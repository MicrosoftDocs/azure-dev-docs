---
title: "Tutorial: Contoso real estate run in CodeSpaces"
description: In this tutorial, run the Contoso real estate in CodeSpaces for this enterprise-grade modern composable cloud-native application and its scenarios.
ms.topic: tutorial
ms.date: 08/29/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a senior developer new to Azure, I want to learn how to run the Contoso real estate in CodeSpaces so that I can learn how to develop modern cloud solutions.
---

# Tutorial: Deploy the Contoso real estate to Azure from GitHub CodeSpaces

In this tutorial, you'll deploy and use the Contoso real estate reference architecture sample and its components, which shows you how to build enterprise-grade modern composable frontends (or micro-frontends) and cloud-native applications. The reference architecture is a collection of best practices, architecture patterns, and functional components that can be used to build and deploy modern JavaScript applications to Azure.

> [!div class="checklist"]
> - Open project with GitHub CodeSpaces in browser
> - Sign in to Azure with the AZD CLI
> - Provision Azure resources and deploy source code for applications with AZD CLI
> - Find resource information

## Prerequisites 

* GitHub account: deployment is completed with GitHub Actions
* Azure subscription: a free account can be created [here](https://azure.microsoft.com/free/)

## Fork the repository

1. In a web browser, navigate to the [Contoso real estate repository](https://github.com/azure-samples/contoso-real-estate).
1. Select **Fork** in the upper-right corner of the page.
1. Select your GitHub account as the destination for the fork.

## Start CodeSpaces

1. Select **Code** in the upper-right corner of the page.
1. Select **CodeSpaces** tab then select **Create codespace on main**.
1. In the new browser tab, select **Sign in with GitHub**. This may take a few minutes to complete because this enterprise solution has many dependencies.

    :::image type="content" source="./media/contoso-real-estate-run-codespaces/start-codespace.png" alt-text="Screenshot of browser showing setting up CodeSpace environment.":::

1. View the new CodeSpace and wait for any final tasks to complete.

    :::image type="content" source="./media/contoso-real-estate-run-codespaces/view-codespace-browser-startup.png" alt-text="Screenshot of browser showing Visual Studio Code in Code Space environment, finishing environment setup.":::

## Sign in to Azure with the AZD CLI

1. In the CodeSpaces integrated terminal, sign in to Azure with the AZD CLI:

    ```bash
    azd auth login
    ``````

1. To complete this command, copy the device code then following the instructions to use the device code. 
1. When the command is complete, you'll see a message that you're signed in to Azure. You can close the browser tab.

## Deploy to Azure with the AZD CLI

1. In the CodeSpaces integrated terminal, create Azure resources and deploy source code with the AZD CLI command to create resources:

    ```bash
    azd provision
    ```    

    Wait for the command to complete.

1. Deploy the source code to the resources with the AZD CLI command:

    ```bash
    azd deploy
    ```

1. Use the following table to answer the remaining AZD prompts:

    |Prompt|Value|
    |--|--|
    |**Enter a new environment name**|Enter an identifying name for the Azure resource group that will be created.| 
    |**Select an Azure Subscription to use**|Select the Azure subscription you want to use for this deployment.|
    |**Select an Azure location to use**|Select **(Europe) West Europe (westeurope)**. Your deployment may fail if the region you selected is unavailable for provisioning specific resources. We recommend using westeurope as your target region since that has been currently validated for all services.|

1. Wait for the process to complete. This takes a few minutes.

## View the deployed application

The Contoso real estate app has two frontends.  

* Blog available without signing in.
* Portal with listing is available after signing in.

To find the URLs for the frontends, use the following steps:

1. In CodeSpaces, use the Azure explorer to find the resource group that was created. You may need to sign in to Azure to see the resource groups.
1. If you have more than one subscription, select the subscription you used for the deployment.
1. Find the Container Apps node, and expand it. Find the resource prefixed with **ca-blog** (meaning Container App blog), right-click it and select **Browse**. Complete the steps to open in a browser. The blog app opens in a new browser tab.

    :::image type="content" source="./media/contoso-real-estate-get-started/browser-blog-landing.png" alt-text="Screenshot of Contoso blog featuring information about technology, news, gastronomy, releases, and locations relevant to users of the HR relocation portal.":::

1. Find the Static Web Apps node, and expand it. Find the resource prefixed with **stapp-web** (meaning Static Web App), right-click it and select **Browse**. Complete the steps to open in a browser. The portal app opens in a new browser tab.

    :::image type="content" source="./media/contoso-real-estate-get-started/browser-portal-landing.png" alt-text="Screenshot of Contoso portal featuring several property listings with images, descriptions, and prices.":::

## Contribute to the application

The Contoso real estate app is a sample application that you can use to learn about modern cloud solutions. You can also contribute to the application by submitting pull requests. Learn more about this process in the [Contoso real estate contribution guide](https://github.com/Azure-Samples/contoso-real-estate/blob/main/CONTRIBUTING.md).

## Clean up

To clean up after you're finished using this tutorial, remove the Azure resources and remove the GitHub CodeSpace.

1. To remove the resources, use the following command:

    ```bash
    azd down
    ``````

1. To remove the GitHub CodeSpace, go to GitHub's [CodeSpaces dashboard](https://github.com/codespaces).
1. Select the ellipsis button for the CodeSpace you want to remove.

    :::image type="content" source="./media/contoso-real-estate-run-codespaces/github-codespace-dashboard-ellipsis.png" alt-text="Screenshot of browser showing CodeSpaces dashboard with ellipsis highlighted for single CodeSpace to delete.":::
1. Select **Delete**.

    :::image type="content" source="./media/contoso-real-estate-run-codespaces/github-codespace-dashboard-delete-button.png" alt-text="Screenshot of browser showing CodeSpaces dashboard with delete option highlighted for single CodeSpace to delete.":::

## Resources

Learn more:

* [Contoso real estate](https://github.com/azure-samples/contoso-real-estate)
* [Naming convention best practices](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)
* [CodeSpaces](https://docs.github.com/codespaces)
* [AZD CLI](/azure/developer/azure-developer-cli)

## Next step

> [!div class="nextstepaction"]
> [Learn how to develop modern cloud solutions](contoso-real-estate-developer-tools.md)
