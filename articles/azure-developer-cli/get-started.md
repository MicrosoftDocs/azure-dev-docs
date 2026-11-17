---
title: 'Azure Developer CLI: Deploy a sample app'
description: Get started with the Azure Developer CLI (azd) by initializing a template, then provisioning, deploying, and cleaning up a sample app on Azure.
keywords: azure developer cli, azd
ms.date: 09/21/2026
author: kristenwomack
ms.author: kwomack
ms.topic: quickstart
ms.service: azure-dev-cli
ms.custom: devx-track-azdevcli, devx-track-python, devx-track-dotnet
ai-usage: ai-generated
#customer intent: As a developer, I want to deploy a sample application to Azure by using the Azure Developer CLI so that I can learn the core azd workflow.
---

# Quickstart: Deploy an Azure Developer CLI template

The Azure Developer CLI (`azd`) is an open-source command-line tool that replaces manual setup and configuration with consistent commands for building and deploying apps on Azure.

In this quickstart, you initialize a sample template and deploy it to Azure. You get a running app on Azure and a reusable local project that you can redeploy, customize, or remove when you're done.

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The [Azure Developer CLI installed](install-azd.md).
- For the .NET sample, the [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0).

> [!NOTE]
> Both samples build container images remotely in Azure. The Python sample doesn't require a local Python installation for deployment. The .NET sample still requires a local .NET SDK because its postprovision hook runs `dotnet user-secrets set`.

## Understand azd templates

An [`azd` template](azd-templates.md) is a source repository that contains everything `azd` needs to work with an app. You can [build your own template](start-with-new-template.md) for a new or existing app, or [start from an existing template](start-with-existing-template.md) and customize it. In this quickstart, you use a sample template so you can focus on the core `azd` workflow.

The following structure shows a simplified, top-level view of a typical template:

```text
|-- src/         # Application source code
|-- infra/       # Azure resources defined as infrastructure as code
|-- azure.yaml   # azd project configuration
`-- .azure/      # Local environment settings
```

For the full breakdown of these files, see [Explore and edit template files](explore-edit-templates.md).

## Initialize the template

From the parent directory where you want to store the project, select a sample repository and run [`azd init`](azd-init-workflow.md):

### [Python](#tab/python)

This option uses the [hello-azd-python](https://github.com/Azure-Samples/hello-azd-python) sample repository.

```azdeveloper
azd init --template hello-azd-python
```

### [.NET](#tab/dotnet)

This option uses the [hello-azd](https://github.com/Azure-Samples/hello-azd) sample repository.

```azdeveloper
azd init --template hello-azd
```

---

`azd` supports many languages, frameworks, and containers. For more information, see [Supported languages and environments](supported-languages-environments.md).

When prompted, enter a short environment name, such as `dev`. After initialization completes, open the new project directory in your terminal before you continue.

The `azd init` command:

- Downloads the selected template into the new project directory.
- Initializes the new directory as an `azd` project.
- Creates an [environment](environments-overview.md) that stores deployment settings, such as your Azure subscription and location, under the `.azure` directory.

The command doesn't create or deploy any Azure resources.

## Sign in to Azure

Run the following command, and then sign in through the browser:

```azdeveloper
azd auth login
```

## Provision and deploy the app resources

Run the following command:

```azdeveloper
azd up
```

When prompted, select the Azure subscription and location to use. The first deployment can take several minutes because [`azd up`](azd-up-workflow.md) runs the complete deployment workflow:

1. **Provision:** Creates the Azure resources that the template's infrastructure-as-code files define.
1. **Package:** Builds and packages the app for deployment. The sample uses a remote container build, so the build runs in Azure.
1. **Deploy:** Deploys the packaged app to the provisioned hosting resource.

The template defines supporting resources, such as managed identities, role assignments, and application settings, in the Bicep files under the `infra` directory and the `azure.yaml` project configuration, and `azd` deploys them together with the app. To learn more about these files, see [Explore and edit template files](explore-edit-templates.md).

You can run `azd up` again after changing the app or infrastructure. `azd` updates the existing environment instead of creating a separate deployment.

## Explore the deployed app

When `azd up` finishes, it prints links to the provisioned resources and the running app in the command output.

1. Select the Azure portal resource-group link in the output to view the resources that `azd` provisioned.

   :::image type="content" source="media/quickstarts/provisioned-azure-resources.png" alt-text="Screenshot of an Azure resource group in the Azure portal that contains the resources azd provisioned for the sample app.":::

1. Select the app endpoint link in the output to open the running app in a browser.

   :::image type="content" source="media/quickstarts/app-home-page.png" alt-text="Screenshot of the deployed sample app's home page running in a browser.":::

## Make a change and redeploy

Optionally, make a small change to the sample app, and then redeploy just the app code with `azd deploy`.

### [Python](#tab/python)

1. Open `src/app/templates/home.html`.
1. Find the `<h1>Hello, customized template!</h1>` heading.
1. Replace the heading text with `<h1>Hello from your azd template!</h1>`, and then save the file.

### [.NET](#tab/dotnet)

1. Open `src/Components/Pages/Home.razor`.
1. Find the heading that shows `Hello, Azure Developer CLI!`.
1. Replace the heading with the following text, and then save the file:

   ```razor
   <MudText Typo="Typo.h2" GutterBottom="true">Hello, customized template!</MudText>
   ```

---

This change affects only the app source, so you don't need to reprovision the infrastructure. Redeploy the updated code:

```azdeveloper
azd deploy
```

The `azd deploy` command packages and deploys only the app code, while `azd up` runs the full provision, package, and deploy workflow. When the command finishes, open the app endpoint from the command output. The home page shows the updated heading.

:::image type="content" source="media/get-started/explore-templates-header.png" alt-text="Screenshot of the deployed hello-azd app with a customized heading.":::

## Clean up resources

When you're finished, run the following command to delete the Azure resources and avoid ongoing charges:

```azdeveloper
azd down
```

Confirm the deletion when prompted. This command removes the resources that `azd` provisioned for the current environment but keeps the local project files.

## Next step

> [!div class="nextstepaction"]
> [Explore and edit template files](explore-edit-templates.md)

[!INCLUDE [request-help](includes/request-help.md)]