---
title: Create Linux virtual machine
description: Create an Azure Linux virtual machine with Azure CLI 
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# 2. Create Linux virtual machine using Azure CLI

In this section of the tutorial, use the Azure CLI to create and configure your virtual machine. At this point in the tutorial, you should have a terminal window open and signed into the Azure cloud with the Azure CLI on the subscription where you intend to create the virtual machine. 

All of the Azure CLI steps can be completed from a single instance of the Azure CLI. If you close the terminal or switch where you are using Azure CLI, such as between the Cloud shell and your local terminal, you will need to [sign in](./introduction.md#sign-in-to-azure-cli) again. 

## Create a resource group for your virtual machine resources

A linux virtual machine includes several Azure resources. Creating a resource group allows you to easily find the resources, and easily delete them when you are done.

If you can create resources on more than one subscription, use the `--subscription YOUR-SUBSCRIPTION-ID` command line parameters to make sure the resource group and subsequent resources are created on the correct subscription.

1. Create an Azure resource group with the following Azure CLI command:

    ```azurecli
    az group create \
        --location eastus 
        --name rg-demo-vm-eastus 
    ```

## Create a linux virtual machine from a GitHub repository

This tutorial uses a cloud-init configuration file to create both the NGINX proxy server and the Express.js server. NGINX is used to forward the Express.js 3000 to the public port 80. 

The `runcmd` has several tasks:
* downloads Node.js, and installs it
* clones a sample Express.js repository
* installs the Express.js dependencies
* starts the Express.js app

1. Create a local file named `cloud-init-github.txt` to define the cloud-init definition and save the following contents to the file or you can [save the sample file](https://github.com/Azure-Samples/js-e2e-vm/blob/main/cloud-init-github.txt) to your local computer. The file needs to exist in the same folder as the terminal path for your Azure CLI commands.

    The cloud-init file is optional. You can accomplish all these commands from the SSH terminal if you would rather, further in the tutorial. 

    ```yml
    #cloud-config
    package_upgrade: true
    packages:
      - nginx
    write_files:
      - owner: www-data:www-data
        path: /etc/nginx/sites-available/default
        content: |
          server {
            listen 80;
            location / {
              proxy_pass http://localhost:3000;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection keep-alive;
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
            }
          }
    runcmd:
      #install Node.js
      - curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -;sudo apt-get install 
      - service nginx restart
      - cd "/home"
      #clone GitHub Repo
      - git clone https://github.com/Azure-Samples/js-e2e-vm
      - cd "js-e2e-vm"
      #Start app
      - npm init
      - npm start
    ```

1. Create an Azure resource of a Linux virtual machine with the following Azure CLI command. The command adds the local cloud-init and generates the SSH keys for you. 

    ```azurecli
    az vm create \
      --resource-group rg-demo-vm-eastus \
      --name demo-vm \
      --location eastus \
      --image UbuntuLTS \
      --admin-username azureuser \
      --generate-ssh-keys \
      --custom-data cloud-init-github.txt
    ```

    The process may take a few minutes. When the process is complete, the Azure CLI returns information about the new resource. Keep the `publicIpAddress` value, it is used later. 

1. When first created, the virtual machine has _no_ open ports. Open port 80 with the following Azure CLI command:

    ```azurecli
    az vm open-port --port 80 --resource-group rg-demo-vm-eastus --name demo-vm
    ```

1. Use the public IP address in a web browser to make sure the virtual machine is available and running. Change the URL to use the value from `publicIpAddress`.

    ```http
    http://YOUR-PUBLIC-IP-ADDRESS
    ```

    While you can and should eventually add a domain name to represent the public Ip address, that isn't part of this tutorial. The following image represents the web app, but your app will use a different Ip address.


    :::image type="content" source="../../media/tutorial-vm/basic-web-app.png" alt-text="Simple app served from Linus virtual machine on Azure.":::

## Next step

> [!div class="nextstepaction"]
> [Connect to virtual machine with SSH](connect-linux-virtual-ssh.md) 