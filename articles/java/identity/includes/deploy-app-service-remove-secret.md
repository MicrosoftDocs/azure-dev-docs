---
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
ms.custom: devx-track-azurecli
---

The *authentication.properties* file of the application currently holds the value of your client secret in the `aad.secret` parameter. It isn't good practice to keep this value in this file. You might also be taking a risk if you commit it to a Git repository.

As an security extra step, you can store this value in [Azure Key Vault](/azure/key-vault/general/basic-concepts) and use [Key Vault References](/azure/app-service/app-service-key-vault-references?tabs=azure-cli) to make it available in your application.

Use the following steps to move the value of `aad.secret` to Key Vault and use it in your code:

1. Use the following commands to create an Azure Key Vault instance:

   ```azurecli
   export RESOURCE_GROUP=<your-resource-group-name>
   export KEY_VAULT=<your-key-vault-name>
   az keyvault create \
       --resource-group $RESOURCE_GROUP \
       --name $KEY_VAULT
   ```

1. Use the following commands to add the secret value of `aad.secret` to your key vault as a new secret:

   ```azurecli
   az keyvault secret set \
       --vault-name $KEY_VAULT \
       --name "AADSECRET" \
       --value "<the-value-of-your-client-secret>"
   ```

1. You now need to give your app access to your key vault. To do this task, first create a new identity for your app by using the following commands:

   ```azurecli
   export WEB_APP_NAME=<your-web-app-name>
   az webapp identity assign \
       --resource-group $RESOURCE_GROUP \
       --name $WEB_APP_NAME
   ```

1. Use the following commands to give this identity `get` and `list` permission on the secrets in your Key Vault:

   ```azurecli
   export IDENTITY=$(az webapp identity show \
       --resource-group $RESOURCE_GROUP \
       --name $WEB_APP_NAME \
       --query principalId \
       --output tsv)
   az keyvault set-policy \
       --resource-group $RESOURCE_GROUP \
       --name $KEY_VAULT \
       --secret-permissions get list \
       --object-id $IDENTITY
   ```

1. Use the following command to create an application setting in your app that uses a key vault reference to the secret in your key vault. This setting makes the value of the secret available to your app as an environment variable.

   ```azurecli
   az webapp config appsettings set \
       --resource-group $RESOURCE_GROUP \
       --name $WEB_APP_NAME \
       --settings AADSECRET='@Microsoft.KeyVault(VaultName=$KEY_VAULT;SecretName=AADSECRET)'
   ```

1. Use the following code to load this value from the environment variables. In the *\src\main\java\com\microsoft\azuresamples\msal4j\helpers\Config.java* file, on line 41, change the current statement to the following line:

   ```java
   public static final String SECRET = System.getenv("AADSECRET");
   ```

1. You can now delete the `aad.secret` key and value from the *authentication.properties* file.

1. Rebuild the code by using the following command:

   ```bash
   mvn clean package
   ```

1. Redeploy the application by using the following command:

   ```bash
   mvn package azure-webapp:deploy
   ```

Your deployment is now complete.
