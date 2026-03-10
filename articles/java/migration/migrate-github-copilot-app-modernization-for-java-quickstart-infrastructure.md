---
title: Prepare Azure Infrastructure Using GitHub Copilot Modernization
description: Shows you how to generate infrastructure as code and provision Azure resources by using GitHub Copilot modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: honc
ms.topic: quickstart
ms.date: 03/11/2026
ai-usage: ai-generated
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Quickstart: Prepare Azure infrastructure by using GitHub Copilot modernization

In this quickstart, you generate infrastructure-as-code (IaC) files and provision Azure resources for your project by using GitHub Copilot modernization.

Before deploying an application to Azure, you need the right cloud infrastructure in place. The **Generate Infrastructure as Code and Provision** task in the GitHub Copilot modernization extension automates this process - it analyzes your project, generates IaC files, and provisions the required Azure resources. This process includes the ability to create an [Azure landing zone](/azure/cloud-adoption-framework/ready/landing-zone/) tailored to your application, covering networking, identity, governance, and security foundations.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A GitHub account with an active [GitHub Copilot](https://github.com/features/copilot) subscription under any plan.
- One of the following IDEs:
  - The latest version of [Visual Studio Code](https://code.visualstudio.com/) (version 1.106 or later) with the following extensions:
    - [GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within Visual Studio Code.
    - [GitHub Copilot modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure). Restart Visual Studio Code after installation.
  - The latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download) (version 2023.3 or later) with the following plugins:
    - [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot) (version 1.5.59 or later). Be sure to sign in to your GitHub account within IntelliJ IDEA.
    - [GitHub Copilot modernization](https://plugins.jetbrains.com/plugin/28791-github-copilot-modernization). Restart IntelliJ IDEA after installation.

## Prepare your infrastructure

Use the following steps to generate IaC files and provision Azure resources:

1. In Visual Studio Code, open your project.

1. In the **Activity** sidebar, open the **GitHub Copilot modernization** extension pane.

1. In the **Tasks** section, select **Generate Infrastructure as Code and Provision**.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/java-prepare-infra.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/java-prepare-infra.png" alt-text="Screenshot of Visual Studio Code that shows the Generate Infrastructure as Code and Provision task with the Run Task button highlighted.":::

1. After you select the task, the Copilot chat window with Agent Mode opens automatically.

1. Select **Continue** repeatedly to confirm each tool action in the Copilot Chat window. The Copilot Agent uses various tools to facilitate infrastructure preparation. Each tool's usage requires confirmation by selecting **Continue**. Provide Copilot with the necessary information, such as subscription and resource group, as it prompts you.

1. Copilot typically goes through the following steps to prepare your infrastructure:

   - Analyzes your project to determine the technology stack, dependencies, and resource requirements.
   - Proposes an Azure architecture with the appropriate hosting services and supporting resources.
   - Generates IaC files, such as Bicep or Terraform.
   - Provisions Azure resources based on the generated IaC files.
   - Creates a summary of the infrastructure provisioning results.

> [!NOTE]
> For the best results, use Claude Sonnet 4 or later models.
>
> The agent can also reference assessment reports, architecture diagrams, landing zone guidelines, or compliance and security requirement documents in the repository to inform infrastructure decisions.

## Customize with your own prompts

The **Generate Infrastructure as Code and Provision** button sends a predefined prompt. For more control, type a custom prompt directly in the Copilot chat with Agent Mode. This approach lets you combine different inputs and tailor the output to your needs.

> [!TIP]
> Example prompts for different scenarios:
>
> - `"Create an Azure landing zone tailored to my application's architecture and requirements"`—design a landing zone with networking, identity, and governance foundations.
> - `"Generate Bicep files for my project's Azure infrastructure based on the assessment report in docs/assessment.md, don't provision yet"`—generate IaC only, referencing an assessment report.
> - `"Provision Azure infrastructure following the architecture diagram in docs/architecture.png and the compliance policies in docs/security-requirements.md"`—combine architecture and compliance inputs.
> - `"Generate Terraform files for my project and provision resources in East US region"`—request a specific IaC format and region.

## See also

- [GitHub Copilot modernization documentation](../../github-copilot-app-modernization/index.yml)
