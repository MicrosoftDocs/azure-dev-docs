---
title: Scale your azd Python web app with Bicep
description: Quickstart article featuring the modification of Bicep files and using azd provision to scale your azd Python web app.
ms.date: 5/26/2026
ms.topic: quickstart
ms.custom: devx-track-python, devx-track-bicep, devx-track-extended-azdevcli
---

# Quickstart: Scale services deployed with the azd Python web templates by using Bicep

The [Python web `azd` templates](./overview-azd-templates.md) help you quickly create a new web application and deploy it to Azure. The `azd` templates use low-cost Azure service options. To fit your scenario, adjust the service levels or versions for each service defined in the template.

In this quickstart, you update the appropriate Bicep template files to scale up existing services. Then, you run the `azd provision` command and view the change you made to the Azure deployment.

## Prerequisites

An Azure subscription - [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)

Install the following tools on your local computer:

- [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Visual Studio Code Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) This extension helps you author Bicep syntax.

## Deploy a template

To get started, you need a working `azd` deployment. After you set up the deployment, you can modify the Bicep files that the `azd` template generates.

1. Follow steps 1 through 7 in the [Quickstart article](./quickstart-python-web-azd-templates.md). In step 2, use the `azure-django-postgres-flexible-appservice` template. For your convenience, here's the entire sequence of commands to run from the command line:

   ```shell
   mkdir azdtest
   cd azdtest
   azd init --template azure-django-postgres-flexible-appservice
   azd auth login
   azd up
   ```

   When `azd up` finishes, open the Azure portal, go to the Azure App Service that you deployed in your new resource group, and take note of the App Service pricing plan (see the App Service plan's **Overview** page, **Essentials** section, **Pricing plan** value).

1. In step 1 of the Quickstart article, you created the *azdtest* folder. Open that folder in Visual Studio Code.

1. In the Explorer pane, go to the *infra* folder. Look at the subfolders and files in the *infra* folder.

   The *main.bicep* file orchestrates the creation of all the services deployed when you run `azd up` or `azd provision`. It calls other files, like *db.bicep* and *web.bicep*. These files call files contained in the *\core* subfolder.

   The *\core* subfolder is a deeply nested folder structure containing Bicep templates for many Azure services. The three top-level Bicep files (*main.bicep*, *db.bicep*, and *web.bicep*) reference some of the files in the *\core* subfolder. Some files aren't used at all in this project.

## Scale a service by modifying its Bicep properties

You can scale an existing resource in your deployment by changing its SKU. To demonstrate this scaling method, change the App Service plan from the **Basic Service plan** (which is designed for apps with lower traffic requirements and doesn't need advanced autoscale and traffic management features) to the **Standard Service plan**, which is designed for running production workloads.

> [!NOTE]
> You can't make all SKU changes after deployment. Some research might be necessary to better understand your scaling options.

1. Open the *web.bicep* file and locate the `appServicePlan` module definition. In particular, look for the property setting:

   ```bicep
      sku: {
         name: 'B1'
      }
   ```

   Change the value from `B1` to `S1` as follows:

   ```bicep
      sku: {
         name: 'S1'
      }
   ```

   > [!IMPORTANT]
   > This change slightly increases the price per hour. For details about the different service plans and their associated costs, see the [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/).

1. Assuming you already deployed the application in Azure, use the following command to deploy changes to the infrastructure without redeploying the application code itself.

   ```shell
   azd provision
   ```

   You shouldn't be prompted for a location and subscription. The *.azure\<environment-name>\.env* file saves those values, where `<environment-name>` is the environment name you provided during `azd init`.

1. When `azd provision` is complete, confirm your web application still works. Also find the App Service Plan for your Resource Group and confirm that the Pricing Plan is set to the Standard Service Plan (S1).

This quickstart concludes here. However, many Azure services can help you build more scalable and production-ready applications. A great place to start learning is [Azure API Management](/azure/api-management/api-management-key-concepts), [Azure Front Door](/azure/frontdoor/front-door-overview), [Azure CDN](/azure/cdn/cdn-overview), and [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview), to name a few.

## Clean up resources

Clean up the resources that the template created by running the [azd down](/azure/developer/azure-developer-cli/reference#azd-down) command.

```shell
azd down
```

The `azd down` command deletes the Azure resources and the GitHub Actions workflow. When prompted, agree to deleting all resources associated with the resource group.

You can also delete the *azdtest* folder, or use it as the basis for your own application by modifying the project's files.

## Related content

- [Learn more about the Python web `azd` templates](./overview-azd-templates.md).
- [Learn more about the `azd` commands](./overview-azd-templates.md#how-do-the-templates-work).
- [Learn what each of the folders and files in the project do and what you can edit or delete](./overview-azd-templates.md#what-can-i-edit-or-delete).
- To add or remove Azure services, update the Bicep templates. Don't know Bicep? Try this [Learning Path: Fundamentals of Bicep](/training/paths/fundamentals-bicep/).
- [Use `azd` to set up a GitHub Actions CI/CD pipeline to redeploy on merge to main branch](./overview-azd-templates.md).
- Set up monitoring so that you can [Monitor your app using the Azure Developer CLI](/azure/developer/azure-developer-cli/monitor-your-app).
