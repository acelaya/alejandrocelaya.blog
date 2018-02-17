---
layout: post
title: "Mutation testing with infection in big PHP projects"
categories: [php,tools]
tags: [tests,unit-testing,mutation-testing,phpunit,infection,continuous-integration]
---

There's no doubt that having tests in a project allows you to find potential bugs earlier and more easily.

Lots of OSS projects require a minimum code coverage in order to accept new pull requests from contributors, and proprietary projects also tend to have some sort of continuous integration workflow which requires certain metrics to be fulfilled in order to get builds passing.

However, the code coverage can lead to a false sense of security, which makes you think that if certain class has a 100% code coverage, it is also 100% bug-free.

This is not always true, since you could be calling a method and yet not being properly testing its output or its real behavior. The code coverage will mark it as covered, but you might introduce a bug and still have a green test.

This is where mutation testing comes in.

### Mutation testing

According to [wikipedia](https://en.wikipedia.org/wiki/Mutation_testing), mutation testing involves applying small modifications to a software. These modifications are called mutations.

Then, if you pass your tests and any of them fails because of this "mutation", then you have "killed the mutant". This is what should happen in code which is covered by tests. If tests keep passing after applying this modification, then your tests covering that part of the project are not so good, and you should improve them to **really** test what they are covering.

So in other words, mutation testing is a quality assurance practice for your tests.

In PHP projects, there used to be one library which purpose was working with the mutation testing approach, [humbug/humbug](https://github.com/humbug/humbug). However, it is mostly abandoned now, and it has motivated the appearance of another project, [infection/infection](https://infection.github.io/).

### Infection

Infection is a mutation testing framework for PHP.

It is easy to start using it in your project, since you just need to install it (`composer require infection/infection --dev`), and create a configuration file. Then, it uses your existing test suite in order to apply mutations to your code and check your tests.

It currently integrates with [phpunit](https://github.com/sebastianbergmann/phpunit/) and [phpspec](https://github.com/phpspec/phpspec), but I suppose there will be compatibility with other testing frameworks in the future.

#### Configuring infection

It consumes an `infection.json` configuration file which could have a structure like this:

```json
{
    "source": {
        "directories": [
            "module/*/src"
        ]
    },
    "timeout": 10,
    "logs": {
        "text": "build/infection/infection-log.txt",
        "summary": "build/infection/summary-log.txt",
        "debug": "build/infection/debug-log.txt"
    },
    "tmpDir": "build/infection/temp",
    "phpUnit": {
        "configDir": "."
    }
}
```

This is the configuration of one of my company's projects. A modular application where every module is located inside the `module` directory and has its own `src` folder with source files.

This config file basically defines where the sources are located, where infection's logs should be placed, a temporary folder which will be used instead of using system's default tmp folder, and where is the `phpunit.xml[.dist]` file.

That's all you need to get infection working.

> You can find detailed information of all the configuration options [here](https://infection.github.io/guide/usage.html#Configuration)

#### Running infection

Now that we have the configuration file, we just need to run `vendor/bin/infection`, and it will execute our test suite and then apply mutations to our source files.

Then it will display the result, telling how many mutants have been killed.

Infection supports lots of mutators, like replacing `++` by `--`, `true` by `false`, changing method visibilities, return values, etc. You can find the whole list [here](https://infection.github.io/guide/mutators.html).

The command line tool supports a list of modifiers, some of which are very interesting. This is how I would recommend you to run it if you want to address the whole project.

`vendor/bin/infection --threads=4 --min-msi=70 --only-covered --log-verbosity=2`.

* `--threads`: It runs tests and mutators in parallel processes, so you can take advantage of all the cores in your machine. Set a value that makes sense your you. If you have 8 cores, maybe you want to set it with value 8.
* `--min-msi`: This flag makes the process fail if the number of killed mutants is below certain percentage. In this case we require 70% of mutants to be killed. Adapt the value to your needs, and try to gradually improve your tests and increase this value (MSI stands for *Mutation Score Indicator*).<br>This flag is really useful in continuous integration environments.
* `--only-covered`: This makes infection address only covered code. We know mutants won't be killed in uncovered code, so I think it makes no sense to apply mutators there.<br>I prefer to separate the *required code coverage* metric from the *required mutation score indicator* metric.
* `--log-verbosity`: By default, infection logs all the mutations it has applied to your code. This could lead to a log with thousands of lines if the project is big, so I prefer to set the log verbosity to **2**, which makes it log only non-killed mutants.

And that's mainly it. You can now automate this task in your continuous integration pipeline, or just run it locally, but at least you will discover some parts both in your source files and your tests that can be improved.

### Troubleshooting

While this could be enough for an introduction to infection, the title of this article says something about **big projects**, so I'm going to explain how we integrated infection in one of my company's biggest projects and how we addressed some inherent problems.

#### Already unstable

The first problem while working with infection is that, at the moment of writing this article, it's not in a stable version yet. That means you could find bugs.

We found one in which infection wasn't properly parsing our phpunit config file and it was excluding almost the whole project from the code coverage report. This caused all mutations to be skipped.

We reported it and they fixed it very fast, but they haven't tagged a version including the fix yet, so we require one specific commit from master while we wait for v0.8 to be released.

#### Time consuming

Another problem is that infection consumes a lot of memory and CPU, and takes a lot of time to be run when you have a lot of classes and tests.

For example, our project has around 1500 unit tests, which take about 1'5min-2min to be run. Our build process also passes some coding style checks and functional repository tests. It usually takes about 3 minutes.

The first time we run infection for the whole project, it took more than 16 minutes. That would make a build which is taking 3 minutes to take almost 20 minutes from now on, which is not an option because our build is run a lot of times every day.

Our solution was making the build run infection only on changed sources, taking advantage of infection's `--filter` flag, which lets you pass a comma-separated list of files and it gets applied only to them.

The way in which we find which files have changed from previous build is by making a `git diff` between current commit and the new commit after updating the branch in which the build is being run (the commit identifiers are defined by jenkins' GIT plugin as environment variables).

If it is the first time the build is run for this branch, we make the diff with develop instead.

The result is a bash script like this:

```bash
# Get files which have changed from latest processed commit, including only those inside sources
# If there's no previous commit, diff with develop
INFECTION_FILTER=$(git diff ${GIT_PREVIOUS_COMMIT:-develop} $GIT_COMMIT --name-only | grep /src/ | paste -sd "," -)

# Check mutations over those files, if any, and require a 70% MSI
if [ -n "$INFECTION_FILTER" ]; then
    vendor/bin/infection --threads=4 --min-msi=70 --only-covered --log-verbosity=2 --filter="${INFECTION_FILTER}"
else
    echo "No source files affected. Infection skipped."
fi
```

As you can see, we perform a diff by including only file names, then we exclude those which do not contain "/src/" as part of the name, and then we convert them into a comma-separated list.

With this approach, the build usually takes 1 extra minute in the worst case scenario, which can be assumed.

However, I'm sure the performance of this project will be improved as it grows and gets more stable.

#### Test run duplication

While previous approach filters the files where mutations are applied, it is still running all tests beforehand, which makes all tests to be run twice on every build.

* First, our own execution, which generates a code coverage report to be published later, and makes the build fail if tests do not pass.
* Then, infection runs tests again, on its own "conditions" (they take your phpunit config file and generate a new one, which has some custom configuration entries).

If it were possible to pass infection an already generated code coverage, we could prevent this duplication, but, as far as I know, it does not support that.

Another solution would be being able to run only tests which affect changed sources, instead of running all tests suites, but phpunit does not allow to filter by a list of files, only a specific file or folder.

This is the only problem for which we have not yet found a solution, so If you know any workaround, a comment will be very welcome :-)

#### Xdebug vs phpdbg

Since infection needs access to a code coverage report, you need some tool which is capable of generating it.

People usually use xdebug, since it is the most extended and feature-rich debugging tool.

However, there's a simpler tool, which is designed to debug php console executions only, and comes bundled with php. It is [phpdbg](https://github.com/krakjoe/phpdbg).

In our project, it usually takes 30%-50% less time to generate a code coverage report than xdebug. The result is not 100% the same, but it is very similar, and it's worth it.

So, instead of running infection like this:

    vendor/bin/infection --threads=4 --min-msi=70 --only-covered --log-verbosity=2 --filter="${INFECTION_FILTER}"

We have to do it like this

    phpdbg -qrr vendor/bin/infection --threads=4 --min-msi=70 --only-covered --log-verbosity=2 --filter="${INFECTION_FILTER}"

It is explained in [infection's docs](https://infection.github.io/guide/usage.html#Running-with-phpdbg).

We have even started to use it to run our own phpunit execution.

### Conclusion

We have seen how to use infection, and how to integrate it in a continuous integration pipeline, even for **big projects**.

I think it is a very useful tool, and the team behind it is doing a great job. It is also not hard to start using it, since you don't really need to write new code, just add a config file and run the CLI tool.

Finally, I recommend you to read this article, from one of infection's contributors. It explains how it internally works, and how to use it in a development workflow [https://medium.com/@maks_rafalko/infection-mutation-testing-framework-c9ccf02eefd1](https://medium.com/@maks_rafalko/infection-mutation-testing-framework-c9ccf02eefd1).
