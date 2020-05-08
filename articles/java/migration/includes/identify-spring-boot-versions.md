---
author: yevster
ms.author: yebronsh
ms.date: 4/15/2020
---

#### Identify Spring Boot versions

Examine the dependencies of each application being migrated to determine its Spring Boot version.

##### Maven

In Maven projects, the Spring Boot version is typically found in the `<parent>` element of the POM file:

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.6.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
```

##### Gradle

In Gradle projects, the Spring Boot version will typically be found in the `plugins` section, as the version of the `org.springframework.boot` plugin:

```gradle
plugins {
  id 'org.springframework.boot' version '2.2.6.RELEASE'
  id 'io.spring.dependency-management' version '1.0.9.RELEASE'
  id 'java'
}
```
