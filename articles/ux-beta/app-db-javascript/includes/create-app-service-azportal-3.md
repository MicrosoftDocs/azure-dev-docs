On the **Create Web App** page, fill out the form as follows.

1. Create a new resource group for the storage account named `msdocs-expressjs-mondgodb-quickstart` by selecting the **Create new** link under **Resource group**. A resource group is a logical container used to group together all of the Azure resources related to one application.  

1. Give your web app a **Name** of `msdocs-expressjs-mongodb-XYZ` where XYZ are any three random characters. This name must be unique across Azure.  The fully qualified domain name of your app will be `https://<app name>.azurewebsites.net`.

1. Leave **Publish** set to *Code*.

1. For **Runtime stack** select *Node 14 LTS*.  You can inspect this list to see what other versions of Node are available.

1. After selecting *Node 14 LTS*, **Operating System** should be set to *Linux*.

1. Choose a **Region** for your app service that is close to you.

1. In **App Service Plan** section at the bottom of the screen, look for the **Sku and size setting**.  By default, a premium plan is selected.  Select **Change size** to review your options and select a different app service plan.
