---
page_type: sample
languages:
- java
products:
- ms-graph
- azure-app-service
- azure-storage
- azure-key-vault
- azure-active-directory
- azure-active-directory-b2c
- microsoft-identity-platform
- entra
description: "Tutorial: Enable your Java Jboss EAP webapp to sign users in, protect endpoints, call APIs with the Microsoft identity platform"
urlFragment: msal-java-jboss-eap-web-app
---

# Tutorial: Enable your Java Tpmcat web app to sign in users and call APIs with the Microsoft identity platform

The [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/v2-overview), along with [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis) (Azure AD) and [Azure Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/overview) (Azure AD B2C) are central to the **Azure** cloud ecosystem. This tutorial aims to take you through the fundamentals of modern authentication using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)

We recommend following the chapters in successive order. However, the code samples are self-contained, so feel free to pick samples by topics that you may need at the moment.

> :warning: This is a *work in progress*. Come back frequently to discover more samples.

## Prerequisites

- Java 8. This sample has been developed on Java 8 but should be compatible with some higher versions.
- [Maven 3](https://maven.apache.org/download.cgi)
- [JBoss EAP](https://developers.redhat.com/products/eap/download)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [VS Code Azure Tools Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

Please refer to each chapter's README for sample-specific prerequisites.

## Recommendations

- Some familiarity with the [Java / Jakarta Servlets](https://projects.eclipse.org/projects/ee4j.servlet)
- Some familiarity with Linux/OSX terminal or Windows PowerShell
- [jwt.ms](https://jwt.ms) for inspecting your tokens.
- [Fiddler](https://www.telerik.com/fiddler) for monitoring your network activity and troubleshooting.
- Follow the [Azure AD Blog](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/bg-p/Identity) to stay up-to-date with the latest developments.

Please refer to each sample's README for sample-specific recommendations.

## Contents

### Chapter 1: Enable your web application to sign in users

|               |               |
|---------------|---------------|
| <img src="media/sign-in.png" width="200"> | [**1.1 Sign-in with Azure AD**](./1-Authentication/sign-in) </br> Sign your users in with **Azure AD** and learn to work with **ID Tokens**.  |
| <img src="media/sign-in-2.png" width="200"> | [**1.2 Sign-in with Azure AD B2C**](./1-Authentication/sign-in-b2c) </br> Sign your customers in with **Azure AD B2C**. Learn to integrate with **external social identity providers**. Learn how to use **user-flows** and **custom policies**. |

### Chapter 2: Get an Access Token and call Microsoft Graph

|                |               |
|----------------|---------------|
| <img src="media/topology.png" width="200"> | [**2.1 Acquire an Access Token from Azure AD and call Microsoft Graph**](./2-Authorization-I/call-graph) </br> Enable your web app to acquire an Access Token to Authorize it to call **Microsoft Graph API**. |


### Chapter 3: Restrict access to routes based on group and / or role membership

|                |               |
|----------------|---------------|
| <img src="media/sign-in.png" width="200"> | [**3.1 Acquire an ID Token with the roles claim**](./3-Authorization-II/roles) </br> Enable your web app to acquire an ID Token with the **Roles** claim. Filter access to routes based on the role membership. |
| <img src="media/sign-in.png" width="200"> | [**3.2 Acquire an ID Token with the Groups claim**](./3-Authorization-II/groups) </br> Enable your web app to acquire an ID Token with a **Groups** claim. Filter access to routes based on the role membership. Learn how to call Graph to handle edge cases where the user is a member of too many groups to fit into an ID Token. |

### Chapter 4: Deploy your app to Azure

|                 |               |
|-----------------|---------------|
| <img src="media/sign-in.png" width="200"> | [**4.1 Deploy to Azure App Service**](./4-Deployment/deploy-to-azure-app-service) </br> Prepare your app for deployment to Azure App Service. Learn how to package and upload files, configure authentication parameters and use various Azure services for managing your operations. |

## We'd love your feedback!

Were we successful in addressing your learning objective? Consider taking a moment to [share your experience with us](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpURDQwVUxQWENUMlpLUlA0QzdJNVE3TUJRSyQlQCN0PWcu).

## More information

Learn more about the **Microsoft identity platform**:

- [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/)
- [Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/)
- [Overview of Microsoft Authentication Library (MSAL)](https://docs.microsoft.com/azure/active-directory/develop/msal-overview)
- [Application types for Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/v2-app-types)
- [Understanding Azure AD application consent experiences](https://docs.microsoft.com/azure/active-directory/develop/application-consent-experience)
- [Understand user and admin consent](https://docs.microsoft.com/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent)
- [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals)
- [Microsoft identity platform best practices and recommendations](https://docs.microsoft.com/azure/active-directory/develop/identity-platform-integration-checklist)

See more code samples:

- [MSAL code samples](https://docs.microsoft.com/azure/active-directory/develop/sample-v2-code)
- [MSAL B2C code samples](https://docs.microsoft.com/azure/active-directory-b2c/code-samples)

## Community Help and Support

Use [Stack Overflow](http://stackovergrant.com/questions/tagged/msal) to get support from the community.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`ms-identity` `azure-ad` `azure-ad-b2c` `msal` `java`].

If you find a bug in the sample, please raise the issue on [GitHub Issues](../../issues).

To provide a recommendation, visit the following [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.