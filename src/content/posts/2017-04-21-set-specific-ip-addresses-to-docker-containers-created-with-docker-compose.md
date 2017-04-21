---
layout: post
title: "Set specific IP addresses to docker containers created with docker-compose"
categories: [tools]
tags: [docker,docker-compose,network]
---

Recently I have been testing one service and its clustering capabilities, in order to see if it fits in a project I'm working on.

I decided the easiest way to do this was by creating a couple docker containers and setting up a cluster between them. It should be an easy task in theory.

My first approach was using a docker-compose file and linking the containers between themselves:

```yaml
version: '3'

services:
    test_1:
        container_name: test_1
        image: some:image
        links:
            - test_2
            - test_3

    test_2:
        container_name: test_2
        image: some:image
        links:
            - test_1
            - test_3

    test_3:
        container_name: test_3
        image: some:image
        links:
            - test_1
            - test_2
```

My surprise when I run `docker-compose up -d` was that I received this message:

```bash
ERROR: Circular dependency between test_2 and test_3 and test_1
```

It makes sense, since docker-compose checks links in order to run containers in the correct order. It is not possible in this case because every container depends on the other two.

### Fixing the problem with networks

By default docker assigns random (sort of...) IP addresses to containers. By using links you make an entry to be added to the hosts file of a container, mapping the name of another container with its IP address. This way you don't need to know its IP address, you can access it over the network by just using its name.

I needed all containers to have a "known" network identifier in order to get the cluster working, because this service consumes a configuration on start-up that's not dynamic.

The solution was making the containers have a static known IP, this way they can be run without links and still communicate between themselves.

Gladly, docker-compose supports networks since version 2, and I was able to define this configuration:

```yaml
version: '3'

services:
    test_1:
        container_name: test_1
        image: some:image
        networks:
            testing_net:
                ipv4_address: 172.28.1.1

    test_2:
        container_name: test_2
        image: some:image
        networks:
            testing_net:
                ipv4_address: 172.28.1.2

    test_3:
        container_name: test_3
        image: some:image
        networks:
            testing_net:
                ipv4_address: 172.28.1.3

networks:
    testing_net:
        ipam:
            driver: default
            config:
                - subnet: 172.28.0.0/16
```

Using the `ipam` you can define a specific CIDR block for the new network, and then, attaching every container to that network you can specify its IP address.

Now, test_1 is always run with the IP address 172.28.1.1, test_2 with 172.28.1.2 and test_3 with 172.28.1.3, and I'm able to hardcode those addresses in the config files.

And that's all!
