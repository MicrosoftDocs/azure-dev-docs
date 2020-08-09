---
author: edburns
ms.author: edburns
ms.date: 08/09/2020
---

### Account for authentication and authorization

Make sure you've covered how your application handles authentication and authorization.  If your existing application uses LDAP for authentication, the WebLogic Server on Azure supports automatic integration via Azure Active Directory Domain Services (Azure AD DS).  This integration enables secure LDAP to flow through Azure AD DS to create the default realm for WebLogic Server.  For more details, see [End-user authorization and authentication for migrating Java apps on WebLogic Server to Azure](migrate-weblogic-with-aad-ldap.md).
