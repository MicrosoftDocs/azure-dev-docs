---
title: Code Using the Java tools you Know and Love
titleSuffix: Azure
description: This article provides an overview of the tools you can use for Java code development with Azure.
author: KarlErickson
ms.author: karler
ms.reviewer: asirveda
ms.topic: article
ms.date: 09/30/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-jenkins
---

# Code using the Java tools you know and love

As Java developers, we love the tools we use. We have our own unique way of working with them that helps us focus and stay productive, just as we have our shortcuts and secrets for getting things done faster and better. Whether we use IntelliJ, Eclipse, or VS Code for coding, or JUnit for testing, or Maven or Gradle for dependency management and build automation, there's nothing that can compel us to toss aside our preferred tools and learn something new. That's why Azure empowers Java developers to bring their applications to the cloud on your favorite tools and frameworks and on the operating system of your choice. Let's take a closer look at some of these tools.

## IDEs - VS Code, IntelliJ, and Eclipse

An ideal IDE includes tools for editing source-code, compilation, local build automation, testing, and debugging - along with controls and monitoring tools for backend services for data management, caching, messaging, and eventing. An integrated toolset that supports all these tasks makes developers more productive, enabling them to avoid having to learn and constantly switch between standalone tools for each task. IntelliJ, Eclipse, and Visual Studio Code are the popular Java IDEs.

## Java on Visual Studio Code

Visual Studio Code (VS Code) is a lightweight, agnostic operating system that runs on Windows, macOS, and Linux. A powerful IDE, it provides a comprehensive toolset for Java development. It supports any Java Development Kit (JDK), including the Microsoft Build of OpenJDK, Amazon Corretto, Eclipse Adoptium, and Oracle Java SE. VS Code also integrates well with all Java frameworks, application servers, and other popular tools, including Tomcat, Spring Boot, JBoss EAP, WildFly, Quarkus, Open Liberty, Maven, and Gradle. It also supports other programming languages that are frequently used by Java developers - like JavaScript and SQL.

:::image type="content" source="media/visual-studio-code-deploy.jpg" alt-text="Screenshot of Visual Studio Code that shows a Java file and the Output window." lightbox="media/visual-studio-code-deploy.jpg":::

VS Code supports and streamlines Java development workflows through a broad range of [Java extensions for Visual Studio Code](https://code.visualstudio.com/docs/java/extensions). There are several hundred extensions for Java alone, which you can search for from within the IDE itself. We packaged key extensions for fundamental Java development into the [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack). This extension pack includes extensions for project management, Maven integration, code editing, code completion, code navigation, refactoring, linting, formatting, debugging, running and debugging JUnit/TestNG test cases, and more. There's also a [Spring Boot Extension Pack](https://marketplace.visualstudio.com/items?itemName=vmware.vscode-boot-dev-pack) for developing and deploying Spring Boot applications - including Spring Initializr support.

The [Azure Tools Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), built by Azure engineering teams, provides a rich set of extensions for discovering and interacting with all the Azure cloud services that help power your Java applications. You can use all the extensions from within VS Code as you're writing, debugging, and testing your Java app. When you're ready to deploy your app, the Azure Tools Extension Pack supports one-click deployment to the various compute services that Azure provides for running Java applications.

[Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java) provides a good overview of the most popular Visual Studio Code extensions for Java development. It also provides instructions for getting started with Java development using Visual Studio Code, along with a walkthrough of the many ways it can help make Java developers more productive.

[Getting Started with Java in VS Code](https://code.visualstudio.com/docs/java/java-tutorial) provides a short tutorial that covers setting-up VS Code for Java Development, including how to write and run the Hello World program. Similarly, there are short tutorials that show how to build a Java application using Visual Studio Code and then deploy it with a single click into services such as the following ones:

* [Azure Container Apps](/azure/container-apps/deploy-visual-studio-code)
* [Azure App Service](https://code.visualstudio.com/docs/java/java-webapp)
* [Azure Functions](/azure/azure-functions/create-first-function-vs-code-java)

If you're new to Java on VS Code, try out the "Java: Tips for Beginners" command in its main Command Palette.

:::image type="content" source="media/visual-studio-code.jpg" alt-text="Screenshot of Visual Studio Code that shows a Java file and sidebar pane." lightbox="media/visual-studio-code.jpg":::

## Azure Toolkit for IntelliJ

The [Azure Toolkit for IntelliJ](../toolkit-for-intellij/index.yml) lets Java developers create, develop, test, and deploy Java applications to Azure using the IntelliJ IDE. For example, developers can use it to accomplish the following tasks:

* Deploy [Java Web applications](../toolkit-for-intellij/create-hello-world-web-app.md) to Azure App Service and [custom containers](../toolkit-for-intellij/hello-world-web-app-linux.md) in Azure App Service.
* Deploy Java or Spring applications, or any [containerized applications](../toolkit-for-intellij/create-container-apps-intellij.md), to Azure Container Apps.
* Deploy [serverless applications](/azure/azure-functions/functions-create-maven-intellij) to Azure Functions.

All of these examples use compute services for running Java on Azure, which we cover in more detail later in this documentation. Spring Cloud Azure integrations are provided through the Spring Initializr experiences in IntelliJ. Just add the appropriate [Java libraries and drivers](../sdk/libraries-drivers-modules.md) (including Azure SDK for Java) as dependencies in your Java project.

Microsoft is actively investing time and resources to provide more functionality for IntelliJ, including new experiences for cloud-native development and deeper integration with Azure services - including integrations with Azure Kubernetes Service and Application Insights.

:::image type="content" source="media/azure-toolkit-for-intellij.jpg" alt-text="Screenshot of IntelliJ that shows a Java file and the Deploy to Azure dialog box." lightbox="media/azure-toolkit-for-intellij.jpg":::

## Azure Toolkit for Eclipse

The Azure Toolkit for Eclipse lets Java developers create, develop, test, and deploy Java applications to Azure using the Eclipse IDE. It includes key [Java libraries and drivers](../sdk/libraries-drivers-modules.md), including the Azure SDK for Java. Developers can use the Azure Toolkit for Eclipse to accomplish the following tasks from the Eclipse IDE:

* Deploy Java Web Apps to Azure App Service and custom containers in App Service.
* Deploy Java or Spring applications, or any containerized applications, to Azure Container Apps.
* Deploy serverless applications to Azure Functions using Maven or Gradle plugins.

## Dependency management and build automation - Maven, Gradle, and GitHub

Maven and Gradle are two popular project management, dependency management, and build automation tools for Java applications. These tools are well-integrated into popular Java IDEs, with one-click deployment to Azure supported through a set of plug-ins for each tool.

## Maven Plugins for Azure Services

Maven plugins for Azure services let you extend your Maven development workflows to Azure, testing your Java applications locally and then deploying them to Azure services in a single step - in a way that integrates with Azure authentication methods and Azure Role-Based Access Control. The [Maven plugin for Azure App Service](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) helps you deploy Maven Java Web application projects to Azure App Service and to custom containers in App Service. The [Maven plugin for Azure Functions](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Functions) helps you deploy Maven serverless Java application projects to Azure Functions.

:::image type="content" source="media/maven.png" alt-text="Diagram that shows a laptop screen with the text 'mvn azure-webapp:deploy' and the heading Deploy Java Web App and Dependencies in One Step." border="false":::

## Gradle plugins for Azure services

Gradle plugins for Azure services are similar to those for Maven. They let you deploy your Java applications to Azure services in a single step - in a way that integrates with Azure authentication methods and Azure Role-Based Access Control. The [Gradle plugin for Azure App Service](https://github.com/microsoft/azure-gradle-plugins/blob/master/azure-webapp-gradle-plugin/README.md) helps you deploy Gradle Java Web application projects to Azure App Service and to custom containers in App Service, and the [Gradle plugin for Azure Functions](https://github.com/microsoft/azure-gradle-plugins/blob/master/azure-functions-gradle-plugin/README.md) helps you deploy Gradle serverless Java application projects to Azure Functions.

:::image type="content" source="media/gradle.png" alt-text="Diagram that shows a laptop screen with the text 'gradle azureWebAppDeploy' and the heading Deploy Java Web App in One Step." border="false":::

## GitHub

GitHub is a popular repository for Java applications, providing a DevOps environment for more than 3.5 million Java applications. Using [GitHub Actions for Java](https://github.com/actions/setup-java), you can accomplish tasks like the following ones:

* Download and set up a requested version of Java.
* Extract and cache a custom version of Java from a local file.
* Configure runners for publishing using Maven, Gradle, or a GPG private key.
* Register problem matchers for error output.
* Cache dependencies managed by Maven or Gradle.

GitHub Actions makes it easy to automate all of your Java software workflow using world-class CI/CD. You can build, test and deploy your code to Azure right from GitHub. Make code reviews, branch management, and issue triaging work the way you want. You can deploy to any of the Azure services for running your Java applications.

GitHub also supports [development containers for Java](https://github.com/Microsoft/vscode-remote-try-java), which you can access via GitHub Codespaces or VS Code Remote - Containers.

## Jenkins Pipelines

Many Microsoft customers who run Java on Azure use Jenkins - an open-source automation server - to build, test, and deploy their applications. If you use Jenkins, you can manage your source code in Azure DevOps, GitHub, or [any other source code management system](https://plugins.jenkins.io/ui/search/?categories=scm) while continuing to use Jenkins for your CI/CD builds - for example, [triggering a Jenkins build when you push your code to your project's Git repository](https://www.youtube.com/watch?v=okmh53oGlak).

## Azure Pipelines

[Azure Pipelines](/azure/devops/pipelines), part of the [Azure DevOps](/azure/devops) service, lets you continuously build, test, and deploy your Java applications to any platform and cloud. It works with GitHub (or Azure Repos) for source control, enabling you to [build using Maven or Gradle](/azure/devops/pipelines/ecosystems/java) and then deploy to any of the Azure services for running your Java applications.

## Azure Command Line Interface

The Azure Command-Line Interface (CLI) is a cross-platform command-line tool for creating, connecting to, and managing Azure resources - including the execution of terminal commands via command-line prompts or scripts. You can install the Azure CLI locally on Linux, macOS, or Windows-based machines, run it from within a container, or access the Azure CLI from a browser through Azure Cloud Shell.

The following example shows you how to use Azure CLI to deploy a JAR or WAR file to Azure Container Apps:

```azurecli
az containerapp up \
    --name <CONTAINER_APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --subscription <SUBSCRIPTION_ID> \
    --location <LOCATION> \
    --environment <ENVIRONMENT_NAME> \
    --artifact <JAR_FILE_PATH_AND_NAME> \
    --ingress external \
    --target-port 8080 \
    --query properties.configuration.ingress.fqdn
```

## Summary

When you use Java with Azure, you can choose your own tools. You can build test, debug, and troubleshoot any Java application (including polyglot applications) using the machine of your choice, including Windows, macOS, Linux, and cloud-based machines. You can also deploy your application to Azure on any application server or with any embedded application server.

:::image type="content" source="media/code-using-tools-you-know.png" alt-text="Diagram with the text 'Code using the Java tools you know and love' and logos for the tools described in this article." border="false" lightbox="media/code-using-tools-you-know.png":::

## Next step

[Deploy Java applications with confidence and ease](deploy.md)
