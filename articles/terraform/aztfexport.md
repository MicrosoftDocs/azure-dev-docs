# Overview of Azure Export for Terraform
Azure Export for Terraform is a tool designed to help reduce friction in translation between Azure and Terraform concepts.
## Benefits
Azure Export for Terraform enables you to:
- **Simplify migration to Terraform on Azure**. Azure Export for Terraform reduces the process of Azure to Terraform resource migration into a single command.
- **Export user-specified sets of resources to Terraform HCL code and state with a single command**. Whether you wish to export a resource, resource group, or even an entire subscription, Azure Export empowers users to specify their predetermined scope and export with as little as a singular command.
- **Inspect preexisting infrastructure with all exposed properties.** Whether learning a newly released resource or investigating an issue in production, Azure Export supports a read-only export with the option to expose all configurable resource properties.
- **Follow plan-apply workflow to integrate non-Terraform infrastructure into Terraform.** By utilizing the option to only export HCL code, inspect non-Terraform resources and easily integrate them into your production infrastructure and remote backends.
## Setup and Installation
Make sure to have an Azure account set up and authenticated into. For an authentication guide, visit [this guide](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#authenticating-to-azure). For setup, make sure you have authenticated into your Azure account in CLI or PowerShell, and set your subscription to the correct scope (if using CLI).  
In addition, configure Terraform if you have not already. To install Terraform refer to [the installation guide](https://developer.hashicorp.com/terraform/downloads).  
To install the tool, visit [the GitHub page](https://github.com/Azure/aztfexport/releases) which includes specific releases of the tool, precompiled binaries, and Windows MSI, Homebrew, and Linux installations.
## Usage
At its most abstract, Azure Export is called as follows:
```console
aztfexport [command] [option] <scope>
```
The scope changes depending on the command being run, as do the available set of option flags. There are three commands that should be used based on what you are trying to export.   

### Export a single resource
To export a single resource, simply specify the Azure resourceID associated with the resource:
```console
aztfexport res [option] <resource id>
```
### Export a resource group
To export a resource group, specify the resource group name, not ID:
```console
aztfexport rg [option] <resource group name>
```
### Export using a query
The tool supports exporting with an Azure Resource Graph query: 
```console
aztfexport query [option] <ARG where predicate>
```
Visit [this tutorial] to see how to use the query mode to export resources with automated filtering.

## Next Steps
First read [this article] to understand the workflows of Azure Export for Terraform and also its best practices and design limitations.  
Then, try running the tool with one of our quickstart guides:

- [Export your first resource group]
- [Export resources into HCL code]

These how-to's explain more complex scenarios:
- [Exploring customized resource filters and names]
- [Using the tool in more advanced scenarios] (i.e. remote backends, appending to preexisting environments)

> [!NOTE]
> Data Collection
>
> Azure Export for Terraform collects telemetry data by default. Microsoft aggregates collected data to identify patterns of usage to identify common issues and to improve the experience of Azure Export for Terraform. Azure Export for Terraform does not collect any private or personal data. For example, the usage data helps identify issues such as commands with low success and helps prioritize our work.
>
> While we appreciate the insights this data provides, we also understand that not everyone wants to send usage data. You can disable data collection with `aztfexport config set telemetry_enabled false`. You can also read the Microsoft privacy statement to learn more.