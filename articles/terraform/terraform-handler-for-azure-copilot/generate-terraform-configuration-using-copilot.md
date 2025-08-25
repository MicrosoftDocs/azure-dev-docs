---
title: Generate Terraform on Azure configurations using Copilot
description: Learn how to generate Terraform on Azure configurations using Copilot
ms.date: 07/08/2025
ms.topic: quickstart
ms.author: jingweiwang
author: Jingwei-MS
ms.collection: ce-skilling-ai-copilot
#customer intent: As a Terraform user, I want to learn how to generate Terraform configurations using Azure Copilot.
---

# Generate Terraform on Azure configurations using Copilot

Copilot can help you generate Terraform configurations that define your Azure infrastructure. Describe the infrastructure you want to deploy, and Copilot generates a Terraform configuration using the AzureRM provider. The configuration automatically includes both the main resources and any required dependencies to ensure the configuration is deployable. You can define the output by iteratively making subsequent prompts.

In this article, you learn how to use [Copilot in Azure](/azure/copilot/overview) from the Azure portal and [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/introduction) in Visual Studio Code. We also provide sample Terraform prompts for you to use as-is or edit as desired.

> [!TIP]
> For best results, keep your prompt to fewer than eight primary Terraform resource types. Copilot performs well with common configurations. Complex or large-scale architectures may produce incomplete or less accurate results.

> [!NOTE]
> Copilot currently supports AzureRM provider resources extensively. Support for the AzAPI provider is evolving and may not be fully available yet. If the required resource type isn't supported, Copilot either falls back to a sample structure or explains the limitations.

## Use Copilot in Azure from the Azure portal

1. Open the [Azure portal](https://ms.portal.azure.com).

1. Select the Copilot icon in the upper right corner.

    :::image type="content" source="./media/generate-terraform-configuration-using-copilot/copilot-in-portal.png" border="true" alt-text="Screenshot of the Azure Copilot icon in the Azure portal.":::

1. Enter a Terraform-related prompt such as the following example. 

    ```copilot-prompt
    Create a Terraform configuration for a Cognitive Services instance 
    named "mycognitiveservice" and the S0 pricing tier
    ```

1. Press **&lt;Enter>**.

    :::image type="content" source="./media/generate-terraform-configuration-using-copilot/copilot-prompt.png" border="true" alt-text="Screenshot of an example Azure Copilot prompt.":::

1. Once Copilot in Azure responds, you can select **Open Full View** to view the configuration code block in full-screen mode.

    :::image type="content" source="./media/generate-terraform-configuration-using-copilot/copilot-open-full-view.png" border="true" alt-text="Screenshot of the Azure Copilot full-screen mode in the Azure portal.":::

1. Select the **Copy** icon to copy the new configuration to the clipboard.

    :::image type="content" source="./media/generate-terraform-configuration-using-copilot/copilot-copy.png" border="true" alt-text="Screenshot of the Azure Copilot copy icon.":::

1. Paste the code into your editor.

## Use GitHub Copilot for Azure from Visual Studio Code

1. Open Visual Studio Code.

1. From the Activity Bar, select **Extensions**, and search for `copilot`.

    :::image type="content" source="./media/generate-terraform-configuration-using-copilot/vs-code-extensions.png" border="false" alt-text="Screenshot of VS Code Extensions icon in the Nav Bar.":::

1. Ensure that the **GitHub Copilot** extension is installed. If it isn't, install it.

1. Ensure that the **GitHub Copilot Chat** extension is installed. If it isn't, install it.

1. Select **Toggle Chat**.

    :::image type="content" source="./media/generate-terraform-configuration-using-copilot/vs-code-toggle-chat.png" border="false" alt-text="Screenshot of the Copilot Toggle Chat option in VS Code.":::

1. Enter a prompt for a Terraform Configuration that begins with `@azure`. For example, the following prompt creates a Content Delivery Network (CDN) resource with various settings.

    ```copilot-prompt
    @azure Use Terraform to create an Azure CDN Front Door profile named "myCDN profile"
    with a custom domain association for "example.com". Configure a CDN Front Door route 
    that links to the default domain, and create a CDN endpoint named "myEndpoint" 
    associated with the custom domain. Ensure that a security policy is applied for 
    enhanced protection in production, and verify that the route is correctly configured
    with the appropriate origin group.
    ```

1. Press **&lt;Enter>**.

    :::image type="content" source="./media/generate-terraform-configuration-using-copilot/vs-code-copilot-prompt.png" border="false" alt-text="Screenshot of a Terraform configuration prompt using Copilot in VS Code.":::

1. GitHub Copilot for Azure interactively guides you through the process and creates the required files for your configuration.

    :::image type="content" source="./media/generate-terraform-configuration-using-copilot/vs-code-copilot-updated-files.png" border="false" alt-text="Screenshot of the Copilot generated files in VS Code.":::

1. Once the files are created or updated, GitHub Copilot for Azure offers to run the `terraform init` and `terraform validate` commands against the generated configuration.

    :::image type="content" source="./media/generate-terraform-configuration-using-copilot/vs-code-copilot-terraform-commands.png" border="false" alt-text="Screenshot of the Copilot option to run various Terraform commands.":::

## Review and use sample Terraform prompts

This section contains several example prompts you can use to generate Terraform configurations. Modify these prompts based on your scenarios, or try other prompts to create different kinds of queries.

```copilot-prompt
Create a Terraform configuration for a Cognitive Services instance with 
name "mycognitiveservice" and S0 pricing tier.
```

```copilot-prompt
Create a Terraform configuration that deploys a Linux virtual machine 
running Ubuntu 22.04 LTS, with 8 GB of RAM. The virtual machine should 
be located in the West US region and assigned a public IP address. 
It must be connected to a virtual network that includes a subnet and is 
secured by a network security group.
```

```copilot-prompt
Create a Terraform configuration for a Container App resource named 
"myApp" using the quick start image. Set the container app environment name 
to "awesomeAzureEnv" and the container name to "myQuickStartContainer".
```

```copilot-prompt
Create a Terraform configuration for an Azure Databricks workspace named 
"myworkspace" with the premium SKU. The workspace should be deployed in 
the West US region.
```

```copilot-prompt
Create a Terraform configuration for an Azure OpenAI deployment that uses 
the "gpt-4" model. Specify the model version as "2024-05-01-preview" and 
set the deployment name to "myOpenAIModel".
```

> [!TIP]
> For more example prompts, see [Generate Terraform and Bicep configurations using Microsoft Copilot in Azure](/azure/copilot/generate-terraform-bicep#terraform-sample-prompts).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Terraform on Azure](/azure/developer/terraform/overview)
