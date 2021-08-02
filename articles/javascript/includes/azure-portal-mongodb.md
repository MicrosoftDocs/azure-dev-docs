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

## Add firewall rule for your client IP address with Azure Portal

By default, the firewall rules are not configured. You should add your client IP address so your client connection to the server with JavaScript is successful.
1. In the Azure portal for your MongoDB database, select **Firewall and virtual networks**.
2. Select **Add my current IP (xxx.xxx.xxx.xxx)**. 
3. The **Exceptions** options should stay selected. This allows you to access the database from the Azure portal and Azure resources to access other Azure resources.  
4. Select **Save**.

    :::image type="content" source="../../media/howto-database/azure-portal-cosmos-db-firewall-setting.png" alt-text="Screenshot of Azure Portal to configure firewall for your local computer." lightbox="../../media/howto-database/azure-portal-cosmos-db-firewall-setting.png":::

## Get the MongoDB connection string for your resource with Azure Portal

1. In the Azure portal for your MongoDB database, select **Connection String**.
2. Select the _copy icon_ at the end of the row for the **Primary Connection String**.

    :::image type="content" source="../../media/howto-database/azure-portal-cosmos-db-connection-string.png" alt-text="Screenshot of Azure Portal to copy connection string." lightbox="../../media/howto-database/azure-portal-cosmos-db-connection-string.png":::

3. Paste the connection string into either an Azure Key Vault **secret** or another secured location. 
