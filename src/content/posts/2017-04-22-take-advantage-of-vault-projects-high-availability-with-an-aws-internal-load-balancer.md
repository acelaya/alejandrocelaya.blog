---
layout: post
title: "Take advantage of vault project&#039;s​ high availability with an AWS internal load balancer"
categories: [tools]
tags: [vault,ha,high-availability,aws,load-balancer,hashicorp,encryption,security]
---

In a project I'm working on, we recently needed to add some kind of encryption system that allowed us to store sensitive information in a secure manner, but being able to access to it at runtime in order to pass it to third party services.

Securely storing your own app passwords is easy. You just hash it, and the password can be verified without having to decrypt it, but if you need to "decrypt" it, the solution is not that easy.

We started by building our own solution based on [zend/crypt](https://docs.zendframework.com/zend-crypt/), which is an excellent solution and works like a charm, but you still need to store the master key somehow, and that's the big problem.

After some research someone pointed us to [vault project](https://www.vaultproject.io/), a self-hosted service which securely manages encrypted key-value pairs, in a more secure manner, where the master key is securely handled. I recommend you read the docs in order to see all its features.

Vault supports different storage backends, each one with its own pros and cons. Some are meant to be used in development environments (like in memory and local file) and others are more suitable for production, with support for high availability (like DynamoDB or consul, onther hashicorp's service).
 

