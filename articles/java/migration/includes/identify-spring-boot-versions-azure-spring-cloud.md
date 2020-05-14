---
author: yevster
ms.author: yebronsh
ms.date: 4/15/2020
---

#### Identify Spring Boot versions

Examine the dependencies of each application being migrated to determine its Spring Boot version.

For any applications using Spring Boot 1.x, follow the [Spring Boot 2.0 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide) to update them to a supported Spring Boot version. For supported versions, see [Prepare a Java Spring app for deployment](/azure/spring-cloud/spring-cloud-tutorial-prepare-app-deployment#spring-boot-and-spring-cloud-versions).

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
