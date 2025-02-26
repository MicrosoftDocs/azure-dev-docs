---
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 03/11/2024
---

This application implements role-based access control (RBAC) using Microsoft Entra ID's application roles and role claims feature. Another approach is to use Microsoft Entra ID groups and group claims. Microsoft Entra ID groups and application roles aren't mutually exclusive. You can use them both to provide fine-grained access control.

You can also use RBAC with application roles and role claims to securely enforce authorization policies.

For a video that covers this scenario and this sample, see [Implement authorization in your applications using app roles, security groups, scopes, and directory roles](https://www.youtube.com/watch?v=LRoc-na27l0).

For more information about how the protocols work in this scenario and in other scenarios, see [Authentication vs. authorization](/entra/identity-platform/authentication-vs-authorization).

This application uses [MSAL for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java) to sign in a user and obtain an [ID token](/entra/identity-platform/id-tokens) from Microsoft Entra ID.

This sample first uses the MSAL for Java (MSAL4J) to sign in the user. On the home page it displays an option for the user to view the claims in their ID tokens. This application also enables the users to view a privileged admin page or a regular user page, depending on the app role they've been assigned to. The idea is to provide an example of how, within an application, access to certain functionality or pages is restricted to subsets of users depending on which role they belong to.

This kind of authorization is implemented using RBAC. With RBAC, an administrator grants permissions to roles, not to individual users or groups. The administrator can then assign roles to different users and groups to control who has access to certain content and functionality.

This sample application defines the following two *Application Roles*:

- `PrivilegedAdmin`: Authorized to access the **Admins Only** and the **Regular Users** pages.
- `RegularUser`: Authorized to access the **Regular Users** page.

These application roles are defined in the [Azure portal](https://portal.azure.com) in the application's registration manifest. When a user signs into the application, Microsoft Entra ID emits a roles claim for each role granted individually to the user in the form of role membership.

You can assign users and groups to roles through the Azure portal.

> [!NOTE]
> Role claims aren't present for guest users in a tenant if the `https://login.microsoftonline.com/common/` endpoint is used as the authority to sign in users. You need to sign in a user to a tenanted endpoint like `https://login.microsoftonline.com/tenantid`.
