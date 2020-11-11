---
title: Connect to virtual machine
description: Use SSH to connect to your Linux virtual machine. 
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# 4. Connect to Linux virtual machine using SSH

In this section of the tutorial, use SSH in a terminal to connect to your virtual machine. [SSH](https://www.ssh.com/ssh/) is a common tool provided with many modern shells today. If you are using a modern Mac, Windows, or Linux operating system, you shouldn't have to install an SSH client. 

## Connect with SSH and change web app

Use the same terminal or shell window on your local computer as with previous steps. 

1. Use the same terminal or shell window on your local computer as with previous steps. Connect to your remote virtual machine with the following command. This process assumes that your SSH client can find your SSH keys, created by the Azure CLI and placed on your local machine. 

    The command includes the user, `azureuser`, which was specified in the Azure CLI command to create the virtual machine. Replace `YOUR-PUBLIC-IP-ADDRESS` with your own virtual machine's public Ip. 

    ```console
    ssh azureuser@YOUR-PUBLIC-IP-ADDRESS
    ``` 

    If you are prompted to continue connecting, answer `yes`.

    When the connection is complete, the terminal prompt should change to indicate the remote virtual machine. 

1. Use the following command to understand where you are on the virtual machine:

    ```bash
    pwd
    ```

    You should be at the azureuser root: `/home/azureuser`.

    Your web app is in the subdirectory, `myapp`. 

1. Change to the `myapp` directory and list the contents:

    ```bash
    cd myapp && ls -l
    ```

    You should see contents like, representing the GitHub repository cloned into the virtual machine and the npm package files:
    
    ```console
    -rw-r--r--  1 root root   817 Nov 11 17:06 cloud-init-github.txt
    -rw-r--r--  1 root root   276 Nov 11 17:06 index.js
    drwxr-xr-x 52 root root  4096 Nov 11 17:06 node_modules
    -rw-r--r--  1 root root 16855 Nov 11 17:06 package-lock.json
    -rw-r--r--  1 root root   290 Nov 11 17:06 package.json
    -rw-r--r--  1 root root   697 Nov 11 17:06 readme.md
    ```

1. Install the Azure SDK client library to add logging from your web app to Azure monitoring.

    ```bash
    sudo npm install --save @microsoft/applicationinsights-web
    ```

1. Set Azure Monitor instrumentation key for Application Insights into an environment variable.

    ```bash
    export INSTRUMENTATION_KEY=1b6a7f0e-4a74-4786-9520-f06a82d3d05f
    ```

    You can check the key is set with the `env` command at the bash terminal.

1. Leave the terminal open, you will use it in the next step.

## Next step

> [!div class="nextstepaction"]
> [Add Azure SDK client code to log to Azure cloud](azure-monitor-application-insights-nodejs-expressjs-code.md) 