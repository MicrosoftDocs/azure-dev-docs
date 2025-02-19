---
ms.date: 02/22/2023
author: KarlErickson
ms.author: seal
---

<!-- NOTE: The item number must be 2 here to force continuation of the sequence after previous steps in the file that includes this file. Otherwise, the numbering will reset to 1. -->
2. Create a new `Todo` Java class. This class is a domain model mapped onto the `todo` table that will be created automatically by JPA. The following code ignores the `getters` and `setters` methods.

   ```java
   package com.example.demo;

   import javax.persistence.Entity;
   import javax.persistence.GeneratedValue;
   import javax.persistence.Id;

   @Entity
   public class Todo {

       public Todo() {
       }

       public Todo(String description, String details, boolean done) {
           this.description = description;
           this.details = details;
           this.done = done;
       }

       @Id
       @GeneratedValue
       private Long id;

       private String description;

       private String details;

       private boolean done;

   }
   ```

1. Edit the startup class file to show the following content.

   ```java
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.boot.context.event.ApplicationReadyEvent;
   import org.springframework.context.ApplicationListener;
   import org.springframework.context.annotation.Bean;
   import org.springframework.data.jpa.repository.JpaRepository;
   
   import java.util.stream.Collectors;
   import java.util.stream.Stream;

   @SpringBootApplication
   public class DemoApplication {

       public static void main(String[] args) {
           SpringApplication.run(DemoApplication.class, args);
       }

       @Bean
       ApplicationListener<ApplicationReadyEvent> basicsApplicationListener(TodoRepository repository) {
           return event->repository
               .saveAll(Stream.of("A", "B", "C").map(name->new Todo("configuration", "congratulations, you have set up correctly!", true)).collect(Collectors.toList()))
               .forEach(System.out::println);
       }

   }

   interface TodoRepository extends JpaRepository<Todo, Long> {

   }
   ```

   [!INCLUDE [spring-default-azure-credential-overview.md](spring-default-azure-credential-overview.md)]

1. Start the application. You'll see logs similar to the following example:

   ```shell
   2023-02-01 10:29:19.763 DEBUG 4392 --- [main] org.hibernate.SQL : insert into todo (description, details, done, id) values (?, ?, ?, ?)
   com.example.demo.Todo@1f
   ```
