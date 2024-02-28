---
ms.author: givermei
ms.date: 01/01/2024
---

The *authentication.properties* file of the application currently holds the value of your client secret in the `aad.secret` parameter. It isn't good practice to keep this value in this file. You might also risk committing it to a Git repository. Since this is a secret value it should be treated as such.

As an extra step you can store this value in [Key Vault](/azure/key-vault/general/basic-concepts) and use [Key Vault References](/azure/app-service/app-service-key-vault-references?tabs=azure-cli) to make it available in your web application. You can follow the below steps to move the value of `aad.secret` to Key Vault and use it in your code.

1. Create an Azure Key Vault instance.

   ```azurecli
   RESOURCE_GROUP=<your-resource-group-name>
   KEY_VAULT=<your-key-vault-name>
   az keyvault create \
       --resource-group $RESOURCE_GROUP \
       --name $KEY_VAULT
   ```

1. Add the secret value of `aad.secret` to your Key Vault as a new secret.

   ```azurecli
   az keyvault secret set \
       --vault-name $KEY_VAULT \
       --name "AADSECRET" \
       --value "<the-value-of-your-client-secret>"
   ```

1. You now need to give your web app access to your Key Vault, for this, first create a new identity for your web app.

   ```azurecli
   WEB_APP_NAME=<your-web-app-name>
   az webapp identity assign --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP
   ```

1. You can now give this identity get and list permission on the secrets in your Key Vault.

   ```azurecli
   IDENTITY=$(az webapp identity show \
       --resource-group $RESOURCE_GROUP \
       --name $WEB_APP_NAME \
       --query principalId \
       --output tsv)
   az keyvault set-policy \
       --resource-group $RESOURCE_GROUP \
       --name $KEY_VAULT \
       --secret-permissions get list  \
       --object-id $IDENTITY
   ```

1. You can now create an application setting in your web app that uses a Key Vault reference to the secret in your Key Vault. This setting makes the value of the secret available to your web app as an environment variable.

   ```azurecli
   az webapp config appsettings set \
       --resource-group $RESOURCE_GROUP \
       --name $WEB_APP_NAME \
       --settings AADSECRET='@Microsoft.KeyVault(VaultName=$KEY_VAULT;SecretName=AADSECRET)'
   ```

1. You can now load this value from the environment variables. In the *\src\main\java\com\microsoft\azuresamples\msal4j\helpers\Config.java* file, on line 41, change the current statement to:

   ```java
   public static final String SECRET = System.getenv("AADSECRET");
   ```

1. You can now delete the `aad.secret` key and value from the *authentication.properties* file.

1. Rebuild the code

   ```bash
   mvn clean package
   ```

1. Redeploy the application.

   ```bash
   mvn package azure-webapp:deploy
   ```
