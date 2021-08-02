---
ms.custom: devx-track-js, devx-track-azurecli
ms.topic: include
ms.date: 08/02/2021
---

## Create and use a MongoDB database with Azure portal 

1. Use the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.DocumentDB) to create a Cosmos DB API for MongoDB. 
2. On the **Basics** page, make sure you select the **version** of MongoDB you intend to use. Learn more about MongoDB versions:
   * [4.0](/azure/cosmos-db/mongodb-feature-support-40) 
   * [3.6](/azure/cosmos-db/mongodb-feature-support-36)
   * [3.2](/azure/cosmos-db/mongodb-feature-support)

3. Once the resource is created, use the **Data Explorer** for your resource to create a new database and collection. 

## Add firewall rule for your client IP address with Azure portal

By default, the firewall rules are not configured. You should add your client IP address so your client connection to the server with JavaScript is successful.
1. In the Azure portal for your MongoDB database, select **Firewall and virtual networks**.
2. Select **Add my current IP (xxx.xxx.xxx.xxx)**. 
3. The **Exceptions** options should stay selected. This allows you to access the database from the Azure portal and Azure resources to access other Azure resources.  
4. Select **Save**.

    :::image type="content" source="../media/howto-database/azure-portal-cosmos-db-firewall-setting.png" alt-text="Screenshot of Azure Portal to configure firewall for your local computer." lightbox="../media/howto-database/azure-portal-cosmos-db-firewall-setting.png":::

## Get the MongoDB connection string for your resource with Azure portal

1. In the Azure portal for your MongoDB database, select **Connection String**.
2. Select the _copy icon_ at the end of the row for the **Primary Connection String**.

    :::image type="content" source="../media/howto-database/azure-portal-cosmos-db-connection-string.png" alt-text="Screenshot of Azure Portal to copy connection string." lightbox="../media/howto-database/azure-portal-cosmos-db-connection-string.png":::

3. Paste the connection string into either an Azure Key Vault **secret** or web app (see next section). 

## Configure your Azure web app with the connection string with Azure portal

Add an Azure web app **MONGODB_URL** environment variable in the Azure portal

1. In the Azure portal for your web app, select **Configuration**.
2. In the **Application settings** section, select **New connection string**.

    :::image type="content" source="../media/howto-database/azure-portal-cosmos-db-connection-string.png" alt-text="Screenshot of Azure Portal to copy connection string." lightbox="../media/howto-database/azure-portal-cosmos-db-connection-string.png":::

3. In the **Add/Edit connection string** side panel, enter the settings:

   |Setting|Value|
   |--|--|
   |Name|Value used in your application to use this setting, such as `MONGODB_URL`. This value is typically used in a Node.js API or server with the process.env method of finding environment variables.|
   |Value|Paste the connection string (from the previous section of this document).|
   |Type|Select the **Custom**.|
   |Deployment slot setting|Only select this value if this connection string is different based on deployment slot.|

    :::image type="content" source="../media/howto-database/azure-portal-web-app-connection-string-add-setting.png" alt-text="Partial screenshot of Azure Portal to set web app connection string." lightbox="../media/howto-database/azure-portal-web-app-connection-string-add-setting.png":::

4. Select **OK** to save the connection string for the web app.     
