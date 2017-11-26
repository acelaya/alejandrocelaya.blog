---
layout: post
title: "How to simulate a socket connection with AWS Simple Queue Service"
categories: [tools]
tags: [aws,sqs,simple-queue-service,message-queue,queue,socket]
---

At some point, any enterprise project will probably need a message queue.

A message queue is used to publish information (usually known as **message**) that a different "node" (usually known as **worker**) will consume in order to perform a specific action.

It is frequently used in web applications to pass information to background workers that consume the queue and perform long tasks, but it is also an important part when applying concepts like [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) to your architecture.

It is also really important when working with microservices, since it is a way to enable communication between each service.

Whatever the case, it is very likely that you will eventually need to decide which message queue to use.

### Why AWS Simple Queue Service

In my company we had to decide this some time ago.

We started testing different services, seeing what their strengths and weaknesses were.

If I remember correctly, we tested [RabbitMQ](https://www.rabbitmq.com/), [Beanstalkd](https://kr.github.io/beanstalkd/), [Redis](https://redis.io/) and [AWS Simple Queue Service](https://aws.amazon.com/sqs/) (**SQS** from now on).

The conclusion was that RabbitMQ is the one with the more features, by far. However, it is also the most complicated to configure and interact with.

Also, we would have to maintain the RabbitMQ clusters ourselves (the same happens with Beanstalkd).

Since we work with AWS, we decided to give **SQS** a try, and its simplicity convinced us.

It is super simple to create a new queue, and using one of their SDKs, you can interact with it in minutes.

Also, the price is absurdly cheap. It is virtually free for "small" amounts of requests (and when I say small, I mean that 1 request to their API every 20 seconds during 1 year costs about $0.30 at the end of the year).

It is by far more cheaper than maintaining your own instances with a different service, and I'm not counting the cost in time you will have to invest in maintaining those instances.

### The "small" problem with SQS

One of the most interesting features with RabbitMQ is that you can open one socket with the queue server, and once a new message gets in, the worker is "notified" and the message can be consumed. This way, you have a process which is always running, listening for a queue, and processing messages as soon as possible.

This is usually the desired behavior. You don't want any delay on processing messages (or the delay should be as short as possible).

On the other hand, **SQS** bills by API request. This means that the worker has to manually check if there's any message in the queue, in small intervals.

Our first approach was configuring cron jobs in our workers, so that they could check if there were any message in the queue, and process all of them, if any.

This was problematic, since it applies a delay of up to one minute (you can't configure a cron to be run with an interval smaller than that), which is not desirable, particularly when the job takes 5-10 seconds to complete. Adding an extra 600% waiting time can affect the user experience depending on the task.

### The long polling to the rescue

The first solution that came to our mind was making the workers run requests on an infinite loop, but that's not a very clean approach, and will result in our workers being at a 100% of CPU usage all the time.

We started investigating and found out about a feature in **SQS** called [long polling](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-long-polling.html). It let's you tell the queue to wait up to 20 seconds if the message queue is empty, and, if during that time a new message enters the queue, return a response immediately.
