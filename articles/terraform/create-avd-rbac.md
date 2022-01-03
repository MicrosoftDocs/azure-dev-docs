---
title: Configure Azure Virtual Desktop Role Based access control using Terraform
description: Learn how to use Terraform to configure role based access control for Azure Virtual Desktop.
keywords: azure devops terraform avd virtual desktop rbac
ms.topic: how-to
ms.date: 12/18/2021
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop RBAC using Terraform

In this article we will walk through adding our users and Azure AD group and then assigning the group to the "Desktop Virtualization User" role, scoped to our host pool.  We could similarly assign permissions to the users that will manage AVD by assigning users or groups to other [Built in Roles for Azure Virtual Desktop](/virtual-desktop/virtual-desktop/rbac.md).

In this article, you learn how to:
> [!div class="checklist"]

> * Use Terraform to read Azure Active Directory (AAD) existing users
> * Use Terraform to create AAD group
> * Role assignment for Azure Virtual Desktop

## Prerequisites

This article assumes you have already deployed the [Azure Virtual Desktop Infrastructure](/virtual-desktop/create-azure-virtual-desktop.md).


## 1. Data Sources

Firstly we need to access the information about our existing users and built in role definition using `data`.

```terraform

data "azuread_user" "aaduser" {
  for_each            = toset(var.avdusers)
  user_principal_name = format("%s", each.key)
}

data "azurerm_role_definition" "role" { # access an existing builtin role
  name = "Desktop Virtualization User"
}
```

## 2. Azure AD Group

Next we will create our AAD group and a group member resource.  This will iterate through the set of users we have defined in our variables.

```terraform
resource "azuread_group" "aadgroup" {
    display_name = "$(var.aadgroupname)"
 }

resource "azuread_group_member" "aadgroupmember" {
  for_each         = data.azuread_user.aaduser
  group_object_id  = azuread_group.aadgroup.id
  member_object_id = each.value["id"]
}
```
## 3. Role Assignment

Lastly we need to assign the role to our application group.  `azurerm_virtual_desktop_application_group.remoteapp.id` references the application group that was created previously. 

```terraform
resource "azurerm_role_assignment" "role" {
  scope              = azurerm_virtual_desktop_application_group.remoteapp.id
  role_definition_id = data.azurerm_role_definition.role.id
  principal_id       = azuread_group.aadgroup.id
}
```

## 4. Complete Terraform Script

To bring all these sections together and see Terraform in action, create a new file called **rbac.tf** and paste the following content:


```terraform

data "azuread_user" "aaduser" {
  for_each            = toset(var.avdusers)
  user_principal_name = format("%s", each.key)
}

data "azurerm_role_definition" "role" { # access an existing builtin role
  name = "Desktop Virtualization User"
}


resource "azuread_group" "aadgroup" {
    display_name = "$(var.aadgroupname)"
 }

resource "azuread_group_member" "aadgroupmember" {
  for_each         = data.azuread_user.aaduser
  group_object_id  = azuread_group.aadgroup.id
  member_object_id = each.value["id"]
}

resource "azurerm_role_assignment" "role" {
  scope              = azurerm_virtual_desktop_application_group.remoteapp.id
  role_definition_id = data.azurerm_role_definition.role.id
  principal_id       = azuread_group.aadgroup.id
}
```

We can also create a **.tfvars** file to pass our list of users - in this case we will call it **env.auto.tfvars** and add the following block:

```terraform
avdusers = [
    "user1@<domain.com>",
    "user2@<domain.com>"
]
```
We will also need to add variables to our variables.tf file for avdusers and aadgroupname.

Lastly, we assume that the provider was declared in our main.tf file when we created our [infrastructure](/virtual-desktop/create-azure-virtual-desktop.md).  We will need to add the Azure AD provider as well, so that we can run the above.  The amended block will now look like:

```terraform
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = ">= 2.26"
    }
    azuread = {
      source = "hashicorp/azuread"
    }
  }
  required_version = ">= 0.14.9"
}
```

You are now ready to [build and deploy](/articles/terraform/create-azure-virtual-desktop.md#build-and-deploy-the-infrastructure) your infrastructure with role based access control.
## Next steps

> [!div class="nextstepaction"] 
> [Learn more about Configuring Azure Virtual Desktop session hosts using Terraform in Azure](/articles/terraform/create-avd-session-host.md)