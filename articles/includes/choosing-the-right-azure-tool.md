# Choosing the right command-line tool for Azure

When it comes to managing Azure, knowing which tool to use can be confusing.

[Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli), [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps), and [Azure Cloud Shell](http://shell.azure.com/) all have overlapping functionality. Because each operates differently, it's
difficult to determine which is the right tool to use.

In this article, you'll learn how to choose the right tool for you.

## Azure CLI vs Azure PowerShell

Azure CLI and Azure PowerShell are command-line tools that create and manage Azure resources. Both are cross-platform, installable
on Windows, macOS, and Linux.

**Azure CLI**

* Cross-platform command-line interface, installable on Windows, macOS, Linux
* Requires Windows PowerShell, Cmd, or Bash

**Azure PowerShell**

* Cross-platform PowerShell module, runs on Windows, macOS, Linux
* Requires Windows PowerShell or PowerShell

## Different Shell Environments

|Shell Environment|Azure CLI|Azure PowerShell|
|---|:---:|:---:|
|Cmd|Yes||
|Bash|Yes|
|Windows PowerShell|Yes|Yes|
|PowerShell|Yes|Yes|

Windows PowerShell, PowerShell, Cmd, and Bash are shell environments. Your shell environment not only determines which tools you can use but also changes the experience.

For example, Bash uses backslashes `\` and Windows PowerShell uses backticks `` ` `` as a line continuation character. The differences in the shell environment don't change how Azure CLI and Azure PowerShell operate. However, they do change your command-line experience.

Azure CLI has an installer that makes its commands executable in all four shell environments.

Azure PowerShell is a PowerShell module named `Az`, not an executable.

It can only be installed using Windows PowerShell or PowerShell. Windows PowerShell is the standard scripting shell that comes preinstalled with most Windows operating systems. PowerShell is a stand-alone installation that uses .NET Core as it's run time, allowing it to be (cross-platform), installable on macOS, Linux, and Windows.

**NOTE**:

* AzureRM is a PowerShell module that is still referenced for Azure administration with PowerShell. However, it has been replaced by Azure PowerShell and has an official retire date of February 29 2024. 

Using AzureRM? You can [migrate Azure PowerShell from AzureRM to Az](https://docs.microsoft.com/powershell/azure/migrate-from-azurerm-to-az).

## What about Azure Cloud Shell?

Azure Cloud Shell is a hosted shell environment.

It's accessible in a web browser and has integrations for [Windows Terminal](https://channel9.msdn.com/Shows/IT-Ops-Talk/Azure-Cloud-Shell-in-the-Windows-Terminal) and [Visual Studio Code](https://azure.microsoft.com/en-us/blog/cloudshelleditor/).

Azure Cloud Shell provides both a PowerShell and Bash shell environment. It comes with Azure CLI and Azure PowerShell preinstalled, among many other command-line tools. Customizing the terminal is limited because it's hosted as a Ubuntu container that Microsoft manages. With the upside being, you don't have to keep the command-line tools up-to-date. And the downside being, you can't update or downgrade the tools.

![Azure CloudShell Bash and PowerShell environments](./media/choosing-the-right-azure-tool/azure-cloud-shell-bash-powershell.png)

Another benefit of Azure CloudShell is that authentication to Azure is handled through your subscription login.

For example, using Azure Cloud Shell in the browser used the authentication from Azure Portal to connect you to your subscription and Azure Resources.

## Which Command-line tool is right for you?

When picking the right tool, it's useful to consider your past experience and current work environment.

Azure CLI is similar to Bash scripting. If you work primarily with Linux systems, Azure CLI is going to feel more natural. Its commands are shorter and the syntax is
similar to that of Bash scripting.

Azure PowerShell is a PowerShell module. If you work primarily with Windows systems, Azure PowerShell is a natural fit. Commands follow a verb-noun naming scheme and
data is returned as objects.

Choose the tool that uses your experience. But also factor in your current work environment. Doing so will shorten the learning curve. And help you become proficient at managing Azure at the command line.

With that said, exercising a growth mindset will only improve your abilities. Use a different tool when it makes sense.

**Note**:

* Feature parity for Azure services doesn't always exist between Azure CLI and Azure PowerShell. But, new functionality is constantly being added.

## Azure CLI and Azure PowerShell Side-by-side Command Comparison

<br>

##### Sign in, Subscription, and Location Commands:

<br>

|Command|Azure CLI|Azure PowerShell|
|---|---|---|
|Sign in with Web Browser|az login|Connect-AzAccount|
|Get available subscriptions|az account list|Get-AzSubscription|
|Set Subscription|az account set –subscription \<SubscriptionId>|Set-AzContext -Subscription \<SubscriptionID>|
|List Azure Locations|az account list-locations|Get-AzLocation|

---

<br>

#### Find Versions, Get Help, and View Command Help:

<br>

|Command|Azure CLI|Azure PowerShell|
|---|---|---|
|Find Version|az --version|Get-InstalledModule -Name Az|
|Get Help|az help|Get-Help|
|View Command Help|az vm --help|Get-Help -Name New-AzVM

---

<br>

#### Create a Resource Group, VM, and Storage Account:

<br>

|Command|Azure CLI|Azure PowerShell|
| --- | --- | --- |
| Create Resource Group | az group create --name \<ResourceGroupName> --location eastus |New-AzResourceGroup -Name \<ResourceGroupName> -Location eastus
| Create Azure Virtual Machine | az vm create --resource-group myResourceGroup --name myVM --image UbuntuLTS --admin-username azureuser --admin-password '\<Password>' |  New-AzVM -ResourceGroupName \<ResourceGroupName> -Name myVM -Image UbuntuLTS -Credential (Get-Credential) |
| Create Azure Storage Account | az storage account create --name \<StorageAccountName> --resource-group \<ResourceGroupName> --location eastus --sku Standard_LRS --kind StorageV2 | New-AzStorageAccount -Name \<StorageAccountName> -ResourceGroupName \<ResourceGroupName> -Location eastus -SkuName Standard_LRS -Kind StorageV2

---

<br>

#### Manage Azure Virtual Machines:

<br>

|Command|Azure CLI|Azure PowerShell|
| --- | --- | --- |
|List VM|az vm list|Get-AzVM
|Restart VM|az vm restart --name myVM --resource-group \<ResourceGroupName>|Restart-AzVM -Name myVM -ResourceGroupName \<ResourceGroupName>
|Stop VM|az vm stop --name myVM --resource-group \<ResourceGroupName>|Stop-AzVM -Name myVM -ResourceGroupName \<ResourceGroupName>
|Stop & Deallocate VM| az vm deallocate --name myVM --resource-group \<ResourceGroupName>|Stop-AzVM -Name myVM -ResourceGroupName \<ResourceGroupName>
|Start VM| az vm start --name myVM --resource-group \<ResourceGroupName>|Start-AzVM -Name myVM -ResourceGroupName \<ResourceGroupName>
|Delete VM|az vm delete --name myVM --resource-group \<ResourceGroupName>|Remove-AzVM -Name myVM -ResourceGroupName \<ResourceGroupName>|

<br>

#### Select Properties and Change Output Formats:

<br>

|Command|Azure CLI|Azure PowerShell|
| --- | --- | --- |
|Show all subscription information|az account list --all|Get-AzSubscription | Select-Object -Property *|
|Output as a Table|az account list -o table| Get-AzSubscription \| Format-Table|
|Output as JSON|az account show|Get-AzSubscription \| ConvertTo-Json|

Note:

* Azure CLI defaults to outputting a JSON string. Other format options can be found on the [Output formats for Azure CLI commands](https://docs.microsoft.com/cli/azure/format-output-azure-cli).
* Azure PowerShell defaults to outputting objects. To learn more about formatting in PowerShell read the [Using Format Commands to Change Output View](https://docs.microsoft.com/powershell/scripting/samples/using-format-commands-to-change-output-view).

## Next Steps:

Azure CLI:

* [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
* [Azure CLI Command Reference](https://docs.microsoft.com/cli/azure/service-page/list%20a%20-%20z?view=azure-cli-latest)
* [Azure CLI reference types and status](https://docs.microsoft.com/cli/azure/reference-types-and-status)

Azure PowerShell:

* [Install Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps)
* [Azure PowerShell Command Reference](https://docs.microsoft.com/powershell/module/az.accounts/)
