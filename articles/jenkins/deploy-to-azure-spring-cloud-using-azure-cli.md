---
title: Deploy apps to Azure Spring Cloud using Jenkins and Azure CLI
description: Learn how to use Azure CLI in a continuous integration and deployment pipeline to deploy microservices to Azure Spring Cloud service
keywords: jenkins, azure, devops, azure spring cloud, azure cli
ms.topic: tutorial
ms.date: 08/10/2020 
ms.custom: devx-track-azurecli,devx-track-jenkins
---

# Tutorial: Deploy apps to Azure Spring Cloud using Jenkins and the Azure CLI

[Azure Spring Cloud](/spring-cloud/spring-cloud-overview) is a fully managed microservice development with built-in service discovery and configuration management. The service makes it easy to deploy Spring Boot-based microservice applications to Azure. This tutorial demonstrates how you can use Azure CLI in Jenkins to automate continuous integration and delivery (CI/CD) for Azure Spring Cloud.

In this tutorial, you'll complete these tasks:

> [!div class="checklist"]
> * Provision a service instance and launch a Java Spring application
> * Prepare your Jenkins server
> * Use the Azure CLI in a Jenkins pipeline to build and deploy the microservice applications 

>[!Note]
> Azure Spring Cloud is currently offered as a public preview. Public preview offerings allow customers to experiment with new features prior to their official release.  Public preview features and services are not meant for production use.  For more information about support during previews, please review our [FAQ](https://azure.microsoft.com/support/faq/) or file a [Support request](/azure-supportability/how-to-create-azure-support-request) to learn more.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

**Jenkins**: [Install Jenkins on a Linux VM](configure-on-linux-vm.md)

**GitHub account**: If you don't have a GitHub account, create a [free account](https://github.com/) before you begin.

## Provision a service instance and launch a Java Spring application

We use [Piggy Metrics](https://github.com/Azure-Samples/piggymetrics) as the sample Microsoft service application and follow the same steps in [Quickstart: Launch a Java Spring application using the Azure CLI](/spring-cloud/spring-cloud-quickstart-launch-app-cli.md) to provision the service instance and set up the applications. If you have already gone through the same process, you can skip to the next section. Otherwise, included in the following are the Azure CLI commands. Refer to [Quickstart: Launch a Java Spring application using the Azure CLI](/spring-cloud/spring-cloud-quickstart-launch-app-cli.md) to get additional background information.

Your local machine needs to meet the same prerequisite as the Jenkins build server. Make sure the following are installed to build and deploy the microservice applications:
    * [Git](https://git-scm.com/)
    * [JDK 8](/java/azure/jdk/?view=azure-java-stable)
    * [Maven 3.0 or above](https://maven.apache.org/download.cgi)
    * [Azure CLI installed](/cli/azure/install-azure-cli?view=azure-cli-latest), version 2.0.67 or higher

1. Install the Azure Spring Cloud extension:

    ```Azure CLI
    az extension add --name spring-cloud
    ```

1. Create a resource group to contain your Azure Spring Cloud service:

    ```Azure CLI
    az group create --location eastus --name <resource group name>
    ```

1. Provision an instance of Azure Spring Cloud:

    ```Azure CLI
    az spring-cloud create -n <service name> -g <resource group name>
    ```

1. Fork the [Piggy Metrics](https://github.com/Azure-Samples/piggymetrics) repo to your own GitHub account. In your local machine, clone your repo in a directory called `source-code`:

    ```bash
    mkdir source-code
    git clone https://github.com/<your GitHub id>/piggymetrics
    ```

1. Set up your configuration server. Make sure you replace &lt;your GitHub id&gt; with the correct value.

    ```Azure CLI
    az spring-cloud config-server git set -n <your-service-name> --uri https://github.com/<your GitHub id>/piggymetrics --label config
    ```

1. Build the project:

    ```bash
    cd piggymetrics
    mvn clean package -D skipTests
    ```

1. Create the three microservices: **gateway**, **auth-service**, and **account-service**:

    ```Azure CLI
    az spring-cloud app create --n gateway -s <service name> -g <resource group name>
    az spring-cloud app create --n auth-service -s <service name> -g <resource group name>
    az spring-cloud app create --n account-service -s <service name> -g <resource group name>
    ```

1. Deploy the applications:

    ```Azure CLI
    az spring-cloud app deploy -n gateway -s <service name> -g <resource group name> --jar-path ./gateway/target/gateway.jar
    az spring-cloud app deploy -n account-service -s <service name> -g <resource group name> --jar-path ./account-service/target/account-service.jar
    az spring-cloud app deploy -n auth-service -s <service name> -g <resource group name> --jar-path ./auth-service/target/auth-service.jar
    ```

1. Assign public endpoint to gateway:

    ```Azure CLI
    az spring-cloud app update -n gateway -s <service name> -g <resource group name> --is-public true
    ```

1. Query the gateway application to get the url so that you can verify that the application is running.

    ```Azure CLI
    az spring-cloud app show --name gateway | grep url
    ```
    
 1. Navigate to the URL provided by the previous command to run the PiggyMetrics application.

## Prepare Jenkins server

In this section, you prepare the Jenkins server to run a build, which is fine for testing. However, because of security implication, you should use an [Azure VM agent](https://plugins.jenkins.io/azure-vm-agents) or [Azure Container agent](https://plugins.jenkins.io/azure-container-agents) to spin up an agent in Azure to run your builds. For more information, see the Jenkins article on the [security implications of building on master](https://wiki.jenkins.io/display/JENKINS/Security+implication+of+building+on+master).

### Install plug-ins

1. Sign in to your Jenkins server. Choose **Manage Jenkins > Manage Plugins**.

1. On the **Available** tab, select the following plug-ins:

    * [GitHub Integration](https://plugins.jenkins.io/github-pullrequest)
    * [Azure Credential](https://plugins.jenkins.io/azure-credentials)

    If these plug-ins don't appear in the list, check the **Installed** tab to see if they're already installed.

1. To install the plug-ins, choose **Download now and install after restart**.

1. Restart your Jenkins server to complete the installation.

### Add your Azure Service Principal credential in Jenkins credential store

1. You need an Azure Service Principal to deploy to Azure. For more information, see the [Create service principal](deploy-from-github-to-azure-app-service.md#create-service-principal) section in the Deploy to Azure App Service tutorial. The output from `az ad sp create-for-rbac` looks something like this:

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
    - **Description**: This is optional, but recommended.
    
### Install Maven and Az CLI spring-cloud extension

The sample pipeline uses Maven to build and Az CLI to deploy to the service instance. When Jenkins is installed, it creates an admin account named *jenkins*. Ensure that the user *jenkins* has permission to run the spring-cloud extension.

1. Connect to the Jenkins master via SSH.

1. Install Maven.

    ```bash
    sudo apt-get install maven
    ```

1. Verify that the Azure CLI is installed by entering `az version`. If the Azure CLI is not installed, see [Installing the Azure CLI](/cli/azure/install-azure-cli).

1. Switch to the `jenkins` user:

    ```bash
    sudo su jenkins
    ```

1. Add the **spring-cloud** extension:

    ```bash
    az extension add --name spring-cloud
    ```

## Create a Jenkinsfile

1. In your own repo (https://github.com/&lt;your GitHub id&gt;/piggymetrics), create a **Jenkinsfile** in the root.

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
             // login to Azure
             sh '''
               az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
               az account set -s $AZURE_SUBSCRIPTION_ID
             '''  
             // Set default resource group name and service name. Replace <resource group name> and <service name> with the right values
             sh 'az configure --defaults group=<resource group name>'
             sh 'az configure --defaults spring-cloud=<service name>'
             // Deploy applications
             sh 'az spring-cloud app deploy -n gateway --jar-path ./gateway/target/gateway.jar'
             sh 'az spring-cloud app deploy -n account-service --jar-path ./account-service/target/account-service.jar'
             sh 'az spring-cloud app deploy -n auth-service --jar-path ./auth-service/target/auth-service.jar'
             sh 'az logout'
           }
         }
       }
   ```

1. Save and commit the change.

## Create the job

1. On the Jenkins dashboard, click **New Item**.

1. Provide a name, *Deploy-PiggyMetrics* for the job and select **Pipeline**. Click OK.

1. Click the **Pipeline** tab next.

1. For **Definition**, select **Pipeline script from SCM**.

1. For **SCM**, select **Git**.

1. Enter the GitHub URL for your forked repo: **https://github.com/&lt;your GitHub id&gt;/piggymetrics.git**

1. Make sure **Branch Specifier (black for 'any')** is ***/Azure**

1. Keep **Script path** as **Jenkinsfile**

1. Click **Save**

## Validate and run the job

Before running the job, let's update the text in the login input box to **enter login ID**.

1. In your own repo, open `index.html` in **/gateway/src/main/resources/static/**

1. Search for "enter your login" and update to "enter login ID"

    ```HTML
    <input class="frontforms" id="frontloginform" name="username" placeholder="enter login ID" type="text" autocomplete="off"/>
    ```

1. Commit the changes

1. Run the job in Jenkins manually. On the Jenkins dashboard, click the job *Deploy-PiggyMetrics* and then **Build Now**.

After the job is complete, navigate to the public IP of the **gateway** application and verify that your application has been updated. 

![Updated Piggy Metrics](./media/deploy-to-azure-spring-cloud-using-azure-cli/piggymetrics.png)

## Clean up resources

When no longer needed, delete the resources created in this article:

```bash
az group delete -y --no-wait -n <resource group name>
```

## Next steps

> [!div class="nextstepaction"]
> [Jenkins on Azure](/azure/jenkins/)