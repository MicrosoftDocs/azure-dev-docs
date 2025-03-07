---
title: Deploy apps to Azure Spring Apps using Jenkins and Azure CLI
description: Learn how to use Azure CLI in a continuous integration and deployment pipeline to deploy microservices to Azure Spring Apps service
keywords: jenkins, azure, devops, azure spring apps, azure cli
ms.topic: tutorial
ms.date: 01/28/2022
ms.custom: devx-track-jenkins, devx-track-azurecli, devx-track-extended-java
---

# Tutorial: Deploy apps to Azure Spring Apps using Jenkins and the Azure CLI

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

[Azure Spring Apps](/azure/spring-apps/overview) is a fully managed microservice development with built-in service discovery and configuration management. The service makes it easy to deploy Spring Boot-based microservice applications to Azure. This tutorial demonstrates how you can use Azure CLI in Jenkins to automate continuous integration and delivery (CI/CD) for Azure Spring Apps.

In this tutorial, you'll complete these tasks:

> [!div class="checklist"]
> * Provision a service instance and launch a Java Spring application
> * Prepare your Jenkins server
> * Use the Azure CLI in a Jenkins pipeline to build and deploy the microservice applications 

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- **Jenkins**: [Install Jenkins on a Linux VM](configure-on-linux-vm.md)
- **GitHub account**: If you don't have a GitHub account, create a [free account](https://github.com/) before you begin.

## Provision a service instance and launch a Java Spring application

We use [Piggy Metrics](https://github.com/Azure-Samples/piggymetrics) as the sample Microsoft service application and follow the same steps in [Quickstart: Launch a Java Spring application using the Azure CLI](/azure/spring-apps/quickstart-deploy-infrastructure-vnet-azure-cli) to provision the service instance and set up the applications. If you've already gone through the same process, you can skip to the next section. Otherwise, included in the following are the Azure CLI commands. Refer to [Quickstart: Launch a Java Spring application using the Azure CLI](/azure/spring-apps/quickstart?tabs=Azure-CLI) to get more information.

Your local machine needs to meet the same prerequisite as the Jenkins build server. Make sure the following are installed to build and deploy the microservice applications:

* [Git](https://git-scm.com/)
* [JDK 8](/java/azure/jdk)
* [Maven 3.0 or above](https://maven.apache.org/download.cgi)
* [Azure CLI installed](/cli/azure/install-azure-cli), version 2.0.67 or higher

1. Install the Azure Spring Apps extension:

    ```azurecli
    az extension add --name spring
    ```

1. Create a resource group to contain your Azure Spring Apps service:

    ```azurecli
    az group create --location eastus --name <resource group name>
    ```

1. Provision an instance of Azure Spring Apps:

    ```azurecli
    az spring create -n <service name> -g <resource group name>
    ```

1. Fork the [Piggy Metrics](https://github.com/Azure-Samples/piggymetrics) repo to your own GitHub account. In your local machine, clone your repo in a directory called `source-code`:

    ```bash
    mkdir source-code
    git clone https://github.com/<your GitHub id>/piggymetrics
    ```

1. Set up your configuration server. Make sure you replace &lt;your GitHub id&gt; with the correct value.

    ```azurecli
    az spring config-server git set -n <your-service-name> --uri https://github.com/<your GitHub id>/piggymetrics --label config
    ```

1. Build the project:

    ```bash
    cd piggymetrics
    mvn clean package -D skipTests
    ```

1. Create the three microservices: **gateway**, **auth-service**, and **account-service**:

    ```azurecli
    az spring app create --n gateway -s <service name> -g <resource group name>
    az spring app create --n auth-service -s <service name> -g <resource group name>
    az spring app create --n account-service -s <service name> -g <resource group name>
    ```

1. Deploy the applications:

    ```azurecli
    az spring app deploy -n gateway -s <service name> -g <resource group name> --jar-path ./gateway/target/gateway.jar
    az spring app deploy -n account-service -s <service name> -g <resource group name> --jar-path ./account-service/target/account-service.jar
    az spring app deploy -n auth-service -s <service name> -g <resource group name> --jar-path ./auth-service/target/auth-service.jar
    ```

1. Assign public endpoint to gateway:

    ```azurecli
    az spring app update -n gateway -s <service name> -g <resource group name> --is-public true
    ```

1. Query the gateway application to get the url so that you can verify that the application is running.

    ```azurecli
    az spring app show --name gateway | grep url
    ```
    
 1. Navigate to the URL provided by the previous command to run the PiggyMetrics application.

## Prepare Jenkins server

In this section, you prepare the Jenkins server to run a build, which is fine for testing. However, because of security implication, you should use an [Azure VM agent](https://plugins.jenkins.io/azure-vm-agents) or [Azure Container agent](https://plugins.jenkins.io/azure-container-agents) to spin up an agent in Azure to run your builds.

### Install plug-ins

1. Log in to your Jenkins server. 

1. Select **Manage Jenkins**.

1. Select **Manage Plugins**.

1. On the **Available** tab, select the following plug-ins:

    * [GitHub Integration](https://plugins.jenkins.io/github-pullrequest)
    * [Azure Credential](https://plugins.jenkins.io/azure-credentials)

    If these plug-ins don't appear in the list, check the **Installed** tab to see if they're already installed.

1. To install the plug-ins, select **Download now and install after restart**.

1. Restart your Jenkins server to complete the installation.

### Add your Azure Service Principal credential in Jenkins credential store

1. You need an Azure Service Principal to deploy to Azure. For more information, see the [Create service principal](./deploy-to-azure-app-service-using-azure-cli.md#add-azure-service-principal-to-a-jenkins-credential) section in the Deploy to Azure App Service tutorial. The output from `az ad sp create-for-rbac` looks something like this:

    ```
    {
        "appId": "xxxxxx-xxx-xxxx-xxx-xxxxxxxxxxxx",
        "displayName": "xxxxxxxjenkinssp",
        "name": "http://xxxxxxxjenkinssp",
        "password": "xxxxxx-xxx-xxxx-xxx-xxxxxxxxxxxx",
        "tenant": "xxxxxx--xxx-xxxx-xxx-xxxxxxxxxxxx"
    }
    ```

1. On the Jenkins dashboard, select **Credentials** > **System**. Then, select **Global credentials(unrestricted)**.

1. Select **Add Credentials**.

1. Select **Microsoft Azure Service Principal** as kind.

1. Supply values for the following fields:

    - **Subscription ID**: Azure subscription ID
    - **Client ID**: Service principal appid
    - **Client Secret**: Service principal password
    - **Tenant ID**: Microsoft account tenant ID
    - **Azure Environment**: Select the appropriate value for your environment. For example, use **Azure** for Azure Global
    - **ID**: Set as `azure_service_principal`. We use this ID in a later step in this article
    - **Description**: This value is optional, but recommended from a documentation/maintenance standpoint.
    
### Install Maven and Azure CLI spring extension

The sample pipeline uses Maven to build and Azure CLI to deploy to the service instance. When Jenkins is installed, it creates an admin account named *jenkins*. Ensure that the user *jenkins* has permission to run the spring extension.

1. Connect to the Jenkins controller via SSH.

1. Install Maven.

    ```bash
    sudo apt-get install maven
    ```

1. Verify that the Azure CLI is installed by entering `az version`. If the Azure CLI isn't installed, see [Installing the Azure CLI](/cli/azure/install-azure-cli).

1. Switch to the `jenkins` user:

    ```bash
    sudo su jenkins
    ```

1. Install the spring extension:

    ```azurecli
    az extension add --name spring
    ```

## Create a Jenkinsfile

1. In your own repo - `https://github.com/your_github_id/piggymetrics` - create a **Jenkinsfile** in the root.

1. Update the file as follows. Make sure you replace the values of **\<resource group name>** and **\<service name>**. Replace **azure_service_principal** with the right ID if you use a different value when you added the credential in Jenkins.

   ```groovy
       node {
         stage('init') {
           checkout scm
         }
         stage('build') {
           sh 'mvn clean package'
         }
         stage('deploy') {
           withCredentials([azureServicePrincipal('azure_service_principal')]) {
             // Log in to Azure
             sh '''
               az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
               az account set -s $AZURE_SUBSCRIPTION_ID
             '''  
             // Set default resource group name and service name. Replace <resource group name> and <service name> with the right values
             sh 'az config set defaults.group=<resource group name>'
             sh 'az config set defaults.spring=<service name>'

             // Deploy applications
             sh 'az spring app deploy -n gateway --jar-path ./gateway/target/gateway.jar'
             sh 'az spring app deploy -n account-service --jar-path ./account-service/target/account-service.jar'
             sh 'az spring app deploy -n auth-service --jar-path ./auth-service/target/auth-service.jar'
             sh 'az logout'
           }
         }
       }
   ```

1. Save and commit the change.

## Create the job

1. On the Jenkins dashboard, select **New Item**.

1. Provide a name, *Deploy-PiggyMetrics* for the job and select **Pipeline**. Click OK.

1. Select the **Pipeline** tab.

1. For **Definition**, select **Pipeline script from SCM**.

1. For **SCM**, select **Git**.

1. Enter the GitHub URL for your forked repo: `https://github.com/&lt;your GitHub id&gt;/piggymetrics.git`.

1. For **Branch Specifier (black for 'any')**, select **/Azure**.

1. For **Script path**, select **Jenkinsfile**.

1. Select **Save**

## Validate and run the job

Before running the job, edit the text in the login input box to **enter login ID**.

1. In your repo, open `index.html` in `/gateway/src/main/resources/static/`.

1. Search for `enter your login` and update that text to `enter login ID`.

    ```HTML
    <input class="frontforms" id="frontloginform" name="username" placeholder="enter login ID" type="text" autocomplete="off"/>
    ```

1. Save and commit the change.

1. Run the job in Jenkins manually. On the Jenkins dashboard, select the job `Deploy-PiggyMetrics` and then select **Build Now**.

After the job is complete, navigate to the public IP of the `gateway` application and verify that your application has been updated.

![Updated Piggy Metrics](./media/deploy-to-azure-spring-apps-using-azure-cli/piggymetrics.png)

## Clean up resources

When no longer needed, delete the resources created in this article:

```azurecli
az group delete -y --no-wait -n <resource group name>
```

## Next steps

> [!div class="nextstepaction"]
> [Jenkins on Azure](/azure/jenkins/)
