---
title: Tutorial - Use Azure Storage for build artifacts
description: Learn how to use the Azure blob service as a repository for build artifacts created by a Jenkins continuous integration solution.
keywords: jenkins, azure, devops, storage, cicd, build artifacts
ms.topic: tutorial
ms.date: 01/12/2021
ms.custom: devx-track-jenkins, devx-track-azurecli
---

# Tutorial: Use Azure Storage for build artifacts

[!INCLUDE [jenkins-integration-with-azure.md](includes/jenkins-integration-with-azure.md)]

This article illustrates how to use Blob storage as a repository of build artifacts created by a Jenkins continuous integration (CI) solution, or as a source of downloadable files to be used in a build process. One of the scenarios where you would find this solution useful is when you're coding in an agile development environment (using Java or other languages), builds are running based on continuous integration, and you need a repository for your build artifacts, so that you could, for example, share them with other organization members, your customers, or maintain an archive. Another scenario is when your build job itself requires other files, for example, dependencies to download as part of the build input.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- **Jenkins server**: If you don't have a Jenkins server installed, [create a Jenkins server on Azure](./configure-on-linux-vm.md).
- **Azure CLI**: Install Azure CLI (version 2.0.67 or higher) on the Jenkins server.
- **Azure storage account**: If you don't already have a storage account, [create a Storage Account](/azure/storage/common/storage-account-create).

## Add Azure credential needed to execute Azure CLI

1. Browse to the Jenkins portal.

1. From the menu, select **Manage Jenkins**.

1. Select **Manage Credentials**.

1. Select the **global** domain.

1. Select **Add Credentials**.

1. Fill out the required fields as follows:

    - **Kind**: Select **Username with password**.
    - **Username**: Specify the `appId` of the service principal.
    - **Password**: Specify the `password` of the service principal.
    - **ID**: Specify a credential identifier, such as `azuresp`.
    - **Description**: Optionally, include a meaningful description for your environment.

1. Select **OK** to create the credential.

## Create a pipeline job to upload build artifacts

The following steps guide you through creating a pipeline job. The pipeline job creates several files and uploads the files to your storage account using Azure CLI.

1. From the Jenkins dashboard, select **New Item**.

1. Name the job **myjob**, select **Pipeline**, and then select **OK**.

1. In the **Pipeline** section of the job configuration, select **Pipeline script** and paste the following into **Script**. Edit the placeholders to match the values for your environment.

    ```groovy
    pipeline {
      agent any
      environment {
        AZURE_SUBSCRIPTION_ID='99999999-9999-9999-9999-999999999999'
        AZURE_TENANT_ID='99999999-9999-9999-9999-999999999999'
        AZURE_STORAGE_ACCOUNT='myStorageAccount'
      }
      stages {
        stage('Build') {
          steps {
            sh 'rm -rf *'
            sh 'mkdir text'
            sh 'echo Hello Azure Storage from Jenkins > ./text/hello.txt'
            sh 'date > ./text/date.txt'
          }
    
          post {
            success {
              withCredentials([usernamePassword(credentialsId: 'azuresp', 
                              passwordVariable: 'AZURE_CLIENT_SECRET', 
                              usernameVariable: 'AZURE_CLIENT_ID')]) {
                sh '''
                  echo $container_name
                  # Login to Azure with ServicePrincipal
                  az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
                  # Set default subscription
                  az account set --subscription $AZURE_SUBSCRIPTION_ID
                  # Execute upload to Azure
                  az storage container create --account-name $AZURE_STORAGE_ACCOUNT --name $JOB_NAME --auth-mode login
                  az storage blob upload-batch --destination ${JOB_NAME} --source ./text --account-name $AZURE_STORAGE_ACCOUNT
                  # Logout from Azure
                  az logout
                '''
              }
            }
          }
        }
      }
    }
    ```

1. Select **Build Now** to run **myjob**.

1. Examine the console output for status. When the post-build action uploads the build artifacts, status messages for Azure storage are written to the console.

1. If you encounter an error similar to the following, it means that you need to grant access at the container level: `ValidationError: You do not have the required permissions needed to perform this operation.` If you receive this error message, refer to the following articles to resolve:

    - [Choose how to authorize access to blob data with Azure CLI - Azure Storage](/azure/storage/blobs/authorize-data-operations-cli)
    - [Use the Azure portal to assign an Azure role for data access - Azure Storage](/azure/storage/common/storage-auth-aad-rbac-portal)

1. Upon successful completion of the job, examine the build artifacts by opening the public blob:

    1. Sign in to the [Azure portal](https://portal.azure.com).
    1. Select **Storage**.
    1. Select the storage account name that you used for Jenkins.
    1. Select **Containers**.
    1. Select the container named **myjob**, within the list of blobs.
    1. You should see the following two files: **hello.txt** and **date.txt**.
    1. Copy the URL for either of these items and paste it in your browser. 
    1. You see the text file that was uploaded as a build artifact.
    
    **Key points**:

    - Container names and blob names are lowercase (and case-sensitive) in Azure storage.

## Create a pipeline job to download from Azure Blob Storage

The following steps show how to configure a pipeline job to download items from Azure Blob Storage.

1. In the **Pipeline** section of the job configuration, select **Pipeline script** and paste the following in **Script**. Edit the placeholders to match the values for your environment.

    ```groovy
    pipeline {
      agent any
      environment {
        AZURE_SUBSCRIPTION_ID='99999999-9999-9999-9999-999999999999'
        AZURE_TENANT_ID='99999999-9999-9999-9999-999999999999'
        AZURE_STORAGE_ACCOUNT='myStorageAccount'
      }
      stages {
        stage('Build') {
          steps {
            withCredentials([usernamePassword(credentialsId: 'azuresp', 
                            passwordVariable: 'AZURE_CLIENT_SECRET', 
                            usernameVariable: 'AZURE_CLIENT_ID')]) {
              sh '''
                # Login to Azure with ServicePrincipal
                az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
                # Set default subscription
                az account set --subscription $AZURE_SUBSCRIPTION_ID
                # Execute upload to Azure
                az storage blob download --account-name $AZURE_STORAGE_ACCOUNT --container-name myjob --name hello.txt --file ${WORKSPACE}/hello.txt --auth-mode login
                # Logout from Azure
                az logout
              '''   
            }
          }
        }
      }
    }
    ```
    
1. After running a build, check the build history console output. Alternatively, you can also look at your download location to see if the blobs you expected were successfully downloaded.  

## Next steps

> [!div class="nextstepaction"]
> [Jenkins on Azure](/azure/Jenkins/)
