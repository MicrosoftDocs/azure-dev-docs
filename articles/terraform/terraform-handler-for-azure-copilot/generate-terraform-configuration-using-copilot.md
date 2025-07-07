---
title: Generate Terraform configurations using Azure Copilot
description: Learn how to generate Terraform configurations using Azure Copilot
ms.date: 07/07/2025
ms.topic: quickstart
ms.service: copilot-for-azure
ms.author: jingweiwang
author: Jingwei-MS
#customer intent: As a Terraform user, I want to learn how to generate Terraform configurations using Azure Copilot.
---

# Generate Terraform configurations using Azure Copilot

Microsoft Copilot in Azure enables you to generate Terraform configurations to define and manage your Azure infrastructure. Describe the infrastructure you want to deploy, and Copilot generates a Terraform configuration using the AzureRM provider. The configuration automatically includes both the main resources and any required dependencies to ensure the configuration is deployable. You can define the output by iteratively making subsequent requests. When ready, copy the configuration and deploy it using your preferred Terraform workflow.

> [TIP]
> For best results, keep your request to fewer than eight primary Terraform resource types. Copilot performs well with common configurations. Complex or large-scale architectures may produce incomplete or less accurate results.

> [Note] 
> Terraform Copilot in Azure currently supports AzureRM provider resources extensively. Support for the AzAPI provider is evolving and may not be fully available yet. If the required resource type is not supported, Copilot will either fallback to a sample structure or explan the limitations.

## Use Azure Copilot in the Azure portal

1. Open the [Azure portal](https://ms.portal.azure.com).

1. Select the Copilot icon in the upper right corner.

    :::image type="content" source="../media/generate-terraform-configuration-using-copilot/copilot-in-portal.png" alt-text="Sceenshot of the Azure Copilot icon in the Azure portal.":::

1. Enter a Terraform-related request and press **&lt;Enter>. For example, `Create a Terraform config for a Cognitive Services instance with name 'mycognitiveservice' and S0 pricing tier`.

    :::image type="content" source="../media/generate-terraform-configuration-using-copilot/copilot-request.png" alt-text="Sceenshot of an example Azure Copilot request":::

1. Once Copilot responds, you can select **Open Full View** to view the configuration code block in full-screen mode.

    :::image type="content" source="../media/generate-terraform-configuration-using-copilot/copilot-open-full-view.png" alt-text="Sceenshot of the Azure Copilot full-screen mode in the Azure portal.":::

1. Select the Copy icon to copy the new configuration to the clipboard.

    :::image type="content" source="../media/generate-terraform-configuration-using-copilot/copilot-copy.png" alt-text="Sceenshot of the Azure Copilot copy icon.":::

1. Paste the code into your editor.

## Use Azure Copilot from VS Code

1. Open VS Code.

1. From the Nav Bar, select **Extensions**.

    :::image type="content" source="../media/generate-terraform-configuration-using-copilot/vs-code-extensions.png" alt-text="Sceenshot of VS Code Extensions icon in the Nav Bar.":::

1. Ensure that the **GitHub Copilot** extension is installed. If it is not, install it.

1. Ensure that the **GitHub Copilot Chat** extension is installed. If it is not, install it.

1. Select **Toggle Chat**.

    :::image type="content" source="../media/generate-terraform-configuration-using-copilot/vs-code-toggle-chat.png" alt-text="Sceenshot of the Copilot Toggle Chat option in VS Code.":::

1. Enter a request for a Terraform Configuration that begins with `@azure`, and press **&lt;Enter>. An example request might be: `@azure use terraform to create a Content Delivery Network (CDN) front door profile named "myCDN profile" with a custom domain association "example.com". Set up a CDN front door route to link to the default domain, and configure a CDN endpoint named "myEndpoint" with the associated custom domain. Ensure a security policy is applied for enhanced production and verify the routing contains the correct origin group.`

    :::image type="content" source="../media/generate-terraform-configuration-using-copilot/vs-code-copilot-request.png" alt-text="Sceenshot of the Copilot Toggle Chat option in VS Code.":::

1. Copilot interactively guides you through the process where it creates the required files for your configuration.

    :::image type="content" source="../media/generate-terraform-configuration-using-copilot/vs-code-copilot-updated-files.png" alt-text="Sceenshot of the Copilot generated files in VS Code.":::
    
1. Once the files are created or updated, Copilot will offer to run the `terraform init` and `terraform validate` commands against the generated configuration.

    :::image type="content" source="../media/generate-terraform-configuration-using-copilot/vs-code-copilot-terraform-commands.png" alt-text="Sceenshot of the Copilot option to run various Terraform commands.":::

## Terraform sample prompts

This section contains several example prompts you can use to generate Terraform configurations. Modify these prompts based on your scenarios, or try other prompts to create different kinds of queries.

- "Create a Terraform config for a Cognitive Services instance with name 'mycognitiveservice' and S0 pricing tier."
- "Show me a Terraform configuration for a linux virtual machine with 8 GB ram and an image of 'Ubuntu 22.04 LTS'. The resource should be placed in the West US location and have a public IP address. Additionally, it should be part of a virtual network with a network security group."
- "Create Terraform configuration for a container app resource with name 'myApp' with quick start image. Also, set the name of the container app environment to 'awesomeAzureEnv' and set the name of the container to 'myQuickStartContainer'."
- "What is the Terraform code for a Databricks workspace in Azure with name 'myworkspace' and a premium SKU. The workspace should be created in the West US region."
- "Create a Terraform template for an Azure OpenAI deployment using the 'gpt-4' model. Set the model version to '2024-05-01-preview' and name the deployment 'myOpenAIModel'."

## Next steps

> [!div class="nextstepaction"]
> Learn more about [Terraform on Azure](/azure/developer/terraform/overview).
