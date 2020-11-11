---
title: Create Azure Monitor resource
description: Create an Azure resource to collect your web app's log files to the Azure cloud. Azure Monitor is the name of the Azure service, while Application Insights is the name of the client library the tutorial uses.
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# 3. Create Application Insights resource for web pages

In this step of the tutorial, create an Azure resource to collect your web app's log files to the Azure cloud. Azure Monitor is the name of the Azure service, while Application Insights is the name of the client library the tutorial uses. 

## Create Azure Monitor resource with Azure CLI

1. Install Application Insights extension to Azure CLI.

    ```azurecli
    az extension add -n application-insights
    ```

1. In the same terminal window where you have uses Azure CLI in previous steps, use the following command to create a monitoring resource:


    ```azurecli
    az monitor app-insights component create \
      --app demoWebAppMonitor \
      --location eastus \
      --resource-group rg-demo-vm-eastus
    ```

    In the results, find and copy the `instrumentationKey`. You will need that later. 

1. Leave the terminal open, you will use it in the next step.

## Next step

> [!div class="nextstepaction"]
> [Connect to virtual machine with SSH](connect-linux-virtual-ssh-machine-ssh.md) 
