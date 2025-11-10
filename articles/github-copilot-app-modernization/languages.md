---
title: Languages and Frameworks Supported by GitHub Copilot app modernization
description: Introduces the support scope of GitHub Copilot app modernization for languages and frameworks.
---

# Languages and Frameworks Supported by GitHub Copilot app modernization

GitHub Copilot app modernization currently supports the following scenarios for languages and frameworks listed below.

## Java
### Upgrading Java version
GitHub Copilot app modernization can help you [upgrade the Java version](https://learn.microsoft.com/en-us/java/upgrade/quickstart-upgrade) of your application and fixes compilation issues and common vulnerabilities. You may [customize the upgrade plan](https://learn.microsoft.com/en-us/java/upgrade/customize-upgrade-plan) to consider additional goals or guidelines during Java version upgrade.

### Upgrading Java framework version
GitHub Copilot app modernization can help you [upgrade the framework version](https://learn.microsoft.com/en-us/java/upgrade/framework-upgrade) of your Java application, whether it is Spring, Spring Boot, or Java EE/Jakarta EE. The tool will make sure the JDK version is also upgraded to be compatible with the framework version, and verify the changes with build fixes and CVE checks.

### Migrating Java apps to Azure
GitHub Copilot app modernization can help you [migrate your Java application to Azure](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate) by assessing its cloud-readiness and updating the code for dependency services.

[Common scenarios](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-predefined-tasks) are supported with AI-assisted code changes out-of-box, and you may define and run your [custom tasks](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task) with reference knowledge such as git commits, plain-text files and URLs without authentication. Code changes will be validated with compilation and CVE fixes as well.

For Java EE / Jakarta EE applications, you may need to first make sure your application architecture is compatible with the target Azure platform. For example, some JBoss EAP apps can be deployed to [Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-language-java-deploy-run?pivots=java-jboss&tabs=windows#jboss-eap-server-lifecycle), but [WebSphere apps should be transformed to Liberty](https://www.ibm.com/docs/en/was-liberty/core?topic=migrating-applications-liberty) before being deployed to Azure Kubernetes Service. After such transformation, GitHub Copilot app modernization can help you update the code for dependency services if they are called with direct APIs.

## .NET
### Upgrading .NET version
GitHub Copilot app modernization can help you [upgrade the .NET version](https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/how-to-upgrade-with-github-copilot) of your application, from an older .NET version or from .NET Framework. The upgrade plan can be customized with your requirements and preferences, and code changes will be validated with compilation and CVE fixes.

### Migrating .NET apps to Azure
GitHub Copilot app modernization can help you [migrate your .NET application to Azure](https://learn.microsoft.com/en-us/dotnet/azure/migration/appmod/quickstart) by assessing its cloud-readiness and updating the code for dependency services.

[Common scenarios](https://learn.microsoft.com/en-us/dotnet/azure/migration/appmod/predefined-tasks) are supported with AI-assisted code changes out-of-box, and code changes will be validated with compilation and CVE fixes.

## Python
### Migrating to Agent Framework
GitHub Copilot app modernization can help you migrate your Semantic Kernel or AutoGen application to Agent Framework, if it is written in Python or .NET.

@Menghua to add a brief tutorial here with screenshots, please remind the user to use Sonnet 4 and the right MCP tools for best results.

## Language-agnostic
### Containerization
Regardless of language, GitHub Copilot app modernization can help you containerize your application by creating a Dockerfiles and building container images.

You may refer to [the Java example on VS Code](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-containerization) or [the .NET example on Visual Studio](https://learn.microsoft.com/en-us/dotnet/azure/migration/appmod/containerization), and you may containerize any application with the "Containerization Tasks" under the "Common Tasks" list in the app modernization extension sidebar on VS Code.

### Deploying to Azure
Regardless of language, GitHub Copilot app modernization can help you deploy your application on existing or new Azure resources.

You may refer to [the Java example on VS Code](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-deploy-to-azure) or [the .NET example on Visual Studio](https://learn.microsoft.com/en-us/dotnet/azure/migration/appmod/deploy), and you may deploy any application with the "Deployment Tasks" under the "Common Tasks" list in the app modernization extension sidebar on VS Code.