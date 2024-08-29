---
title: Azure CLI virtual machine with Express.js
description: Create an Azure Linux virtual machine, with a clone of an Express.js-based app from a GitHub repository.  
ms.topic: how-to
ms.date: 02/09/2023
ms.custom: devx-track-js, devx-track-azurecli, engagement-fy23, linux-related-content
# Must use non-internal sub
---

# Create Express.js virtual machine using Azure CLI

In this tutorial, create a Linux virtual machine (VM) for an Express.js app. The VM is configured with a cloud-init configuration file and includes NGINX and a GitHub repository for an Express.js app. Connect to the VM with SSH, change the web app to including trace logging, and view the public Express.js server app in a web browser.

This tutorial includes the following tasks:

* Sign in to Azure with Azure CLI
* Create Azure Linux VM resource with Azure CLI
    * Open public port 80
    * Install demo Express.js web app from a GitHub repository
    * Install web app dependencies
    * Start web app
* Create Azure Monitoring resource with Azure CLI
    * Connect to VM with SSH
    * Install Azure SDK client library with npm
    * Add Application Insights client library code to create custom tracing
* View web app from browser
    * Request `/trace` route to generate custom tracing in Application Insights log
    * View count of traces collected in log with Azure CLI
    * View list of traces with Azure portal
* Remove resources with Azure CLI

## Prerequisites

- An Azure user account and subscription: [create a free subscription](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=azure-docs-js-dev-vscode-tutorial-appservice-extension&mktingSource=azure-docs-js-dev-vscode-tutorial-appservice-extension).
- SSH to connect to the VM: Use Azure Cloud Shell or a modern terminal such as bash shell, which includes SSH.
[!INCLUDE [include](~/../articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## 1. Create Application Insights resource for web pages

Create an Azure resource group for all your Azure resources and a Monitor resource to collect your web app's log files to the Azure cloud. Creating a resource group allows you to easily find the resources, and delete them when you're done. Azure Monitor is the name of the Azure service, while Application Insights is the name of the client library the tutorial uses. 

1. Optional, if you've more than one subscription, use [az account set](/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription) to set the default subscription before completing the remaining commands.

    ```azurecli
    az account set \
        --subscription "ACCOUNT NAME OR ID" 
    ```

2. Create an Azure resource group with [az group create](/cli/azure/group#az-group-create). Use the name `rg-demo-vm-eastus`:

    ```azurecli
    az group create \
        --location eastus \
        --name rg-demo-vm-eastus 
    ```

### Create Azure Monitor resource with Azure CLI

1. Install Application Insights extension to the Azure CLI.

    ```azurecli
    az extension add -n application-insights
    ```

1. Use the following command to create a monitoring resource, with [az monitor app-insights component create](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-create):


    ```azurecli
    az monitor app-insights component create \
      --app demoWebAppMonitor \
      --location eastus \
      --resource-group rg-demo-vm-eastus \
      --query instrumentationKey --output table
    ```

1. Copy the **Result** from the output, you'll need that value as your `instrumentationKey` later. 

1. Leave the terminal open, you'll use it in the next step.
 
## 2. Create Linux virtual machine using Azure CLI

Uses a cloud-init configuration file to create both the NGINX reverse proxy server and the Express.js server. NGINX is used to forward the Express.js port (3000) to the public port (80). 

1. Create a local file named `cloud-init-github.txt` and save the following contents to the file or you can [save the repository's file](https://github.com/Azure-Samples/js-e2e-vm/blob/main/cloud-init-github.txt) to your local computer. The [cloud-init](https://cloudinit.readthedocs.io/en/latest/topics/examples.html#yaml-examples) formatted file needs to exist in the same folder as the terminal path for your Azure CLI commands.

    :::code language="yaml" source="~/../js-e2e-vm/cloud-init-github.txt" :::

1. Review the `runcmd` section of file to understand what it does. 

    The `runcmd` has several tasks:

    * Download Node.js, and install it
    * Clone the sample Express.js repository from GitHub into `myapp` directory
    * Install the application dependencies
    * Start the Express.js app with PM2

### Create a virtual machine resource 

1. Enter the Azure CLI command, [az vm create](/cli/azure/vm#az-vm-create), at a terminal to create an Azure resource of a Linux virtual machine. The command creates the VM from the cloud-init file and generates the SSH keys for you. The running command displays where the keys are stored. 

    ```azurecli
    az vm create \
      --resource-group rg-demo-vm-eastus \
      --name demo-vm \
      --location eastus \
      --public-ip-sku Standard \
      --image UbuntuLTS \
      --admin-username azureuser \
      --generate-ssh-keys \
      --custom-data cloud-init-github.txt
    ```

1. Wait while the process may take a few minutes. 

1. Keep the **publicIpAddress** value from the response, it's needed to view the web app in a browser and to connect to the VM. If you lose this IP, use the Azure CLI command, [az vm list-ip-addresses](/cli/azure/vm#az-vm-list-ip-addresses) to get it again.

1. The process created SSH keys and but them in a location stated in the response.
1. Go to that location and create the `authorized_keys` file:

    ```bash
    cd <SSH-KEY-LOCATION> && cat id_rsa >> authorized_keys
    ``` 

### Open port for virtual machine

When first created, the virtual machine has _no_ open ports. Open port 80 with the following Azure CLI command, [az vm open-port](/cli/azure/vm#az-vm-open-port) so the web app is publicly available:

```azurecli
az vm open-port \
  --port 80 \
  --resource-group rg-demo-vm-eastus \
  --name demo-vm
```

### Browse to web site

1. Use the public IP address in a web browser to make sure the virtual machine is available and running. Change the URL to use the value from `publicIpAddress`.

    ```HTTP
    http://YOUR-VM-PUBLIC-IP-ADDRESS
    ```

1. If the resource fails with a gateway error, try again in a minute, the web app may take a minute to start.

1. The virtual machine's web app returns the following information:

    * VM name
    * Your client IP
    * Current Date/Time  

    :::image type="content" source="../media/tutorial-vm/basic-web-app.png" alt-text="Screenshot of web browser showing simple app served from Linus virtual machine on Azure.":::


1. The initial code file for the web app has a single route, which passed through the NGINX proxy. 

    :::code language="JavaScript" source="~/../js-e2e-vm/index.js" :::

## 3. Connect to Linux virtual machine using SSH

In this section of the tutorial, use SSH in a terminal to connect to your virtual machine. [SSH](https://www.ssh.com/ssh/) is a common tool provided with many modern shells, including the Azure Cloud Shell. 

### Connect with SSH and change web app

1. Connect to your remote virtual machine with the following command.  

    Replace `YOUR-VM-PUBLIC-IP` with your own virtual machine's public IP. 

    ```console
    ssh azureuser@YOUR-VM-PUBLIC-IP
    ``` 

    This process assumes that your SSH client can find your SSH keys, created as part of your VM creation and placed on your local machine. 

1. If you're asked if you're sure you want to connect, answer `y` or `yes` to continue. 

1. Use the following command to understand where you are on the virtual machine. You should be at the azureuser root: `/home/azureuser`. 

    ```bash
    pwd
    ```

1. When the connection is complete, the terminal prompt should change to indicate the username and resource name of remote virtual machine.

    ```bash
    azureuser@demo-vm:
    ```

1. Your web app is in the subdirectory, `myapp`. Change to the `myapp` directory and list the contents:

    ```bash
    cd myapp && ls -l
    ```

1. You should see contents representing the GitHub repository cloned into the virtual machine and the npm package files:
    
    ```console
    -rw-r--r--   1 root root   891 Nov 11 20:23 cloud-init-github.txt
    -rw-r--r--   1 root root  1347 Nov 11 20:23 index-logging.js
    -rw-r--r--   1 root root   282 Nov 11 20:23 index.js
    drwxr-xr-x 190 root root  4096 Nov 11 20:23 node_modules
    -rw-r--r--   1 root root 84115 Nov 11 20:23 package-lock.json
    -rw-r--r--   1 root root   329 Nov 11 20:23 package.json
    -rw-r--r--   1 root root   697 Nov 11 20:23 readme.md
    ```

### Install Monitoring SDK

1. In the SSH terminal, which is connected to your virtual machine, install the [Azure SDK client library for Application Insights](https://www.npmjs.com/package/applicationinsights).

    ```bash
    sudo npm install --save applicationinsights
    ```

1. Wait until the command completes before continuing. 

### Add Monitoring instrumentation key

1. In the SSH terminal, which is connected to your virtual machine, use the [Nano](https://www.nano-editor.org/dist/latest/nano.html#Editor-Basics) editor to open the `package.json` file.

    ```bash
    sudo nano package.json
    ```

1. Add a `APPINSIGHTS_INSTRUMENTATIONKEY` environment variable to the beginning of your **Start** script. In the following example, replace `REPLACE-WITH-YOUR-KEY` with your instrumentation key value.

    ```json
    "start": "APPINSIGHTS_INSTRUMENTATIONKEY=REPLACE-WITH-YOUR-KEY pm2 start index.js --watch --log /var/log/pm2.log"
    ```

1. Still in the SSH terminal, save the file in the Nano editor with <kbd>control</kbd> + <kbd>X</kbd>. 
1. If prompted in the Nano editor, enter **Y** to save. 
1. If prompted in the Nano editor, accept the file name when prompted. 

## Stop VM to change application

The Azure client library is now in your _node_modules_ directory and the key is passed into the app as an environment variable. The next step programmatically uses Application Insights.

1. Stop [PM2](https://www.npmjs.com/package/pm2), which is a production process manager for Node.js applications, with the following commands:

    ```bash
    sudo npm run-script stop 
    ```

1. Replace original `index.js` with file using Application Insights.

    ```bash
    sudo npm run-script appinsights
    ```

1. The client library and logging code is provided for you. 

    :::code language="JavaScript" source="~/../js-e2e-vm/index-logging.js" highlight="7-36":::

1. Restart the app with PM2 to pick up the next environment variable.

    ```bash
    sudo npm start
    ```
## Use app to verify logging 

1. In a web browser, test the app with the new `trace` route:

    ```http
    http://YOUR-VM-PUBLIC-IP-ADDRESS/trace
    ```

    The browser displays the response, `trace route demo-vm YOUR-CLIENT-IP VM-DATE-TIME` with your IP address.

<a name="viewing-the-vm-logs-for-nginx-and-pm2"></a>

### Viewing the log for NGINX

The virtual machine (VM) collects logs for NGINX, which are available to view.

| Service | Log location|
|--|--|
|NGINX| /var/log/nginx/access.log|


1. Still in the SSH terminal, view VM log for the NGINX proxy service with the following command to view the log:

```bash
cat /var/log/nginx/access.log
```

1. The log includes the call from your local computer. 

```console
"GET /trace HTTP/1.1" 200 10 "-"
```

### Viewing the log for PM2

The virtual machine collects logs for PM2, which are available to view.

| Service | Log location|
|--|--|
|PM2| /var/log/pm2.log|

1. View VM log for the PM2 service, which is your Express.js Node web app. In the same bash shell, use the following command to view the log:

    ```bash
    cat /var/log/pm2.log
    ```

1. The log includes the call from your local computer. 

    ```console
    grep "Hello world app listening on port 3000!" /var/log/pm2.log
    ```

1. The log also includes your environment variables, including your ApplicationInsights key, passed in the npm start script. use the following grep command to verify your key is in the environment variables. 

    ```bash
    grep APPINSIGHTS_INSTRUMENTATIONKEY /var/log/pm2.log
    ```
    
    This displays your PM2 log with `APPINSIGHTS_INSTRUMENTATIONKEY` highlighted in a different color. 


### VM logging and cloud logging

In this application, using `console.log` writes the messages into the PM2 logs found on the VM only. If you delete the logs or the VM, you lose that information.

If you want to retain the logs beyond the lifespan of your virtual machine, use Application Insights. 

## 5. Clean up resources

Once you've completed this tutorial, you need to remove the resource group, which includes all its resources to make sure you aren't billed for any more usage. 

In the same terminal, use the Azure CLI command, [az group delete](/cli/azure/group#az-group-delete), to delete the resource group:

```azurecli
az group delete --name rg-demo-vm-eastus -y
```

This command takes a few minutes. 

## Troubleshooting

If you have issues, use the following table to understand how to resolve your issue:

|Problem|Resolution|
|--|--|
|502 Gateway error|This could indicate your index.js or package.js file has an error. View your PM2 logs at `/var/log/pm2.log` for more information. The most recent error is at the bottom of the file. If you're sure those files are correct, stop and start the PM2 using the npm scripts in `package.json`.|


## Sample code

* [Express.js virtual machine sample code](https://github.com/Azure-Samples/azure-typescript-e2e-apps/tree/main/api-expressjs-vm)

## Next steps

* [Create load balancer in front of a virtual machine](/azure/load-balancer/quickstart-load-balancer-standard-public-cli)
* [Inject certificates from Key Vault](/azure/virtual-machines/linux/tutorial-automate-vm-deployment#inject-certificates-from-key-vault)
* [Connect to VM with Bastion](/azure/bastion/tutorial-create-host-portal)
