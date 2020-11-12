---
title: Tutorial - Deploy to Azure App Service with Jenkins and the Azure CLI
description: Learn how to use Azure CLI to deploy a Java web app to Azure in Jenkins Pipeline
keywords: jenkins, azure, devops, app service, cli
ms.topic: tutorial
ms.date: 11/10/2020 
ms.custom: devx-track-jenkins, devx-track-azurecli
---

# Tutorial: Deploy to Azure App Service with Jenkins and the Azure CLI

[!INCLUDE [solution-template-retirement.md](includes/solution-template-retirement.md)]

To deploy a Java web app to Azure, you can use Azure CLI in a [Jenkins Pipeline](https://jenkins.io/doc/book/pipeline/). In this tutorial, you do the following tasks:

> [!div class="checklist"]
> * Create a Jenkins VM
> * Configure Jenkins
> * Create a web app in Azure
> * Prepare a GitHub repository
> * Create Jenkins pipeline
> * Run the pipeline and verify the web app

## Create and configure Jenkins instance

If you do not already have a Jenkins master, [install Jenkins on a Linux VM](configure-on-linux-vm.md).

The Azure Credential plug-in allows you to store Microsoft Azure service principal credentials in Jenkins. In version 1.2, we added the support so that Jenkins Pipeline can get the Azure credentials. 

Ensure you have version 1.2 or later:

* Within the Jenkins dashboard, click **Manage Jenkins -> Plugin Manager ->** and search for **Azure Credential**. 
* Update the plug-in if the version is earlier than 1.2.

Java JDK and Maven are also required in the Jenkins master. To install, sign in to Jenkins master using SSH and run the following commands:

```bash
sudo apt-get install -y openjdk-7-jdk
sudo apt-get install -y maven
```

## Add Azure service principal to a Jenkins credential

An Azure credential is needed to execute Azure CLI.

* Within the Jenkins dashboard, click **Credentials -> System ->**. Click **Global credentials(unrestricted)**.
* Click **Add Credentials** to add a [Microsoft Azure service principal](/cli/azure/create-an-azure-service-principal-azure-cli?toc=%252fazure%252fazure-resource-manager%252ftoc.json) by filling out the Subscription ID, Client ID, Client Secret, and OAuth 2.0 Token Endpoint. Provide an ID for use in subsequent step.

![Add Credentials](./media/deploy-to-azure-app-service-using-azure-cli/add-credentials.png)

## Create an Azure App Service for deploying the Java web app

Create an Azure App Service plan with the **FREE** pricing tier using the  [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) CLI command. The appservice plan defines the physical resources used to host your apps. All applications assigned to an appservice plan share these resources, allowing you to save cost when hosting multiple apps. 

```azurecli-interactive
az appservice plan create \
    --name myAppServicePlan \ 
    --resource-group myResourceGroup \
    --sku FREE
```

When the plan is ready, the Azure CLI shows similar output to the following example:

```json
{ 
  "adminSiteName": null,
  "appServicePlanName": "myAppServicePlan",
  "geoRegion": "North Europe",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/0000-0000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan",
  "kind": "app",
  "location": "North Europe",
  "maximumNumberOfWorkers": 1,
  "name": "myAppServicePlan",
  ...
  < Output has been truncated for readability >
} 
``` 

### Create an Azure web app

 Use the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) CLI command to create a web app definition in the `myAppServicePlan` App Service plan. The web app definition provides a URL to access your application with and configures several options to deploy your code to Azure. 

```azurecli-interactive
az webapp create \
    --name <app_name> \ 
    --resource-group myResourceGroup \
    --plan myAppServicePlan
```

Substitute the `<app_name>` placeholder with your own unique app name. This unique name is part of the default domain name for the web app, so the name needs to be unique across all apps in Azure. You can map a custom domain name entry to the web app before you expose it to your users.

When the web app definition is ready, the Azure CLI shows information similar to the following example: 

```json 
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app_name>.azurewebsites.net",
  "enabled": true,
   ...
  < Output has been truncated for readability >
}
```

### Configure Java

Set up the Java runtime configuration that your app needs with the  [az appservice web config update](/cli/azure/webapp/config) command.

The following command configures the web app to run on a recent Java 8 JDK and [Apache Tomcat](https://tomcat.apache.org/) 8.0.

```azurecli
az webapp config set \ 
    --name <app_name> \
    --resource-group myResourceGroup \ 
    --java-version 1.8 \ 
    --java-container Tomcat \
    --java-container-version 8.0
```

## Prepare a GitHub repository

1. Open the [Simple Java Web App for Azure](https://github.com/azure-devops/javawebappsample) repo. To fork the repo to your own GitHub account, click the **Fork** button in the top right-hand corner.

1. In GitHub web UI, open **Jenkinsfile** file. Click the pencil icon to edit this file to update the resource group and name of your web app on line 20 and 21 respectively.

    ```java
    def resourceGroup = '<myResourceGroup>'
    def webAppName = '<app_name>'
    ```
    
1. Change line 23 to update credential ID in your Jenkins instance

    ```java
    withCredentials([azureServicePrincipal('<mySrvPrincipal>')]) {
    ```
    
## Create Jenkins pipeline

Open Jenkins in a web browser, click **New Item**.

1. Enter a name for the job.
1. Select **Pipeline**. 
1. Select **OK**.
1. Select **Pipeline**.
1. For **Definition**, select **Pipeline script from SCM**.
1. For **SCM**, select **Git**.
1. Enter the GitHub URL for your forked repo: `https:\<your forked repo\>.git`
1. Select **Save**

## Test your pipeline

1. Go to the pipeline you created
1. Click **Build Now**
1. After the build completes, select **Console Output** to see build details.

## Verify your web app

Do the following to verify the WAR file is deployed successfully to your web app. 

1. Open a web browser:

1. Browse to `http://&lt;app_name>.azurewebsites.net/api/calculator/ping`

1. You should see text similar to the following:

    ```output
    Welcome to Java Web App!!! This is updated!
    Today's date
    ```

1. Go to http://&lt;app_name>.azurewebsites.net/api/calculator/add?x=&lt;x>&y=&lt;y> (substitute &lt;x> and &lt;y> with any numbers) to get the sum of x and y

    ![Calculator: add](./media/deploy-to-azure-app-service-using-azure-cli/calculator-add.png)

## Deploy to Azure Web App on Linux

Once you use Azure CLI in your Jenkins pipeline, modify the script to deploy to an Azure Web App on Linux. Web Apps on Linux supports Docker. As such, you provide a Dockerfile that packages your web app with service runtime into a Docker image. The plug-in builds the image, pushes it to a Docker registry, and deploys the image to your web app.

1. [Create an Azure Web App running on Linux](/azure/app-service/containers/quickstart-nodejs).

1. [Install Docker on your Jenkins](https://docs.docker.com/engine/installation/linux/ubuntu/).

1. [Create a Container Registry in the Azure portal](/azure/container-registry/container-registry-get-started-azure-cli).

1. In the same [Simple Java Web App for Azure](https://github.com/azure-devops/javawebappsample) repo you forked, edit the **Jenkinsfile2** file as follows:

    1. Update to the names of your resource group, web app, and ACR (replacing the placeholders with your values).

        ```bash
        def webAppResourceGroup = '<myResourceGroup>'
        def webAppName = '<app_name>'
        def acrName = '<myRegistry>'
        ```

    1. Update `<azsrvprincipal\>` to your credential ID

        ```bash
        withCredentials([azureServicePrincipal('<mySrvPrincipal>')]) {
        ```

1. Create a new Jenkins pipeline as you did when deploying to Azure web app in Windows using `Jenkinsfile2`.

1. Run your new job.

1. To verify, in Azure CLI, run the following command:

    ```azurecli
    az acr repository list -n <myRegistry> -o json
    ```

    You should see results similar to the following:
    
    ```output
    [
    "calculator"
    ]
    ```
    
1. Browse to `http://<app_name>.azurewebsites.net/api/calculator/ping` (replacing the placeholder). You should see similar results to the following: 

    ```output
    Welcome to Java Web App!!! This is updated!
    Today's date
    ```

1. Browse to `http://<app_name>.azurewebsites.net/api/calculator/add?x=<x>&y=<y>` (replacing the placeholders). The values you specify for `x` and `y` are summed and displayed.
    
## Next steps

> [!div class="nextstepaction"]
> [Jenkins on Azure](/azure/jenkins)