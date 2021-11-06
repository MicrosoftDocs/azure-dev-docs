You can deploy your application code from a local Git repository to Azure by configuring a [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) in your local repo pointing at Azure to push code to. The URL of the remote repository and Git credentials can needed for configuration can be retrieved using either the Azure portal or the Azure CLI.

### [Azure portal](#tab/deploy-instructions-azportal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy local Git Azure portal 1](<./deploy-local-git/azure-portal-1.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-local-git/azure-portal-1-240px.png" alt-text="A screenshot showing how to locate your App Service using the search toolbar at the top of the Azure portal." lightbox="../../media/quickstart-python/deploy-local-git/azure-portal-1.png"::: |
| [!INCLUDE [Deploy local Git Azure portal 2](<./deploy-local-git/azure-portal-2.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-local-git/azure-portal-2-240px.png" alt-text="A screenshot showing how to navigate to the deployment center in App Service and select Local Git as the deployment method." lightbox="../../media/quickstart-python/deploy-local-git/azure-portal-2.png"::: |
| [!INCLUDE [Deploy local Git Azure portal 3](<./deploy-local-git/azure-portal-3.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-local-git/azure-portal-3-240px.png" alt-text="A screenshot showing the deployment center after saving and the remote Git URL to use for deployments." lightbox="../../media/quickstart-python/deploy-local-git/azure-portal-3.png"::: |
| [!INCLUDE [Deploy local Git Azure portal 4](<./deploy-local-git/azure-portal-4.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-local-git/azure-portal-4-240px.png" alt-text="A screenshot showing the location of the deployment credentials in the deployment center in App Service." lightbox="../../media/quickstart-python/deploy-local-git/azure-portal-4.png"::: |

### [Azure CLI](#tab/deploy-instructions-azcli)

First, you need to tell Azure what branch to use for deployment. This value is stored in the app settings for the web app with a key of `DEPLOYMENT_BRANCH`. For this example, you will be deploying code from the `main` branch.

```azurecli
az webapp config appsettings set \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --settings DEPLOYMENT_BRANCH='main'
```

Next, configure the deployment source for your web app to be local Git using the `az webapp deployment source` command.  This command will output the URL of the remote Git repository that you will be pushing code to.  Make a copy of this value as you will need it in a later step.

```azurecli
az webapp deployment source config-local-git \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --output tsv
```

Retrieve the deployment credentials for your application.  These will be needed for Git to authenticate to Azure when you push code to Azure in a later step.

```azurecli
az webapp deployment list-publishing-credentials \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query "{Username:join(\`\u005C\`, [name,publishingUserName]), Password:publishingPassword}" \
    --output table
```

---

Next, in the root directory of your application, configure a [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) that points to Azure using the Git URL of the Azure remote obtained in a previous step.

```bash
git remote add azure <git-deployment-url>
```

Now you can push code from your local Git repository to Azure using the Git remote you just configured. The first time you push code to Azure, Git will prompt you for the Azure deployment credentials you obtained in a previous step. Git will then cache these credentials so you will not have to re-enter them on subsequent deployments.

```bash
git push azure main
```
