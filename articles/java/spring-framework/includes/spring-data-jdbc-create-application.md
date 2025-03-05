---
ms.date: 02/22/2023
author: KarlErickson
ms.author: karler
ms.reviewer: seal
---

<!-- NOTE: The item number must be 3 here to force continuation of the sequence after previous steps in the file that includes this file. Otherwise, the numbering will reset to 1. -->
3. Create a new `Todo` Java class. This class is a domain model mapped onto the `todo` table that will be created automatically by Spring Boot. The following code ignores the `getters` and `setters` methods.

   ```java
   import org.springframework.data.annotation.Id;

   public class Todo {

       public Todo() {
       }

       public Todo(String description, String details, boolean done) {
           this.description = description;
           this.details = details;
           this.done = done;
       }

       @Id
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
   import org.springframework.data.repository.CrudRepository;

   import java.util.stream.Stream;

   @SpringBootApplication
   public class DemoApplication {

       public static void main(String[] args) {
           SpringApplication.run(DemoApplication.class, args);
       }

       @Bean
       ApplicationListener<ApplicationReadyEvent> basicsApplicationListener(TodoRepository repository) {
           return event->repository
               .saveAll(Stream.of("A", "B", "C").map(name->new Todo("configuration", "congratulations, you have set up correctly!", true)).toList())
               .forEach(System.out::println);
       }

   }

   interface TodoRepository extends CrudRepository<Todo, Long> {

   }
   ```

   [!INCLUDE [spring-default-azure-credential-overview.md](spring-default-azure-credential-overview.md)]

1. Start the application. The application stores data into the database. You'll see logs similar to the following example:

   ```shell
   2023-02-01 10:22:36.701 DEBUG 7948 --- [main] o.s.jdbc.core.JdbcTemplate : Executing prepared SQL statement [INSERT INTO todo (description, details, done) VALUES (?, ?, ?)]    
   com.example.demo.Todo@4bdb04c8
   ```
