---
title: What is GitHub Copilot for Azure?
description: This article describes the purpose and capabilities of the GitHub Copilot for Azure Visual Studio Code extension, and how it fits into a developer's workflow.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: overview
ms.date: 9/22/2025
ms.collection: ce-skilling-ai-copilot
---

# What is GitHub Copilot for Azure?

GitHub Copilot for Azure is a GitHub Copilot extension that enables developers to use natural language to:

- Learn about Azure features.
- Deploy Azure resources.
- Get information about Azure resources.
- Diagnose and troubleshoot problems with Azure resources.

You must have access to an Azure subscription and be subscribed to GitHub Copilot. [Get started](get-started.md) using the extension.

GitHub Copilot is designed to help developers, including developers new to Azure, to be more productive as quickly as possible. For experienced Azure users, GitHub Copilot for Azure replaces the need to:

- memorize or look up Azure CLI commands and arguments.
- create complex deployment scripts by hand.
- sign in and browse through the Azure portal.

## How it works

GitHub Copilot for Azure supplements the general knowledge of a foundational large language model (LLM) like GPT-5 and Claude Sonnet 4 with tool calling using the **Azure Model Context Protocol (MCP) Server** that enables interaction with Azure services, systems, and Azure Resource Graph to carry out specific tasks on your behalf. Over [35 Azure services](../azure-mcp-server/tools/index.md) are already available and more services and capabilities are being added regularly. Learn more about the capabilities of [Azure MCP Server](../azure-mcp-server/overview.md).

## Supported development environments

You can use GitHub Copilot for Azure in the following supported development environments:

|Supported Client|Description|Feature Stage|Download Link|
|---|---|---|---|
|Visual Studio Code|Surfaces GitHub Copilot for Azure via the GitHub Copilot user interface for both Ask and Agent modes. It also surfaces the Azure MCP Server tools. Provides IDE-specific tools and custom modes.|General availability|[Link](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot)|
|Visual Studio 2022|Also Surfaces the GitHub Copilot for Azure via the GitHub Copilot user interface, and Azure MCP Server tools, but only provides access to Ask and Agent mode.|Public preview|[Link](https://marketplace.visualstudio.com/items?itemName=github-copilot-azure.GitHubCopilotForAzure2022)|
|Visual Studio 2026|Surfaces built-in GitHub Copilot for Azure and Azure MCP Server tools via GitHub Copilot user interface. Available in both Ask and Agent mode.|Public preview|The tools are available upon installation of the [Azure and AI development workload](/dotnet/azure/configure-visual-studio#install-azure-workloads).|


## Primary scenarios

GitHub Copilot for Azure currently enables four primary scenarios:

|Category|Explanation|Examples|
|---|---|---|
|Learn|Learn about Azure services and tools from the latest Microsoft Learn documentation.|<ul><li>"What Azure services should I use with my app?"</li><li>"What are the available types of Azure OpenAI models?"</li><li>"What is Azure AI Search and why should I use it?"</li><li>"How does pricing work for Azure SQL?"</li></ul>|
|Design and develop|Ask for guidance and help when building apps for the cloud.|<ul><li>"Can you help me build a RAG application with Python t odeploy to Azure?"</li><li>"Use azd to undeploy my project in Azure."</li><li>"We're a pizza company and want to create an online customized pizza delivery solution. Create an API to accept pizza orders on Azure."</li></ul>|
|Deploy|Create Azure resources and deploy apps.|<ul><li>"Can you help me deploy my application to Azure?"</li><li>"I need a CI/CD pipeline so I can get my app deployed to Azure."</li><li>"Use azd to undeploy my project from Azure."</li></ul>|
|Troubleshoot|Diagnose and troubleshoot application and resource problems.|<ul><li>"What is using up my GPT-5 model quota on Azure?"</li><li>"Find out why my Kubernetes cluster is running slow on Azure."</li><li>"Why am I seeing 500 errors when opening my website on Azure?"</li></ul>|
|Optimize|Answer questions about resources, including locations, settings, and resource health.|<ul><li>"How many Azure OpenAI deployments do I have?"</li><li>"Give me a count of Azure storage accounts in eastus by subscription, sorted from largest to smallest."</li></ul>|

> [!Note]
> Make sure the word "Azure" is somewhere in the prompt so that the LLM calls the appropriate tool from Azure MCP Server.

The documentation provides a quickstart and example prompts to help you start using GitHub Copilot for Azure as quickly as possible.

## Best practices

Using copilots can increase developer productivity by answering questions, executing tasks, and generating code. However, remember these vital rules:

- Review all AI-generated responses. Validate their correctness, applicability, potential outcomes (such as costs and security) before taking action based on those responses.
- Never save application secrets or credentials in source code.
- Never submit application secrets or credentials in questions or in code when you ask questions.

When you're working with any tool based on large language models, use good prompt engineering techniques for the best results. The following tips come from the article [Write effective prompts for Microsoft Copilot in Azure](/azure/copilot/write-effective-prompts), which provides advice for prompt engineering in the context of Azure.

- [Be clear and specific](/azure/copilot/write-effective-prompts#be-clear-and-specific)
- [Set expectations](/azure/copilot/write-effective-prompts#set-expectations)
- [Add context about your scenario](/azure/copilot/write-effective-prompts#add-context-about-your-scenario)
- [Break down your requests](/azure/copilot/write-effective-prompts#break-down-your-requests)
- [Customize your code](/azure/copilot/write-effective-prompts#customize-your-code)
- [Use Azure terminology](/azure/copilot/write-effective-prompts#use-azure-terminology)
- [Use the feedback loop](/azure/copilot/write-effective-prompts#use-the-feedback-loop)

When working in agent mode, you can create longer prompts, however it's important to constrain the copilot before allowing it to act on your behalf especially when working with your Azure account. Here's an approach to building a longer prompt that might help get the results you desire.

- **Command** - "Don't take any action until I authorize it." Prevent the copilot from taking action before you validate its understanding of the prompt.
- **Describe** - Express what you want to happen. Here, you describe the work like you would to a coworker in sufficient detail for your coworker to be successful.
- **Ask** - "Do you have any clarifying questions to ask me before you begin?" - Give the copilot an opportunity to identify unclear instructions.
- **Iterate** - Iterate with the copilot until it understands what you are asking it to do. The copilot might require several iterations before it has everything it needs to be successful.
- **Request** - "Create a step-by-step checklist plan that I can review before I authorize you to execute the plan." This not only forces the copilot to think ahead of its actions and explain its approach, it also follows these steps and provides a status.
- **Review** - At some point, you might trust the copilot and not closely review its work. However, it's always best to make sure you review the plan and clarify what you want.
- **Authorize** - "I've reviewed the plan and you're authorized to begin."
- **Validate** - Spend time checking the work to ensure that it accomplishes what you intended.

## Tool calling

# [Visual Studio Code](#tab/vscode)

GitHub Copilot for Azure uses agentic tools behind the scenes to perform all operations. When first released for Visual Studio Code, the GitHub Copilot for Azure team created proprietary tools for use, however the current direction is to migrate away from prorietary tools to those supplied by the [Azure MCP Server](.../azure-mcp-server/overview).

Here's a list of all the tools currently supported by GitHub Copilot for Azure. Also listed is the migration status which applies solely to the Visual Studio Code version. The Visual Studio 2022 version uses Azure MCP Server tools by default.

|Tool|Description and sample prompts|Migration Status|
|---|---|---|
|azure_list_activity_logs|Lists activity logs for a resource over a specified time.<br /><ul><li>“Show me the activity logs for my web app”</li><li>“What happened to my VM in the last 24 hours?”</li></ul>|Complete|
|azure_diagnose_resource|Diagnoses app performance or failures using logs and telemetry.<br /><ul><li>“Why is my app slow?”</li><li>“Help me diagnose issues with my app”</li></ul>|Complete|
|azure_get_auth_context|Retrieves current Azure authentication context (account, subscription, tenant).<br /><ul><li>“What Azure account am I signed in with?”</li><li>“Show me my current tenant”</li></ul>|N/A|
|azure_set_auth_context|Updates Azure authentication context (sign in/out, switch tenant or subscription).<br /><ul><li>"Sign me into Azure”</li><li>“Change my subscription”</li></ul>|N/A|
|azure_get_azure_verified_module|Fetches verified Bicep modules for a resource type.<br /><ul><li>“Get Bicep module for storage account”</li><li>“Find verified module for virtual machine”</li></ul>|Planned|
|azure_generate_azure_cli_command|Generates Azure CLI commands based on user intent.<br /><ul><li>“Create a new resource group using Azure CLI”</li><li>“List all VMs in a resource group”</li></ul>|Complete|
|azure_recommend_custom_modes|Captures Azure-related intent and suggests modes to enhance workflows.<br /><ul><li>“I want to build an Azure Function”</li><li>“Help me deploy to Azure”</li></ul>|N/A|
|azure_get_dotnet_template_tags|Lists tags for filtering .NET templates	“What .NET template tags are available?”</li><li>“Show me template categories for Azure projects”</li></ul>|N/A|
|azure_dotnet_templates_for_tag|Retrieves the list of .NET project templates matching a given tag for dotnet new commands.<br /><ul><li>“Show me Azure Function templates”, “Get web API templates”</li></ul>|N/A|
|azure_query_azure_resource_graph|Queries Azure Resource Graph for resources, subscriptions, or resource groups.<br /><ul><li>“List all my virtual machines”</li><li>“Show me resources in my resource group”</li></ul>|Planned|


# [Visual Studio 2022](#tab/vs2022)

See the the [Azure MCP Server](.../azure-mcp-server/overview) documentation.

# [Visual Studio 2026](#tab/vs2026)

GitHub Copilot for Azure uses agentic tools behind the scenes to perform all operations. When first released for Visual Studio Code, the GitHub Copilot for Azure team created proprietary tools for use, however the current direction is to migrate away from prorietary tools to those supplied by the [Azure MCP Server](.../azure-mcp-server/overview).

Here's a list of all the tools currently supported by GitHub Copilot for Azure. Also listed is the migration status which applies solely to the Visual Studio Code version. The Visual Studio 2022 version uses Azure MCP Server tools by default.

|Tool|Description|Example Prompts|
|---|---|---|
|create_azure_devops_workflow|Generate an Azure DevOps Workflow for Azure Functions or ASP.NET projects. Creates directory structure and YAML for publishing.|<ul><li>“Create Azure DevOps workflow for my Blazor project”</li><li>“Create yaml file to publish to ADO”</li></ul>|
|create_github_actions_workflow|Generate a GitHub Actions Workflow for Azure Functions or ASP.NET projects. Creates directory, YAML, and sets up secrets.|<ul><li>“Create GitHub Actions workflow for deployment”</li><li>“Publish with GitHub Actions to Azure”</li></ul>|
|create_website_azure_publish_profile|Create a publish profile for Azure Web Apps or Azure Function Apps.|<ul><li>“Create publish profile for my Azure web app”</li><li>“Set up Azure publish profile for my Blazor project”</li></ul>|
|generate_azure_cli_command|Generates Azure CLI (az) commands based on natural language intent. Always use this tool for CLI requests.|<ul><li>“Create a new resource group using the Azure CLI”</li><li>“How do I create an app service using azure cli?”</li></ul>|
|publish_project_to_azure_website|Publish a project to an Azure Web site using an existing publish profile (.pubxml file).|<ul><li>“Publish my Blazor project to Azure using the existing profile”</li><li>“Deploy my project to Azure website”</li></ul>|
|query_azure_resource_graph|Query Azure Resource Graph using natural language prompts; returns results as JSON.|<ul><li>“Find all virtual machines in my subscription”</li><li>“Show me all storage accounts in the West US region”</li></ul>|
|select_website_for_azure_publish|Select an Azure Web site for publishing projects; guides through choosing or creating instances.|<ul><li>“Help me select an Azure web app for my Blazor project”</li><li>“I need to choose an Azure Function App for deployment”</li></ul>|
|verify_azure_publish_compatibility|Verify if a project is compatible with Azure publish operations (ASP.NET Core, Blazor, Azure Function).|<ul><li>“Check if my project can be published to Azure”</li><li>“Verify Azure compatibility for my Blazor application”</li></ul>|

---

## Related content

- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [deploying your application to Azure](deploy-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).
