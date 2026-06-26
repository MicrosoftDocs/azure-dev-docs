---
title: Deploy JavaScript Apps on Azure
description: Deploying your JavaScript applications to Azure allows you to use the power of cloud computing, ensuring scalability, reliability, and global reach. This guide walks you through various methods to deploy your JavaScript apps to Azure, from manual deployments to automated CI/CD pipelines.
ms.date: 06/17/2026
ms.topic: concept-article
ms.custom:
  - vscode-azure-extension-update-completed
  - sfi-image-nochange
# customer intent: As a JavaScript developer new to Azure, I want know all the ways to deploy code to Azure so that I can choose the best process for my application and situation.
---

# Deployment JavaScript app to Azure overview

To deploy your JavaScript-based app to Azure, you move a file or set of files to Azure to be served via an HTTP endpoint. The process of moving the files is called deployment.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Node.js LTS](https://nodejs.org/).
- A GitHub account if you plan to deploy from a GitHub repository.

## Deployment tools

Azure offers various deployment tools to suit different needs. Here are some common methods:

| Method | Details |
|--|--|
|[Azure Developer CLI](/azure/developer/azure-developer-cli)|Ideal for developers who prefer command-line tools and need to automate the provisioning and deployment of resources.|
|[Visual Studio Code Extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=All%20categories&sortBy=Relevance)|Suitable for manual, testing, or infrequent deployments. Requires the relevant Azure extensions installed locally.|
|[Azure CLI](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli)|Useful for manual or occasional deployments. Requires the Azure CLI installed locally.|
|[GitHub Actions](/azure/app-service/deploy-github-actions?tabs=applevel)|Best for automated or continuous deployments triggered by changes in your GitHub repository.|

Other deployment tools exist, based on the specific service. For example, Azure app service supports a wide variety of deployment tools:
- [From ZIP file](/azure/app-service/deploy-zip)
- [With FTP](/azure/app-service/deploy-ftp)
- [Dropbox or OneDrive](/azure/app-service/deploy-content-sync)
- [Local Git](/azure/app-service/deploy-local-git)
- [cURL](/azure/app-service/deploy-zip#with-curl)
- [SSH](/azure/app-service/configure-linux-open-ssh-session)

You can redeploy to your App service using any of the provided methods even if you didn't use that method to originally deploy. You might have some configuration before redeploying if you're switching methods.

<a id="deploy-or-redeploy-to-app-service-with-visual-studio-code"></a>

## Azure hosting services for JavaScript apps

Start by choosing the hosting service that best matches your app. After you choose a service, use the recommended deployment path to get to the right tutorial faster.

| Service | Best for | Key features | Recommended path |
|--|--|--|--|
| [Azure Static Web Apps](/azure/static-web-apps/overview) | Modern web apps with static frontends, such as React, Vue, or Angular, and optional serverless APIs. | Free SSL, global CDN, staging environments on pull requests, and integrated authentication. | Start with [Deploy to Azure Static Web Apps](#deploy-to-azure-static-web-apps). |
| [Azure App Service](/azure/app-service/overview) | Full-featured web applications and REST APIs. | Built-in autoscaling, deployment slots, and easy integration with Azure services. | Start with [Deploy with Azure Developer CLI](#deploy-with-azure-developer-cli) or [Deploy with Visual Studio Code](#deploy-with-visual-studio-code). |
| [Azure Functions](/azure/azure-functions/functions-overview) | Event-driven serverless applications and microservices. | Pay-per-execution pricing, automatic scaling, and multiple triggers and bindings. | Start with [Deploy with Visual Studio Code](#deploy-with-visual-studio-code) and then continue to [Deploy to Azure Functions](#deploy-to-azure-functions). |
| [Azure Container Apps](/azure/container-apps/overview) | Containerized applications and microservices. | Kubernetes-powered serverless containers, Dapr integration, and event-driven scaling. | Start with [Deploy to Azure Container Apps](#deploy-to-azure-container-apps). |

For more information on choosing the right hosting service, see [Hosting applications on Azure](/azure/developer/intro/hosting-apps-on-azure).

## Deployment methods with tools

After you choose a hosting service, choose the deployment method that fits how you work.

- **Build before deployment**: For complex or lengthy builds, package your application into a zip file and deploy it. A deployment package allows you to control and test the build before deployment.
- **Build during deployment**: For simpler builds, use the Azure-provided environment variable SCM_DO_BUILD_DURING_DEPLOYMENT=true to build your app during deployment.

If you're deploying to App Service, other deployment methods are also available:

[Deployment slots](/azure/app-service/deploy-staging-slots) in Azure App Service allow you to create separate environments for staging and production. The use of slots enables you to test your app in a staging environment before swapping it with the production slot, ensuring a smooth and error-free deployment. Learn more about deployment slots.

Don't use deployment slots to mix deployment purposes. All deployment slots share the app service so you need to make sure the traffic patterns and intended use of all slots are the same. If you need to have a hosted test or stage environment that should be a separate app service.

## Deploy with Azure Developer CLI

For the fastest end-to-end path to provisioning Azure resources and deploying your app, start with the Azure Developer CLI (`azd`).

The Azure Developer CLI simplifies the process of deploying your app to Azure. Follow these steps:

1. [Install](/azure/developer/azure-developer-cli/install-azd) the Azure Developer CLI.
1. [Find an existing project](https://azure.github.io/awesome-azd/) that uses many of the same resources your project uses.
1. Initialize a local version of the project for use as an infrastructure template for your own project.
1. Create the resources and deploy the code to Azure.

     ```bash
     azd auth login
     azd init --template <template-name>
     azd up
    ```

Use this path when you want one workflow for infrastructure, deployment, and repeatable environments.

<a name="deploy-or-redeploy-to-app-service-with-visual-studio-code"></a>

## Deploy with Visual Studio Code

If you want a guided deployment flow in your editor, use the Azure extensions for Visual Studio Code.

To deploy or redeploy your App Service app by using Visual Studio Code, complete the following steps:

1. Install the related Azure extensions, such as [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) or [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
1. Open the Azure explorer. Select the Azure icon in the primary side bar or use the keyboard shortcut (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>).
1. In the Resource group, select your subscription and service.
1. Right-click your service then select **Deploy to Web App...**.

    :::image type="content" source="../media/azure-app-service-vscode-extensions/deploy-or-redeploy-app-service.png" alt-text="Screenshot of deploying or redeploying to App Service by using Visual Studio Code." lightbox="../media/azure-app-service-vscode-extensions/deploy-or-redeploy-app-service.png":::
    
## Service-specific next steps

After you choose a hosting service and deployment method, continue with the service-specific path that matches your app.

### Deploy to Azure Static Web Apps

Azure Static Web Apps is ideal for modern web applications built with JavaScript frameworks. To deploy:

1. Install the [Azure Static Web Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) for Visual Studio Code.
1. Build your application locally to ensure it works as expected.
1. In Visual Studio Code, open the Azure explorer, and find Azure Static Web Apps.
1. Right-click your subscription, and then select **Create Static Web App**.
1. Follow the prompts to connect your GitHub repository. Azure automatically creates a GitHub Actions workflow.
1. Push changes to your repository to trigger automatic deployments.

For more details, see [Deploy your web app to Azure Static Web Apps](/azure/static-web-apps/deploy-web-framework).

### Deploy to Azure App Service

Azure App Service is a good fit when you need managed hosting for a web app or API. You can deploy by using `azd`, Visual Studio Code, Azure CLI, or GitHub Actions.

You can redeploy to your App Service by using any of the available methods, even if you didn't use that method to originally deploy. You might need some configuration before redeploying if you're switching methods.

For a service-specific deployment path, start with one of these tutorials:

- [Deploy a Node.js and MongoDB web app to Azure App Service](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli)
- [Deploy to App Service by using GitHub Actions](/azure/app-service/deploy-github-actions?tabs=applevel)
- [Deploy to App Service from ZIP packages](/azure/app-service/deploy-zip)

#### Deploy with Azure CLI

To deploy your JavaScript app by using the Azure CLI, follow these steps:

1. [Install the Azure CLI](/cli/azure/install-azure-cli) if you don't already have it.
1. Sign in to your Azure account.

     ```bash
     az login
     ```

1. Create or use an existing App Service plan and app service.

     ```bash
     az appservice plan create --name <plan-name> --resource-group <resource-group> --sku B1 --is-linux
     az webapp create --resource-group <resource-group> --plan <plan-name> --name <app-name> --runtime "NODE|20-lts"
     ```

1. Deploy your application code as a ZIP file or from a local Git repository.

     For ZIP deployment:
     ```bash
     az webapp deployment source config-zip --resource-group <resource-group> --name <app-name> --src <path-to-zip>
     ```

     For local Git deployment:
     ```bash
     az webapp deployment source config-local-git --resource-group <resource-group> --name <app-name>
     az webapp config appsettings set --resource-group <resource-group> --name <app-name> --settings DEPLOYMENT_BRANCH='main'
     git remote add azure <git-url>
     git push azure main
     ```

#### Deploy with GitHub Actions

GitHub Actions automates your deployment process whenever you push changes to your GitHub repository. To set up GitHub Actions for Azure deployment:

1. In your GitHub repository, create a `.github/workflows/` directory if it doesn't exist.
1. Create a workflow file (for example, `azure-deploy.yml`) that defines your deployment steps.
1. Use an Azure login action to authenticate with Azure. **Recommended:** Use OpenID Connect (OIDC) for enhanced security instead of storing credentials as secrets.

     **Option A: OpenID Connect (recommended)**
     
     ```yaml
     permissions:
       id-token: write
       contents: read

     - name: Azure Login
       uses: azure/login@v2
       with:
         client-id: ${{ secrets.AZURE_CLIENT_ID }}
         tenant-id: ${{ secrets.AZURE_TENANT_ID }}
         subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

     - name: Deploy to Azure Web App
       uses: azure/webapps-deploy@v3
       with:
         app-name: <app-name>
         package: '.'
     ```
     
     For setup instructions, see [Configure OpenID Connect with GitHub Actions](/azure/developer/github/connect-from-azure-openid-connect).

     **Option B: Credential-based authentication (legacy)**
     
     ```yaml
     - name: Azure Login
       uses: azure/login@v2
       with:
         creds: ${{ secrets.AZURE_CREDENTIALS }}

     - name: Deploy to Azure Web App
       uses: azure/webapps-deploy@v3
       with:
         app-name: <app-name>
         package: '.'
     ```

1. Add deployment steps appropriate for your hosting service (App Service, Static Web Apps, or Container Apps).

1. Commit and push the workflow file to your repository to activate automatic deployments.

For more detailed guidance, see [Deploy with GitHub Actions](/azure/app-service/deploy-github-actions?tabs=applevel).

### Deploy to Azure Functions

Azure Functions is a good fit for event-driven JavaScript apps and serverless APIs.

To deploy from Visual Studio Code:

1. Install the [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extension.
1. Open the Azure explorer, and select your Azure subscription.
1. Create or select your function app.
1. Use the extension commands to publish your local project.

For service guidance, see [Azure Functions documentation](/azure/azure-functions/) and [Functions overview](/azure/azure-functions/functions-overview).

### Deploy to Azure Container Apps

Azure Container Apps provides serverless container hosting for JavaScript applications. To deploy:

1. Containerize your application by using Docker. Create a `Dockerfile` in your project root.
1. Build and test your container locally.
1. Push your container image to [Azure Container Registry](/azure/container-registry/container-registry-get-started-docker-cli).
1. Use the [Azure Container Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps) or Azure CLI to create and deploy your container app.

For a complete guide, see [JavaScript on Azure Container Apps overview](/azure/container-apps/javascript-overview).

## Build steps

After you choose your service and deployment path, decide when the build should happen.

Depending on your application's complexity and deployment needs, you can choose to build your JavaScript app either before or during deployment:

- **Build before deployment**: For complex or lengthy builds, package your application into a zip file and deploy it. A deployment package gives you control over the build process and lets you test it before deployment.
- **Build during deployment**: For simpler builds, use the Azure-provided environment variable `SCM_DO_BUILD_DURING_DEPLOYMENT=true` to build your app during deployment.

## Deployment slots

Use deployment slots after you have a running App Service app and need a safer release process.

[Deployment slots](/azure/app-service/deploy-staging-slots) in Azure App Service allow you to create separate environments for staging and production. By using slots, you can test your app in a staging environment before swapping it with the production slot, ensuring a smooth and error-free deployment.

Don't use deployment slots to mix deployment purposes. All deployment slots share the App Service, so you need to make sure the traffic patterns and intended use of all slots are the same. If you need a hosted test or stage environment, use a separate App Service.

## Connect to your Azure hosted environment

- For **manual or occasional access** to your hosted environments, refer to how to [view files in your Azure hosted environment](#view-files-in-azure-hosted-environment).
- For **automated or consistent access**, consider taking the steps to set up one of the deployment methods.

## View files in Azure hosted environment

There are several ways to immediately see the files in your hosted Azure Web app or Function app. If you're using slots in your hosted resource, you need to make sure you're on the correct slot before viewing files.

- View files in [Azure portal](https://portal.azure.com) - select **Console** under Development tools for your hosting resource.

- View files in VS Code extension - select the Azure icon in the Activity bar. In the Resources section, select your subscription and service. The **Files** node provides a view of your remote files.

    - [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) and [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extensions both provide a view of remote files.

  :::image type="content" source="../media/deployment-methods/deploy-to-azure-web-app-view-files-in-visual-studio-code-extension.png" alt-text="Screenshot of remote files displayed in the Azure App Service and Azure Functions extensions in Visual Studio Code." lightbox="../media/deployment-methods/deploy-to-azure-web-app-view-files-in-visual-studio-code-extension.png":::

## View HTTP endpoint in Azure portal

View your HTTP endpoint from the service's Overview page on the Azure portal.

:::image type="content" source="../media/howto-deploy/azure-portal-hosting-url.png" alt-text="Screenshot of the HTTP endpoint on the service Overview page in the Azure portal." lightbox="../media/howto-deploy/azure-portal-hosting-url.png":::

## Related content

- [Deployment tutorials using Visual Studio Code](https://code.visualstudio.com/docs/azure/deployment)
- [Hosting apps on Azure](/azure/developer/intro/hosting-apps-on-azure)
- [Azure Static Web Apps documentation](/azure/static-web-apps/)
- [Azure Container Apps documentation](/azure/container-apps/)
- [Azure App Service documentation](/azure/app-service/)
- [Azure Functions documentation](/azure/azure-functions/)
