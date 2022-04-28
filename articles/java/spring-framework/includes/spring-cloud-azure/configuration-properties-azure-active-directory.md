---
ms.date: 04-26-2022
ms.author: v-yonghuiye
---

## Azure Active Directory properties

> [!div class="mx-tdBreakAll"]
> |Property | Description|
> |---------|------------|
> |spring.cloud.azure.active-directory.app-id-uri | App ID URI which might be used in the "aud" claim of an id_token. |
> |spring.cloud.azure.active-directory.application-type | Type of the Azure AD application. |
> |spring.cloud.azure.active-directory.authenticate-additional-parameters | Add additional parameters to the Authorization URL. |
> |spring.cloud.azure.active-directory.authorization-clients | The OAuth2 authorization clients. |
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
> |spring.cloud.azure.active-directory.credential.client-id | Client ID to use when performing service principal authentication with Azure. |
> |spring.cloud.azure.active-directory.credential.client-secret | Client secret to use when performing service principal authentication with Azure. |
> |spring.cloud.azure.active-directory.enabled | Whether to enable Azure Active Directory related auto-configuration. The default value is `false`. |
> |spring.cloud.azure.active-directory.jwk-set-cache-lifespan | The lifespan of the cached JWK set before it expires, default is 5 minutes. The default value is `5m`. |
> |spring.cloud.azure.active-directory.jwk-set-cache-refresh-time | The refresh time of the cached JWK set before it expires, default is 5 minutes. The default value is `5m`. |
> |spring.cloud.azure.active-directory.jwt-connect-timeout | Connection Timeout for the JWKSet Remote URL call. |
> |spring.cloud.azure.active-directory.jwt-read-timeout | Read Timeout for the JWKSet Remote URL call. |
> |spring.cloud.azure.active-directory.jwt-size-limit | Size limit in Bytes of the JWKSet Remote URL call. |
> |spring.cloud.azure.active-directory.post-logout-redirect-uri | The redirect uri after logout. |
> |spring.cloud.azure.active-directory.profile.cloud-type | Name of the Azure cloud to connect to. Supported types are: AZURE, AZURE_CHINA, AZURE_GERMANY, AZURE_US_GOVERNMENT, OTHER. |
> |spring.cloud.azure.active-directory.profile.environment.active-directory-endpoint | Azure Active Directory endpoint. For example: https://login.microsoftonline.com/ |
> |spring.cloud.azure.active-directory.profile.environment.microsoft-graph-endpoint | Microsoft Graph endpoint. For example: https://graph.microsoft.com/ |
> |spring.cloud.azure.active-directory.profile.tenant-id | Azure Tenant ID. |
> |spring.cloud.azure.active-directory.redirect-uri-template | Redirection Endpoint: Used by the authorization server to return responses containing authorization credentials to the client via the resource owner user-agent. The default value is `{baseUrl}/login/oauth2/code/`. |
> |spring.cloud.azure.active-directory.resource-server.claim-to-authority-prefix-map | Configure which claim will be used to build GrantedAuthority, and prefix of the GrantedAuthority's string value. Default value is: "scp" -> "SCOPE_", "roles" -> "APPROLE_". |
> |spring.cloud.azure.active-directory.resource-server.principal-claim-name | Configure which claim in access token be returned in AuthenticatedPrincipal#getName. Default value is "sub". |
> |spring.cloud.azure.active-directory.session-stateless | If true activates the stateless auth filter Azure ADAppRoleStatelessAuthenticationFilter. The default is false which activates Azure ADAuthenticationFilter. The default value is `false`. |
> |spring.cloud.azure.active-directory.user-group.allowed-group-ids | The group ids can be used to construct GrantedAuthority. |
> |spring.cloud.azure.active-directory.user-group.allowed-group-names | The group names can be used to construct GrantedAuthority. |
> |spring.cloud.azure.active-directory.user-group.use-transitive-members | If "true", use "v1.0/me/transitiveMemberOf" to get members. Otherwise, use "v1.0/me/memberOf". The default value is `false`. |
> |spring.cloud.azure.active-directory.user-name-attribute | Decide which claim to be principal's name. |
