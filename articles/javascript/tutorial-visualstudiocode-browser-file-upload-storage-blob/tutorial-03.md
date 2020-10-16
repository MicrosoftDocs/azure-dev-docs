---
title: include file tutorial-03.md
description: include file tutorial-03.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---

In this section of the tutorial, you create the Azure Storage resource with a Visual Studio extension then configure the resource with Azure CLI commands for file upload. 

## Sign in to Azure

[!INCLUDE [azure-sign-in](../includes/azure-sign-in.md)]

## Create Storage resource 

Use the Visual Studio Code extension to create a Storage resource. 

1. Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.

    :::image type="content" source="../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource.png" alt-text="Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.":::

1. Follow the prompts using the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `fileuploadyourname`, for your Storage resource name. Replace `yourname` with your lowercase name or unique ID. This unique name is also used as part of the URL to access the resource in a browser. Use only characters and numbers, up to 24 in length. You need this **account name** to use the Azure CLI scripts later.<br>Each Azure resource resides in an Azure resource group. This is a logical group to help you manage resources. That management can be all resources within a project or team, as an example. This resource is created in a resource group with the same name. |

1. When the app creation process is complete, a notification appears with information about the new resource. 

    :::image type="content" source="../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource-complete.png" alt-text="When the app creation process is complete, a notification appears with information about the new resource.":::

1. Right-click on the resource in the Azure Storage extension, select **Copy Primary Key**. You will need this **Storage account key** later.

## Set storage account key in code file

Set the resource name in `src/uploadToBlob.ts` for the storageAccountName value. 

```typescript
const storageAccountName = ''; // Fill string with your Storage resource name
```

## Generate your shared access signature (SAS) token with Azure CLI

Generate the SAS token before configuring CORS. 

You can configure a SAS Token for your resource with , [Azure CLI](/cli/azure/storage/account?view=azure-cli-latest#az_storage_account_generate_sas), and the Azure Portal. 

1. Sign in with the Azure CLI using the following command at a terminal:

    ```azurecli
    az login
    ```

    In the response, find the **subscription ID**, you will need it later. 

1. Use the following command to create as [Azure CLI command to generate your Storage SAS token](/cli/azure/storage/account?view=azure-cli-latest#az_storage_account_generate_sas) set with the [required parameters](/cli/azure/storage/account?view=azure-cli-latest#az_storage_account_generate_sas-required-parameters) and [optional parameters](/cli/azure/storage/account?view=azure-cli-latest#az_storage_account_generate_sas-optional-parameters). Replace the following values with your own values: 

    | Property|Value|
    |--|--|
    |YOUR-EXPIRY-DATE|Expiry date set to the `end` environment variable - a date when the SAS token expires in the format of `YYYY-MM-DDTHH:MMZ`. Enter a date 24 hours from now. You don't need to surround it with quotes to mark it as a string. An example is `2021-12-30T12:00Z`.|
    |YOUR-RESOURCE-PRIMARY-KEY|Storage Account primary key|
    |YOUR-RESOURCE-NAME|Storage account name (resource name)|
    |YOUR-SUBSCRIPTION-ID| Subscription ID|

    ```azurecli
    az storage account generate-sas --expiry YOUR-EXPIRY-DATE \
    --permissions cdlruwap \
    --resource-types sco \
    --services b \
    --account-key YOUR-RESOURCE-PRIMARY-KEY \
    --account-name YOUR-RESOURCE-NAME \
    --subscription YOUR-SUBSCRIPTION-ID
    ```

    > [!CAUTION]
    > If you are not using a Bash shell, replace the line continuation character, `\`, with the appropriate character for your terminal. 

## Set SAS token in code file

1. The response is a quoted string. Copy the string contents into `src/uploadToBlob.ts` for the sasToken value. 

    ```typescript
    const sasToken = ''; // Fill string with your SAS token
    ```

    You need to use the token value as part of the next Azure CLI command.

## Configure your Azure Storage resource for CORS with Azure CLI

Configure CORS for your resource with the following [Azure CLI](/cli/azure/storage/cors?view=azure-cli-latest) script. 

1. If you some time has passed since you completed the previous section, sign in with the Azure CLI, using the following command at a terminal:

    ```azurecli
    az login
    ```

    In the response, find the subscription ID, you will need it later. 

1. Use the following [Azure CLI command to add a CORS rule](/cli/azure/storage/cors?view=azure-cli-latest#az_storage_cors_add) to your Storage resource set with the [required parameters](/cli/azure/storage/cors?view=azure-cli-latest#az_storage_cors_add-required-parameters) and [optional parameters](/cli/azure/storage/cors?view=azure-cli-latest#az_storage_cors_add-optional-parameters). Replace the following values with your own values: 

    | Property|Value|
    |--|--|
    |YOUR-RESOURCE-NAME|Storage account name (resource name)|
    |YOUR-SUBSCRIPTION-ID| Subscription ID|
    |YOUR-SAS-TOKEN|Your SAS token returned from the previous section. Make sure to have quotes surrounding the token."|

    ```azurecli
    az storage cors add --methods DELETE GET HEAD MERGE OPTIONS POST PUT \
        --origins * \
        --services b \
        --allowed-headers * \
        --exposed-headers * \
        --max-age 86400 \
        --timeout 86400 \
        --account-key  \
        --account-name YOUR-RESOURCE-NAME \
        --subscription YOUR-SUBSCRIPTION-ID \
        --sas-token "YOUR-SAS-TOKEN"
    ```

    > [!CAUTION]
    > If you are not using a Bash shell, replace the line continuation character, `\`, with the appropriate character for your terminal. 

    The command doesn't return any results.

## Run project locally to verify connection to Storage account

If you followed these steps, your SAS token and storage account name are set in the `src/uploadToBlob.ts` file, so you are ready to run the application.

1. From the Visual Studio Code terminal, enter the following command:

    ```javascript
    npm start
    ```

1. When the terminal displays the URL, such as `http://localhost:3000`, your app is ready. Open a browser and enter that URL. The website connected to Azure Storage blobs should display with a file selection button and a file upload button. 

    :::image type="content" source="../media/tutorial-browser-file-upload/browser-react-app-azure-storage-resource-configured-upload-button-displayed.png" alt-text="The React website connected to Azure Storage blobs should display with a file selection button and a file upload button.":::

1. Select an image from the `images` folder to upload. The `spring-flowers.jpg` are a good visual for this test. The select the **Upload!** button. 

    The React front-end client code calls into the `[src/uploadToBlob.ts](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob/blob/main/src/uploadToBlob.ts)` to authenticate to Azure, then create a Storage Container, the upload the blob to that container. 

## Want to know more? 

If you want to see your subscription list, use [this link into the Azure portal Subscription list](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) for your account. 

Other configuration options include:
* SAS Token with [PowerShell](/powershell/module/azure.storage/new-azurestorageblobsastoken)
* SAS Token with Portal
* CORS with [PowerShell](/powershell/module/azure.storage/set-azurestoragecorsrule)
* CORS with Portal