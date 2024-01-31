---
author: KarlErickson
ms.author: haiche
ms.date: 04/27/2023
ms.custom: devx-track-azurecli
---

Use the following commands to create a private endpoint for the PostgreSQL server in your Virtual Network:

### [Bash](#tab/in-bash)
 ```bash
 # export RESOURCE_GROUP_NAME = "abc1110rg"

 export DB_RESOURCE_ID=$(az resource show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $DB_SERVER_NAME \
    --resource-type "Microsoft.DBforPostgreSQL/servers" \
    --query "id" \
    --output tsv)

 az network private-endpoint create \
    --name myPrivateEndpoint \
    --resource-group $RESOURCE_GROUP_NAME \
    --vnet-name myVNet  \
    --subnet mySubnet \
    --private-connection-resource-id $DB_RESOURCE_ID \
    --group-id postgresqlServer \
    --connection-name myConnection
 ```
### [PowerShell](#tab/in-powershell)        
 ```powershell
 # $Env:RESOURCE_GROUP_NAME = "abc1110rg"

 $Env:DB_RESOURCE_ID=$(az resource show `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:DB_SERVER_NAME `
    --resource-type "Microsoft.DBforPostgreSQL/servers" `
    --query "id" `
    --output tsv)

 az network private-endpoint create `
    --name myPrivateEndpoint `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --vnet-name myVNet  `
    --subnet mySubnet `
    --private-connection-resource-id $Env:DB_RESOURCE_ID `
    --group-id postgresqlServer `
    --connection-name myConnection
 ```
---

This example uses the private IP address of the PostgreSQL server for the datasource connection. The fully qualified domain name (FQDN) in the customer DNS setting doesn't resolve to the private IP configured. If you want set up a DNS zone for the configured FQDN, follow the steps in the [Configure the Private DNS Zone](/azure/postgresql/single-server/how-to-configure-privatelink-cli#configure-the-private-dns-zone) section of [Create and manage Private Link for Azure Database for PostgreSQL - Single server using CLI](/azure/postgresql/single-server/how-to-configure-privatelink-cli).

Run the following command to get private IP address of the PostgreSQL server:

### [Bash](#tab/in-bash)
 ```bash
 export DB_PRIVATE_IP=$(az network private-endpoint show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name myPrivateEndpoint \
    --query customDnsConfigs'[0]'.ipAddresses'[0]' \
    --output tsv)

 echo $DB_PRIVATE_IP
 ```
### [PowerShell](#tab/in-powershell)        
 ```powershell
 $Env:DB_PRIVATE_IP=$(az network private-endpoint show `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name myPrivateEndpoint `
    --query customDnsConfigs'[0]'.ipAddresses'[0]' `
    --output tsv)

 echo $Env:DB_PRIVATE_IP
 ```
---
