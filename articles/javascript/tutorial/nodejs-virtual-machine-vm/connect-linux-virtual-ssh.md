---
title: Create Linux virtual machine
description: Create an Azure Linux virtual machine with Azure CLI 
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# 3. Connect to Linux virtual machine using SSH

In this section of the tutorial, use SSH in a terminal to connect to your virtual machine. [SSH](https://www.ssh.com/ssh/) is a common tool provided with many modern shells today. If you are using a modern Mac, Windows, or Linux operating system, you shouldn't have to install an SSH client. 

## Connect with SSH and change web app

1. Open a terminal or shell window on your local computer and connect to your remote virtual machine with the following command. This process assumes that your SSH client can find your SSH keys, created by the Azure CLI and placed on your local machine. 

    The command includes the user, `azureuser`, which was specified in the Azure CLI command to create the virtual machine. Replace `YOUR-PUBLIC-IP-ADDRESS` with your own virtual machine's public Ip. 

    ```console
    ssh azureuser@YOUR-PUBLIC-IP-ADDRESS
    ``` 

    When the connection is complete, the terminal prompt should change to indicate the remote virtual machine. 

1. Use the nano text editor provided in the virtual machine to edit the `index.js`. 

    ```console
    nano index.js
    ```

## Next step

> [!div class="nextstepaction"]
> [Connect to virtual machine with SSH](connect-linux-virtual-ssh.md) 