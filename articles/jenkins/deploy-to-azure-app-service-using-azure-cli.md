---
title: Tutorial - Deploy to Azure App Service with Jenkins and the Azure CLI
description: Learn how to use Azure CLI to deploy a Java web app to Azure in Jenkins Pipeline
keywords: jenkins, azure, devops, app service, cli
ms.topic: tutorial
ms.date: 01/06/2021
ms.custom: devx-track-jenkins, devx-track-azurecli, devx-track-extended-java, linux-related-content
---

# Tutorial: Deploy to Azure App Service with Jenkins and the Azure CLI

[!INCLUDE [jenkins-integration-with-azure.md](includes/jenkins-integration-with-azure.md)]

To deploy a Java web app to Azure, you can use Azure CLI in a [Jenkins Pipeline](https://jenkins.io/doc/book/pipeline/). In this tutorial, you do the following tasks:

> [!div class="checklist"]
> * Create a Jenkins VM
> * Configure Jenkins
> * Create a web app in Azure
> * Prepare a GitHub repository
> * Create Jenkins pipeline
> * Run the pipeline and verify the web app

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

- **Jenkins** - [Install Jenkins on a Linux VM](configure-on-linux-vm.md)
- **Azure CLI**: Install Azure CLI (version 2.0.67 or higher) on the Jenkins server.

## Configure Jenkins

The following steps show how to install the required Java JDK and Maven on the Jenkins controller:

1. Sign in to Jenkins controller using SSH.

1. Download and install the Azul Zulu build of OpenJDK for Azure from an apt-get repository:

    ```bash
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 0xB1998361219BD9C9
    sudo apt-add-repository "deb http://repos.azul.com/azure-only/zulu/apt stable main"
    sudo apt-get -q update
    sudo apt-get -y install zulu-8-azure-jdk
    ```
    
1. Run the following command to install Maven:

    ```bash
    sudo apt-get install -y maven
    ```
    
## Add Azure service principal to a Jenkins credential

The following steps show how to specify your Azure credential:

1. Make sure the [Credentials plug-in](https://plugins.jenkins.io/credentials/) is installed.

1. Within the Jenkins dashboard, select **Credentials -> System ->**.

1. Select **Global credentials(unrestricted)**.

1. Select **Add Credentials** to add a [Microsoft Azure service principal](/cli/azure/create-an-azure-service-principal-azure-cli?toc=%252fazure%252fazure-resource-manager%252ftoc.json). Make sure that the credential kind is ***Username with password*** and enter the following items:

    * **Username**: Service principal `appId`
    * **Password**: Service principal `password`
    * **ID**: Credential identifier (such as `AzureServicePrincipal`)

## Create an Azure App Service for deploying the Java web app

Use [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) to create an Azure App Service plan with the **FREE** pricing tier:

```azurecli
az appservice plan create \
    --name <app_service_plan> \ 
    --resource-group <resource_group> \
    --sku FREE
```

**Key points**:

- The appservice plan defines the physical resources used to host your apps.
- All applications assigned to an appservice plan share these resources.
- Appservice plans allow you to save cost when hosting multiple apps.

## Create an Azure web app

Use [az webapp create](/cli/azure/webapp#az-webapp-create) to create a web app definition in the `myAppServicePlan` App Service plan.

```azurecli
az webapp create \
    --name <app_name> \ 
    --resource-group <resource_group> \
    --plan <app_service_plan>
```

**Key points**:

- The web app definition provides a URL to access your application with and configures several options to deploy your code to Azure.
- Substitute the `<app_name>` placeholder with a unique app name.
- The app name is part of the default domain name for the web app. Therefore, the name needs to be unique across all apps in Azure.
- You can map a custom domain name entry to the web app before you expose it to your users.


## Configure Java

Use [az appservice web config update](/cli/azure/webapp/config) to set up the Java runtime configuration for the app:

```azurecli
az webapp config set \ 
    --name <app_name> \
    --resource-group <resource_group> \ 
    --java-version 1.8 \ 
    --java-container Tomcat \
    --java-container-version 8.0
```

## Prepare a GitHub repository

1. Open the [Simple Java Web App for Azure](https://github.com/azure-devops/javawebappsample) repo.

1. Select the **Fork** button to fork the repo to your own GitHub account.

1. Open the **Jenkinsfile** file by clicking on the file name.

1. Select the pencil icon to edit the file.

1. Update the subscription ID and tenant ID.
    
    ```groovy
      withEnv(['AZURE_SUBSCRIPTION_ID=<subscription_id>',
            'AZURE_TENANT_ID=<tenant_id>']) 
    ```
    
1. Update the resource group and name of your web app on line 22 and 23 respectively.

    ```groovy
    def resourceGroup = '<resource_group>'
    def webAppName = '<app_name>'
    ```

1. Update the credential ID in your Jenkins instance

    ```groovy
    withCredentials([usernamePassword(credentialsId: '<service_principal>', passwordVariable: 'AZURE_CLIENT_SECRET', usernameVariable: 'AZURE_CLIENT_ID')]) {
    ```
    
## Create Jenkins pipeline

Do the following to create a Jenkins pipeline:

1. Open Jenkins in a web browser.

1. Select **New Item**.

1. Enter a name for the job.

1. Select **Pipeline**.

1. Select **OK**.

1. Select **Pipeline**.

1. For **Definition**, select **Pipeline script from SCM**.

1. For **SCM**, select **Git**.

1. Enter the GitHub URL for your forked repo: `https:\<forked_repo\>.git`

1. Select **Save**

## Test your pipeline

1. Go to the pipeline you created

1. Select **Build Now**

1. After the build completes, select **Console Output** to see build details.

## Verify your web app

Do the following to verify the WAR file is deployed successfully to your web app:

1. Browse to the following URL: `http://&lt;app_name>.azurewebsites.net/api/calculator/ping`

1. You should see text similar to the following:

    ```output
    Welcome to Java Web App!!! This is updated!
    Today's date
    ```

1. Browse to the following URL (substitute &lt;x> and &lt;y> with two values to be summed): http://&lt;app_name>.azurewebsites.net/api/calculator/add?x=&lt;x>&y=&lt;y>.

    ![Example of running the demo add](./media/deploy-to-azure-app-service-using-azure-cli/calculator-add.png)

## Deploy to Azure App Service on Linux

App Service can also host web apps natively on Linux for supported application stacks. It can also run custom Linux containers (also known as Web App for Containers.)

You can modify the script to deploy to an Azure App Service on Linux. App Service on Linux supports Docker. As such, you provide a Dockerfile that packages your web app with service runtime into a Docker image. The plug-in builds the image, pushes it to a Docker registry, and deploys the image to your web app.

1. Refer to [Migrate custom software to Azure App Service using a custom container](/azure/app-service/tutorial-custom-container?pivots=container-linux#configure-app-service-to-deploy-the-image-from-the-registry) to create an Azure App Service on Linux and an Azure Container Registry.

    ```azurecli
        az group create --name myResourceGroup2 --location westus2
        az acr create --name myACRName --resource-group myResourceGroup2 --sku Basic --admin-enabled true
        az appservice plan create --name myAppServicePlan --resource-group  myResourceGroup2 --is-linux
        az webapp create --resource-group myResourceGroup2 --plan myAppServicePlan --name myApp --deployment-container-image-name myACRName.azurecr.io/calculator:latest
    ```

1. [Install Docker on your Jenkins](https://docs.docker.com/engine/installation/linux/ubuntu/).

1. Make sure [Docker Pipeline plug-in](https://plugins.jenkins.io/docker-workflow/) is installed.

1. In the same [Simple Java Web App for Azure](https://github.com/azure-devops/javawebappsample) repo you forked, edit the **Jenkinsfile2** file as follows:

    1. Update the subscription ID and tenant ID.

        ```groovy
         withEnv(['AZURE_SUBSCRIPTION_ID=<mySubscriptionId>',
                'AZURE_TENANT_ID=<myTenantId>']) {
        ```

    1. Update to the names of your resource group, web app, and ACR (replacing the placeholders with your values).

        ```bash
        def webAppResourceGroup = '<resource_group>'
        def webAppName = '<app_name>'
        def acrName = '<registry>'
        ```

    1. Update `<azsrvprincipal\>` to your credential ID

        ```bash
        withCredentials([usernamePassword(credentialsId: '<service_principal>', passwordVariable: 'AZURE_CLIENT_SECRET', usernameVariable: 'AZURE_CLIENT_ID')]) {
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
