---
title: "Tutorial: Migrate Oracle WebLogic Server to Azure Kubernetes Service with geo-redundancy"
description: Shows how to deploy WebLogic Server to Azure Kubernetes Service with geo-redundancy.
author: KarlErickson
ms.author: haiche
ms.topic: how-to
ms.date: 04/29/2024
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, migration-java,, devx-track-azurecli, devx-track-extended-java
---

# Tutorial: Migrate Oracle WebLogic Server to Azure Kubernetes Service with geo-redundancy

This tutorial shows you a straightforward and effective way to implement a business continuity and disaster recovery (DR) strategy for Java using Oracle WebLogic Server (WLS) on Azure Kubernetes Service (AKS). The solution illustrates how to back up and restore a WLS workload using a simple database-driven Jakarta EE application running on AKS. Geo-redundancy is a complex topic, with many possible solutions. The best solution depends on your unique requirements. For other ways to implement geo-redundancy, see the resources at the end of this article.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Use Azure optimized best practices to achieve high availability and disaster recovery (HA/DR).
> - Set up a Microsoft Azure SQL Database failover group in paired regions.
> - Set up and configure primary WLS clusters on AKS.
> - Configure geo-redundancy using Azure Backup.
> - Restore a WLS cluster in a secondary region.
> - Set up an Azure Traffic Manager.
> - Test failover.

The following diagram illustrates the architecture you build:

<!-- Diagram source https://github.com/Azure-Samples/azure-cafe/blob/main/diagrams/weblogic-on-aks-dr-solution-architecture.vsdx-->
:::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/weblogic-on-aks-dr-solution-architecture.png" alt-text="Diagram of the solution architecture of WLS on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/weblogic-on-aks-dr-solution-architecture.png" border="false":::

Azure Traffic Manager checks the health of your regions and routes the traffic accordingly to the application tier. The primary region has a full deployment of the WLS cluster. Only the primary region is actively servicing network requests from the users. The secondary region restores the WLS cluster from backups of the primary region if there's a disaster or declared DR event. The secondary region is activated to receive traffic only when the primary region experiences a service disruption.

Azure Traffic Manager uses the health check feature of the Azure Application Gateway and the WebLogic Kubernetes Operator (WKO) to implement this conditional routing. WKO deeply integrates with AKS health checks, enabling Azure Traffic Manager to have a high level of awareness of the health of your Java workload. The primary WLS cluster is running and the secondary cluster is shut down.

The geo-failover recovery time objective (RTO) of the application tier depends on the time for starting AKS and running the secondary WLS cluster, which is typically less than an hour. The application data is persisted and replicated in the Azure SQL Database failover group, with an RTO of minutes or hours and a recovery point objective (RPO) of minutes or hours. In this architecture, Azure backup has only one *Vault-standard* backup for the WLS configuration every day. For more information, see [What is Azure Kubernetes Service (AKS) backup?](/azure/backup/azure-kubernetes-service-backup-overview)

[!INCLUDE [ha-dr-for-wls-overview](includes/ha-dr-for-wls-overview.md)]

This article uses Azure Backup to protect AKS. For region availability, supported scenarios, and limitations, see [Azure Kubernetes Service backup support matrix](/azure/backup/azure-kubernetes-service-cluster-backup-support-matrix). Currently, Azure Backup supports Vault Tier backups and restoring across regions, which are available in public preview. For more information, see [Enable Vault Tier backups for AKS and restore across regions by using Azure Backup](/azure/backup/tutorial-restore-aks-backups-across-regions).

> [!NOTE]
> In this article, you must frequently create unique identifiers for various resources. This article uses the convention of `<initials><sequence-number>` as a prefix. For example, if your name is Emily Juanita Bernal, a unique identifier would be `ejb01`. For additional disambiguity, you could append today's date in `MMDD` format, such as `ejb010307`.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Make sure you have either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).
- Prepare a local machine with Windows, Linux, or macOS installed.
- To run Azure CLI commands, install the [Azure CLI](/cli/azure/install-azure-cli), version 2.54.0 or later.
- Install and set up [kubectl](/cli/azure/aks#az-aks-install-cli).
- Install and set up [Git](/devops/develop/git/install-and-set-up-git).
- Install a Java SE implementation, version 17 or later - for example, [the Microsoft build of OpenJDK](/java/openjdk).
- Install [Maven](https://maven.apache.org/download.cgi), version 3.9.3 or later.
- Have the credentials for an Oracle single sign-on (SSO) account. To create one, see [Create Your Oracle Account](https://aka.ms/wls-aks-create-sso-account).
- Use the following steps to accept the license terms for WLS:
  1. Visit the [Oracle Container Registry](https://container-registry.oracle.com/) and sign in.
  1. If you have a support entitlement, select **Middleware**, then search for and select **weblogic_cpu**.
  1. If you don't have a support entitlement from Oracle, select **Middleware**, then search for and select **weblogic**.
  1. Accept the license agreement.

- Running WLS on AKS requires an understanding of WLS domains. For more information on WLS domains, see the [Decide whether to use the prebuilt Azure Marketplace offer](migrate-weblogic-to-azure-kubernetes-service.md#decide-whether-to-use-the-prebuilt-azure-marketplace-offer) section of [Migrate WebLogic Server applications to Azure Kubernetes Service](migrate-weblogic-to-azure-kubernetes-service.md). This article assumes that you're running WLS on AKS using the [model in image](https://oracle.github.io/weblogic-kubernetes-operator/samples/azure-kubernetes-service/model-in-image/) domain home source type, with transaction logs and stores in an external database, and no external storage.

## Set up an Azure SQL Database failover group in paired regions

[!INCLUDE [ha-dr-for-wls-azure-sql-database-creation](includes/ha-dr-for-wls-azure-sql-database-creation.md)]

[!INCLUDE [ha-dr-for-wls-azure-sql-database-schema-aks](includes/ha-dr-for-wls-azure-sql-database-schema-aks.md)]

[!INCLUDE [ha-dr-for-wls-azure-sql-database-failover-group](includes/ha-dr-for-wls-azure-sql-database-failover-group.md)]

## Get the JDBC connection string and database admin username for the failover group

The following steps direct you to get the JDBC connection string and database username for the database within the failover group. These values are different than the corresponding values for the primary database.

1. In the Azure portal, find the resource group into which you deployed the primary database.
1. In the list of resources, select the primary database with type **SQL database**.
1. Under **Settings**, select **Connection strings**.
1. Select **JDBC**.
1. In the text area under **JDBC (SQL authentication)**, select the copy icon to put the value of the JDBC connection string on the clipboard.
1. In a text editor, paste the value. You edit it in another step.
1. Return to the resource group.
1. Select the resource of type **SQL Server** that contains the database you just looked at in the previous steps.
1. Under **Data management**, select **Failover groups**.
1. In the table in the middle of the page, select the failover group.
1. In the text area under **Read/write listener endpoint**, select the copy icon to put the value of the JDBC connection string on the clipboard.
1. Paste the value on a new line in your text editor. Your text editor should now have lines similar to the following example:

   ```
   jdbc:sqlserver://ejb010307db.database.windows.net:1433;database=ejb010307db;user=azureuser@ejb010307db;password={your_password_here};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
   ejb010307failover.database.windows.net
   ```

1. Create a new line using the following modifications:

   1. Copy the entire first line.
   1. Change the hostname part of the URL to use the hostname from the **Read/write listener endpoint** line.
   1. Remove everything after the `name=value` pair for `database`. In other words, remove everything including and after the `;` immediately after `database=ejb010307db`.

      When you're done, the string should look similar to the following example:

      ```
      jdbc:sqlserver://ejb010307failover.database.windows.net:1433;database=ejb010307db
      ```

      This value is the JDBC connection string.

1. In the same text editor, derive the database username by getting the value of the `user` parameter from the original JDBC connection string and replacing the database name with the first part of the **Read/write listener endpoint** line. Continuing with the previous example, the value would be `azureuser@ejb010307failover`. This value is the database admin username.

## Set up and configure the primary WLS clusters on AKS

In this section, you create a WLS cluster on AKS using the [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer. The cluster in East US is the primary and is configured as the active cluster.

> [!NOTE]
> You can find more information about [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer from the following articles:
>
> - [Deploy a Java application with WebLogic Server on an Azure Kubernetes Service (AKS) cluster](/azure/aks/howto-deploy-java-wls-app)
> - [Oracle WebLogic user guide for AKS](https://aka.ms/wls-aks-docs)

### Prepare a sample app

[!INCLUDE [ha-dr-for-wls-azure-prepare-sample-app](includes/ha-dr-for-wls-azure-prepare-sample-app.md)]

### Create a storage account and storage container to hold the sample application

Use the following steps to create a storage account and container. Some of these steps direct you to other guides. After completing the steps, you can upload a sample application to deploy on WLS.

1. Sign in to the [Azure portal](https://aka.ms/publicportal).
1. Create a storage account by following the steps in [Create a storage account](/azure/storage/common/storage-account-create). Use the following specializations for the values in the article:

   - Create a new resource group for the storage account.
   - For **Region**, select **East US**.
   - For **Storage account name**, use the same value as the resource group name.
   - For **Performance**, select **Standard**.
   - For **Redundancy**, select **Locally-redundant storage (LRS)**.
   - The remaining tabs need no specializations.

1. Proceed to validate and create the account, then return to this article.
1. Create a storage container within the account by following the steps in the [Create a container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) section of [Quickstart: Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal).
1. Using the same article, upload the *azure-cafe/weblogic-cafe/target/weblogic-cafe.war* package that you built previously by following the steps in the [Upload a block blob](/azure/storage/blobs/storage-quickstart-blobs-portal#upload-a-block-blob) section. Then, return to this article.

### Deploy WLS on AKS

Use the following steps to deploy WLS on AKS:

1. Open the [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer in your browser and select **Create**. You should see the **Basics** pane of the offer.

   :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-basis.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server on AKS Basics pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-basis.png":::

1. Use the following steps to fill out the **Basics** pane:

   1. Ensure that the value shown for **Subscription** is the same one that has the roles listed in the prerequisites section.
   1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group - for example, *wlsaks-eastus-20240109*.
   1. Under **Instance details**, for **Region**, select **East US**.
   1. Under **Credentials WebLogic**, provide a password for **WebLogic Administrator** and **WebLogic Model encryption**, respectively. Save aside the username and password for **WebLogic Administrator**.
   1. Under **Optional Basic Configuration**, for **Accept defaults for optional configuration?**, select **No**. The optional configuration shows.

      :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-basis-optional-config.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server on AKS Basics pane Optional Basic Configuration." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-basis-optional-config.png":::

   1. For **Name prefix for Managed Server**, fill in `msp`. You configure WLS TLOG table with prefix `TLOG_${serverName}_ ` later. This article creates TLOG table with name `TLOG_msp${index}_WLStore`. If you want a different managed server name prefix, make sure the value matches Microsoft SQL Server Table Naming Conventions and the real table names.
   1. Leave the defaults for the other fields.

1. Select **Next** to go to the **AKS** pane.

1. Under **Image selection**, provide the following information:

   - For **Username for Oracle Single Sign-On authentication**, fill in your Oracle SSO username from the preconditions.
   - For **Password for Oracle Single Sign-On authentication**, fill in your Oracle SSO credentials from the preconditions.

   :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-aks-image-selection.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server on AKS pane - Image Selection." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-aks-image-selection.png":::

1. Under **Application**, use the following steps:

   1. In the **Application** section, next to **Deploy an application?**, select **Yes**.
   1. Next to **Application package (.war,.ear,.jar)**, select **Browse**.
   1. Start typing the name of the storage account from the previous section. When the desired storage account appears, select it.
   1. Select the storage container from the previous section.
   1. Select the checkbox next to **weblogic-cafe.war**, which you uploaded in the previous section. Select **Select**.
   1. Leave the defaults for the other fields.

   :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-aks-app-selection.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server on AKS pane - App Selection." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-aks-app-selection.png":::

1. Select **Next**.

1. Leave the defaults in the **TLS/SSL Configuration** pane, and then select **Next** to go to the **Load Balancing** pane.

   :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-appgateway-ingress.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server Cluster on AKS Load Balancing pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-appgateway-ingress.png":::

1. In the **Load Balancing** pane, next to **Create ingress for Administration Console. Make sure no application with path /console\*, it will cause conflict with Administration Console path**, select **Yes**.

1. Leave the defaults for the other fields and select **Next**

1. Leave the default values in the **DNS** pane and select **Next** to go to the **Database** pane.

   :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-database.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server Cluster on AKS Database pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wls-aks-offer-portal-database.png":::

1. Enter the following values in the **Database** pane:

   - For **Connect to database?**, select **Yes**.
   - For **Choose database type**, select **Microsoft SQL Server (Supports passwordless connection)** .
   - For **JNDI Name**, enter *jdbc/WebLogicCafeDB*.
   - For **DataSource Connection String**, paste the value you saved for **JDBC connection string** in the [Get the JDBC connection string and database admin username for the failover group](#get-the-jdbc-connection-string-and-database-admin-username-for-the-failover-group) section.
   - For **Global transaction protocol**, select **None**.
   - For **Database username**, paste the value you saved for **database admin username** in the [Get the JDBC connection string and database admin username for the failover group](#get-the-jdbc-connection-string-and-database-admin-username-for-the-failover-group) section.
   - Enter the database server admin sign-in password that you saved aside previously for **Database Password**. Enter the same value for **Confirm password**.
   - Leave the defaults for the other fields.

1. Select **Review + create**.

1. Wait until **Running final validation...** successfully completes, then select **Create**. After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again.

Depending on network conditions and other activity in your selected region, the deployment can take up to 70 minutes to complete. After that, you should see the text **Your deployment is complete** displayed on the deployment page.

### Configure the storage of TLOG data

In this section, you configure the storage of TLOG data by overriding the [WLS image model](https://oracle.github.io/weblogic-kubernetes-operator/samples/azure-kubernetes-service/model-in-image/) with a `ConfigMap`. For more information about the `ConfigMap`, see [WebLogic Deploy Tooling model ConfigMap](https://oracle.github.io/weblogic-kubernetes-operator/managing-domains/model-in-image/usage/#optional-wdt-model-configmap).

This section requires a Bash terminal with the Azure CLI and kubectl installed. Use the following steps to derive the necessary YAML to and configure the storage of TLOG data:

1. Use the following steps to connect to your AKS cluster:

   1. Open the Azure portal and go to the resource group that you provisioned in the [Deploy WLS on AKS](#deploy-wls-on-aks) section.
   1. Select the AKS cluster from the resource list, and then select **Connect** to connect to the AKS cluster.
   1. Select **Azure CLI** and follow the steps to connect to the AKS cluster in your local terminal.

1. Use the following steps to obtain the `topology:` entry from the WLS image model YAML:

   1. Open the Azure portal and go to the resource group that you provisioned in the [Deploy WLS on AKS](#deploy-wls-on-aks) section.
   1. Select **Settings** > **Deployments**. Select the first deployment whose name starts with **oracle.20210620-wls-on-aks**.
   1. Select **Outputs**. Copy the **shellCmdtoOutputWlsImageModelYaml** value to the clipboard. The value is a shell command that decodes the base64 string of the model file and saves the content in a file named *model.yaml*.
   1. Paste the value into your Bash terminal and run the command to produce the *model.yaml* file.
   1. Edit the file to remove all content except for the top-level `topology:` entry. There should be no top-level entries in your file except for `topology:`.
   1. Save the file.

1. Use the following steps to obtain the `ConfigMap` name and namespace name from the WLS domain model YAML:

   1. Open the Azure portal and go to the resource group that was provisioned in the [Deploy WLS on AKS](#deploy-wls-on-aks) section.
   1. Select **Settings** > **Deployments**. Select the first deployment whose name starts with **oracle.20210620-wls-on-aks**.
   1. Select **Outputs**. Copy value of **shellCmdtoOutputWlsDomainYaml** to clipboard. The value is a shell command to decode base64 string of model file and save content in *model.yaml*.
   1. Paste the value to your terminal and you get a file named *domain.yaml*.
   1. Look in the `domain.yaml` for the following values.

      - `spec.configuration.model.configMap`. If you accepted the defaults, this value is `sample-domain1-wdt-config-map`.
      - `metadata.namespace`. If you accepted the defaults, this value is `sample-domain1-ns`.

      For your convenience, you can use the following command to save these values as shell variables:

      ```bash
      export CONFIG_MAP_NAME=sample-domain1-wdt-config-map
      export WLS_NS=sample-domain1-ns
      ```

1. Use the following command to get the `ConfigMap` YAML:

   ```bash
   kubectl get configmap ${CONFIG_MAP_NAME} -n ${WLS_NS} -o yaml > configMap.yaml
   ```

1. Use the following steps to create the *tlog-db-model.yaml* file:

   1. In a text editor, create an empty file called *tlog-db-model.yaml*.

   1. Insert the contents of your *model.yaml*, add a blank line, and then insert the contents of your *configMap.yaml* file.

1. In your *tlog-db-model.yaml* file, locate the line ending with `ListenPort: 8001`. Append this text on the following line, taking extreme care that `TransactionLogJDBCStore` is exactly under `ListenPort` and the remaining lines in the following snippet are indented by two, as shown in the following example:

   ```yaml
   TransactionLogJDBCStore:
     Enabled: true
     DataSource: jdbc/WebLogicCafeDB
     PrefixName: TLOG_${serverName}_
   ```

   The completed *tlog-db-model.yaml* should look very close to the following example:

   ```yaml
   topology:
     Name: "@@ENV:CUSTOM_DOMAIN_NAME@@"
     ProductionModeEnabled: true
     AdminServerName: "admin-server"
     Cluster:
       "cluster-1":
         DynamicServers:
           ServerTemplate: "cluster-1-template"
           ServerNamePrefix: "@@ENV:MANAGED_SERVER_PREFIX@@"
           DynamicClusterSize: "@@PROP:CLUSTER_SIZE@@"
           MaxDynamicClusterSize: "@@PROP:CLUSTER_SIZE@@"
           MinDynamicClusterSize: "0"
           CalculatedListenPorts: false
     Server:
       "admin-server":
         ListenPort: 7001
     ServerTemplate:
       "cluster-1-template":
         Cluster: "cluster-1"
         ListenPort: 8001
         TransactionLogJDBCStore:
           Enabled: true
           DataSource: jdbc/WebLogicCafeDB
           PrefixName: TLOG_${serverName}_
     SecurityConfiguration:
       NodeManagerUsername: "@@SECRET:__weblogic-credentials__:username@@"
       NodeManagerPasswordEncrypted: "@@SECRET:__weblogic-credentials__:password@@"

   resources:
     JDBCSystemResource:
       jdbc/WebLogicCafeDB:
         Target: 'cluster-1'
         JdbcResource:
           JDBCDataSourceParams:
             JNDIName: [
               jdbc/WebLogicCafeDB
             ]
             GlobalTransactionsProtocol: None
           JDBCDriverParams:
             DriverName: com.microsoft.sqlserver.jdbc.SQLServerDriver
             URL: '@@SECRET:ds-secret-sqlserver-1709938597:url@@'
             PasswordEncrypted: '@@SECRET:ds-secret-sqlserver-1709938597:password@@'
             Properties:
               user:
                 Value: '@@SECRET:ds-secret-sqlserver-1709938597:user@@'
           JDBCConnectionPoolParams:
               TestTableName: SQL SELECT 1
               TestConnectionsOnReserve: true
   ```

1. Override the WLS model with the `ConfigMap`. To override the WLS model, replace the existing `ConfigMap` with the new model. For more information, see [Updating an existing model](https://oracle.github.io/weblogic-kubernetes-operator/managing-domains/model-in-image/runtime-updates/#updating-an-existing-model) in the Oracle documentation. Run the following commands to recreate the `ConfigMap`:

   ```bash
   export CM_NAME_FOR_MODEL=sample-domain1-wdt-config-map
   kubectl -n sample-domain1-ns delete configmap ${CM_NAME_FOR_MODEL}

   # replace path of tlog-db-model.yaml
   kubectl -n sample-domain1-ns create configmap ${CM_NAME_FOR_MODEL} \
     --from-file=tlog-db-model.yaml
   kubectl -n sample-domain1-ns label configmap ${CM_NAME_FOR_MODEL} \
     weblogic.domainUID=sample-domain1
   ```

1. Restart the WLS cluster by using the following commands. You need to cause a rolling update to make the new model work.

   ```bash
   export RESTART_VERSION=$(kubectl -n sample-domain1-ns get domain sample-domain1 '-o=jsonpath={.spec.restartVersion}')
   # increase restart version
   export RESTART_VERSION=$((RESTART_VERSION + 1))

   kubectl -n sample-domain1-ns patch domain sample-domain1 \
       --type=json \
       '-p=[{"op": "replace", "path": "/spec/restartVersion", "value": "'${RESTART_VERSION}'" }]'
   ```

Make sure the WLS pods are running before you move on. You can use the following command to watch status of the pods:

```bash
kubectl get pod -n sample-domain1-ns -w
```

> [!NOTE]
> In this article, WLS models are included in the application container image, which was created by the WLS on AKS offer. TLOG is configured by overriding the existing model with the WDT `ConfigMap` that contains the model file and uses the domain CRD `configuration.model.configMap` field to reference the map. In production scenarios, [auxiliary images](https://oracle.github.io/weblogic-kubernetes-operator/managing-domains/model-in-image/auxiliary-images/) are the recommended best approach for including Model in Image model files, application archive files, and the WebLogic Deploy Tooling installation, in your pods. This feature eliminates the need to provide these files in the image specified in `domain.spec.image`.

## Configure geo-redundancy using Azure Backup

In this section, you use Azure Backup to back up AKS clusters by using the Backup extension, which must be installed in the cluster.

Use the following steps to configure geo-redundancy:

1. Create a new storage container for the AKS backup extension in the storage account you created in the [Create a storage account and storage container to hold the sample application](#create-a-storage-account-and-storage-container-to-hold-the-sample-application) section.

1. Use the following commands to install the AKS backup extension and enable the CSI drivers and snapshots for your cluster:

   ```azurecli
   #replace with your resource group name.
   export RG_NAME=wlsaks-eastus-20240109
   export AKS_NAME=$(az aks list \
       --resource-group ${RG_NAME} \
       --query "[0].name" \
       --output tsv)

   az aks update \
       --resource-group ${RG_NAME} \
       --name ${AKS_NAME} \
       --enable-disk-driver \
       --enable-file-driver \
       --enable-blob-driver \
       --enable-snapshot-controller --yes
   ```

   It takes about 5 minutes to enable the drivers. Make sure the commands complete without error before moving on.

[!INCLUDE [ha-dr-for-wls-backup-extension](includes/ha-dr-for-wls-backup-extension.md)]

6. Open the Azure portal, in the search bar on the top, search for *Backup vaults*. You should see it listed under **Services**. Select it.

1. To enable AKS Backup, follow the steps in [Back up Azure Kubernetes Service by using Azure Backup](/azure/backup/azure-kubernetes-service-cluster-backup) up to, but not including, the "Use hooks during AKS backup" section. Make the adjustments indicated in the following steps.

1. When you reach the "Create a Backup vault" section, make the following adjustments:

   - For step 1, under **Regions**, select **East US**. Under **Backup Storage Redundancy**, use **Globally-Redundant**.

     :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backupvault-basics.png" alt-text="Screenshot of the Azure portal that shows the Backup Vault Basic pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backupvault-basics.png":::

   - For step 2, enable **Cross Region Restore**.

1. When you reach the "Create a backup policy" section, make the following adjustments when asked to create a retention policy:

   1. Add a retention rule where **Vault-standard** is selected.

      :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/vault-standard-retention-rule.png" alt-text="Screenshot of the Azure portal that shows the selection of the Vault-standard option." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/vault-standard-retention-rule.png":::

   1. Select **Add**.

1. When you reach "Configure backups" section, make the following adjustments. Step 1-5 are for AKS Extension installation. Skip step 1-5 and start from step 6.

   - For step 7, you run into permission errors. Select **Grant Permission** to move on. After the permission deployment completes, if the error still shows, select **Revalidate** to refresh the role assignments.

     :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/aks-configure-backup-grant-permission.png" alt-text="Screenshot of the Azure portal that shows the AKS Configure Backup Grant Permission." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/aks-configure-backup-grant-permission.png":::

   - For step 10, find **Select Resources to Backup**, and make the following adjustments:
     - For **Backup Instance name**, fill in a unique name.
     - For **Namespaces**, select namespaces for WebLogic Operator and WebLogic Server. In this article, select **weblogic-operator-ns** and **sample-domain1-ns**.
     - For **Other options**, select all the options. Make sure **Include Secrets** is selected.

     :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/aks-configure-backup-select-resources.png" alt-text="Screenshot of the Azure portal that shows the AKS Configure Backup Select Resources." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/aks-configure-backup-select-resources.png":::

   - For step 11, you run into a role assignment error. Select your datasource from the list, and select **Assign missing roles** to mitigate the error.

     :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/aks-configure-backup-validation.png" alt-text="Screenshot of the Azure portal that shows the AKS Configure Backup Validation." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/aks-configure-backup-validation.png":::

## Prepare to restore the WLS cluster in a secondary region

In this section, you prepare to restore the WLS cluster in the secondary region. Here, the secondary region is West US. Before restoring, you must have an AKS cluster with AKS Backup Extension installed in the West US region.

### Configure Azure Container Registry for geo-replication

Use the following steps to configure Azure Container Registry (ACR) for geo-replication, which contains the WLS image you created in the [Deploy WLS on AKS](#deploy-wls-on-aks) section. To enable ACR replication, you have to upgrade it to the Premium pricing plan. For more information, see [Geo-replication in Azure Container Registry](/azure/container-registry/container-registry-geo-replication).

1. Open the resource group that you provisioned in the [Deploy WLS on AKS](#deploy-wls-on-aks) section. From the resource list, select the ACR whose name starts with **wlsaksacr**.
1. In the ACR landing page, select **Settings** > **Properties**. For **Pricing plan**, select **Premium**, and then select **Save**.
1. In the navigation pane, select **Services** > **Geo-replications**. Select **Add** to add replication region in the page.
1. In the **Create replication** page, for **Location**, select **West US**, and then select **Create**.

After the deployment finishes, the ACR is enabled for geo-replication.

### Create a storage account in a secondary region

To enable the AKS Backup Extension, you must provide a storage account with an empty container in the same region.

To restore backup cross region, you must provide a staging location where the backup data is hydrated. This staging location includes a resource group and a storage account in it within the same region and subscription as the target cluster for restoration.

Use the following steps to create a storage account and container. Some of these steps direct you to other guides.

1. Sign in to the [Azure portal](https://aka.ms/publicportal).
1. Create a storage account by following the steps in [Create a storage account](/azure/storage/common/storage-account-create). You don't need to perform all the steps in the article. Fill out the fields shown on the **Basics** pane. For **Region**, select **West US**, then select **Review + create** to accept the default options. Proceed to validate and create the account, then return to this article.
1. Create a storage container for the AKS Backup Extension by following the steps in the [Create a container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) section of [Quickstart: Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal).
1. Create a storage container as a staging location for use during restoration.

### Prepare an AKS cluster in a secondary region

The following sections show you how to create an AKS cluster in a secondary region.

#### Create a new AKS cluster

This article exposes a WLS application using Application Gateway Ingress Controller. In this section, you create a new AKS cluster in the West US region. Then, you enable the ingress controller add-on with a new application gateway instance. For more information, see [Enable the ingress controller add-on for a new AKS cluster with a new application gateway instance](/azure/application-gateway/tutorial-ingress-controller-add-on-new).

Use the following steps to create the AKS cluster:

1. Use the following commands to create a resource group in the secondary region:

   ```azurecli
   export RG_NAME_WESTUS=wlsaks-westus-20240109

   az group create --name ${RG_NAME_WESTUS} --location westus
   ```

1. Use the following commands to deploy an AKS cluster with the add-on enabled:

   ```azurecli
   export AKS_NAME_WESTUS=${RG_NAME_WESTUS}aks
   export GATEWAY_NAME_WESTUS=${RG_NAME_WESTUS}gw

   az aks create \
       --resource-group ${RG_NAME_WESTUS} \
       --name ${AKS_NAME_WESTUS} \
       --network-plugin azure \
       --enable-managed-identity \
       --enable-addons ingress-appgw \
       --appgw-name ${GATEWAY_NAME_WESTUS} \
       --appgw-subnet-cidr "10.225.0.0/16" \
       --generate-ssh-keys
   ```

   This command automatically creates a `Standard_v2 SKU` application gateway instance with the name `${RG_NAME_WESTUS}gw` in the AKS node resource group. The node resource group is named `MC_resource-group-name_cluster-name_location` by default.

   > [!NOTE]
   > The AKS cluster that you provisioned in the [Deploy WLS on AKS](#deploy-wls-on-aks) section runs across three availability zones in the East US region. Availability zones aren't supported in the West US region. The AKS cluster in West US isn't zone-redundant. If your production environment requires zone redundancy, make sure your paired region supports availability zones. For more information, see the [Overview of availability zones for AKS clusters](/azure/aks/availability-zones#overview-of-availability-zones-for-aks-clusters) section of [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones).

1. Use the following commands to get the public IP address of the application gateway instance. Save aside the IP address, which you use later in this article.

   ```azurecli
   export APPGW_ID=$(az aks show \
       --resource-group ${RG_NAME_WESTUS} \
       --name ${AKS_NAME_WESTUS} \
       --query 'addonProfiles.ingressApplicationGateway.config.effectiveApplicationGatewayId' \
       --output tsv)
   echo ${APPGW_ID}
   export APPGW_IP_ID=$(az network application-gateway show \
       --id ${APPGW_ID} \
       --query frontendIPConfigurations\[0\].publicIPAddress.id \
       --output tsv)
   echo ${APPGW_IP_ID}
   export APPGW_IP_ADDRESS=$(az network public-ip show \
       --id ${APPGW_IP_ID} \
       --query ipAddress \
       --output tsv)
   echo "App Gateway pubilc IP address: ${APPGW_IP_ADDRESS}"
   ```

1. Use the following command to attach a domain name service (DNS) name label to the public IP address resource. Replace `<your-chosen-DNS-name>` with an appropriate value - for example, `ejb010316`.

   ```azurecli
   az network public-ip update --ids ${APPGW_IP_ID} --dns-name <your-chosen-DNS-name>
   ```

1. You can check the fully qualified domain name (FQDN) of the public IP with `az network public-ip show`. The following example shows an FQDN with DNS label `ejb010316`:

   ```bash
   az network public-ip show \
       --id ${APPGW_IP_ID} \
       --query dnsSettings.fqdn \
       --output tsv
   ```

   This command produces output similar to the following example:

   ```output
   ejb010316.westus.cloudapp.azure.com
   ```

> [!NOTE]
> If you're working with an existing AKS cluster, complete the following two actions before you move on:
>
> - Enable the ingress controller add-on by following the steps in [Enable application gateway ingress controller add-on for an existing AKS cluster](/azure/application-gateway/tutorial-ingress-controller-add-on-existing).
> - If you have WLS running in the target namespace, to avoid conflicts, clean up WLS resources in the WebLogic Operator namespace and WebLogic Server namespace. In this article, the WLS on AKS offer provisioned the WebLogic Operator in namespace `weblogic-operator-ns` and the WebLogic Server in namespace `sample-domain1-ns`. Run `kubectl delete namespace weblogic-operator-ns sample-domain1-ns` to delete the two namespaces.

#### Enable the AKS Backup Extension

Before you continue, use the following steps to install the AKS Backup Extension to the cluster in the secondary region:

1. Use the following command to connect to the AKS cluster in the West US region:

   ```azurecli
   az aks get-credentials \
       --resource-group ${RG_NAME_WESTUS} \
       --name ${AKS_NAME_WESTUS}
   ```

1. Use the following command to enable the CSI drivers and snapshots for your cluster:

   ```azurecli
   az aks update \
       --resource-group ${RG_NAME_WESTUS} \
       --name ${AKS_NAME_WESTUS} \
       --enable-disk-driver \
       --enable-file-driver \
       --enable-blob-driver \
       --enable-snapshot-controller --yes
   ```

[!INCLUDE [ha-dr-for-wls-backup-extension](includes/ha-dr-for-wls-backup-extension.md)]

> [!NOTE]
> To save costs, you can stop the AKS cluster in the secondary region by following the steps in [Stop and start an Azure Kubernetes Service (AKS) cluster](/azure/aks/start-stop-cluster). Start it before you restore the WLS cluster.

### Wait for a Vault-standard backup to happen

In AKS, the **Vault-standard Tier** is the only tier that supports *Geo-redundancy* and *Cross Region Restore*. As stated in [Which backup storage tier does AKS backup support?](/azure/backup/azure-kubernetes-service-backup-overview#which-backup-storage-tier-does-aks-backup-support), "Only one scheduled recovery point per day is moved to Vault Tier." You must wait for a **Vault-standard** backup to happen. A good lower bound is to wait 24 hours after completing the previous step before continuing.

### Stop the primary cluster

The primary WLS cluster and secondary WLS cluster are configured with the same TLOG database. Only one cluster can own the database at the same time. To ensure the secondary cluster works correctly, stop the primary WLS cluster. In this article, stop the AKS cluster to disable the WLS cluster by using the following steps:

1. Open the Azure portal and go to the resource group that you provisioned in the [Deploy WLS on AKS](#deploy-wls-on-aks) section.
1. Open the AKS cluster listed in the resource group.
1. Select **Stop** to stop the AKS cluster. Make sure the deployment finishes before moving on.

### Restore the WLS cluster

AKS backup supports both Operational Tier and Vault Tier backups. Only backups stored in Vault Tier can be used to do a restore to a cluster in a different region (Azure Paired Region). As per the retention rules set in the backup policy, the first successful backup of a day is moved to the blob container cross region. For more information, see the [Which backup storage tier does AKS backup support?](/azure/backup/azure-kubernetes-service-backup-overview#which-backup-storage-tier-does-aks-backup-support) section of [What is Azure Kubernetes Service backup?](/azure/backup/azure-kubernetes-service-backup-overview)

After you configured geo-redundancy in the [Configure geo-redundancy using Azure Backup](#configure-geo-redundancy-using-azure-backup) section, it takes at least a day for Vault Tier backups to become available for restoring.

Use the following steps to restore the WLS cluster:

1. Open the Azure portal and search for *Backup center*. Select **Backup center** under **Services**.
1. Under **Manage**, select **Backup instances**. Filter on the datasource type **Kubernetes Services** to find the backup instance you created in the previous section.
1. Select the backup instance to see the restore points list. In this article, the instance name is a string similar to `wlsonaks*\wlsaksinstance20240109`.

   :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-instance-restorepoints.png" alt-text="Screenshot of the Azure portal that shows the Backup instance restore points." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-instance-restorepoints.png":::

1. Select the latest **Operational and Vault-standard** backup, then select **More options**. Select **Restore** to start the restore process.
1. On the **Restore** page, the default pane is **Restore point**. Select **Previous** to change to the **Basics** pane. For **Restore Region**, select **Secondary Region**, then select **Next: Restore point**.

   :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-instance-restore-basics.png" alt-text="Screenshot of the Azure portal that shows the Restore Basics pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-instance-restore-basics.png":::

1. On the **Restore point** pane, for **Select the tier to restore**, select **Vault Store**, then select **Next:Restore parameters**.

   :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-instance-restore-restorepoint.png" alt-text="Screenshot of the Azure portal that shows the Restore point pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-instance-restore-restorepoint.png":::

1. On the **Restore parameters** pane, use the following steps:

   1. For **Select Target cluster**, select the AKS cluster that you created in the West US region. You run into a permission issue as the following screenshot shows. Select **Grant Permission** to mitigate the errors.
   1. For **Backup Staging Location**, select the Storage Account that you created in **West US**. You run into a permission issue as the following screenshot shows. Select **Assign missing roles** to mitigate the errors.
   1. If the errors still happen after role assignments finishes, select **Revalidate** to refresh the permissions.

      :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-instance-restore-restoreparameters-targetcluster.png" alt-text="Screenshot of the Azure portal that shows the Restore parameter pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-instance-restore-restoreparameters-targetcluster.png":::

   1. When granting missing permissions, if asked to specify a **Scope**, accept the default value.
   1. Select **Validate**. You should see the message, **Validation completed successfully**. Otherwise, troubleshoot and resolve the problem before continuing.

1. Select **Next:Review + restore**, then select **Restore**. It takes about 10 minutes to restore the WLS cluster.

1. You can monitor the restore process from **Backup center** > **Monitoring + reporting** > **Backup jobs**, as shown in the following screenshot:

   :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-restore-progress.png" alt-text="Screenshot of the Azure portal that shows a CrossRegionRestore in progress." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/backup-restore-progress.png":::

1. Select **Refresh** to see the latest progress.

1. After the process completes without error, stop the backup AKS cluster. Failure to do so causes ownership conflicts when you access the TLOG database in later steps.

1. Start the primary cluster.

## Set up an Azure Traffic Manager

[!INCLUDE [ha-dr-for-wls-aks-azure-traffic-manager](includes/ha-dr-for-wls-aks-azure-traffic-manager.md)]

## Test failover from primary to secondary

To test failover, you manually fail your primary database server and WLS cluster over to the secondary database server and WLS cluster in this section.

[!INCLUDE [ha-dr-for-wls-azure-verify-sample-app](includes/ha-dr-for-wls-azure-verify-sample-app.md)]

### Failover to the secondary site

Use the following steps to fail over from primary to secondary.

First, use the following steps to stop the primary AKS cluster:

1. Open the Azure portal and go to the resource group that was provisioned in the [Deploy WLS on AKS](#deploy-wls-on-aks) section.
1. Open the AKS cluster listed in the resource group.
1. Select **Stop** to stop the AKS cluster. Make sure the deployment finishes before moving on.

Next, use the following steps to fail over the Azure SQL Database from the primary server to the secondary server.

1. Switch to the browser tab of your Azure SQL Database failover group.
1. Select **Failover** > **Yes**.
1. Wait until it completes.

Next, use the following steps to start the secondary cluster.

1. Open the Azure portal and go to the resource group that has AKS cluster in secondary region.
1. Open the AKS cluster listed in the resource group.
1. Select **Start** to start the AKS cluster. Make sure the deployment finishes before moving on.

[!INCLUDE [ha-dr-for-wls-azure-verify-sample-app-test-failover](includes/ha-dr-for-wls-azure-verify-sample-app-test-failover.md)]

### Fail back to the primary site

To fail back to the primary site, you have to ensure the two clusters have a mirror backup configuration. You can achieve this state by using the following steps:

1. Enable the AKS cluster backups in the West US region by following the steps in the [Configure geo-redundancy using Azure Backup](#configure-geo-redundancy-using-azure-backup) section, starting from step 4.
1. Restore the latest Vault Tier backup to the cluster in the East US region by following  the steps in the [Prepare to restore the WLS cluster in a secondary region](#prepare-to-restore-the-wls-cluster-in-a-secondary-region) section. Skip the steps you already completed.
1. Use similar steps in the [Failover to the secondary site](#failover-to-the-secondary-site) section to fail back to the primary site including database server and cluster.

## Clean up resources

If you're not going to continue to use the WLS clusters and other components, use the following steps to delete the resource groups to clean up the resources used in this tutorial:

1. In the search box at the top of the Azure portal, enter *Backup vaults* and select the backup vaults from the search results.
1. Select **Manage** > **Properties** > **Soft delete** > **Update**. Next to **Enable soft Delete**, unselect the checkbox.
1. Select **Manage** > **Backup instances**. Select the instance you created and delete it.
1. Enter the resource group name of Azure SQL Database servers (for example, `myResourceGroup`) in the search box at the top of the Azure portal, and select the matched resource group from the search results.
1. Select **Delete resource group**.
1. In **Enter resource group name to confirm deletion**, enter the resource group name.
1. Select **Delete**.
1. Repeat steps 4-7 for the resource group of the Traffic Manager - for example, `myResourceGroupTM1`.
1. Repeat steps 4-7 for the resource group of the primary WLS cluster - for example, `wls-aks-eastus-20240109`.
1. Repeat steps 4-7 for the resource group of the secondary WLS cluster - for example, `wls-aks-westus-20240109`.

## Next steps

In this tutorial, you set up an HA/DR solution consisting of an active-passive application infrastructure tier with an active-passive database tier, and in which both tiers span two geographically different sites. At the first site, both the application infrastructure tier and the database tier are active. At the second site, the secondary domain is shut down, and the secondary database is on standby.

Continue to explore the following references for more options to build HA/DR solutions and run WLS on Azure:

> [!div class="nextstepaction"]
> [Disaster Recovery solutions for Oracle Fusion Middleware products](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.4/asdrg/index.html#Oracle%C2%AE-Fusion-Middleware)
> [!div class="nextstepaction"]
> [Azure reliability documentation](/azure/reliability)
> [!div class="nextstepaction"]
> [Build solutions for high availability](/azure/architecture/high-availability/building-solutions-for-high-availability)
> [!div class="nextstepaction"]
> [Automatic failover using Azure Traffic Manager](/azure/networking/disaster-recovery-dns-traffic-manager#automatic-failover-using-azure-traffic-manager)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure VMs](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)
