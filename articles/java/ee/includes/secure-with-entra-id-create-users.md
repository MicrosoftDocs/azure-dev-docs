---
author: KarlErickson
ms.author: jiangma
ms.date: 09/26/2024
---

First, create two users in your Microsoft Entra tenant by following the steps in [How to create, invite, and delete users](/entra/fundamentals/how-to-create-delete-users). You just need the [Create a new user](/entra/fundamentals/how-to-create-delete-users#create-a-new-user) section. Use the following directions as you go through the article, then return to this article after you create users in your Microsoft Entra tenant.

To create a user to serve as an "admin" in the app, use the following steps:

1. When you reach the **Basics** tab in the [Create a new user](/entra/fundamentals/how-to-create-delete-users#create-a-new-user) section, use the following steps:
   1. For **User principal name**, enter *admin*. Save the value so you can use it later when you sign in to the app.
   1. For **Mail nickname**, select **Derive from user principal name** 
   1. For **Display name**, enter *Admin*.
   1. For **Password**, select **Auto-generate password**. Copy and save the **Password** value to use later when you sign in to the app.
   1. Select **Account enabled**.

      :::image type="content" source="../media/quarkus-with-microsoft-entra-id/create-admin-user.png" alt-text="Screenshot of the Azure portal that shows the Create new user Basics pane for an admin user." lightbox="../media/quarkus-with-microsoft-entra-id/create-admin-user.png":::

   1. Select **Review + create** > **Create**. Wait until the user is created.
   1. Wait a minute or so and select **Refresh**. You should see the new user in the list.

To create a user to serve as a "user" in the app, repeat these steps, but use the following values:

- For **User principal name**, enter *user*.
- For **Display name**, enter *User*.

:::image type="content" source="../media/quarkus-with-microsoft-entra-id/create-regular-user.png" alt-text="Screenshot of the Azure portal that shows the Create new user Basics pane for a regular user." lightbox="../media/quarkus-with-microsoft-entra-id/create-regular-user.png":::
