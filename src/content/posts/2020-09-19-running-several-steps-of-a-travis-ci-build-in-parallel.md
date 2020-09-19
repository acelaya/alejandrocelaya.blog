---
layout: post
title: "Running several steps of a Travis CI build in parallel"
categories: [tools]
tags: [ci,continuous-integration,github-actions,oss,open-source]
---

Let's not deny that [GitHub actions](https://github.com/features/actions) are hitting hard in the tech community, and many projects are transitioning from other continuous integration systems like [Circle CI](https://circleci.com/) or [Travis CI](https://travis-ci.org/).

Personally I have been using Travis a lot during the past years, for all my OSS projects, and I have gotten very used to it.

However, people seem to be "abandoning" travis in favor of GitHub Actions, for different reasons. "It's faster", "I can run smaller tasks in parallel", etc.

In my case, I have moved a few very specific tasks there, where travis was becoming a bottleneck, but I still have mixed feelings about the very-verbose yaml-based config needed to configure a few GitHub Actions, compared to the more concise travis one.

In this article I'll explain how I improved a travis build to run several smaller tasks in parallel jobs, without having to completely move away from it.

### Initial state

This project's travis config is relatively simple. It is used to build a JS project for the web browser, and it has to run the next tasks:

* Lint the code, to make sure it fulfils the project's coding standards.
* Run unit tests.
* Run mutation tests.
* Build the docker image, to make sure none of the new changes broke it.
* Conditionally publish a release on GitHub, with a dist file attached to it, if the build is being run for a git tag.

```yaml
dist: bionic

language: node_js

branches:
  only:
    - /.*/

cache:
  directories:
    - node_modules

services:
  - docker

node_js:
  - '12.16.3'

install: npm ci

before_script:
  - echo "Building commit range ${TRAVIS_COMMIT_RANGE}"
  - export MUTATION_FILES=$(git diff ${TRAVIS_COMMIT_RANGE:-origin/main} --name-only | grep -E 'src\/(.*).(ts|tsx)$' | paste -sd ",")

script:
  - npm run lint
  - npm run test:ci
  - npm run mutate:ci
  - docker build -t project:test .

after_success:
  - node_modules/.bin/ocular coverage/clover.xml

before_deploy: npm run build ${TRAVIS_TAG#?}

deploy:
  - provider: releases
    api_key:
      secure: <key>
    file: "./dist/project_${TRAVIS_TAG#?}_dist.zip"
    skip_cleanup: true
    on:
      tags: true
```

### Problems with this approach

This is more or less ok, but the last two commands in `script` can be relatively slow and can delay the whole process.

Also, specially the mutation tests one, which is currently always considered successful regardless the result, can make the build reach the maximum run time allowed by travis, making the whole build falsely fail.

> The reason for the `before_script` step is to determine which source code files changed, and run mutation tests on them only, in order to mitigate this.

Other than this, the build config defines "global" customizations that are actually only used for some tasks:

* Running `npm ci` is not required for the `docker build` task.
* Getting the `docker` service is not required by any of the other tasks.
* Determining changed files is only used by the `mutation tests` task.

### Making use of jobs

One cool feature travis supports is the use of a job [build matrix](https://docs.travis-ci.com/user/build-matrix/), that lets you define multiple jobs that run in parallel as part of the same build, and make each one of them do unrelated tasks.

Using this feature it is possible to improve the `.travis.yml` file, making it look like this:

```yaml
dist: bionic

language: node_js

branches:
  only:
    - /.*/

cache:
  directories:
    - node_modules

node_js:
  - '12.16.3'

jobs:
  fast_finish: true
  allow_failures:
    - name: 'Mutation tests'
  include:

    - name: 'Lint'
      install: npm ci
      script: npm run lint

    - name: 'Unit tests'
      install: npm ci
      script: npm run test:ci
      after_success:
        - node_modules/.bin/ocular coverage/clover.xml

    - name: 'Mutation tests'
      install: npm ci
      before_script:
        - echo "Building commit range ${TRAVIS_COMMIT_RANGE}"
        - export MUTATION_FILES=$(git diff ${TRAVIS_COMMIT_RANGE:-origin/main} --name-only | grep -E 'src\/(.*).(ts|tsx)$' | paste -sd ",")
      script: npm run mutate:ci

    - name: 'Build docker image'
      services:
        - docker
      script: docker build -t project:test .

    - name: 'Publish release'
      if: tag IS present
      before_deploy: npm run build ${TRAVIS_TAG#?}
      deploy:
        - provider: releases
          api_key:
            secure: <key>
          file: "./dist/project_${TRAVIS_TAG#?}_dist.zip"
          skip_cleanup: true
          on:
            tags: true
```

This approach introduces all these benefits:

* Now linting, testing, mutation testing and building the docker image run in parallel, making the build finish earlier.
* The mutation testing step is allowed to fail, and thanks to the `fast_finish` flag, travis won't even wait for it to finish, considering the build successful once the rest have passed.
* Configs that are only meaningful for certain jobs are defined in the job itself, instead of globally.
* The "publish release" job only runs conditionally if the build is for a tag, thanks to the `if: tag IS present` condition. (More info about [conditional jobs](https://docs.travis-ci.com/user/conditional-builds-stages-jobs/) in travis).
* As soon as any of the jobs fails, the whole build fails and you don't have to continue waiting. Before this, if the third task failed, you still had to wait for the previous two to finish.
* Each job can have a name, making it more clear in travis UI what tasks are being run:

![Travis CI jobs](https://alejandrocelaya.blog/assets/img/travis-multiple-jobs/travis-jobs.png)

### Conclusion

The main purpose of this article was to showcase that travis still has a lot to give. Github Actions are definitely cool, but there's usually no silver bullet for everything, and a combination with other tools might be more suitable.

Also, this allows people using travis to improve their builds without having to change everything. Then, once you have split your tasks, if you still want to move to Github Actions, it should be easier.

> If you are curious, this is the project in which I use this travis configuration: [shlinkio/shlink-web-client](https://github.com/shlinkio/shlink-web-client).
