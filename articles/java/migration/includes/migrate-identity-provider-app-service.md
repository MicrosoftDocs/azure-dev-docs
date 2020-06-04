---
author: yevster
ms.author: yebronsh
ms.date: 5/19/2020
---

### Migrate and enable the identity provider

If your application requires authentication or authorization, ensure they're configured to access the identity provider by using the following guidance:

* If the identity provider is Azure Active Directory, no changes should be necessary.
* If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Azure Active Directory. For more information, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).
* If the identity provider is another on-premises solution, such as PingFederate, consult the [Custom installation of Azure AD Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) topic to configure federation with Azure Active Directory. Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#oauth2) or [SAML](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#servlet-saml2).
