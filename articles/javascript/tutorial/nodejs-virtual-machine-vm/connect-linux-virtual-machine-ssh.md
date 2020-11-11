---
title: Connect to virtual machine
description: Use SSH to connect to your Linux virtual machine.  If you are using a modern Mac, Windows, or Linux operating system, the terminal-based client SSH should already be installed.
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# 4. Connect to Linux virtual machine using SSH

In this section of the tutorial, use SSH in a terminal to connect to your virtual machine. [SSH](https://www.ssh.com/ssh/) is a common tool provided with many modern shells, including the Azure Cloud Shell. 

## Connect with SSH and change web app

Use the same terminal or shell window as with previous steps. 

1. Connect to your remote virtual machine with the following command. This process assumes that your SSH client can find your SSH keys, created as part of your VM creation and placed on your local machine. If you are asked if you want to continue connecting, answer `yes`. When the connection is complete, the terminal prompt should change to indicate the remote virtual machine. 

    Replace `YOUR-PUBLIC-IP-ADDRESS` with your own virtual machine's public Ip. 

    ```console
    ssh azureuser@YOUR-PUBLIC-IP-ADDRESS
    ``` 

1. Use the following command to understand where you are on the virtual machine. You should be at the azureuser root: `/home/azureuser`. 

    ```bash
    pwd
    ```

1. Your web app is in the subdirectory, `myapp`. Change to the `myapp` directory and list the contents:

    ```bash
    cd myapp && ls -l
    ```

    You should see contents like, representing the GitHub repository cloned into the virtual machine and the npm package files:
    
    ```console
    -rw-r--r--   1 root root   891 Nov 11 20:23 cloud-init-github.txt
    -rw-r--r--   1 root root  1347 Nov 11 20:23 index-logging.js
    -rw-r--r--   1 root root   282 Nov 11 20:23 index.js
    drwxr-xr-x 190 root root  4096 Nov 11 20:23 node_modules
    -rw-r--r--   1 root root 84115 Nov 11 20:23 package-lock.json
    -rw-r--r--   1 root root   329 Nov 11 20:23 package.json
    -rw-r--r--   1 root root   697 Nov 11 20:23 readme.md
    ```

1. Install the Azure SDK client library for Application Insights.

    ```bash
    sudo npm install --save applicationinsights
    ```

1. Set Azure Monitor instrumentation key for Application Insights into an environment variable.

    ```bash
    export APPINSIGHTS_INSTRUMENTATIONKEY=REPLACE-WITH-YOUR-KEY
    ```

    You can check the key is set with the `env` command at the bash terminal.

1. Leave the terminal open and connected to your VM, you will use it in the next step.

## Next step

> [!div class="nextstepaction"]
> [Add Azure SDK client code to log to Azure cloud](azure-monitor-application-insights-nodejs-expressjs-code.md) 