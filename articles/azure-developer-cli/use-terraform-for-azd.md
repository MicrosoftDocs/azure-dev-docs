---
title: Use Terraform as an infrastructure as code tool for Azure Developer CLI
description: How to use Terraform as an infrastructure as code tool for Azure Developer CLI (azd).
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/13/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-terraform, build-2023
---

# Use Terraform as an infrastructure as code tool for Azure Developer CLI

Azure Developer CLI (`azd`) supports multiple infrastructures as code (IaC) providers, including:  

- [Bicep](/azure/azure-resource-manager/bicep/overview?tabs=bicep)
- [Terraform](../terraform/overview.md)

By default, `azd` assumes Bicep as the IaC provider. Refer to the [Comparing Terraform and Bicep](../terraform/comparing-terraform-and-bicep.md?tabs=comparing-bicep-terraform-integration-features) article for help deciding which IaC provider is best for your project.

> [!NOTE]
> Terraform is still in beta. Read more about alpha and beta feature support on the [feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning) page


## Pre-requisites

- [Install and configure Terraform](../terraform/quickstart-configure.md)
- [Install and log into Azure CLI (v 2.38.0+)](/cli/azure/install-azure-cli)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js or Python Terraform template](./azd-templates.md#start-with-an-existing-template).

> [!NOTE]
> While `azd` doesn't rely on an Azure CLI login, Terraform requires Azure CLI. Read more about this requirement from [Terraform's official documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/azure_cli).

## Configure Terraform as the IaC provider

1. Open the [`azure.yaml` file](./azd-schema.md#terraform-as-iac-provider-sample) found in the root of your project and make sure you have the following lines to override the default, which is Bicep:

    ```yaml
    infra:
      provider: terraform
    ```

1. Add all your `.tf` files to the `infra` directory found in the root of your project.
1. Run `azd up`. 

> [!NOTE] 
> Check out these two azd templates with Terraform as IaC Provider: [Node.js and Terraform](https://github.com/Azure-Samples/todo-nodejs-mongo-terraform) and [Python and Terraform](https://github.com/Azure-Samples/todo-python-mongo-terraform). 

## `azd pipeline config` for Terraform

Terraform stores state about your managed infrastructure and configuration. Because of this state file, you need to enable remote state **before** you run `azd pipeline config` to set up your deployment pipeline in GitHub.

By default, `azd` assumes the use of local state file. If you ran `azd up` before enabling remote state, you need to run `azd down` and switch to remote state file.

## Local vs remote state

Terraform uses persisted [state](https://www.terraform.io/language/state) data to keep track of the resources it manages. 

Scenarios for enabling remote state:

- To allow shared access to the state data, and allow multiple people work together on that collection of infrastructure resources
- To avoid exposing sensitive information included in state file
- To decrease the chance of inadvertent deletion because of storing state locally

## Enable remote state

1. Make sure you [configure a remote state storage account](../terraform/store-state-in-azure-storage.md).
1. Add a new file called `provider.conf.json` in the `infra` folder.

    ```json
    {
        "storage_account_name": "${RS_STORAGE_ACCOUNT}",
        "container_name": "${RS_CONTAINER_NAME}",
        "key": "azd/azdremotetest.tfstate",
        "resource_group_name": "${RS_RESOURCE_GROUP}"
    }
    ```

1. Update `provider.tf` found in the `infra` folder to set the backend to be remote

    ```console
    # Configure the Azure Provider
    terraform {
      required_version = ">= 1.1.7, < 2.0.0"
      backend "azurerm" {
      }
    ```

1. Run `azd env set <key> <value>` to add configuration in the `.env` file. 
For example: 
 
    ```azdeveloper
    azd env set RS_STORAGE_ACCOUNT your_storage_account_name
    azd env set RS_CONTAINER_NAME your_terraform_container_name
    azd env set RS_RESOURCE_GROUP your_storage_account_resource_group
    ```

1. Run the next `azd` command as per your usual workflow. When remote state is detected, `azd` initializes Terraform with the configured backend configuration.

1. To share the environment with teammates, make sure they run `azd env refresh -e <environmentName>` to refresh environment settings in the local system, and perform Step 4 to add configuration in the `.env` file.

## See also

- Learn more about Terraform's dependency on [Azure CLI](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/azure_cli). 
- For more on remote state, see [store Terraform state in Azure Storage](../terraform/store-state-in-azure-storage.md).
- Template: [React Web App with Node.js API and MongoDB (Terraform) on Azure](https://github.com/Azure-Samples/todo-nodejs-mongo-terraform)

## Next steps

> [!div class="nextstepaction"]
> [Azure Developer CLI FAQ](./faq.yml)
