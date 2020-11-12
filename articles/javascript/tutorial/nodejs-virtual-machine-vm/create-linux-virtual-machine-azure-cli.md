---
title: Create Linux virtual machine
description: Use the Azure CLI to create and configure your virtual machine. At this point in the tutorial, you should have a terminal window open and signed into the Azure cloud with the Azure CLI on the subscription where you intend to create the virtual machine.
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# 2. Create Linux virtual machine using Azure CLI

In this section of the tutorial, use the Azure CLI to create and configure your virtual machine. At this point in the tutorial, you should have a terminal window open and signed into the Azure cloud on the subscription where you intend to create the virtual machine. 

All of the Azure CLI steps can be completed from a single instance of the Azure CLI. If you close the window or switch where you are using Azure CLI, such as between the Cloud shell and your local terminal, you will need to [sign in](./introduction.md#sign-in-to-azure-cli) again. 

## Create a linux virtual machine from a GitHub repository

This tutorial uses a cloud-init configuration file to create both the NGINX reverse proxy server and the Express.js server. NGINX is used to forward the Express.js port (3000) to the public port (80). 

The `runcmd` has several tasks:
* download Node.js, and install it
* clone the sample Express.js repository
* install the Express.js dependencies
* start the Express.js app with PM2

1. Create a local file named `cloud-init-github.txt` and save the following contents to the file or you can [save the repository's file](https://github.com/Azure-Samples/js-e2e-vm/blob/main/cloud-init-github.txt) to your local computer. The file needs to exist in the same folder as the terminal path for your Azure CLI commands.

    :::code language="yaml" source="~/../js-e2e-vm/cloud-init-github.txt" :::


## Create a resource group for your virtual machine resources

A linux virtual machine includes several Azure resources. Creating a resource group allows you to easily find the resources, and delete them when you are done.

1. Create an Azure resource group with the following Azure CLI command:

    ```azurecli
    az group create \
        --location eastus \
        --name rg-demo-vm-eastus 
    ```

## Create a virtual machine resource 

1. Create an Azure resource of a Linux virtual machine with the following Azure CLI command. The Azure Cloud Shell provides [Nano](https://www.nano-editor.org/dist/latest/nano.html#Editor-Basics) as a text editor. The command adds the local cloud-init and generates the SSH keys for you. The running command displays where the keys are stored. 

    ```azurecli
    az vm create \
      --resource-group rg-demo-vm-eastus \
      --name demo-vm \
      --location eastus \
      --image UbuntuLTS \
      --admin-username azureuser \
      --generate-ssh-keys \
      --custom-data "./cloud-init-github.txt"
    ```

    The process may take a few minutes. When the process is complete, the Azure CLI returns information about the new resource. Keep the `publicIpAddress` value, it is used later. 
     

1. When first created, the virtual machine has _no_ open ports. Open port 80 with the following Azure CLI command so the web app is publicly available:

    ```azurecli
    az vm open-port \
      --port 80 \
      --resource-group rg-demo-vm-eastus \
      --name demo-vm
    ```

1. Use the public IP address in a web browser to make sure the virtual machine is available and running. Change the URL to use the value from `publicIpAddress`.

    ```HTTP
    http://YOUR-PUBLIC-IP-ADDRESS
    ```

    If the resource fails with a gateway error, try again in a minute, the web app may take a minute to start.

    While you can and should eventually add HTTPS and a domain name to represent the public Ip address, that isn't part of this tutorial. The following image represents the web app, but your app will use a different Ip address.

    :::image type="content" source="../../media/tutorial-vm/basic-web-app.png" alt-text="Simple app served from Linus virtual machine on Azure.":::

1. Leave the terminal open, you will use it through out the tutorial.

## Next step

> [!div class="nextstepaction"]
> [Install Application Insights client library and change code](create-azure-monitoring-application-insights-web-resource.md) 