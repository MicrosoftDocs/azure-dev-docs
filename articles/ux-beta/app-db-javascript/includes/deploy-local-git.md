You can deploy your code to Azure from a local Git repository by configuring a remote Git repository in Azure to push code to. Pushing code to Azure via Git requires that you:

* Configure a Git remote in your local repository.
* Configure your Azure web app for local Git deployment.
* Retrieve the deployment credentials for the web app from Azure. These deployment credentials are different than the credentials you use to sign into the Azure portal with. They are auto-generated and scoped to only allow deployment to this web app.

Configuring your Azure web app for local Git deployment and retrieving your credentials can be done in either the Azure portal or using the Azure CLI.

### [Azure portal](#tab/deploy-instructions-azportal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy from VS Code 1](<./deploy-from-local-git-azportal-1.md>)] | :::image type="content" source="../media/deploy-local-git-azportal-1-240px.png" alt-text="A screenshot showing how to navigate to a web app using the search box in Azure portal." lightbox="../media/deploy-local-git-azportal-1.png"::: |
| [!INCLUDE [Deploy from VS Code 2](<./deploy-from-local-git-az-portal-2.md>)] | :::image type="content" source="../media/deploy-local-git-azportal-2-240px.png" alt-text="A screenshot showing te location of the deployment page and how to configure a web app for local Git deployment in the Azure portal." lightbox="../media/deploy-local-git-azportal-2.png"::: |
| [!INCLUDE [Deploy from VS Code 3](<./deploy-from-local-git-az-portal-3.md>)] | :::image type="content" source="../media/deploy-local-git-azportal-3-240px.png" alt-text="A screenshot of the Azure portal showing the Git URL to push code to for local Git deployments." lightbox="../media/deploy-local-git-azportal-3.png"::: |
| [!INCLUDE [Deploy from VS Code 3](<./deploy-from-local-git-az-portal-4.md>)] | :::image type="content" source="../media/deploy-local-git-azportal-4-240px.png" alt-text="A screenshot of the Azure portal showing where to retrieve the deployment credentials for local Git deployment." lightbox="../media/deploy-local-git-azportal-4.png"::: |

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

Next, you need to add a [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) that points to Azure where you will deploy your code to. In the root directory of your application, run the following command:

```bash
git remote add azure <deploymentLocalGitUrl-from-create-step>
```

To deploy your application to Azure, use the `git push` command to push code from your local `main` branch to the `azure` remote. The first time you push your code to Azure, Git will prompt you for the credentials to connect to the remote repository.  Enter the Azure deployment credentials you retrieved above.  Git will cache these credentials so you will not have to re-enter them on subsequent deployments.

```bash
git push azure main
```
