---
ms.topic: include
ms.date: 05/05/2021
author: adrianhall
ms.author: adhal
---

## Deploy the backend service

To deploy the quickstart service, first login to Azure with the Azure CLI:

```bash
az login
```

A web browser will be opened to complete the authorization.

If necessary, [select a subscription](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli).

### Create a resource group

Type the following to create a resource group:

```bash
az group create -l westus -n zumo-quickstart
```

This will create a resource group called _zumo-quickstart_ to hold all the resources we create. Replace `westus` with another region if you do not have access to the westus region or you prefer a region closer to you.

### Deploy the backend to Azure

The service is comprised of the following resources:

* An App Service Hosting Plan on the Free plan.
* A web-site hosted within the App Service Hosting plan.
* An Azure SQL server.
* An Azure SQL database in the Basic tier (incurs cost).

The Azure SQL database is the only resource that incurs cost.  For details, see [Pricing](https://azure.microsoft.com/pricing/details/sql-database/single/).

To deploy the resources, type the following:

```bash
cd samples/nodejs
az deployment group create -n ZumoQuickstart -g zumo-quickstart --template-file ./azuredeploy.json
```

Once complete, run the following to see the outputs:

```bash
az deployment group show -n ZumoQuickstart -g zumo-quickstart --query properties.outputs
```

This will show information about your deployment that you need in developing your mobile application.  The database username and password are useful for accessing the database through the Azure Portal.  The name of the App Service is used below, and the public endpoint is embedded in your code later on.

Finally, deploy the Azure Mobile Apps server to the created App Service:

```bash
az webapp deployment source config-zip -g zumo-quickstart --name zumo-XXXXXXXX --src ./zumoserver.zip
```

Replace `zumo-XXXXXXXX` with the name of your App Service; shown in the list of outputs.  Within 2-3 minutes, your Azure Mobile Apps server will be ready to use.  You can use a web browser to confirm this.  Point your web browser to your public endpoint with `/tables/TodoItem` appended to it (e.g. `https://zumo-XXXXXXXX.azurewebsites.net/tables/TodoItem`).  The browser will display an error about a missing X-ZUMO-VERSION parameter if the server is working properly.

> **Deleting the resources**
>
> Once you have completed the quickstart tutorial, you can delete the resources with `az group delete -n zumo-quickstart`.
>
> The tutorial is comprised of three parts (including this section).  Do not delete the resources before completing the tutorial.
