---
ms.author: bbanerjee
ms.date: 01/01/2024
---

## Scenario

1. This web application uses [**MSAL for Java (MSAL4J)**](https://github.com/AzureAD/microsoft-authentication-library-for-java) to sign in a user and obtain an [ID Token](/entra/identity-platform/id-tokens) from **Microsoft Entra ID**:

This sample first uses the  **MSAL for Java (MSAL4J)** to sign in the user. On the home page it displays an option for the user to view the claims in their ID Tokens. This web application also allows the users to view a **privileged admin page** or a **regular user page** depending on the app role they have been assigned to. The idea is to provide an example of how, within an application, access to certain functionality/page is restricted to subsets of users depending on which role they belong to.

This kind of authorization is implemented using role-based access control (RBAC). When using RBAC, an administrator grants permissions to roles, not to individual users or groups. The administrator can then assign roles to different users and groups to control who has then access to certain content and functionality.

This sample application defines the following two *Application Roles*:

- `PrivilegedAdmin`: Authorized to access the `Admins Only` and the `Regular Users` pages.
- `RegularUser`: Authorized to access the `Regular Users` page.

These application roles are defined in the [Azure portal](https://portal.azure.com) in the application's registration manifest. When a user signs into the application, Microsoft Entra ID emits a `roles` claim for each role that's been granted individually to the user in the form of role membership. Assignment of users and groups to roles can be done through the portal's UI, or programmatically using the [Microsoft Graph](https://graph.microsoft.com) and [Microsoft Azure AD PowerShell](/powershell/module/azuread/). In this sample, application role management is done through the Azure portal or using PowerShell.

> [!NOTE]
> Role claims aren't present for guest users in a tenant if the `https://login.microsoftonline.com/common/` endpoint is used as the authority to sign in users. You need to sign-in a user to a tenanted endpoint like 'https://login.microsoftonline.com/tenantid'
