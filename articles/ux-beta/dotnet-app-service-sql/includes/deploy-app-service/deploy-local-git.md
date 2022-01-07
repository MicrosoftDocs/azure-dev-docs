You can deploy your application code from a local Git repository to Azure by configuring a [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) in your local repo pointing at your Azure App Service. The URL of the remote repository and Git credentials needed for configuration can be retrieved using either the Azure portal or the Azure CLI.

### [Azure portal](#tab/deploy-instructions-azportal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy from Local Git 1](<./deploy-from-local-git-azportal-1.md>)] | :::image type="content" source="../../media/azportal-deploy-local-git-01-240px.png" alt-text="A screenshot showing how to navigate to a web app using the search box in Azure portal." lightbox="../../media/azportal-deploy-local-git-01.png"::: |
| [!INCLUDE [Deploy from Local Git 2](<./deploy-from-local-git-azportal-2.md>)] | :::image type="content" source="../../media/azportal-deploy-local-git-02-240px.png" alt-text="A screenshot showing te location of the deployment page and how to configure a web app for local Git deployment in the Azure portal." lightbox="../../media/azportal-deploy-local-git-02.png"::: |
| [!INCLUDE [Deploy from Local Git 3](<./deploy-from-local-git-azportal-3.md>)] | :::image type="content" source="../../media/azportal-deploy-local-git-03-240px.png" alt-text="A screenshot of the Azure portal showing the Git URL to push code to for local Git deployments." lightbox="../../media/azportal-deploy-local-git-03.png"::: |

### [Azure CLI](#tab/deploy-instructions-azcli)

Next, configure the deployment source for your web app to be local Git using the `az webapp deployment source` command.  This command will output the URL of the remote Git repository that you will be pushing code to.  Make a copy of this value as you will need it in a later step.

```azurecli
az webapp deployment source config-local-git \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --output tsv
```

Retrieve the deployment credentials for your application. These will be needed for Git to authenticate to Azure when you push code to Azure in a later step.

```azurecli
az webapp deployment list-publishing-credentials 
        --name <app-service-name> 
        --resource-group msdocs-core-sql
        --query "{Username:join(`u005C`, [name,publishingUserName]), Password:publishingPassword}"
```

---

Next, let's add an Azure origin to our local Git repo using the App Service Git deployment URL from the step where we created our App Service.  Make sure to replace your app name in the url below.  You can also get this completed URL from the Azure Portal Local Git/FTPS Credentials tab.

```bash
git remote add azure https://<app-name>.scm.azurewebsites.net/<your-app-name>.git
```

Finally, push your code using the correct origin and branch name.

```bash
## Master is the default deployment branch for App Service - this will ensure our local main branch works for the deployment
git push azure main:master
```

Enter your password if you are prompted to do so. This command will take a moment to run as it deploys your app code to the Azure App Service.