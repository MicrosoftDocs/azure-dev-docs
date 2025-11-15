---
title: Languages and Frameworks Supported by GitHub Copilot app modernization
description: Introduces the support scope of GitHub Copilot app modernization for languages and frameworks.
ms.topic: reference
ms.date: 11/18/2025
---

# Languages and frameworks supported by GitHub Copilot app modernization

GitHub Copilot app modernization currently supports the following scenarios for languages and frameworks.

## Java

### Upgrading Java version

GitHub Copilot app modernization can help you [upgrade the Java version](/java/upgrade/quickstart-upgrade?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) of your application and fix compilation issues and common vulnerabilities. You can [customize the upgrade plan](/java/upgrade/customize-upgrade-plan?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) to consider additional goals or guidelines during the Java version upgrade.

### Upgrading Java framework version

GitHub Copilot app modernization can help you [upgrade the framework version](/java/upgrade/framework-upgrade?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) of your Java application, whether it's Spring, Spring Boot, or Java EE/Jakarta EE. The tool makes sure the JDK version is also upgraded to be compatible with the framework version, and verifies the changes with build fixes and CVE checks.

### Migrating Java apps to Azure

GitHub Copilot app modernization can help you [migrate your Java application to Azure](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) by assessing its cloud readiness and updating the code for dependency services.

[Common scenarios](../java/migration/migrate-github-copilot-app-modernization-for-java-predefined-tasks.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) are supported with AI-assisted code changes out-of-box, and you can define and run your [custom tasks](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) with reference knowledge such as git commits, plain-text files, and URLs without authentication. Code changes are validated with compilation and CVE fixes.

For Java EE / Jakarta EE applications, you need to first make sure your application architecture is compatible with the target Azure platform. For example, some JBoss EAP apps can be deployed to [Azure App Service](/azure/app-service/configure-language-java-deploy-run?pivots=java-jboss&tabs=windows#jboss-eap-server-lifecycle), but [WebSphere apps should be transformed to Liberty](https://www.ibm.com/docs/en/was-liberty/core?topic=migrating-applications-liberty) before being deployed to Azure Kubernetes Service (AKS). After such transformation, GitHub Copilot app modernization can help you update the code for dependency services if they are called with direct APIs.

## .NET

### Upgrading .NET version

GitHub Copilot app modernization can help you [upgrade the .NET version](/dotnet/core/porting/how-to-upgrade-with-github-copilot?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) of your application, from an older .NET version or from .NET Framework. You can customize the upgrade plan with your requirements and preferences. Code changes are validated with compilation and CVE fixes.

### Migrating .NET apps to Azure

GitHub Copilot app modernization can help you [migrate your .NET application to Azure](/dotnet/azure/migration/appmod/quickstart?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) by assessing its cloud readiness and updating the code for dependency services.

The tool supports [common scenarios](/dotnet/azure/migration/appmod/predefined-tasks?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) with AI-assisted code changes out of the box. It validates code changes with compilation and CVE fixes.

## Python

### Migrating to Microsoft Agent Framework

GitHub Copilot app modernization can help you migrate your Python application from Semantic Kernel or AutoGen to Microsoft Agent Framework.

To migrate to Microsoft Agent Framework:

1. Make sure you install and enable GitHub Copilot app modernization in Visual Studio Code (VS Code). For best results, select Claude Sonnet 4 or later as your model.

1. Open your Python project that uses Semantic Kernel or AutoGen in VS Code.

1. Select the app modernization extension to open the sidebar.

1. Start the migration process by using one of these methods:
   - Select the **Convert to Agent Framework** button when detected automatically.
   - Manually navigate to **Tasks** > **Python** > **Agent Framework Migration** > **Migrate AutoGen to Agent Framework** or **Migrate Semantic Kernel to Agent Framework**.

   :::image type="content" source="media/languages/migrate-to-agent-framework-quickstart.png" alt-text="Screenshot that shows the entry points for converting to Agent Framework button in VS Code.":::

   > [!TIP]
   > If you have a hybrid project with both Java and Python, use the manual navigation method through the **Tasks** list to select the Python migration option.

1. The extension starts the migration process in the Copilot Agent chat window.

   :::image type="content" source="media/languages/migrate-to-agent-framework-run-task.png" alt-text="Screenshot that shows the chat window with the migration task being invoked through the appmod-run-task tool.":::

1. To complete the migration, follow the guidance in the chat window. After code migration, the workflow sets up a Python virtual environment (if not already set up) and installs project dependencies, then runs Python-specific validation steps:

   - **Check Python Syntax Issues**: Resolve Python syntax and import issues.
   - **Check Python Lint Issues**: Install linters (if not already installed) and resolve lint issues per project configuration.
   - **Run Python Tests**: Install test runners (if not already installed) and run tests to verify the migration quality.

   :::image type="content" source="media/languages/migrate-to-agent-framework-workflow.png" alt-text="Screenshot that shows the environment setup, syntax checking, and lint checking in the migration workflow.":::

   :::image type="content" source="media/languages/migrate-to-agent-framework-workflow-run-test.png" alt-text="Screenshot that shows the Run Python Tests step in the migration workflow.":::

1. Review the migration summary, which includes the files migrated, validation results, and more.

   :::image type="content" source="media/languages/migrate-to-agent-framework-summary.png" alt-text="Screenshot that shows the migration summary with migrated files and validation results.":::

## Language-agnostic

### Containerization

Regardless of language, GitHub Copilot app modernization can help you containerize your application by creating Dockerfiles and building container images.

For more information, see [the Java example on VS Code](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-containerization.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) or [the .NET example on Visual Studio](/dotnet/azure/migration/appmod/containerization?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json). You can containerize any application with the **Containerization Tasks** options under the **Common Tasks** list in the app modernization extension sidebar in VS Code.

### Deploying to Azure

Regardless of language, GitHub Copilot app modernization can help you deploy your application on existing or new Azure resources.

For more information, see [the Java example on VS Code](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-deploy-to-azure.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json) or [the .NET example on Visual Studio](/dotnet/azure/migration/appmod/deploy?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json). You can deploy any application with the **Deployment Tasks** options under the **Common Tasks** list in the app modernization extension sidebar in VS Code.
