---
layout: post
title: Dispatch REST-like requests with a single controller class in Zend Expressive
tags:
    - zend-expressive
    - rest
    - dispatch
    - zf3
categories:
    - php
    - zf

---

I was digging into Zend Expressive and how to use controllers that allow me to share dependencies between different routes, instead of having to use different middlewares every time.

[Abdul](https://samsonasik.wordpress.com/) wrote a great article on this subject that you can find [here](https://samsonasik.wordpress.com/2016/01/03/using-routed-middleware-class-as-controller-with-multi-actions-in-expressive/), which also became part of [Expressive's cookbook](https://zendframework.github.io/zend-expressive/cookbook/using-routed-middleware-class-as-controller/) some time later.

This is a perfect approach that easily allows to reuse some code, but then I thought how to do something similar in a rest environment, having a single class with different dispatchable methods that will be called depending on the request's HTTP method.

This is a possible solution based on ZF2's [AbstractRestfulController](https://github.com/zendframework/zend-mvc/blob/master/src/Controller/AbstractRestfulController.php)

### The abstract implementation

We need some default behavior and some code that can be reused, so this could be our `AbstractRestController`.

```php
namespace App\Rest;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Zend\Diactoros\Response\JsonResponse;
use Zend\Stratigility\MiddlewareInterface;

abstract class AbstractRestController implements MiddlewareInterface
{
    const IDENTIFIER_NAME = 'id';

    /**
     * @param Request $request
     * @param Response $response
     * @param null|callable $out
     * @return null|Response
     */
    public function __invoke(Request $request, Response $response, callable $out = null)
    {
        $requestMethod = strtoupper($request->getMethod());
        $id = $request->getAttribute(static::IDENTIFIER_NAME);

        switch ($requestMethod) {
            case 'GET':
                return isset($id)
                    ? $this->get($request, $response, $out)
                    : $this->getList($request, $response, $out);
            case 'POST':
                return $this->create($request, $response, $out);
            case 'PUT':
                return $this->update($request, $response, $out);
            case 'DELETE':
                return isset($id)
                    ? $this->delete($request, $response, $out)
                    : $this->deleteList($request, $response, $out);
            case 'HEAD':
                return $this->head($request, $response, $out);
            case 'OPTIONS':
                return $this->options($request, $response, $out);
            case 'PATCH':
                return $this->patch($request, $response, $out);
            default:
                return $out($request, $response);
        }
    }

    public function get(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse(['content' => 'Method not allowed'], 405);
    }

    public function getList(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse(['content' => 'Method not allowed'], 405);
    }

    public function create(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse(['content' => 'Method not allowed'], 405);
    }

    public function update(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse(['content' => 'Method not allowed'], 405);
    }

    public function delete(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse(['content' => 'Method not allowed'], 405);
    }

    public function deleteList(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse(['content' => 'Method not allowed'], 405);
    }

    public function head(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse(['content' => 'Method not allowed'], 405);
    }

    public function options(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse(['content' => 'Method not allowed'], 405);
    }

    public function patch(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse(['content' => 'Method not allowed'], 405);
    }

    final protected function createResponse($data, $status = 200)
    {
        return new JsonResponse($data, $status);
    }
}
```

It creates an invokable class that dispatches different methods based on the request HTTP method, passing the `$request`, `$response` and next middleware to all of them.

By default, it makes all the methods return a **405** status, so that we can leave them unimplemented in concrete controllers and any consumer knows that they are not allowed.

This class will be the base for any rest controller.

### Concrete implementations

Once we have the abstract controller, we can define any class extending it.

```php
namespace App\Controller;

use App\Rest\AbstractRestController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class RestUserController extends AbstractRestController
{
    public function get(Request $request, Response $response, callable $out = null)
    {
        $id = $request->getAttribute(self::IDENTIFIER_NAME);
        return $this->createResponse([
            'id' => $id,
            'name' => 'John Doe',
        ]);
    }

    public function getList(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse([
            [
                'id' => 'e2f7ee10-af32-46e7-86cc-5afe441b69e5',
                'name' => 'John Doe',
            ],
            [
                'id' => '04162d88-dd7c-4855-ae4f-cc63e64edd7c',
                'name' => 'Jane Doe',
            ],
        ]);
    }

    public function create(Request $request, Response $response, callable $out = null)
    {
        return $this->createResponse([
            'message' => 'You have created a new user',
        ]);
    }

    public function delete(Request $request, Response $response, callable $out = null)
    {
        $id = $request->getAttribute(self::IDENTIFIER_NAME);
        return $this->createResponse([
            'message' => sprintf('You have deleted the user with id %s', $id),
        ]);
    }
}
```

This class overrides only 4 of the public methods, returning custom responses.

We will usually inject some service on this controller and use it to perform CRUD operations. In this example I have just hardcoded the responses. 

### Register the route

Once the controller is created, we need to register a route setting this controller as the middleware and allowing any method, since the HTTP method check will be performed in the controller itself.

If you have created your app starting from the [skeleton application](https://github.com/zendframework/zend-expressive-skeleton), you just need to open the `config/autoload/routes.global.php` file and add the route and register your controller as a service.

The registration of the controller will depend on the container implementation and how it needs to be created. In this case I'm using the Zned\ServiceManager component, and the controller is a simple invokable service without dependencies.

Also, the route definition could slightly change depending on the chosen router. I'm using FastRoute.

```php
use App\Action\RestUserController;
use Zend\ServiceManager\Factory\InvokableFactory;

return [
    'dependencies' => [
        'factories' => [
            RestUserController::class => InvokableFactory::class,
        ],
    ],

    'routes' => [
        // [...]

        [
            'name' => 'rest.client',
            'path' => '/rest/user[/{id}]',
            'middleware' => RestUserController::class,
        ],
    ],
];
```

When the `allowed_methods` key is not set, it allows any method by default.

Now, a GET request to the **/rest/user** route will return the list of users, a DELETE request to **/rest/user/123** will delete the user 123 and so one.
