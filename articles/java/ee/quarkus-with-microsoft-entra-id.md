---
title: "Quarkus with Microsoft Entra ID"
description: Shows how to secure Quarkus applications with Microsoft Entra ID using OpenID Connect.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 06/14/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-quarkus, devx-track-javaee-quarkus-entra-id, devx-track-extended-java, devx-track-azurecli
---

# Secure Quarkus applications with Microsoft Entra ID using OpenID Connect

This article shows you how to secure Red Hat Quarkus applications with Microsoft Entra ID using OpenID Connect with a simple web application.

In this article, you learn how to:

> [!div class="checklist"]
> - Set up an OpenID Connect provider with Microsoft Entra ID.
> - Protect a Quarkus app by using OpenID Connect.
> - Run and test the Quarkus app.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- The Azure account must be at least a [Cloud Application Administrator](/entra/identity/role-based-access-control/permissions-reference#cloud-application-administrator).
- If you don't have an existing Microsoft Entra tenant, [set up a tenant](/entra/identity-platform/quickstart-create-new-tenant).
- Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, or Windows Subsystem for Linux).
- Install and set up [Git](/devops/develop/git/install-and-set-up-git).
- Install a Java SE implementation, version 21 or later - for example, [the Microsoft build of OpenJDK](/java/openjdk).
- Install [Maven](https://maven.apache.org/download.cgi), version 3.9.3 or later.

## Set up an OpenID Connect provider with Microsoft Entra ID

In this section, you set up an OpenID Connect provider with Microsoft Entra ID for use with your Quarkus app. In a later section, you configure the Quarkus app by using OpenID connect to authenticate and authorize users in your Microsoft Entra tenant.

### Create users in Microsoft Entra tenant

First, create two users in your Microsoft Entra tenant by following steps in [How to create, invite, and delete users](/entra/fundamentals/how-to-create-delete-users). You just need the section [Create a new user](/entra/fundamentals/how-to-create-delete-users#create-a-new-user). Use the following directions as you go through the article, then return to this article after you create users in your Microsoft Entra tenant.

1. When you reach the **Basics** of section [Create a new user](/entra/fundamentals/how-to-create-delete-users#create-a-new-user):
   1. Enter a unique username for **User principal name** and copy the **User principal name** value. You use this value later when you sign in to the Quarkus app.
   1. Select **Derive from user principal name** for **Mail nickname**.
   1. Enter the user's name for **Display name**.
   1. Select **Auto-generate password** for **Password** and copy the **Password** value. You use this value later when you sign in to the Quarkus app.
   1. Select **Account enabled**.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/create-admin-user.png" alt-text="Screenshot of creating an user acting as admin." lightbox="media/quarkus-with-microsoft-entra-id/create-admin-user.png":::

   1. Select **Review + create** > **Create**. Wait until the user is created.
   1. Refresh the page and you should see the new user in the list.

   1. Repeat the above steps to create a second user.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/create-regular-user.png" alt-text="Screenshot of creating a user acting as normal user." lightbox="media/quarkus-with-microsoft-entra-id/create-regular-user.png":::

   The first user is used as an administrator, and the second user is used as a regular user.

### Register an application in Microsoft Entra ID

Next, register an application by following steps in [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app). Use the following directions as you go through the article, then return to this article after you register and configure the application.

1. When you reach the section [Register an application](/entra/identity-platform/quickstart-register-app#register-an-application):
   1. Select **Accounts in this organizational directory only (Personal only - Single tenant)** for **Supported account types** in this quickstart.
   1. When registration finishes, write down the **Application (client) ID** and **Directory (tenant) ID**. You use these values later in the Quarkus app configuration.

1. When you reach the section [Add a redirect URI](/entra/identity-platform/quickstart-register-app#add-a-redirect-uri):
   1. Select **Web** for the **Configure platforms** and enter `http://localhost:8080` for the **Redirect URIs**.

1. When you reach the section [Add credentials](/entra/identity-platform/quickstart-register-app#add-credentials), select [Add a client secret](/entra/identity-platform/quickstart-register-app#add-a-client-secret) in this quickstart.
   1. When you add a client secret, write down the **Client secret** value. You use this value later in the Quarkus app configuration.

### Add app roles to your application

Then, add app roles to your application by following steps in [Add app roles to your application and receive them in the token](/entra/identity-platform/howto-add-app-roles-in-apps). You just need section [Declare roles for an application](/entra/identity-platform/howto-add-app-roles-in-apps#declare-roles-for-an-application) and section [Assign users and groups to Microsoft Entra roles](/entra/identity-platform/howto-add-app-roles-in-apps#assign-users-and-groups-to-microsoft-entra-roles). Use the following directions as you go through the article, then return to this article after you declare roles for the application.

1. When you reach the section [Declare roles for an application](/entra/identity-platform/howto-add-app-roles-in-apps#declare-roles-for-an-application), in **App roles UI**:
   1. Enter `Admin` for **Display name**.
   1. Select **Users/Groups** for **Allowed member types**.
   1. Enter `admin` for **Value**.
   1. Enter `Admin` for **Description**.
   1. Select **Do you want to enable this app role?**.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/create-admin-role.png" alt-text="Screenshot of creating a role used by admin." lightbox="media/quarkus-with-microsoft-entra-id/create-admin-role.png":::

   1. Select **Apply**. Wait until the role is created.

   1. Repeat the steps to create a second role.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/create-user-role.png" alt-text="Screenshot of creating a role used by regular user." lightbox="media/quarkus-with-microsoft-entra-id/create-user-role.png":::

   The first role is used by the administrator, and the second role is used by the regular user.

1. When you reach the section [Assign users and groups to Microsoft Entra roles](/entra/identity-platform/howto-add-app-roles-in-apps#assign-users-and-groups-to-microsoft-entra-roles):
   1. Select **Add user/group**. In **Add Assignment** pane, select user **Admin** for **Users** and select role **Admin** for **Select a role**. Select **Assign**. Wait until the application assignment succeeded.
   1. Repeat the above steps to assign the **User** role to user **User**.
   1. You should see the users and roles assigned in the **Users and groups** pane.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/users-and-roles-assigned.png" alt-text="Screenshot of users and roles assigned." lightbox="media/quarkus-with-microsoft-entra-id/users-and-roles-assigned.png":::
