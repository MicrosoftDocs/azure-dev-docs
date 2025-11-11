---
title: Languages and Frameworks Supported by GitHub Copilot app modernization
description: Introduces the support scope of GitHub Copilot app modernization for languages and frameworks.
ms.topic: reference
ms.date: 11/11/2025
---

# Languages and Frameworks Supported by GitHub Copilot app modernization

GitHub Copilot app modernization currently supports the following scenarios for languages and frameworks listed below.

## Java
### Upgrading Java version
GitHub Copilot app modernization can help you [upgrade the Java version](/java/upgrade/quickstart-upgrade?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) of your application and fixes compilation issues and common vulnerabilities. You may [customize the upgrade plan](/java/upgrade/customize-upgrade-plan?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) to consider additional goals or guidelines during Java version upgrade.

### Upgrading Java framework version
GitHub Copilot app modernization can help you [upgrade the framework version](/java/upgrade/framework-upgrade?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) of your Java application, whether it is Spring, Spring Boot, or Java EE/Jakarta EE. The tool will make sure the JDK version is also upgraded to be compatible with the framework version, and verify the changes with build fixes and CVE checks.

### Migrating Java apps to Azure
GitHub Copilot app modernization can help you [migrate your Java application to Azure](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) by assessing its cloud-readiness and updating the code for dependency services.

[Common scenarios](../java/migration/migrate-github-copilot-app-modernization-for-java-predefined-tasks.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) are supported with AI-assisted code changes out-of-box, and you may define and run your [custom tasks](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) with reference knowledge such as git commits, plain-text files and URLs without authentication. Code changes will be validated with compilation and CVE fixes as well.

For Java EE / Jakarta EE applications, you may need to first make sure your application architecture is compatible with the target Azure platform. For example, some JBoss EAP apps can be deployed to [Azure App Service](/azure/app-service/configure-language-java-deploy-run?pivots=java-jboss&tabs=windows#jboss-eap-server-lifecycle), but [WebSphere apps should be transformed to Liberty](https://www.ibm.com/docs/en/was-liberty/core?topic=migrating-applications-liberty) before being deployed to Azure Kubernetes Service. After such transformation, GitHub Copilot app modernization can help you update the code for dependency services if they are called with direct APIs.

## .NET
### Upgrading .NET version
GitHub Copilot app modernization can help you [upgrade the .NET version](/dotnet/core/porting/how-to-upgrade-with-github-copilot?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) of your application, from an older .NET version or from .NET Framework. The upgrade plan can be customized with your requirements and preferences, and code changes will be validated with compilation and CVE fixes.

### Migrating .NET apps to Azure
GitHub Copilot app modernization can help you [migrate your .NET application to Azure](/dotnet/azure/migration/appmod/quickstart?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) by assessing its cloud-readiness and updating the code for dependency services.

[Common scenarios](/dotnet/azure/migration/appmod/predefined-tasks?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) are supported with AI-assisted code changes out-of-box, and code changes will be validated with compilation and CVE fixes.

## Python
### Migrating to Agent Framework
GitHub Copilot app modernization can help you migrate your Semantic Kernel or AutoGen application to Agent Framework, if it is written in Python.

With GitHub Copilot app modernization installed and enabled, open your Python project, select app modernization extension to open its sidebar, and either select the **Convert to Agent Framework** button when detected automatically, or manually navigate to **Tasks** > **Python** > **Agent Framework Migration** > **Migrate AutoGen to Agent Framework** or **Migrate Semantic Kernel to Agent Framework**.

:::image type="content" source="media/languages/migrate-to-agent-framework-quickstart.png" alt-text="Screenshot showing the entry points for converting to Agent Framework button in VS Code.":::

The extension will prompt you in the chat window to start the migration process:

:::image type="content" source="media/languages/migrate-to-agent-framework-run-task.png" alt-text="Screenshot showing the chat window with the migration task being invoked through the appmod-run-task tool.":::

The extension then guides you through completing the migration in the chat window.

For hybrid projects with both Python and other languages, open the folder that contains the Python code to make automatic detection work. For best results, use Claude Sonnet 4 or later.

## Language-agnostic
### Containerization
Regardless of language, GitHub Copilot app modernization can help you containerize your application by creating a Dockerfiles and building container images.

You may refer to [the Java example on VS Code](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-containerization.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) or [the .NET example on Visual Studio](/dotnet/azure/migration/appmod/containerization?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json), and you may containerize any application with the "Containerization Tasks" under the "Common Tasks" list in the app modernization extension sidebar on VS Code.

### Deploying to Azure
Regardless of language, GitHub Copilot app modernization can help you deploy your application on existing or new Azure resources.

You may refer to [the Java example on VS Code](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-deploy-to-azure.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) or [the .NET example on Visual Studio](/dotnet/azure/migration/appmod/deploy?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json), and you may deploy any application with the "Deployment Tasks" under the "Common Tasks" list in the app modernization extension sidebar on VS Code.
