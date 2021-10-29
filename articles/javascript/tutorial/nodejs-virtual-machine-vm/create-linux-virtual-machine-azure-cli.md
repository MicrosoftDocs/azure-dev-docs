---
title: Create Linux virtual machine
description: Use the Azure CLI to create and configure your virtual machine. At this point in the tutorial, you should have a terminal window open and signed into the Azure cloud with the Azure CLI on the subscription where you intend to create the virtual machine.
ms.topic: tutorial
ms.date: 10/29/2021
ms.custom: devx-track-js, devx-track-azurecli
---

# 3. Create Linux virtual machine using Azure CLI

In this section of the tutorial, use the Azure CLI to create and configure your virtual machine. At this point in the tutorial, you should have a terminal window open and signed into the Azure cloud on the subscription where you intend to create the virtual machine. 

All of the Azure CLI steps can be completed from a single instance of the Azure CLI. If you close the window or switch where you are using Azure CLI, such as between the Cloud Shell and your local terminal, you will need to sign in again. 

## Create a cloud-init file to expedite linux virtual machine creation

This tutorial uses a cloud-init configuration file to create both the NGINX reverse proxy server and the Express.js server. NGINX is used to forward the Express.js port (3000) to the public port (80). 

1. Create a local file named `cloud-init-github.txt` and save the following contents to the file or you can [save the repository's file](https://github.com/Azure-Samples/js-e2e-vm/blob/main/cloud-init-github.txt) to your local computer. The [cloud-init](https://cloudinit.readthedocs.io/en/latest/topics/examples.html#yaml-examples) formatted file needs to exist in the same folder as the terminal path for your Azure CLI commands.

    :::code language="yaml" source="~/../js-e2e-vm/cloud-init-github.txt" :::

1. Review the `runcmd` section of file to understand what it does. 

    The `runcmd` has several tasks:

    * Download Node.js, and install it
    * Clone the sample Express.js repository from GitHub into `myapp` directory
    * Install the Express.js dependencies
    * Start the Express.js app with PM2

## Create a virtual machine resource 

1. Enter the [Azure CLI command](/cli/azure/vm#az_vm_create) at a terminal to create an Azure resource of a Linux virtual machine. The command creates the VM from the cloud-init file and generates the SSH keys for you. The running command displays where the keys are stored. 

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

    The process may take a few minutes. 

1. Keep the **publicIpAddress** value from the response, it is needed to view the web app in a browser and to connect to the VM. 
     

## Open port for virtual machine

When first created, the virtual machine has _no_ open ports. Open port 80 with the following [Azure CLI command](/cli/azure/vm#az_vm_open_port) so the web app is publicly available:

```azurecli
az vm open-port \
  --port 80 \
  --resource-group rg-demo-vm-eastus \
  --name demo-vm
```

## Browse to web site

1. Use the public IP address in a web browser to make sure the virtual machine is available and running. Change the URL to use the value from `publicIpAddress`.

    ```HTTP
    http://YOUR-PUBLIC-IP-ADDRESS
    ```

1. The virtual machine's web app returns the following information. Your app will use a different IP address.  

    :::image type="content" source="../../media/tutorial-vm/basic-web-app.png" alt-text="Simple app served from Linus virtual machine on Azure.":::

1. If the resource fails with a gateway error, try again in a minute, the web app may take a minute to start.

1. The initial code file for the web app has a single route displaying your client Ip address, passed through the NGINX proxy. 

    :::code language="JavaScript" source="~/../js-e2e-vm/index.js" :::

## Next step

> [!div class="nextstepaction"]
> [Connect to VM with SSH](connect-linux-virtual-machine-ssh.md) 