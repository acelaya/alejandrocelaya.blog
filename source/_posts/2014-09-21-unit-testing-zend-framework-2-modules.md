---
title: Unit testing Zend Framework 2 modules
categories:
    - php
tags:
    - zf2
    - zend-framework-2
    - module
    - phpunit
    - unit-testing
    - tdd
    - agile

---

One of the first articles I wrote in this blog was an introduction to unit testing PHP applications. You can find it [here](/2014/01/29/introduction-to-php-unit-testing-with-phpunit/) in case you need to know the first steps and the theory.

On this article I'm going to explain how to get a Zend Framework 2 module tested. It is indeed very similar to test any PHP application, we just have to be sure the framework classes are properly loaded.

### Structure

Zend Framework 2 modules usually have a standard folder structure. A view folder with templates, a config folder with configuration files, a src folder with PHP classes and tests are usually placed in a tests folder (sometimes it is just test). There can be other folders like public, languages, etc.

This could be the structure of our module:

~~~
MyModule
| - config
| - languages
| - src
|   | - Controller
|   |   | - IndexController.php
|   |   | - [...]
|   | - Service
|   |   | - MyService.php
|   |   | - [...]
| - tests
|   | - Controller
|   |   | - IndexControllerTest.php
|   |   | - [...]
|   | - Service
|   |   | - MyServiceTest.php
|   |   | - [...]
|   | - bootstrap.php
|   | - phpunit.xml
| - view
| - composer.json
| - Module.php
~~~

If you don't want to create this by yourself, this module can be found [here](https://github.com/acelaya-blog/zf2-testing).

The content of src and tests folders is the only one that matters for this article. I'm going to use [psr-4](http://www.php-fig.org/psr/psr-4/) autoloading but we'll see that later.

### Bootstrapping

When I started to test my first Zend Framework 2 module I found the bootstrap files in the documentation very confusing. There are different approaches.

In the [Zend Skeleton Module](https://github.com/zendframework/ZendSkeletonModule) the bootstrap tries to load ZF2, then uses `Zend\Loader` to autoload classes in the framework and the tested module, then initializes the `ModuleManager` and finally tries to initialize a `ServiceManager`. It seems very confusing to me in case you need to customize something. You can see the file [here](https://github.com/zendframework/ZendSkeletonModule/blob/master/tests/bootstrap.php).

In the getting started documentation used to be a different approach, but it seems it has been removed in one of the last versions. It was also too confusing, trying to load all the framework stuff.

The thing is that when I make a unit test I just want to test one class, one tiny component, and don't need to load everything else. That's why I prefer to use the composer's autoloader, which makes the bootstrap script much simpler.

~~~php
<?php
$vendorDir = findParentPath('vendor');

if (file_exists($file = $vendorDir . '/autoload.php')) {
    require_once $file;
} else {
    throw new \RuntimeException("Composer autoload not found");
}

function findParentPath($path)
{
    $dir = __DIR__;
    $previousDir = '.';
    while (!is_dir($dir . '/' . $path)) {
        $dir = dirname($dir);
        if ($previousDir === $dir) {
            return false;
        }
        $previousDir = $dir;
    }
    return $dir . '/' . $path;
}
~~~

What this script does is basically trying to recursively find the vendor folder in a parent directory. If it finds it, it includes the autoloader, if not, it throws a `RuntimeException`.

This approach is not my own idea, I think I saw it in an [@ocramius](https://twitter.com/Ocramius) module and really liked its simplicity.

That makes us not having to use `Zend\Loader`, loading modules, preparing a `ServiceManager` and such. The only thing you need is to define the autoloading strategy of your module in the composer.json file, and the rest of the dependencies will be available too.

For our example, the composer.json autoloading could be something like this:

~~~javascript
[...]

"autoload": {
    "psr-4": {
        "MyModule\\": "src/",
        "MyModuleTest\\": "tests/"
    },
    "classmap": ["./Module.php"]
}

[...]
~~~

<blockquote class="text-muted">
    <small>
        For more information on how to use composer, read
        <a href="/2014/07/19/dependency-management-and-autoloading-in-php-projects-with-composer/">this</a>
    </small>
</blockquote>

### PHPUnit configuration

Once the bootstrap script is clear, we need to define the phpunit config file. It is just a common phpunit.xml file, nothing special, you just need to define the test suites you want. In our case there will be two testsuites, one for controllers and one for services, but we could include others if needed.

~~~xml
<?xml version="1.0"?>
<phpunit bootstrap="./bootstrap.php"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         verbose="true"
         stopOnFailure="false"
         processIsolation="false"
         backupGlobals="false"
         syntaxCheck="true">

    <testsuite name="Controller tests">
        <directory>./Controller</directory>
    </testsuite>
    <testsuite name="Service tests">
        <directory>./Service</directory>
    </testsuite>

    <filter>
        <whitelist>
            <directory suffix=".php">./src</directory>
        </whitelist>
    </filter>

</phpunit>
~~~

### Writing tests

Our example module has two classes, a service and a controller. Let's write the tests for both of them.

The subjects under test (both classes we are going to test) can be found in the example repository. [MyService](https://github.com/acelaya-blog/zf2-testing/blob/master/src/Service/MyService.php) and [IndexController](https://github.com/acelaya-blog/zf2-testing/blob/master/src/Controller/IndexController.php).

**MyServiceTest**:

~~~php
<?php
namespace MyModuleTest\Service;

use MyModule\Service\MyService;
use PHPUnit_Framework_TestCase as TestCase;
use Zend\EventManager\Event;
use Zend\EventManager\EventManager;

class MyServiceTest extends TestCase
{
    /**
     * @var MyService
     */
    private $myService;

    public function setUp()
    {
        $this->myService = new MyService();
        $this->myService->setEventManager(new EventManager());
    }

    public function testFooEventIsTriggeredWhenCallingFoo()
    {
        // With no event handler the event is not triggered
        $fooIsTriggered = false;
        $this->myService->foo();
        $this->assertFalse($fooIsTriggered);

        // Add an event handler
        $test = $this;
        $this->myService->getEventManager()->attach(
            'foo',
            function (Event $e) use (&$fooIsTriggered, $test) {
                $fooIsTriggered = true;
                // Check the param 'argument' exists with the correct value
                $test->assertEquals('foo', $e->getParam('argument'));
            }
        );
        $this->myService->foo();
        // Check the event was triggered
        $this->assertTrue($fooIsTriggered);
    }

    public function testBarEventIsTriggeredWhenCallingBar()
    {
        // With no event handler the event is not triggered
        $barIsTriggered = false;
        $this->myService->bar();
        $this->assertFalse($barIsTriggered);

        // Add an event handler
        $test = $this;
        $this->myService->getEventManager()->attach(
            'bar',
            function (Event $e) use (&$barIsTriggered, $test) {
                $barIsTriggered = true;
                // Check the param 'argument' exists with the correct value
                $test->assertEquals('bar', $e->getParam('argument'));
            }
        );
        $this->myService->bar();
        // Check the event was triggered
        $this->assertTrue($barIsTriggered);
    }
}
~~~

The MyService class just wraps an EventManager which handles two events. When we call MyService::foo, the event manager triggers the foo event, passing a param to it called argument with the value foo. When we call MyService::bar the same happens, but both the event triggered and the param are bar instead of foo.

In the test we check that the events are triggered if an event handler was previously attached, and that the arguments passed to the event handler are correct.

As you can see it is a simple PHPUnit test which extends `PHPUnit_Framework_TestCase`. We use some ZF2 classes just because the subject under test depends on them.

**IndexController**:

~~~php
<?php
namespace MyModuleTest\Controller;

use MyModule\Controller\IndexController;
use PHPUnit_Framework_TestCase as TestCase;
use Zend\Http;

class IndexControllerTest extends TestCase
{
    /**
     * @var IndexController
     */
    private $indexController;

    public function setUp()
    {
        $this->indexController = new IndexController();
    }

    public function testIndexAction()
    {
        $resp = $this->indexController->indexAction();
        $this->assertTrue(is_array($resp));
        $this->assertArrayHasKey('foo', $resp);
        $this->assertEquals('bar', $resp['foo']);
    }

    public function testModelAction()
    {
        $resp = $this->indexController->modelAction();
        $this->assertInstanceOf('Zend\View\Model\ViewModel', $resp);
        $this->assertEquals('foo', $resp->getVariable('bar'));
        // Check a nonexistent variable in the model
        $this->assertNull($resp->getVariable('nonexistent'));
    }

    public function testDeniedResponseAction()
    {
        $resp = $this->indexController->deniedResponseAction();
        $this->assertInstanceOf('Zend\Http\Response', $resp);
        $this->assertEquals(Http\Response::STATUS_CODE_403, $resp->getStatusCode());
        $this->assertEquals('Permission denied', $resp->getContent());
    }

    public function testRedirectResponseAction()
    {
        $resp = $this->indexController->redirectResponseAction();
        $this->assertInstanceOf('Zend\Http\Response', $resp);
        $this->assertEquals(Http\Response::STATUS_CODE_302, $resp->getStatusCode());
        $headers = $resp->getHeaders()->toArray();
        $this->assertArrayHasKey('Location', $headers);
        $this->assertEquals('/home', $headers['Location']);
    }
}
~~~

Once again this is a simple PHPUnit test which checks every method in the IndexController class does what it's intended to do.

In the case of controller tests there is a Zend Framework 2 component that is worth the mention, `Zend\Test`. It includes a class designed to test HTTP controllers, the `Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase`. It extends `PHPUnit_Framework_TestCase` so it can be used as a regular test case, but it adds some new methods to check headers, routes and even CSS selectors in returned views. Complete documentation can be found [here](http://framework.zend.com/manual/2.3/en/modules/zend.test.phpunit.html).

### Conclusions

As you can see, testing Zend Framework modules is not harder than testing any other PHP application. The key is using composer to easily bootstrapping the test suits and keeping classes simple and decoupled so that unit tests are really unit.

If you want to run this examples, clone the [example repository](https://github.com/acelaya-blog/zf2-testing), run `php composer.phar install` to install all dependencies and then run `vendor/bin/phpunit -c tests/phpunit.xml` to run both tests.
