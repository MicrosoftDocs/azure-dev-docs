---
author: KarlErickson
ms.author: jiangma
ms.date: 10/07/2024
---

Then, add app roles to your application by following steps in [Add app roles to your application and receive them in the token](/entra/identity-platform/howto-add-app-roles-in-apps). You just need the sections [Declare roles for an application](/entra/identity-platform/howto-add-app-roles-in-apps#declare-roles-for-an-application) and [Assign users and groups to Microsoft Entra roles](/entra/identity-platform/howto-add-app-roles-in-apps#assign-users-and-groups-to-microsoft-entra-roles). Use the following directions as you go through the article, then return to this article after you declare roles for the application.

1. When you reach the [Declare roles for an application](/entra/identity-platform/howto-add-app-roles-in-apps#declare-roles-for-an-application) section, use the **App roles** UI to create roles for the administrator and the regular user.

   1. Create an administrator user role by using the following values:
      - For **Display name**, enter *Admin*.
      - For **Allowed member types**, select **Users/Groups**.
      - For **Value**, enter *admin*.
      - For **Description**, enter *Admin*.
      - Select **Do you want to enable this app role?**.

      :::image type="content" source="media/secure-with-entra-id-add-app-roles/create-admin-role.png" alt-text="Screenshot of the Azure portal that shows the Create app role pane for the admin user." lightbox="media/secure-with-entra-id-add-app-roles/create-admin-role.png":::

   1. Select **Apply**. Wait until the role is created.

   1. Create a regular user role by using the same steps, but with the following values:
      - For **Display name**, enter *User*.
      - For **Value**, enter *user*.
      - For **Description**, enter *User*.

      :::image type="content" source="media/secure-with-entra-id-add-app-roles/create-user-role.png" alt-text="Screenshot of the Azure portal that shows the Create app role pane for the regular user." lightbox="media/secure-with-entra-id-add-app-roles/create-user-role.png":::

1. When you reach the [Assign users and groups to Microsoft Entra roles](/entra/identity-platform/howto-add-app-roles-in-apps#assign-users-and-groups-to-microsoft-entra-roles), section, use the following steps:
   1. Select **Add user/group**.
   1. In the **Add Assignment** pane, for **Users**, select user **Admin** and for **Select a role**, select role **Admin**. Then, select **Assign**. Wait until the application assignment succeeds. You might need to scroll the table sideways to see the **Role assigned** column.
   1. Repeat the previous steps to assign the **User** role to user **User**.
   1. Select **Refresh** and you should see the users and roles assigned in the **Users and groups** pane.

      :::image type="content" source="media/secure-with-entra-id-add-app-roles/users-and-roles-assigned.png" alt-text="Screenshot of the Azure portal that shows the users and roles assigned." lightbox="media/secure-with-entra-id-add-app-roles/users-and-roles-assigned.png":::

      You might need to adjust the width of the column headers to make your view look like the image.

Don't follow any other steps in **Add app roles to your application and receive them in the token**.
