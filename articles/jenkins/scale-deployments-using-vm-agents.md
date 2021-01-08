---
title: Tutorial - Scale Jenkins deployments with VM running in Azure
description: Learn how to add additional capacity to your Jenkins pipelines using Azure virtual machines
keywords: jenkins, azure, devops, virtual machine, agents
ms.topic: tutorial
ms.date: 12/16/2020
ms.custom: devx-track-jenkins
---

# Tutorial: Scale Jenkins deployments with VM running in Azure

[!INCLUDE [jenkins-integration-with-azure.md](includes/jenkins-integration-with-azure.md)]

This tutorial shows how to create a Linux virtual machines in Azure and add the VM as a work node to Jenkins.

In this tutorial, you will:

> [!div class="checklist"]
> * Create agent machine
> * Add agent to Jenkins
> * Create a new Jenkins freestyle job
> * Run the job on an Azure VM agent

## Prerequisites

- **Jenkins installation**: If you don't have access to a Jenkins installation, [configure Jenkins using Azure CLI](configure-on-linux-vm.md)

## Create agent machine

### Create Azure VM

- Open your Azure CLI and login
    ```shell
    az login
    ```
- Make sure current login use the right subscription
    Check current subscription:
    ```shell
    az account show 
    ```
    Sample output:
    ```json
    {
        "environmentName": "AzureCloud",
        "homeTenantId": "00000000-0000-0000-0000-000000000000",
        "id": "00000000-0000-0000-0000-000000000000",
        "isDefault": true,
        "managedByTenants": [],
        "name": "00000000-0000-0000-0000-000000000000",
        "state": "Enabled",
        "tenantId": "00000000-0000-0000-0000-000000000000",
        "user": {
            "name": "user@test.com",
            "type": "user"
        }
    }
    ```
    If output shows you are not using the subscription you want to use, you can change the subscrtiption with command:
    ```shell
    az account set --subscription "My Sub"
    ```
- Create Resourece group
    ```shell
    az group create --name my-resource-group --location eastus
    ```

- Create Virtual Machine
  - Linux
    ```shell 
    az vm create --resource-group my-resource-group --name my-vm --image UbuntuLTS --admin-username azureuser --admin-password "password"
    ```
    You also upload your ssh key with command `--ssh-key-value ssh_path`, for example: `--ssh-key-value ~/.ssh/id_rsa.pub`

  - Windows
    ```shell
    az vm create --resource-group my-resource-group --name my-vm --image UbuntuLTS --admin-username azureuser --admin-password "password"
    ```
  
-	Install JDK
    - Linux
      - Login into VM with SSH tool
        ```shell
        ssh username@123.123.123.123
        ```
      - Install JDK with `apt`, you can also install with other package manage tools like: `yum, pacman` etc.
        ```shell
        sudo apt-get install -y default-jdk
        ```
        After installation is complete, run `java -version` to check the java environment. You see:
        
        ```bash
        openjdk 11.0.9.1 2020-11-04
        OpenJDK Runtime Environment (build 11.0.9.1+1-Ubuntu-0ubuntu1.18.04)
        OpenJDK 64-Bit Server VM (build 11.0.9.1+1-Ubuntu-0ubuntu1.18.04, mixed mode, sharing)
        ```
        
    - Windows
      - Login with SSH tool or `Remote Desktop Connection`
      - Download the JDk from https://www.oracle.com/java/technologies/javase-downloads.html
      - Install JDK

## Add agent to Jenkins
  - Open your Jenkins portal, navigate to `Jenkins -> Manage Jenkins -> Manage Nodes and cloud -> New Node`, set a name for the new node; select **Permanent Agent** and click **OK**.
    ![Create new node](./media/scale-deployments-using-vm-agents/portal.png)
  - Configure node
    - `Name`  Jenkins node name
    - `Remote root directory` remote working directory, example: `/home/azureuser/work`
    - `Labels`: Labels are used to group multiple agents into one logical group. Example : `UBUNTU`
    - `Launch method`, you have two optionals to start the remote Jenkins Node
        - `SSH`
            - `Host`: VM public IP address or domain name, example: `123.123.123.123, example.com`
            - `Credentials`: Create a new Jenkins Username/Password credentials to store your VM username/password
            - `Host Key Verification Strategy`: Controls how Jenkins verifies the SSH key presented by the remote host whilst connecting. Default selection is OK.
            Configuration example: ![SSH](./media/scale-deployments-using-vm-agents/ssh2.png)

        - Execution of command of the master
            - Download the `agent.jar`  from https://yourjenkinshostname/jnlpJars/agent.jar, exmaple: `https://localhost:8443/jnlpJars/agent.jar`
            - Upload the `agent.jar` to your VM
            - Start Jenkisn now with command `ssh nodeHost java -jar remote_agentjar_path`, example: `ssh azureuser@40.85.162.9 java -jar /home/azureuser/agent.jar`   
            Configuration example: ![Configure execute command of the master](./media/scale-deployments-using-vm-agents/config.png)
        
After you set all the configurations, save the configuration and Jenkins will add the VM as a new work node. ![VM as new work node](./media/scale-deployments-using-vm-agents/commandstart.png)

## Create a job in Jenkins

1. Within the Jenkins dashboard, click **New Item**. 
1. Enter `demoproject1` for the name and select **Freestyle project**, then select **OK**.
1. In the **General** tab, choose **Restrict where project can be run** and type `ubuntu` in **Label Expression**. You see a message confirming that the label is served by the cloud configuration created in the previous step. 
   ![Set up job](./media/scale-deployments-using-vm-agents/job-config.png)
1. In the **Source Code Management** tab, select **Git** and add the following URL into the **Repository URL** field: `https://github.com/spring-projects/spring-petclinic.git`
1. In the **Build** tab, select **Add build step**, then **Invoke top-level Maven targets**. Enter `package` in the **Goals** field.
1. Select **Save** to save the job definition.

## Build the new job on an Azure VM agent

1. Go back to the Jenkins dashboard.
1. Select the job you created in the previous step, then click **Build now**. A new build is queued, but does not start until an agent VM is created in your Azure subscription.
1. Once the build is complete, go to **Console output**. You see that the build was performed remotely on an Azure agent.

![Console output](./media/scale-deployments-using-vm-agents/console-output.png)

## Next steps

> [!div class="nextstepaction"]
> [CI/CD to Azure App Service](deploy-from-github-to-azure-app-service.md)