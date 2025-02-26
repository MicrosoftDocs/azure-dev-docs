---
ms.date: 07/15/2022
ms.author: karler
ms.reviewer: seal
author: KarlErickson
---

## Clean up resources

To clean up all resources used during this quickstart, delete the resource group by using the following command:

```azurecli
az group delete \
    --name $AZ_RESOURCE_GROUP \
    --yes
```

## Next steps

To learn more about deploying a Spring Data application to Azure Spring Apps and using managed identity, see [Tutorial: Deploy a Spring application to Azure Spring Apps with a passwordless connection to an Azure database](../deploy-passwordless-spring-database-app.md).

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](../index.yml)
