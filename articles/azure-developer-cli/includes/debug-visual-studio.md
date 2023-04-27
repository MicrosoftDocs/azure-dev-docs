---
author: alexwolfmsft
ms.service: azure-dev-cli
ms.topic: include
ms.date: 08/10/2022
ms.author: alexwolf
---

Run and debug apps built on your local machine using [Visual Studio](/visualstudio/azure) and Azure Developer CLI (`azd`). In this guide, you'll use the [Todo application with C# and Azure Cosmos DB for MongoDB](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) template. You can apply the principles you learn in this article to any of the [Azure Developer CLI templates](../more-azd-info.md#azure-developer-cli-templates).

## Prerequisites

- [Install azd](../install-azd.md)
- [Run `azd` with the Node.js template](../get-started.md)
- [.NET SDK 6.0](https://dotnet.microsoft.com/download/dotnet/6.0)

## Install and enable the preview feature
  
1. Install [Visual Studio Preview](https://visualstudio.microsoft.com/vs/preview/) 
   
   > [!NOTE]
   > This is different from Visual Studio. If you have the non-preview version of Visual Studio, you still need to install this. 

1. Open Visual Studio Preview.

1. From the **Tools** menu, select **Options** > **Preview Features**.

1. Make sure **Integration with azd, the Azure Developer CLI** is enabled.

   :::image type="content" source="../media/debug/visual-studio-options.png" alt-text="Screenshot of the Visual Studio option to turn on integration with the Azure Developer CLI.":::

## Open the API solution

1. Open the `Todo.Api.sln` solution in the `/src/api` directory.  

   If you've [enabled the `azd` integration feature](#prerequisites), the `azure.yaml` file is detected. Visual Studio automatically initializes the app model and runs `azd env refresh`.

1. Expand **Connected Services** to see all the dependencies.  

   While the web front-end running on Azure App Service isn't part of the API solution, it's detected and included under **Service Dependencies**

   :::image type="content" source="../media/debug/visual-studio-open-solution.png" alt-text="Screenshot of the message indicating the Azure Developer CLI is initialized.":::

## Run and debug

1. From your project's `src/api` directory, open `ListController.cs`.

1. Set a breakpoint at line 20.

   :::image type="content" source="../media/debug/visual-studio-breakpoint.png" alt-text="Screenshot of the breakpoint set in the sample code.":::

1. Press `<F5>`.

1. Wait for the message indicating the web server is listening on port 3101.

   :::image type="content" source="../media/debug/visual-studio-run.png" alt-text="Screenshot of the status bar message indicating the debugger is listening on port 3101.":::

1. In your preferred browser, enter the following address: `https://localhost:3101/lists`

1. When the breakpoint you set earlier is hit, app execution will pause. At this point, you can perform standard debugging tasks, such as:
   - Inspect variables
   - Look at the call stack
   - Set other breakpoints

1. Press `<F5>` to continue running the app. 

   The sample app returns a list (or an empty list [] if you haven't launched the web front-end before):

    ```
    [{"id":"fb9c1cb3811349b993421fc0e815c4c1","name":"My List","description":null,"createdDate":"2022-06-27T01:10:16.7721172+00:00","updatedDate":null}]
    ```

## Other `azd` integrations

### Manage `azd` environment

To manage the `azd` environment:

1. Select **...** in the upper-right corner of the **Service Dependencies** pane.
1. Select one of the following options in the dropdown menu:

   - Create a new environment
   - Select and set a specific environment as the current active environment
   - Deprovision an environment

   :::image type="content" source="../media/debug/visual-studio-manage-environment.png" alt-text="Screenshot of the options to manage the Azure Developer CLI environment in Visual Studio.":::

### Provision environment resources

You can provision Azure resources to your environment.

1. In **Connected Services**, click the icon at the top right to restore/provision environment resources.

   :::image type="content" source="../media/debug/visual-studio-provision.png" alt-text="Screenshot of option to provision Azure Developer CLI environment resources in Visual Studio.":::

1. Confirm the environment name, subscription, and location.

### Publish your app

If you make any updates, you can publish your app by doing the following steps:

1. In the Solution Explorer, expand **Connected Services**.

1. Select **Publish**.

1. Select **Add a publish profile**.

1. Select a **Target** of **Azure**, and select **Next**.

1. Select **Azure Developer CLI Environment**, and select **Next**.

   :::image type="content" source="../media/debug/visual-studio-publish.png" alt-text="Screenshot of message in Debug Console indicating debugger is listening on port 3100.":::

1. Select the environment.

1. Select **Finish**.

## Other resources

- [Visual Studio Connected Service](/visualstudio/azure/overview-connected-services)
- [Overview of Publish Tool in Visual Studio](/visualstudio/deployment/publish-overview)
