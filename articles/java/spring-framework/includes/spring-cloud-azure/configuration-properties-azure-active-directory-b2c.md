---
ms.date: 04-26-2022
ms.author: v-yonghuiye
---
## Azure Active Directory B2C properties

> [!div class="mx-tdBreakAll"]
> |Property | Description|
> |---------|------------|
> |spring.cloud.azure.active-directory.b2c.app-id-uri | App ID URI which might be used in the "aud" claim of a token. |
> |spring.cloud.azure.active-directory.b2c.authenticate-additional-parameters | Additional parameters for authentication. |
> |spring.cloud.azure.active-directory.b2c.authorization-clients | Specify client configuration. |
> |spring.cloud.azure.active-directory.b2c.base-uri | Azure AD B2C endpoint base uri. |
> |spring.cloud.azure.active-directory.b2c.credential.client-id | Client ID to use when performing service principal authentication with Azure. |
> |spring.cloud.azure.active-directory.b2c.credential.client-secret | Client secret to use when performing service principal authentication with Azure. |
> |spring.cloud.azure.active-directory.b2c.enabled | Whether to enable Azure Active Directory B2C related auto-configuration. The default value is `false`. |
> |spring.cloud.azure.active-directory.b2c.jwt-connect-timeout | Connection Timeout for the JWKSet Remote URL call. |
> |spring.cloud.azure.active-directory.b2c.jwt-read-timeout | Read Timeout for the JWKSet Remote URL call. |
> |spring.cloud.azure.active-directory.b2c.jwt-size-limit | Size limit in Bytes of the JWKSet Remote URL call. |
> |spring.cloud.azure.active-directory.b2c.login-flow | Specify the primary sign-in flow key. The default value is `sign-up-or-sign-in`. |
> |spring.cloud.azure.active-directory.b2c.logout-success-url | Redirect url after logout. The default value is `http://localhost:8080/login`. |
> |spring.cloud.azure.active-directory.b2c.profile.tenant-id | Azure Tenant ID. |
> |spring.cloud.azure.active-directory.b2c.reply-url | Reply url after get authorization code. The default value is `{baseUrl}/login/oauth2/code/`. |
> |spring.cloud.azure.active-directory.b2c.user-flows | User flows. |
> |spring.cloud.azure.active-directory.b2c.user-name-attribute-name | User name attribute name. |
