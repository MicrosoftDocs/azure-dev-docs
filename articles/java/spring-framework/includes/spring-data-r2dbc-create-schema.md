---
 author: judubois
 ms.date: 05/06/2020
 ms.author: judubois
---

Inside the main `DemoApplication` class, configure a new Spring bean that will create a database schema:

```java
    @Bean
    public ConnectionFactoryInitializer initializer(ConnectionFactory connectionFactory) {
        ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
        initializer.setConnectionFactory(connectionFactory);
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource("schema.sql"));
        initializer.setDatabasePopulator(populator);
        return initializer;
    }
```

This Spring bean uses a file called *schema.sql*, so create that file in the *src/main/resources* folder:
