---
author: bmitchell287
ms.author: brendm
ms.reviewer: bbanerjee
ms.date: 08/21/2025
---

Deploy the JAR package to Azure Container Apps.

> [!NOTE]
> If necessary, you can specify the JDK version in the Java build environment variables. For more information, see [Build environment variables for Java in Azure Container Apps](/azure/container-apps/java-build-environment-variables).

Now you can deploy your WAR file with the `az containerapp up` CLI command.

```azurecli
az containerapp up \
    --name $API_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --environment $ENVIRONMENT \
    --artifact <JAR_FILE_PATH_AND_NAME> \
    --ingress external \
    --target-port 8080 \
    --query properties.configuration.ingress.fqdn
```

> [!NOTE]
> The default JDK version is 17. If you need to change the JDK version for compatibility with your application, you can use the `--build-env-vars BP_JVM_VERSION=<YOUR_JDK_VERSION>` argument to adjust the version number.

For more build environment variables, see [Build environment variables for Java in Azure Container Apps](/azure/container-apps/java-build-environment-variables).
