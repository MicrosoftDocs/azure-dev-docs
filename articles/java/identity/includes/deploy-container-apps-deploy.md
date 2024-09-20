---
author: KarlErickson
ms.author: bappadityams
ms.date: 09/11/2024
---

Deploy the JAR package to Azure Container Apps.

> [!NOTE]
> If necessary, you can specify the JDK version in the [Java build environment variables](java-build-environment-variables.md).

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

You can find more applicable build environment variables in [Java build environment variables](java-build-environment-variables.md).
