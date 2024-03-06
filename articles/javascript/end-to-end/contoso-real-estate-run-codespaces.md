---
title: "Tutorial: Contoso Real Estate run in Codespaces"
description: In this tutorial, run the Contoso Real Estate in Codespaces for this enterprise-grade modern composable cloud-native application and its scenarios.aces
ms.topic: tutorial
ms.date: 08/31/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate, devx-track-extended-azdevcli
# CustomerIntent: As a senior developer new to Azure, I want to learn how to run the Contoso Real Estate in Codespaces so that I can learn how to develop modern cloud solutions.
---

# Tutorial: Deploy the Contoso Real Estate to Azure from GitHub Codespaces

[!INCLUDE [include](./includes/contoso-intro-paragraph.md)]

In this tutorial, you'll deploy and use the Contoso Real Estate reference architecture sample and its components, which shows you how to build enterprise-grade modern composable frontends (or micro-frontends) and cloud-native applications. The reference architecture is a collection of best practices, architecture patterns, and functional components that can be used to build and deploy modern JavaScript applications to Azure.

> [!div class="checklist"]
> - Open project with GitHub Codespaces in browser
> - Sign in to Azure with the Azure Developer CLI
> - Provision Azure resources and deploy source code for applications with Azure Developer CLI
> - Find resource information

## Prerequisites 

* GitHub account: access to the Contoso Real Estate repository and ability to fork and open with GitHub Codespaces is required to complete tutorial. 
* Azure subscription: a free account can be created [here](https://azure.microsoft.com/free/)

## Fork the repository

1. In a web browser, navigate to the [Contoso Real Estate repository](https://github.com/azure-samples/contoso-real-estate).
1. Select **Fork** in the upper-right corner of the page.
1. Select your GitHub account as the destination for the fork.

## Start Codespaces

1. Select **Code** in the upper-right corner of the page.
1. Select **Codespaces** tab then select **+ Create codespace on main**.
1. In the new browser tab, select **Sign in with GitHub**. This may take a few minutes to complete because this enterprise solution has many dependencies.

    :::image type="content" source="./media/contoso-real-estate-run-codespaces/start-codespace.png" alt-text="Screenshot of browser showing setting up CodeSpace environment.":::

1. View the new CodeSpace and wait for any final tasks to complete.

    :::image type="content" source="./media/contoso-real-estate-run-codespaces/view-codespace-browser-startup.png" alt-text="Screenshot of browser showing Visual Studio Code in Code Space environment, finishing environment setup.":::

## Run the applications locally in Codespaces

To run the entire solution in Codespaces with local resources, the underlying services must be running locally. 

1. Run the following command to install the npm workspace dependencies of all the `./packages` applications into a single `node_modules` folder. 

    ```bash
    npm install
    ```
    
2. Run the following command to run all the services such as the databases, and start all the applications in the `./packages` folder. 

    ```bash
    npm run start
    ```

3. There are two client applications: blog and portal. Use the **ports** tab toward the bottom of the Codespace UI to find the correct URL for each app. 

    :::image type="content" source="./media/contoso-real-estate-serverless-api-migration/codespaces-open-portal-url.png" lightbox="./media/contoso-real-estate-serverless-api-migration/codespaces-open-portal-url.png" alt-text="Screenshot of the Codespace with the Ports tab displayed and the forwarded address for the Portal app highlighted to select.":::

    Notice the URL for the apps uses the Codespaces name and the app's port number as the subdomain name: `https://special-space-adventure-q9rwrw7pxg4hxpxx-4280.app.github.dev/home`.

    The Codespaces name is `special-space-adventure` and the port for the portal is `4280`. 

## Sign in to Azure with the Azure Developer CLI

The first step to deploying the Contoso Real Estate app to Azure is to sign in to Azure with the Azure Developer CLI.

1. In the Codespaces integrated terminal, sign in to Azure with the Azure Developer CLI:

    ```bash
    azd auth login
    ``````

1. To complete this command, copy the device code then following the instructions to use the device code. A browser window may open automatically as part of this task or you may need to open the browser window manually with a URL provided in the terminal output.
1. When the command is complete, you'll see a message that you're signed in to Azure. You can close this browser tab.

## Deploy to Azure with the Azure Developer CLI

Deployment is separated into provisioning (creating cloud resources) and deployment (moving code to the cloud). This is necessary to allow for execution of scripts between provisioning and deployment.

1. In the Codespaces integrated terminal, run the following command to create Azure resources and deploy source code with the Azure Developer CLI command to create resources:

    ```bash
    azd provision
    ```    

1. Use the following table to answer the remaining AZD prompts:

    |Prompt|Value|
    |--|--|
    |**Enter a new environment name**|Enter an identifying name for the Azure resource group that will be created.| 
    |**Select an Azure Subscription to use**|Select the Azure subscription you want to use for this deployment.|
    |**Select an Azure location to use**|Select **(Europe) West Europe (westeurope)**. Your deployment may fail if the region you selected is unavailable for provisioning specific resources. We recommend using westeurope as your target region since that has been currently validated for all services that are part of this architecture reference and Azure Developer CLI template.|

    Wait for the process to complete which includes:

    * Creating a resource group: `rg-<environment-name>`
    * Creating resources
    * Creating environment variables associated with the resources, found in `.azure/<environment-name>/.env`
    * A `postprovision` hook in the **azure.yml** file to restore the database from dump file.

1. Use the following command to deploy the source code to the resources with the Azure Developer CLI command:

    ```bash
    azd deploy
    ```

    This process includes:

    * `postpackage` hook in the **azure.yml** file to fix the URLs used for the client application **build** which needs to know the URLs for the API and CMS.
    * Building the application artifacts with environment variables from `azd provision` command

1. Wait for the process to complete. This takes a few minutes.

## View the deployed application

The Contoso Real Estate app has two frontends.  

* Blog available without signing in.
* Portal with listing is available after signing in.

To find the URLs for the frontends, use the following steps:

1. Select the **Ports** tab in the bottom panel of the Codespaces window.
1. If you have more than one subscription, select the subscription you used for the deployment.
1. Find the Container Apps node, and expand it. Find the resource prefixed with **ca-blog** (meaning Container App blog), right-click it and select **Browse**. Complete the steps to open in a browser. The blog app opens in a new browser tab.

    :::image type="content" source="./media/contoso-real-estate-get-started/browser-blog-landing.png" alt-text="Screenshot of Contoso blog featuring information about technology, news, gastronomy, releases, and locations relevant to users of the HR relocation portal.":::

1. Find the Static Web Apps node, and expand it. Find the resource prefixed with **stapp-web** (meaning Static Web App), right-click it and select **Browse**. Complete the steps to open in a browser. The portal app opens in a new browser tab.

    :::image type="content" source="./media/contoso-real-estate-get-started/browser-portal-landing.png" alt-text="Screenshot of Contoso portal featuring several property listings with images, descriptions, and prices.":::

## Monitor the deployed application

In the browser tab for the Contoso Real Estate repository, use `azd monitor` to launch the custom dashboard. 

```bash
azd monitor
```

This opens a new browser tab with the custom dashboard in the Azure portal. 

:::image type="content" source="./media/contoso-real-estate-run-codespaces/azure-portal-custom-dashboard.png" alt-text="Screenshot of Azure portal with the Contoso Real Estate's custom dashboard visible.":::

## Run local code against cloud resources

When you need to run one of the applications, you may want to run the package you're updating locally against the cloud resources. To do this, the local application needs to know where the cloud resources are. Typically this is managed as environment variables. 

When you create the resources with the Azure Developer CLI (`azd`), a `./.azure` folder is created with a folder for your named environment. This folder contains a `.env` file with the environment variables for the resources. 

## Debug local projects

This project has Visual Studio Code launch configurations in the `.vscode` folder to help debug the apps. The debug runs against local or cloud resources based on the .env file values used. 

Debug configurations for the **secure portal** include:

* **Debug web**: Debug the portal
* **Debug API**: Debug the Azure Functions app. When running or debugging the Azure Functions locally, remember to rename the existing `local.settings.sample.json` to `local.settings.json` in order to start the Azure Functions successfully.

Debug configurations for the **public blog** include:

* **ng serve**: Run the Angular app for the blog in Chrome
* **blog: frontend**: Debug the Angular app for the blog
* **blog: backend**: Debug the Strapi CMS for the blog

### Run local projects

This project has scripts in the root `package.json` file to help run the project against cloud resources.

```json
"scripts": {
    "start": "concurrently npm:start:* --kill-others",
    "start:services": "docker compose up",
    "start:api": "npm run start --workspace=api",
    "start:website": "npm run start:swa --workspace=portal",
    // ... remaining scripts removed for brevity
}
```


## Contribute to the application

The Contoso Real Estate app is a sample application that you can use to learn about modern cloud solutions. You can also contribute to the application by submitting pull requests. Learn more about this process in the [Contoso Real Estate contribution guide](https://github.com/Azure-Samples/contoso-real-estate/blob/main/CONTRIBUTING.md).

## Clean up

To clean up after you're finished using this tutorial, delete the Azure resources and delete the GitHub CodeSpace.

1. To delete the resources, use the following command:

    ```bash
    azd down
    ``````

1. To delete the GitHub CodeSpace, go to GitHub's [Codespaces dashboard](https://github.com/codespaces).
1. Select the ellipsis button for the CodeSpace you want to delete.

    :::image type="content" source="./media/contoso-real-estate-run-codespaces/github-codespace-dashboard-ellipsis.png" alt-text="Screenshot of browser showing Codespaces dashboard with ellipsis highlighted for single CodeSpace to delete.":::
1. Select **Delete**.

    :::image type="content" source="./media/contoso-real-estate-run-codespaces/github-codespace-dashboard-delete-button.png" alt-text="Screenshot of browser showing Codespaces dashboard with delete option highlighted for single CodeSpace to delete.":::

## Troubleshooting

### Capture logs

If you see any issues during provisioning or deployment, you can use the `--debug` command combined with the `tee` command to capture logs in the development container to help understand the issue:


```bash
azd provision --debug 2>&1 | tee provision.log.txt
```

```bash
azd deploy --debug 2>&1 | tee deploy.log.txt
```

### Report issues

Report issues with the Contoso Real Estate sample in the [GitHub repository](https://github.com/Azure-Samples/contoso-real-estate/issues).


## Resources

Learn more:

* [Contoso Real Estate](https://github.com/azure-samples/contoso-real-estate)
* [Naming convention best practices](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)
* [Codespaces](https://docs.github.com/codespaces)
* [Azure Developer CLI](/azure/developer/azure-developer-cli)

## Next step

> [!div class="nextstepaction"]
> [Learn how to develop modern cloud solutions](contoso-real-estate-developer-tools.md)
