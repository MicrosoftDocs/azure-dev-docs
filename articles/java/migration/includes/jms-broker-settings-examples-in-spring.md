---
author: yevster
ms.author: yebronsh
ms.date: 2/12/2020
---

Here's an ActiveMQ example from an *application.properties* file:

```properties
spring.activemq.brokerurl=broker:(tcp://localhost:61616,network:static:tcp://remotehost:61616)?persistent=false&useJmx=true
spring.activemq.user=admin
spring.activemq.password=tryandguess
```

For more information on ActiveMQ configuration, see the [Spring Boot messaging documentation](https://docs.spring.io/spring-boot/docs/2.0.x/reference/html/boot-features-messaging.html).

Here's an IBM MQ example from an *application.yaml* file:

```yaml
ibm:
  mq:
    queueManager: qm1
    channel: dev.ORDERS
    connName: localhost(14)
    user: admin
    password: big$ecr3t
```

For more information on IBM MQ configuration, see the [IBM MQ Spring components documentation](https://github.com/ibm-messaging/mq-jms-spring#ibm-mq-jms-spring-components).
