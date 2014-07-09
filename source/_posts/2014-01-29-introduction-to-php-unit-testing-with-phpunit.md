---
title: Introduction to PHP unit testing with PHPUnit
tags:
    - agile
    - php
    - phpunit
    - tdd
    - unit-testing
categories:
    - php

---

Nowadays we are in the era of agile methodologies. One of the best practices promoted by these methodologies is [Test-Driven Development (TDD)](http://en.wikipedia.org/wiki/Test-driven_development)

It mainly consists on preparing small pieces of code that are responsible for testing parts of the real application.

For this purpose each of the main programming languages has its own unit testing framework. In the case of PHP this is [PHPUnit](http://phpunit.de/).

### Preparing the testing environment.

Unit testing applications is not a trivial practice. It's not easy pick an existing application and start writing tests for it.

There is where Test-driven development comes in.

When we are doing TDD every new feature or piece of code we write will come with a test previously written that will fail the first time.

Once the failing test is written and we know what the real code is expected to do we will write it. Once it is done the test should pass.

Finally we can [refactor](http://en.wikipedia.org/wiki/Code_refactoring) the code.

This is knonwn as **red light, green light, refactor**.

* <span class="text-danger">**Red light:**</span> the test fails the first time.
* <span class="text-success">**Green light:**</span> the test passes after the code is implemented.
* <span class="text-info">**Refactor:**</span> the tested code is refactored to improve performance and make it maintainable.

To make it possible to test an application it is better if it is object oriented, and it follows the [SOLID principles](http://es.wikipedia.org/wiki/SOLID_(object-oriented_design)). PHPUnit can be used to test procedural code, but we are not going to discuss that in this article.

Finally we need to get the PHPUnit library. It can be done by following [this article](http://phpunit.de/manual/current/en/installation.html).

### First examples

If everything went ok we are now ready to run PHP unit tests from the command line with the `phpunit` command.

Lets asume we need to test a `Calculator` class, which is used to perform mathematical operations. The first step is to write the empty class that will fail the tests. We know the behavior of the class, but we will avoid the concrete implementation by the moment.

<small>**Note**. <i class="text-muted">It is assumed the classes in these examples can be loaded somehow, by including them or autoloading them.</i></small>

~~~php
<?php
namespace Math;

class Calculator
{
    /**
     * This method adds two numbers and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of adding the two numbers
     */
    public function add($number1, $number2)
    {
        return 0;
    }

    /**
     * This method substracts a number from another and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of substracting $number2 from $number1
     */
    public function substract($number1, $number2)
    {
        return 0;
    }

    /**
     * This method multiplies two numbers and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of multiplying two numbers
     */
    public function multiply($number1, $number2)
    {
        return 0;
    }

    /**
     * This method divides one number by another and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of dividing $number2 by $number1
     */
    public function divide($number1, $number2)
    {
        return 0;
    }
}
~~~

We have created the class, but it is not yet implemented. If we didn't know the implementation of the class and reading the comments it is assumable that calling `add(2, 5)` will return 7, so lets write the test

While using PHPUnit, tests are usually classes that extend `PHPUnit_Framework_TestCase`, so lets define our `CalculatorTest` class.

Each test case class contains some methods which name starts with the test word. Each one of those methods will be called in order of definition by phpunit.

There could also be deffined a method called `setUp()` and a method called `tearDown()`. Those methods are automatically called previous and later to each test method.

To test the application code and check everything is going as expected we will use the assertion methods. There is a bunch of them that can be used to compare results with whatever we are expecting to be produced.

For example, the method `assertEquals($expected, $actual)` will check both $expected and $actual are equals. If they are the test will pass, if not the test will fail.

~~~php
<?php
namespace Math;

class CalculatorTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var \Math\Calculator
     */
    private $calculator

    /*
     * Reinstantiate Calculater before each test
     */
    public function setUp()
    {

        $this->calculator = new Calculator();

    }

    public function testAdd()
    {
        $expected = 7;
        $actual = $this->calculator->add(2, 5);
        $this->assertEquals($expected, $actual);
    }

    public function testSubstract()
    {
        $expected = 2;
        $actual = $this->calculator->substract(5, 3);
        $this->assertEquals($expected, $actual);
    }

    public function testMultiply()
    {
        $expected = 20;
        $actual = $this->calculator->multiply(10, 2);
        $this->assertEquals($expected, $actual);
    }

    public function testDivide()
    {
        $expected = 15;
        $actual = $this->calculator->divide(45, 3);
        $this->assertEquals($expected, $actual);
    }
}
~~~

As we can see, the behavior of Calculator class has been assumed while writing the test, but as the class is not implemented, the tests will fail.

### Running the tests for the first time. <span class="text-danger">Red light.</span>

To run a PHPUnit test suite, a small configuration script has to be defined. It is a xml script that PHPUnit will read to know how to run the tests. We will define on it the test classes and a so called bootstrap script, which is a php script that is runned after all the test cases to perform any operation needed for the code to work, like load configuration, set up autoloaders, loggers, database connections (not recommended, we will see this latter) and such.

Asuming our project has this structure:

~~~
Project
    |- src
    |    |- Math
    |    |    |- Calculator.php
    |    |- WebService (this will be used later)
    |- tests
    |    |- bootstrap.php
    |    |- phpunit.xml
    |    |- Math
    |    |    |- CalculatorTest.php
    |    |- WebService (this will be used later)
    |- public
    |    |- ...
~~~

A basic phpunit.xml file will look like this.

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="./bootstrap.php" colors="true">
    <testsuites>
    <testsuite name="Math">
        <directory>./Math</directory>
    </testsuite>
    </testsuites>
</phpunit>
~~~

This is defining the boostrap.php script is located in the same directory and that we only have one test suite called Math that will look for any class called *Test in the Math directory.

We could add more testsuites if we had more tests, and test results will be grouped for each testsuite.

In our case the bootstrap.php script does simply define how to load classes, but it could be as complex as we need.

~~~php
<?php
// Register class autoloading
spl_autoload_register(function ($name) {
    $name = str_replace('\\', '/', $name) . '.php';

    // Try to load class from src dir
    $srcPath = __DIR__ . '/../src/' . $name;
    if (is_file($srcPath)) include_once $srcPath;

    // Load the class from tests dir otherwise
    else include_once __DIR__ . '/' . $name;
});
~~~

With all this set up we are ready to run the tests. In the console we need to be at the tests directory and run the `phpunit` command. It will find the `phpunit.xml` script and run the tests as we configured them.

After running the test we will see something like this:

![Red light screenshot](/assets/img/red-light.png)

As we can see all the tests failed. They all returned zero instead of expected result. Finally a resume line tells there were 4 tests, 4 assertions and all of them failed.

Now we are ready to implement the calculator methods.

### Running the test again. <span clas="text-success">Green light.</span>

The Calculator class methods should now be implemented, like this.

~~~php
<?php
namespace Math;

class Calculator
{
    /**
     * This method adds two numbers and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of adding the two numbers
     */
    public function add($number1, $number2)
    {
        return $number1 + $number2;
    }

    /**
     * This method substracts a number from another and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of substracting $number2 from $number1
     */
    public function substract($number1, $number2)
    {
        return $number1 - $number2;
    }

    /**
     * This method multiplies two numbers and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of multiplying two numbers
     */
    public function multiply($number1, $number2)
    {
        return $number1 * $number2;
    }

    /**
     * This method divides one number by another and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of dividing $number2 by $number1
     */
    public function divide($number1, $number2)
    {
        if ($number2 == 0) {
            throw new \InvalidArgumentException("Division by zero is not possible");
        }

        return $number1 / $number2;
    }
}
~~~

All the methods do now what they suggest they do. If we run again the tests with the phpunit command the result is this.

![Green light screenshot](/assets/img/green-light.png)

All the tests are now working and a green light is returned.

We could now refactor the code. In our example it has no point because every method is a one line.

### Testing exceptions.

You should have noticed that `divide()` method could throw an exception if we try to divide by zero. PHPUnit allows us to test if an exception is produced while running some piece of code.

To do this we could update our `CalculatorTest` class adding a new test like this.

~~~php
<?php
namespace Math;

class CalculatorTest extends \PHPUnit_Framework_TestCase
{

    /* ... */

    /**
     * @expectedException \InvalidArgumentException
     */
    public function testExceptionProducedWhileDividingByZero()
    {
        $this->calculator->divide(45, 0);
    }
}
~~~

We just added an `@expectedException` annotation, telling PHPUnit what kind of exception will be produced in that method. If that exception is produced, the test passes, otherwise it is considered it has failed.

### Mocking dependencies.

Now that we have our tests working it’s time to go a step further.

The `Calculator` class is a very simple class with no dependencies, but in real world it is common to have some dependencies that could difficult to test the class. For example, we could have a component that sends emails, or consumes a web service, are writes into a database.

All of this operations have to be avoided at testint environments. We don’t want to test if we have a proper internet connection, or we have configured the database in the wrong port.

For this purpose the mocks are introduced. They are fake objects designed to replace a real object that is used in production and development environments, but we want to avoid at this point.

In PHP there is plenty of libraries to create mocks at runtime, but I prefer to write them by implementing interfaces. If we program always to abstractions, our dependencies will always be interfaces, and any object implementing them will be valid, the real pbject at production environment and the mock at testing environment.

For example, imagine our `Calculator` class has to send all calculation results to a web service before returning the result, and we have a class called `WebRegister` with the implementation of calling to that web service and sending the information. We could make it to implement a so called `WebRegisterInterface` that will be lately used to create a `WebRegisterMock`.

Both WebRegister and WebRegisterInterface are placed at src/WebService with the names WebRegister.php and WebRegisterInterface.php

WebRegisterInterface.php

~~~php
<?php
namespace WebService;

interface WebRegisterInterface
{
    public function send($result);
}
~~~

WebRegister.php

~~~php
<?php
namespace WebService;

class WebRegister implements WebRegisterInterface
{
    public function send($result)
    {

        // Stuff...

    }
}
~~~

Now we will update the `Calculator` class to get its dependency injected in the constructor.

~~~php
<?php
namespace Math;

use WebService\WebRegisterInterface;

class Calculator
{
    /**
     * @var WebRegisterInterface
     */
    private $register;

    public function __construct(WebRegisterInterface $register)
    {
        $this->register = $register;
    }

    /**
     * This method adds two numbers and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of adding the two numbers
     */
    public function add($number1, $number2)
    {
        $result = $number1 + $number2;
        $this->register->send($result);
        return $result;
    }

    /**
     * This method substracts a number from another and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of substracting $number2 from $number1
     */
    public function substract($number1, $number2)
    {
        $result = $number1 - $number2;
        $this->register->send($result);
        return $result;
    }

    /**
     * This method multiplies two numbers and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of multiplying two numbers
     */
    public function multiply($number1, $number2)
    {
        $result = $number1 * $number2;
        $this->register->send($result);
        return $result;
    }

    /**
     * This method divides one number by another and returns the result
     * @param number $number1
     * @param number $number2
     * @returns The result of dividing $number2 by $number1
     */
    public function divide($number1, $number2)
    {
        if ($number2 == 0) {
            throw new \InvalidArgumentException("Division by zero is not possible");
        }

        $result = $number1 / $number2;
        $this->register->send($result);
        return $result;
    }
}
~~~

Now, the result is sent every time a calculation is performed. This refactoring will force us to update the `CalculatorTest`, because we instantiate a `Calculator` object there with no arguments. That will produce a PHP error because of the missing argument, but we don´t want the web service to be called every time we run the test.

To solve this we create a `WebRegisterMock` class in tests/WebService/WebRegisterMock.php with this contents:

~~~php
<?php
namespace WebService;

class WebRegisterMock implements WebRegisterInterface
{
    public function send($result)
    {
        // Do nothing real here
        return null;
    }
}
~~~

Now the `CalculatorTest` class can be refactored to look like this:

~~~php
<?php
namespace Math;

use WebService\WebRegisterMock;

class CalculatorTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var \Math\Calculator
     */
    private $calculator

    /*
     * Reinstantiate Calculater before each test
     */
    public function setUp()
    {

        $this->calculator = new Calculator(new WebRegisterMock());

    }

    // Keep the test methods...
}
~~~

Now we can run tests again and all lights will be green.

This is basically what unit testing is. In real life testing use to be a little more complex, with more dependencies and more code to be written. We should also add some more assertions for each operation, to ensure everything is ok, but this is just an example.

For a complete PHPUnit documentation refer to its [website](http://phpunit.de/manual/current/en/index.html).