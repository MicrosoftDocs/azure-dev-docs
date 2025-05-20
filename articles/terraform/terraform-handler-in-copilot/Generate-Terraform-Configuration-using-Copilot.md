---
title: Generate Terraform configurations using Microsoft Copilot in Azure
description: Learn about how Microsoft Copilot in Azure can generate Terraform configurations for you to use.
ms.date: 04/08/2025
ms.topic: concept-article
ms.service: copilot-for-azure
ms.author: Jingwei Wang
author: jingweiwang
Reviewer: Tom Archer
---

# Generate Terraform configurations using Microsoft Copilot in Azure

Microsoft Copilot in Azure can generate Terraform configurations to help you define and manage your Azure infrastructure more efficiently.

Just describe the infrastructure you want to deploy, and Copilot will generate a Terraform configuration using the AzureRM provider. It automatically includes both the main resources and any required dependencies to ensure the configuration is deployable.

You can refine the output by asking follow-up questions. Once you're ready, copy the configuration and deploy it using your preferred Terraform workflow.

> [TIP]
> For best results, keep your request to fewer than eight primary resource types. Copilot performs well with common setups—for example, a resource group that includes Azure Container Apps, Azure Functions, and Azure Cosmos DB. Complex or large-scale architectures may produce incomplete or less accurate results.

## How Terraform Copilot works from Portal
- Open the [Azure Portal](https://ms.portal.azure.com)
- Select the Copilot icon in the upper right corner
- You can start asking any questions related to Terraform，and make sure to include the keyword "Terraform" in your question. For example, “Create a Terraform config for a Cognitive Services instance with name 'mycognitiveservice' and S0 pricing tier“
- Copilot will provide you with a relevent response. You can click on "Apply in Editor" to view the configuration code block in full-screen mode. 
![loading](image-1.png)
- In the full-screen editor，you can choose to download the file locally or Copy content and paste it elsewhere like in VS Code
![Loading](image-2.png)

Also recommend you watch this video: [Terraform Copilot in Portal](https://microsoftapc-my.sharepoint.com/:v:/g/personal/yunliu1_microsoft_com/EeIRrCj9WClAh2xEulwh4-wBah9oCkeFRC-f1GltRe9ZAw?CT=1747762724589&OR=OWA-NT-Mail&CID=5926c2ef-f597-4bb2-dbd1-717e542630b5&e=Vfjzrs&xsdata=MDV8MDJ8amluZ3dlaXdhbmdAbWljcm9zb2Z0LmNvbXwxYzMzNmU5YjQzZDQ0YjFmYTY2YzA4ZGQ5M2ExYjY4YXw3MmY5ODhiZjg2ZjE0MWFmOTFhYjJkN2NkMDExZGI0N3wxfDB8NjM4ODI5MDQ0OTg3NDMxOTk4fFVua25vd258VFdGcGJHWnNiM2Q4ZXlKRmJYQjBlVTFoY0draU9uUnlkV1VzSWxZaU9pSXdMakF1TURBd01DSXNJbEFpT2lKWGFXNHpNaUlzSWtGT0lqb2lUV0ZwYkNJc0lsZFVJam95ZlE9PXwwfHx8&sdata=d3Rla3d6cWJHbFhRUjU5b3RpN25tOE1ZUkNCMEFPeFJ6amZadUFZZ0N6UT0%3D&clickParams=eyJYLUFwcE5hbWUiOiJNaWNyb3NvZnQgT3V0bG9vayBXZWIgQXBwIiwiWC1BcHBWZXJzaW9uIjoiMjAyNTA1MTUwMDcuMDEiLCJPUyI6IldpbmRvd3MgMTEifQ%3D%3D)

## How Terraform Copilot works by integrating with VS Code Extension
- Make sure you have installed the GitHub Copilot and Github Copilot Chat for Azure within VS Code Extension
- Select the Toggle Chat button at the top of your screen 
- You can start by asking any questions about Terraform. Begin by typing @azure followed by your question, here is an example: 
"@azure use terraform to create a CDN frontdoor profile named "myCDN profile" with a custom domain association "example.com". Set up a CDN frontdoor route to link to the default domain, and configurate a CDN endpoint named "myEndpoint" with the associated custom domain. Ensure a security policy is applied for enhanced production and verify the routing contains the correct origin group."

- Github Copilot will respond accordingly. As you can see, a configuration file code block will be generated, which includes the resource group, CDN frontdoor profile, customer domain, endpoint setup, security policy, and proper routing configuration. 

- You can directly click "Insert at Cursor" to use this ready-to-go TF configuration file.
![Loading](image.png)

You may also refer to this video: [Terraform Copilot in VS Code Extension](https://microsoftapc-my.sharepoint.com/personal/yunliu1_microsoft_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fyunliu1%5Fmicrosoft%5Fcom%2FDocuments%2FVideos%2FDemos%2FGithub%20Copilot%20for%20Azure%20Extension%2Emp4&ct=1747762785686&or=OWA%2DNT%2DMail&cid=6e294ac3%2Dec67%2D45ee%2D8adb%2Db12b9c8466a9&ga=1&LOF=1&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Ebb6f7e59%2D925f%2D4c7f%2D8d7c%2D54e3a5a3e0f1)

## Terraform sample prompts

Here are a few examples of the kinds of prompts you can use to generate Terraform configurations. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "Create a Terraform config for a Cognitive Services instance with name 'mycognitiveservice' and S0 pricing tier."
- "Show me a Terraform configuration for a linux virtual machine with 8GB ram and an image of 'UbuntuServer 18.04-LTS'. The resource should be placed in the West US location and have a public IP address. Additionally, it should be part of a virtual network with a network security group."
- "Create Terraform configuration for a container app resource with name 'myApp' with quick start image. Add a log analytic space with PerGB2018 sku and set the retention days to 31. Enable single revision mode in the container app and set the CPU and memory limits to 2 and 4GB respectively. Also, set the name of the container app environment to 'awesomeAzureEnv' and set the name of the container to 'myQuickStartContainer'."
- "What is the Terraform code for a Databricks workspace in Azure with name 'myworkspace' and a premium SKU. The workspace should be created in the West US region."
- "Create an OpenAI deployment with gpt-3.5-turbo model using Terraform template. Set the version of the model to 0613."


## Next steps

- If you have any suggestions regarding Terraform in Copilot—including but not limited to the quality of generated content, accuracy, response speed, or overall user experience—we warmly welcome your feedback via our [feedback form]. Your voice matters to us.
- Try customizing the sample prompts for your own scenarios.
- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn more about [Terraform on Azure](/azure/developer/terraform/overview).