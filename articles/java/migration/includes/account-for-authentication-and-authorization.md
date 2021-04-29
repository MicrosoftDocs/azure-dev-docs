---
author: edburns
ms.author: edburns
ms.date: 08/09/2020
---

### Account for authentication and authorization

Most applications have some kind of authentication and authorization.  If you use LDAP for authentication, WebLogic Server on Azure supports automatic integration. The marketplace offer uses Azure Active Directory Domain Services (Azure AD DS) with secure LDAP.  The offer creates the default realm for WebLogic Server from data in the Azure AD DS.  For more information, see [End-user authorization and authentication for migrating Java apps on WebLogic Server to Azure](../migrate-weblogic-with-aad-ldap.md).
