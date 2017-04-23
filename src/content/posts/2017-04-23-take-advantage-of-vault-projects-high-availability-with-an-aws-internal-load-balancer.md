---
layout: post
title: "Take advantage of vault project&#039;s​ high availability with an AWS internal load balancer"
categories: [tools]
tags: [vault,ha,high-availability,aws,load-balancer,hashicorp,encryption,security]
---

In a project I'm working on, we recently needed to add some kind of encryption system that allowed us to store sensitive information in a secure manner, but being able to access to it at runtime in order to pass it to third party services.

Securely storing your own app passwords is easy. You just hash it, and the password can be verified without having to decrypt it, but if you need to "decrypt" it, the solution is not that easy.

We started by building our own solution based on [zend/crypt](https://docs.zendframework.com/zend-crypt/), which is an excellent solution and works like a charm, but you still need to store the master key somehow, and that's the big problem.

After some research, someone pointed us to [vault project](https://www.vaultproject.io/), a self-hosted service which manages encrypted key-value pairs, in a more secure manner, where the master key is securely handled. I recommend you read the docs in order to see all its features.

Vault supports different storage backends, each one with its own pros and cons. Some are meant to be used in development environments (like in memory and local file) and others are more suitable for production, with support for high availability (like DynamoDB or [consul](https://www.consul.io/), another hashicorp's service).

The official documentation indirectly recommends using vault with consul, which is a service with more features than just storing data. Indeed, it is a service discovery tool widely used this days in container-based infrastructures.

For this reason, we started using both vault and consul in development, in order to get used to both services, but in the end we found it problematic because of different reasons:

* The consul server needs to get started before vault, otherwise vault fails on start-up. We saw this problem happening in development very frequently, which was annoying.
* We talked with an expert sysadmin that was using consul in production environments. He told us it was a magnificent service, but he warn us about the possibility of having random data loss for no apparent reason.<br>
When using consul as a service discovery tool, that is not a big problem. Just recreating the consul cluster, all the data is retrieved again from running services. In our case it isn't that simple. We were going to store sensitive and important data in consul, and loosing it could be a big problem.
* I usually prefer to maintain as less services as possible in production. I see it from the point of view of a developer. If there is a cloud service that does the job, I prefer to use it rather than maintaining my own server.<br>
**Be serverless as much as possible**.

### Finding an alternative

Ok, consul is discarded. We need another storage alternative.

Looking at vault's documentation we saw there are a couple [storage backends](https://www.vaultproject.io/docs/configuration/storage/dynamodb.html) that support high availability.

We finally decided to go with [AWS DynamoDB](https://aws.amazon.com/dynamodb/). It is much less prone to data loss due to redundant storage under it, easier to buck-up and restore, and much cheaper than having dedicated servers. Also, the project's infrastructure is already in AWS, so communication should be fast.

Using DynamoDB we now only need to manage vault servers.

### Vault's high availability

Another of the vault's feature is the possibility to configure several servers in high availability mode, as long as the storage supports it.

This was a must for us, since getting vault down would make the service to not properly work and produce inconsistent data.

The way vault manages high availability is very interesting. The first server that's unsealed is set as active, and the rest are set in standby.

If a request is performed to one of the servers in standby, they just redirect the request to the active server.

If the active server is down, then one of the standby servers takes the leadership and is set as active.

The communication between servers does not happen via network communication, but on the shared storage. The active server creates a lock file, and this way, the rest of the servers know they have to standby.

This makes every server to work in an independent manner, and makes it easy to add more servers to the cluster if needed.

The only problem is how do I make my app dynamically read from the active server, but be able to read from others if the active is down.

Do I have to manually manage the load balancing? Do I have to implement some kind of strategy that tries to communicate to each server until one returns a response? That's odd.

Vault's documentation recommends using another consul's feature to solve this problem, some kind of DNS that makes a cluster name to resolve to the active instances IP address. This way you just need to perform requests to the cluster name.

That's good, but we weren't going to use consul, right?

### AWS internal load balancer to the rescue

After some investigation we saw contradictory opinions on behalf of hashicorp about using a load balancer with vault. Sometimes they recommend not to use it, sometimes they say they are not against nor in favor. 

Because of the way high availability works in vault, if the balancer redirects to a standby instance and it redirects to the balancer again, you could enter an infinite redirection loop.

But what if you could make the load balancer consider standby instances out of service?

Gladly, vault's API has an [endpoint](https://www.vaultproject.io/api/system/health.html) that performs a health check returning a status 200 only on unsealed active instances. If the instance is not active, it returns a 429 status. This endpoint doesn't require authentication.

Using this endpoint for the balancer's health check, the balancer will never redirect to a standby instance.

Also, if the active instance has any problem and goes down, as soon as a standby instance takes leadership, the load balancer will notice it, and mark it as *InService*, starting to redirect requests to that instance.

Pretty nice. We can now configure our app to perform requests to the balancer and the problem is solved.

### Configuring the AWS load balancer

When configuring the load balancer for the vault instances, we just need to take into account a few things.

First, the balancer should be a classic load balancer, and it has to be configured as **internal**. This makes the balancer name resolve to the private IP address, and therefore, you prevent anyone accessing vault from the outside.

It should also be configured to forward HTTP traffic on port 8200 (vault works on this port)

![Load balancer]({{site.url}}/assets/img/vault-with-load-balancer/balancer-first-step.png)

Then, when you are asked to configure the health check, use this params.

![Health check]({{site.url}}/assets/img/vault-with-load-balancer/health-check.png)

Configure the interval and healthy threshold according to your needs. Since for me it is a critical service, I reduced the interval to 15 seconds, and set the healthy threshold to 2. This way, when tha active instances goes down, it wont take more than 30 seconds to recover the service.

Finally add the instances to the balancer.

If everything is properly configured, after some seconds, in the instances tab of the balancer, you should see that only one of the instances is *InService*.

![Instances status]({{site.url}}/assets/img/vault-with-load-balancer/instances-status.png)

Now the balancer and the vault instances are ready to work!
