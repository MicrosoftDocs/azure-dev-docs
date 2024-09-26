---
author: KarlErickson
ms.author: jiangma
ms.date: 09/26/2024
---

Next, register an application by following the steps in [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app). Use the following directions as you go through the article, then return to this article after you register and configure the application.

1. When you reach the [Register an application](/entra/identity-platform/quickstart-register-app#register-an-application) section, use the following steps:
   1. For **Supported account types**, select **Accounts in this organizational directory only (Default directory only - Single tenant)**.
   1. When registration finishes, save the **Application (client) ID** and **Directory (tenant) ID** values to use later in the app configuration.
1. When you reach the [Add a redirect URI](/entra/identity-platform/quickstart-register-app#add-a-redirect-uri) section, use the following steps:
   1. For **Configure platforms**, select **Web**.
   1. For **Redirect URIs**, enter `http://localhost:8080` for your Quarkus app or `https://localhost:9443/ibm/api/social-login/redirect/liberty-entra-id` for your Open Liberty/WebSphere Liberty app.
1. When you reach the [Add credentials](/entra/identity-platform/quickstart-register-app#add-credentials) section, select the **Add a client secret** tab.
1. When you add a client secret, write down the **Client secret** value to use later in the app configuration.
