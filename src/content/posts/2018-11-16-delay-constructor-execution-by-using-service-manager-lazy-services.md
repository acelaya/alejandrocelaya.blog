---
layout: post
title: "Delay constructor execution by using ServiceManager lazy services"
permalink: /2018/11/16/delay-constructor-execution-by-using-service-manager-lazy-services
categories: [php,zf]
tags: [zf,proxy,di]
---

A couple years ago I wrote a [post](/2016/06/12/using-service-manager-3-lazy-services-to-improve-your-php-application-performance/) about how to improve PHP applications performance by using `zend-servicemanager` lazy services.

In that article I explained how the `ServiceManager` takes advantage of the proxy design pattern to delay the creation of services, when they are marked as **lazy**.

That can improve performance if the object is resource consuming, but that is not the only advantage behind proxies.

### A use case

Some days ago I was working on a new feature for [Shlink](https://shlink.io), an open source project I maintain.

The feature consisted on adding support to geolocate IP addresses by using [GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/), an IP address database which is updated every month.

They have an official [PHP library](https://github.com/maxmind/GeoIP2-php), which exposes a `GeoIp2\Database\Reader` service where you need to inject the path to the GeoLite2 library file.

Since **Shlink** uses the `zend-servicemanager` to manage dependency injection, I created a factory like this (these examples are pseudocode):

```php
<?php
declare(strict_types=1);

namespace Shlinkio\Shlink\Factory;

use GeoIp2\Database\Reader;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class GeoLiteReaderFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $geoLiteDbLocation = $container->get('config')['geolite2']['db_location'] ?? '';
        return new Reader($geoLiteDbLocation);
    }
}
```

And then registered it like this:

```php
<?php
declare(strict_types=1);

namespace Shlinkio\Shlink\Common;

use GeoIp2\Database\Reader;
use Shlinkio\Shlink\Factory\GeoLiteReaderFactory;

return [

    'dependencies' => [
        'factories' => [
            Reader::class => GeoLiteReaderFactory::class,
        ],
    ],

];
```

Then I registered other services which were depending on this one, and everything seemed to be ok.

### The issue

My intention was to download the GeoLite2 database during **Shlink**'s installation.

The problem is that the `GeoIp2\Database\Reader` service throws an exception if the file you specified does not exist, and the first time **Shlink** is executed, it does not exist.

The way I designed my service graph was making the `GeoIp2\Database\Reader` object to be instantiated, and throw an error before being able to download the file.

I started to think on ways to workaround this issue, but none of them seemed clean enough.

Then I thought "maybe I can wrap the object somehow, so that it is not created until it is going to be actually used", and then I realized that was exactly what a Proxy does, and also, that the `ServiceManager` includes its own implementation to do this.

### The solution

The solution was pretty straightforward. I just had to mark the service as lazy, changing the configuration to this:

```php
<?php
declare(strict_types=1);

namespace Shlinkio\Shlink\Common;

use GeoIp2\Database\Reader;
use Shlinkio\Shlink\Factory\GeoLiteReaderFactory;
use Zend\ServiceManager\Proxy\LazyServiceFactory;

return [

    'dependencies' => [
        'factories' => [
            Reader::class => GeoLiteReaderFactory::class,
        ],
    ],
    
    'delegators' => [
        Reader::class => [
            LazyServiceFactory::class,
        ],
    ],
    
    'lazy_services' => [
        'class_map' => [
            Reader::class => Reader::class,
        ],
        'proxies_target_dir' => 'data/proxies',
        'proxies_namespace' => 'ShlinkProxy',
        'write_proxy_files' => true,
    ],

];
```

And that's it. No further code changes were needed, only configuration.

With this change, the constructor of the `GeoIp2\Database\Reader` is no longer run until the object is going to be actually used, which allows **Shlink** to be installed, and the database file to be downloaded.

> If you want to more deeply understand what the new config actually means, it is explained in detail in my [previous article](/2016/06/12/using-service-manager-3-lazy-services-to-improve-your-php-application-performance/) about lazy services.

### Conclusion

With this article I just wanted to share how to solve a specific issue introduced by third party code, where you don't have the "power" to change the implementation.

I also wanted to expose a real use case, which will probably remind you to some real situation in which you have faced a similar problem in the past.
