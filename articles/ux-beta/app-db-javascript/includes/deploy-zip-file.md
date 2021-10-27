Applications can be deployed to Azure by creating a ZIP file of the application artifacts and uploading the ZIP file to Azure. ZIP files can be uploaded to Azure using the Azure CLI or a HTTP client like [curl](https://curl.se/).

There are two approaches of deploying a ZIP file to Azure:

* Deploying a ZIP file that contains all artifacts (such as node_modules) needed for the application.
* Deploying a ZIP file only containing the application source code and making use of Azure's build automation.

Deploying a ZIP file only containing application source requires you to set a flag to enable Azure's build automation, which is covered at the end of this section.

#### Create a ZIP file of your application

First, create a ZIP file of your application. You only need to include needed components of the application. You do not need to include any files or directories that start with a dot (`.`) such as `.env`, `.gitignore`, `.github`, or `.vscode`.

##### [Linux/Mac](#tab/deploy-zip-linux-mac)

On Linux or Mac, you can use the built in `zip` utility to create a ZIP file.

```bash
zip -r <file-name>.zip . -x '.??*'
```

##### [Windows](#tab/deploy-zip-windows)

On Windows, use a program like 7-Zip to create a ZIP file needed to deploy the application.

![A screenshot showing files being zipped into a ZIP file using 7-Zip.](./media/deploy-zip-file-windows-1.png)

---

#### Upload the ZIP file to Azure

Once you have a ZIP file, the file can be uploaded to Azure using either Azure CLI or an HTTP client.

##### [Azure CLI](#tab/deploy-instructions--zip-azcli)

```azurecli
az webapp deploy \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME  \
    --src-path <zip-file-path>
```

##### [curl](#tab/deploy-instructions--zip-curl)

```bash
curl -X POST \
    -u <username> \
    --data-binary @"<zip-package-path>" https://<app-name>.scm.azurewebsites.net/api/publish&type=zip
```

---

#### Enable build automation (if required)

By default, the deployment engine assumes that a ZIP package is ready to run as-is and doesn't run any build automation. To enable build automation, set the `SCM_DO_BUILD_DURING_DEPLOYMENT` app setting in either the Azure Portal or Azure CLI.

##### [Azure portal](#tab/deploy-instructions-azportal)

Coming soon

##### [Azure CLI](#tab/deploy-instructions-azcli)

```azurecli
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $APP_SERVICE_NAME \
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

---
