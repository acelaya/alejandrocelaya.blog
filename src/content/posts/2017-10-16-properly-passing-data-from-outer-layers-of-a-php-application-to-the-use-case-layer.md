---
layout: post
title: "Properly passing data from outer layers of a PHP application, to the use case layer"
categories: [php]
tags: [ddd,clean-architecture,clean-code,services]
---

Lately, I've been digging a lot in ways of improving software architecture. Mainly subjects like [Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html), [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design), and such.

Those topics cover a lot of advanced and complex practices, but today, I want to talk about one of the best approaches to pass data from outer layers of the application (actions, controllers, async jobs, CLI commands...) to services that are part of the use case layer, by taking advantage of some of the practices promoted by those subjects.

That's a task which is present in any kind of application, and is very important to get properly done. You usually need to get data from different origins (a HTTP request, the input of the command line...), filter and validate it, and then use it to perform some kind of task.

Not doing it in the correct way could cause inconsistencies, or duplications in your codebase.

### My previous attempts

First of all, I want to start by talking about some of the approaches I have followed in the past, that I felt they were not 100% correct, and have led me to a better one.

My greatest doubt has always been what's the correct place to filter and validate data. And that's what I asked about a year ago on twitter.

<blockquote class="twitter-tweet" data-lang="es"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/LazyWeb?src=hash&amp;ref_src=twsrc%5Etfw">#LazyWeb</a>, in web apps, filtering and validation should happen in controllers/actions or in services? I&#39;m never sure about this</p>&mdash; Alejandro Celaya (@acelayaa) <a href="https://twitter.com/acelayaa/status/777775855544242176?ref_src=twsrc%5Etfw">19 de septiembre de 2016</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The tweet received a lot of good answers, but my knowledge wasn't mature enough at the moment, and I couldn't "digest" it (I suppose).

Since then, these have been muy approaches:

* Validate data in outer layers and pass it already validated to services. That decouples the service from the validation task, but forces us to duplicate the validation if we share some business logic between a CLI command and an HTTP action (for example).
* Having some sort of validation service that wraps the validation logic, and inject it in elements that need to validate. Solves previous problem, but it is not something that can be easily handled, and also, increases the number of dependencies of actions and CLI commands.
* Pass raw data to Services and perform validation there. This also solves the duplication problem, but creates a weird flow, since we have to treat raw data from HTTP or CLI, cast it and check for their existence (which should be part of validation), then pass the result to the Service, and then, make the service again convert received params into some sort of data structure that can be validated.

### Better approach

We have seen the problems caused by previous approaches, so we need a better solution, and some of the answers to my tweet include it. **Use value objects for data exchange**.

Domain Driven Design (DDD) tells that you should use DTOs (data transfer objects) to exchange only the exact needed params with services.

A value object is an immutable object that can be used to exchange data, which also includes the minimum validation logic to ensure data consistency.

If we pass raw data from outer layers to a newly created value object, and then pass that value object to services, we ensure services always receive valid data, we avoid duplication and we also remove the validation logic from outer layers elements, without increasing the number of dependencies.

All problems solved.

### Case study

Ok, all that theory looks good, but how do we really apply this to the real world?

Let's propose an example that we can use to apply the previous approach. I'm sure you have implemented something like this a lot of times.

Imagine we have a web application with an endpoint which is used by users to change their password.

The endpoint expects a POST request which receives the old password, the new password and a confirmation of the new password (to prevent typos).

The user will be identified by some sort of session system, so there's no need to provide any kind of user identifier.

All provided data needs to be filtered and validated, checking that both the new password and the confirmation password are equal, and that they follow a minimum complexity rule which forces the user to use at least 10 characters that include letters and numbers.

All three values will be filtered with trim and strip tags.

#### The value object

We will create a value object that will wrap all needed information so that the service can perform the "change password" operation.

It will also validate all proposed rules when created, and throw an exception if anything fails.

```php
<?php
declare(strict_types=1);

namespace App\Model;

final class UserPassword
{
    private $userId;
    private $newPassword;
    private $currentPassword;
    
    public function __construct(string $userId, string $currentPassword, string $newPassword, string $confirmPassword)
    {
        
        
        
        
    }
}
```
