---
layout: post
title: "Mutation testing with infection in big PHP projects"
categories: [php,tools]
tags: [tests,unit-testing,mutation-testing,phpunit,infection,continuous-integration]
---

There's no doubt that having tests in a project allows you to find potential bugs earlier and more easily.

Lot's of OSS projects require a minimum code coverage in order to accept new pull requests from contributors, and proprietary projects also tend to have some sort of continuous integration workflow which requires certain metrics to be fulfilled in order to get builds passing.

However, the code coverage can lead to a false sense of security, which makes you think that if certain class has a 100% code coverage, it is also 100% bug-free.

This is not true, since you could be calling a method and yet not being properly testing its output or its real behavior. The code coverage will mark it as covered, but you might introduce a bug and still have a green test.

This is where mutation testing comes in.

### Mutation testing

According to [wikipedia](https://en.wikipedia.org/wiki/Mutation_testing), mutation testing involves applying small modifications to a software. These modifications are called mutations.

Then, if you pass your tests and any of them fails because of this "mutation", then you have "killed the mutant". This is what should happen in code which is covered by tests. If tests keep passing after applying this modification, then your tests covering that part of the project are not so good.

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

Infection supports lots of mutators, like replacing `++` by `--`, `true` by `false`, changing method visibilities, etc. You can find the whole list [here](https://infection.github.io/guide/mutators.html).

The command line tool supports a list of modifiers, some of which are very interesting. This is how I would recommend you to run it if you want to address the whole project.

`vendor/bin/infection --threads=4 --min-msi=70 --only-covered --log-verbosity=2`.

* `--threads`: It runs tests and mutators in parallel processes, so you can take advantage of all of cores in your computer. Set a value that makes sense your you. If you have 8 cores, maybe you want to set it with value 8.
* `--min-msi`: This flag makes the process fail if the number of killed mutants is below certain percentage. In this case we require 70% of mutants to be killed. Adapt the value to your needs, and try to gradually improve your tests and increase this value (MSI stands for *Mutation Score Indicator*).<br>This flag is really useful in continuous integration environments.
* `--only-covered`: This makes infection address only covered code. We know mutants won't be killed in uncovered code, so I think it makes no sense to apply mutators there.<br>I prefer to separate the *required code coverage* metric from the *required mutation score indicator* metric.
* `--log-verbosity`: By default, infection logs all the mutations it has applied to your code. This could lead to a log with thousands of lines if the project is big, so I prefer to set the log verbosity to **2**, which makes it log only non-killed mutants.

And that's mainly it. You can now automate this task in your continuous integration pipeline, or just run it locally, but at least you will discover some parts both in your source files and your tests that can be improved.

### Troubleshooting

While this could be enough for an introduction to infection, the title of this article says something about **big projects**, so I'm going to explain now how we integrated infection in one of my company's biggest projects and how we solved some inherent problems.
