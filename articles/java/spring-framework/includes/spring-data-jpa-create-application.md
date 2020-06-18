---
 author: judubois
 ms.date: 06/16/2020
 ms.author: judubois
---

Create a new `Todo` Java class, next to the `DemoApplication` class, and add the following code:

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Todo)) {
            return false;
        }
        return id != null && id.equals(((Todo) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
```

This class is a domain model mapped on the `todo` table, that will be automatically created by JPA.

To manage that class, you'll need a repository. Define a new `TodoRepository` interface in the same package:

```java
package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}
```

This repository is a repository that Spring Data JPA manages.

Finish the application by creating a controller that can store and retrieve data. Implement a `TodoController` class in the same package, and add the following code:

```java
package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Todo createTodo(@RequestBody Todo todo) {
        return todoRepository.save(todo);
    }

    @GetMapping("/")
    public Iterable<Todo> getTodos() {
        return todoRepository.findAll();
    }
}
```

Finally, halt the application and start it again using the following command:

```bash
./mvnw spring-boot:run
```

## Test the application

To test the application, you can use cURL.

First, create a new "todo" item in the database using the following command:

```bash
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"description":"configuration","details":"congratulations, you have set up JPA correctly!","done": "true"}' \
    http://127.0.0.1:8080
```

This command should return the created item as follows:

```json
{"id":1,"description":"configuration","details":"congratulations, you have set up JPA correctly!","done":true}
```

Next, retrieve the data by using a new cURL request as follows:

```bash
curl http://127.0.0.1:8080
```

This command will return the list of "todo" items, including the item you've created, as follows:

```json
[{"id":1,"description":"configuration","details":"congratulations, you have set up JPA correctly!","done":true}]
```
