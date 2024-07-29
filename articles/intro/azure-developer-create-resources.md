---
title: How do I create and manage resources in Azure?
description: An overview of techniques that developers use to provision resources in Azure.
keywords: azure portal, azure cli, azure powershell, azure sdk, azure rest apis
ms.service: azure
ms.topic: overview
ms.date: 07/29/2024
ms.custom: overview
---

# How do I create and manage resources in Azure?

This is part five in a short series of 7 articles to help developers get started with Azure.

* Part 1: [Azure for developers overview](azure-developer-overview.md)
* Part 2: [Key Azure services for developers](azure-developer-key-services.md)
* Part 3: [Hosting applications on Azure](hosting-apps-on-azure.md)
* Part 4: [Connect your app to Azure services](connect-to-azure-services.md)
* Part 5: **How do I create and manage resources in Azure?**
* Part 6: [Key concepts for building Azure apps](azure-developer-key-concepts.md)
* Part 7: [How am I billed?](azure-developer-billing.md)

Azure provides a variety of tools to create and manage the Azure resources used by your application. 


> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE50C5I]


Different tools are designed to support different use cases, and most Azure developers use a combination of different tools depending on the job they need to perform. For example, you might:

* **Use a GUI tool like the Azure portal or the Azure Tools extension for VS Code** when prototyping Azure resources for a new application. GUI tools guide you through the process of creating new services and let you review and select the options for a service using drop-down menus and other graphical elements.

* **Write a script using the Azure CLI or Azure PowerShell** to automate a common task.  For example, you might create a script that creates a basic dev environment for a new web application consisting of an Azure App Service, a database, and blob storage.  Writing a script ensures the resources are created the same way each time and is faster to run than clicking through a UI.

* **Use Infrastructure as Code (IaC) tools to declaratively deploy and manage Azure resources**.  Tools like Terraform, Ansible, or Bicep allow you to codify the Azure resources needed for a solution in declarative syntax, ensuring the consistent deployment of Azure resources across environments and preventing environmental drift.

## Azure portal

The [Azure portal](https://portal.azure.com) is a web-based interface designed for managing Azure resources. The Azure portal features:

* An easy to use, web-based UI for creating and managing Azure resources
* The ability to create configurable dashboards
* Access to subscription settings and billing information

:::image type="content" source="./media/azure-portal-800px.png" alt-text="A screenshot showing the Azure portal." lightbox="./media/azure-portal.png":::

## VS Code Azure Tools Extension Pack

Developers using [Visual Studio Code](https://code.visualstudio.com) can manage Azure resources right from VS Code using the [Azure Tools Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) for VS Code. Using the Azure Tools Extension Pack can:

* Create, manage, and deploy code to web sites using Azure App Service.
* Create, browse, and query Azure databases
* Create, debug, and deploy Azure Functions directly from VS Code
* Deploy containerized applications from VS Code

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

:::image type="content" source="./media/visual-studio-code-azure-tools-extension.png" alt-text="A screenshot showing Visual Studio Code with the Azure Tools extension pack installed.":::

## Command line tools

Command line tools offer the benefits of efficiency, repeatability, and the ability to script recurring tasks.  Azure provides two different command line tools to choose from. The Azure CLI and Azure PowerShell are functionally equivalent.  You only need to select and use the tool that best fits your individual workflow.

### Azure CLI

The [Azure CLI](/cli/azure/what-is-azure-cli) is a cross-platform command line tool that runs on Windows, Linux and macOS.  The Azure CLI:

* Features a concise, efficient syntax for managing Azure resource.
* Outputs results as JSON (by default). Results can also be formatted as YAML, an ASCII table or tab-separated values with no keys.
* Provides the ability to query and shape output through the use of [JMESPath queries](https://jmespath.org/).

Azure CLI commands are easily incorporated into popular scripting languages like [Bash](/training/modules/bash-introduction/) giving you the ability to script common tasks.

```azurecli
LOCATION='eastus'                                        
RESOURCE_GROUP_NAME='msdocs-expressjs-mongodb-tutorial'

WEB_APP_NAME='msdocs-expressjs-mongodb-123'
APP_SERVICE_PLAN_NAME='msdocs-expressjs-mongodb-plan-123'    
RUNTIME='NODE|14-lts'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME

# Create an app service plan
az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux

# Create the web app in the app service
az webapp create \
    --name $WEB_APP_NAME \
    --runtime $RUNTIME \
    --plan $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME 
```

### Azure PowerShell

[Azure PowerShell](/powershell/azure/what-is-azure-powershell) is a set of cmdlets for managing Azure resources directly from PowerShell.  Azure PowerShell is installed as a PowerShell module and works with PowerShell 7.0.6 LTS and PowerShell 7.1.3 or higher on all platforms including Windows, macOS, and Linux. It's also compatible with Windows PowerShell 5.1.

Azure PowerShell is tightly integrated with the PowerShell language.  Commands follow a verb-noun format and data is returned as PowerShell objects.  If you are already familiar with PowerShell scripting, Azure PowerShell is a natural choice.

```azurepowershell
$location = 'eastus'
$resourceGroupName = 'msdocs-blob-storage-demo-azps'
$storageAccountName = 'stblobstoragedemo999'

# Create a resource group
New-AzResourceGroup `
    -Location $location `
    -Name $resourceGroupName

# Create the storage account
New-AzStorageAccount `
    -Name $storageAccountName `
    -ResourceGroupName $resourceGroupName `
    -Location $location `
    -SkuName Standard_LRS
```

For more information on choosing between Azure CLI and Azure PowerShell, see the article [Choose the right command-line tool](/cli/azure/choose-the-right-azure-command-line-tool).

## Infrastructure as Code tools

[Infrastructure as Code](/devops/deliver/what-is-infrastructure-as-code) is the process of managing and provisioning resources through declarative configuration files.  Infrastructure as code tools use a declarative end state specification to guarantee a set of resources are created and configured the same way each time. Further, most infrastructure as code tools monitor resources to make sure they remain configured in the desired state.

For infrastructure deployments that are automated, repeated, and reliable, Azure supports a variety of Infrastructure as Code tools.

### Bicep

[Bicep](/azure/azure-resource-manager/bicep/) is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse.

  ```bicep
  param location string = resourceGroup().location
  param storageAccountName string = 'toylaunch${uniqueString(resourceGroup().id)}'

  resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
    name: storageAccountName
    location: location
    sku: {
      name: 'Standard_LRS'
    }
    kind: 'StorageV2'
    properties: {
      accessTier: 'Hot'
    }
  }
  ```

### Terraform

[Hashicorp Terraform](../terraform/index.yml) is an open-source tool for provisioning and managing cloud infrastructure. It codifies infrastructure in configuration files that describe the topology of cloud resources.  The Terraform CLI provides a simple mechanism to deploy and version configuration files to Azure.

```terraform
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "${var.prefix}-resources"
  location = var.location
}

resource "azurerm_app_service_plan" "main" {
  name                = "${var.prefix}-asp"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_app_service" "main" {
  name                = "${var.prefix}-appservice"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  app_service_plan_id = azurerm_app_service_plan.main.id

  site_config {
    linux_fx_version = "NODE|10.14"
  }
}
```

### Ansible

[Ansible](../ansible/index.yml) is an open-source product that automates cloud provisioning, configuration management, and application deployments. Using Ansible you can provision virtual machines, containers, and network and complete cloud infrastructures. Also, Ansible allows you to automate the deployment and configuration of resources in your environment.

```yml
- hosts: localhost
  connection: local
  vars:
    resource_group: myResourceGroup
    webapp_name: myfirstWebApp
    plan_name: myAppServicePlan
    location: eastus
  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"

    - name: Create App Service on Linux with Java Runtime
      azure_rm_webapp:
        resource_group: "{{ resource_group }}"
        name: "{{ webapp_name }}"
        plan:
          resource_group: "{{ resource_group }}"
          name: "{{ plan_name }}"
          is_linux: true
          sku: S1
          number_of_workers: 1
        frameworks:
          - name: "java"
            version: "8"
            settings:
              java_container: tomcat
              java_container_version: 8.5
```

## Azure SDK and REST APIs

Azure resources can also be created programmatically from code.  This allows you to write applications that dynamically provision Azure resources in response to user requests.  The Azure SDK provides resource management packages in .NET, Go, Java, JavaScript and Python that allow Azure resources to be created and managed directly in code.  Alternatively, the Azure REST API allows Azure resources to be managed through HTTP requests to a RESTful endpoint.

> [!div class="nextstepaction"]
> [Using the Azure SDK for .NET](/dotnet/azure/sdk/resource-management)

> [!div class="nextstepaction"]
> [Using the Azure SDK for Go](../go/management-libraries.md)

> [!div class="nextstepaction"]
> [Using the Azure SDK for Java](../java/sdk/overview.md)

> [!div class="nextstepaction"]
> [Using the Azure SDK for JavaScript](../javascript/core/use-azure-sdk.md)

> [!div class="nextstepaction"]
> [Using the Azure SDK for Python](../python/sdk/azure-sdk-overview.md)

> [!div class="nextstepaction"]
> [Using the Azure REST APIs](/rest/api/azure/)


> [!div class="nextstepaction"]
> [Continue to part 6: Key concepts for building Azure apps](azure-developer-key-concepts.md)
