---
title: Secure your REST API using Spring Cloud Azure
description: Shows you how to secure REST API by Microsoft Entra ID.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.date: 08/28/2024
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Secure your REST API using Spring Cloud Azure

This tutorial shows you how to enable REST APIs protection with [Microsoft Entra ID](/azure/active-directory/fundamentals/active-directory-whatis) in a Spring Boot application.

This article uses a survey system as an example. The survey system provides the following REST APIs:

- `GET  /api/survey/question` is for viewing the survey.
- `POST /api/survey` is for fill in the survey.
- `GET  /api/survey` is for viewing the survey result.

In this article, you protect these APIs by applying role-based access control (RBAC) to enforce the following requirements:

- `GET  /api/survey/question` is available for each request.
- `POST /api/survey` is available for authenticated user requests containing an access token with the `SCOPE_Survey.User` scope granted.
- `GET  /api/survey` is available for authenticated admin user requests containing an access token with the `SCOPE_Survey.Admin` scope granted.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or higher.
- [Apache Maven](https://maven.apache.org)
- [Azure CLI](/cli/azure/install-azure-cli)
- A Microsoft Entra instance. For instructions on creating one, see [Quickstart: Create a new tenant in Microsoft Entra ID](/azure/active-directory/fundamentals/active-directory-access-create-new-tenant).
- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web**, **OAuth2 Resource Server**, and **Microsoft Entra ID** dependencies, and then select Java version 8 or higher.

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this article.

## Register the REST API

Use the following steps to register your web API in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. If you have access to multiple tenants, use the **Directory + subscription** filter (:::image type="icon" source="media/secure-your-restful-api-using-spring-cloud-azure/portal-directory-subscription-filter.png" border="false":::) to select the tenant in which you want to register an application.

1. Find and select **Microsoft Entra ID**.

1. Under **Manage**, select **App registrations** > **New registration**.

1. Enter a name for your application in the **Name** field, for example `Api-SurveyService`. Users of your app might see this name, and you can change it later.

1. For **Supported account types**, select **Accounts in any organizational directory**.

1. Select **Register** to create the application.

1. On the app **Overview** page, look for the **Application (client) ID** value, and then record it for later use. You need it to configure the YAML configuration file for this project.

1. Under **Manage**, select **Expose an API** > **Add a scope**. Accept the proposed Application ID URI (`api://{clientId}`) by selecting **Save and continue**, and then enter the following information:

   - For **Scope name**, enter `Survey.User`.
   - For **Who can consent**, select **Admins and users**.
   - For **Admin consent display name**, enter `Access the survey service as a user.`.
   - For **Admin consent description**, enter `Allows the users to write data in survey system.`.
   - For **User consent display name**, enter `Access the survey service as a user.`.
   - For **User consent description**, enter `Allows the users to write data in survey system.`.
   - For **State**, keep **Enabled**.
   - Select **Add scope**.

1. Repeat the previous step to add another scope. When you select **Add a scope**, enter the following information:

   - For **Scope name**, enter `Survey.Admin`.
   - For **Who can consent**, select **Admins and users**.
   - For **Admin consent display name**, enter `Access the survey service as a admin.`.
   - For **Admin consent description**, enter `Allows the users to view data in survey system.`.
   - For **User consent display name**, enter `Access the survey service as a admin.`.
   - For **User consent description**, enter `Allows the users to view data in survey system.`.
   - For **State**, keep **Enabled**.
   - Select **Add scope**.

<a name='enable-the-spring-cloud-azure-starter-azure-active-directory'></a>

## Enable the Spring Cloud Azure Starter Microsoft Entra ID

Next, enable the REST API protection with Spring Cloud Azure.

### Add Security dependencies

To install the Spring Cloud Azure Starter Azure Active Directory module, add the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>5.22.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.20.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure Starter Microsoft Entra artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
  </dependency>
  ```

- The Spring Boot Starter OAuth2 Resource Server artifact:

  ```xml
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
  </dependency>
  ```

### Authorize HTTP requests

To protect the survey REST APIs, add the annotation `@PreAuthorize("hasAuthority('SCOPE_Survey.xxx')")` with a concrete scope name to enable protection, as shown in the following example:

```java
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/survey")
public class SurveyController {

    private static final String QUESTION = "Which sports do you like most?";
    private final Map<LocalDateTime, String> surveys = new LinkedHashMap<>();

    @GetMapping(value = "/question", produces = MediaType.APPLICATION_JSON_VALUE)
    public String question() {
        return QUESTION;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_Survey.User')")
    public String addAnswer(@RequestParam("answer") String answer) {
        if (StringUtils.hasText(answer)) {
            surveys.put(LocalDateTime.now(), answer);
            return "succeeded";
        }
        return "Failed";
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('SCOPE_Survey.Admin')")
    public Map<LocalDateTime, String> list() {
        return surveys;
    }
}
```

Update the YAML configuration as shown in the following example:

```yaml
spring:
  cloud:
    azure:
      active-directory:
        enabled: true
        credential:
          client-id: <your-application-ID-of-Api-SurveyService>
        app-id-uri: <your-application-ID-URI-of-Api-SurveyService>
```

> [!NOTE]
> In v1.0 tokens, the configuration requires the client ID of the API, while in v2.0 tokens, you can use the client ID or the application ID URI in the request. You can configure both to properly complete the audience validation.

## Deploy to Azure Spring Apps

After you have the Spring Boot application running locally, you can move it to production. [Azure Spring Apps](/azure/spring-apps/overview) makes it easy to deploy Spring Boot applications to Azure without any code changes. The service manages the infrastructure of Spring applications so developers can focus on their code. Azure Spring Apps provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](/azure/spring-apps/quickstart).

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Microsoft Entra ID Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/aad/spring-cloud-azure-starter-active-directory)
