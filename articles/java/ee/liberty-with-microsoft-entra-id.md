---
title: "WebSphere Liberty/Open Liberty with Microsoft Entra ID"
description: Shows you how to secure IBM WebSphere Liberty/Open Liberty applications with Microsoft Entra ID using OpenID Connect (OIDC).
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 09/26/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-entra-id, devx-track-extended-java, devx-track-azurecli
---

# Secure WebSphere Liberty/Open Liberty applications with Microsoft Entra ID using OpenID Connect

This article shows you how to secure IBM WebSphere Liberty/Open Liberty applications with Microsoft Entra ID using OpenID Connect (OIDC).

In this article, you learn how to:

> [!div class="checklist"]
> - Set up an OIDC provider with Microsoft Entra ID.
> - Protect a WebSphere Liberty/Open Liberty app by using OIDC.
> - Run and test the WebSphere Liberty/Open Liberty app.

## Prerequisites

[!INCLUDE [secure-with-entra-id-prerequisites](includes/secure-with-entra-id-prerequisites.md)]

## Set up an OIDC provider with Microsoft Entra ID

OpenID Connect is an industry standard authentication protocol well supported by Microsoft Entra ID. In this section, you set up an OIDC provider with Microsoft Entra ID for use with your WebSphere Liberty/Open Liberty app. In a later section, you configure the WebSphere Liberty/Open Liberty app by using OIDC to authenticate and authorize users in your Microsoft Entra tenant.

### Create users in Microsoft Entra tenant

[!INCLUDE [secure-with-entra-id-create-users](includes/secure-with-entra-id-create-users.md)]

### Register an application in Microsoft Entra ID

[!INCLUDE [secure-with-entra-id-register-app](includes/secure-with-entra-id-register-app.md)]

### Add app roles to your application

[!INCLUDE [secure-with-entra-id-add-app-roles](includes/secure-with-entra-id-add-app-roles.md)]

## Protect a WebSphere Liberty/Open Liberty app by using OpenID Connect

In this section, you secure a WebSphere Liberty/Open Liberty app that authenticates and authorizes users in your Microsoft Entra tenant by using OIDC. You also learn how to give users access to certain parts of the app using role-based access control (RBAC). The app uses the Programmatic Security Policy Configuration of the Jakarta Servlet specification. See the resources section for a reference to securing an RESTful web services application.

The sample WebSphere Liberty/Open Liberty app for this quickstart is on GitHub in the [liberty-entra-id](https://github.com/Azure-Samples/liberty-entra-id/tree/2024-09-26) repository.

### Enable authentication and authorization to secure app

The app has a welcome page resource defined in [index.html](https://github.com/Azure-Samples/liberty-entra-id/blob/2024-09-26/src/main/webapp/index.html), which is shown in the following example code. This page is accessible to unauthenticated users. The root path of the welcome page is at `/`.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Greeting</title>
</head>
<body>
<h1>Hello, welcome to Open Liberty/WebSphere Liberty and Microsoft Entra ID integration!</h1>
<h1>
    <a href="/profile/user">Sign in as user</a>
</h1>
<h1>
    <a href="/profile/admin">Sign in as admin</a>
</h1>
</body>
</html>
```

From the welcome page, users can sign in to the app to access the profile page. The welcome page has links to sign in as a user or as an admin. The links are at `/profile/user` and `/profile/admin`, respectively.

Both `/profile/user` and `/profile/admin` links point to the profile servlet, defined in [ProfileServlet.java](https://github.com/Azure-Samples/liberty-entra-id/blob/2024-09-26/src/main/java/com/example/ProfileServlet.java), as shown in the following example code. This servlet is accessible only to authenticated users by using the annotation `jakarta.servlet.annotation.ServletSecurity` and annotation `jakarta.servlet.annotation.HttpConstraint`. The attribute `rolesAllowed = {"users"}` specifies that only authenticated users with security role `users` can access the `/profile` path. The authenciated user is automatically assigned the `users` role in the configuration file [server.xml](https://github.com/Azure-Samples/liberty-entra-id/blob/2024-09-26/src/main/liberty/config/server.xml#L31-L38).

```java
package com.example;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.HttpConstraint;
import jakarta.servlet.annotation.ServletSecurity;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import com.ibm.websphere.security.social.UserProfileManager;
import java.util.List;

@WebServlet(name = "ProfileServlet", urlPatterns = {"/profile/user","/profile/admin"})
@ServletSecurity(value = @HttpConstraint(rolesAllowed = {"users"},
        transportGuarantee = ServletSecurity.TransportGuarantee.CONFIDENTIAL))
public class ProfileServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {

        List<?> roles = UserProfileManager.getUserProfile().getIdToken().getClaims().getClaim("roles",
                List.class);

        String path = request.getServletPath();
        if (path.equals("/profile/admin") && (null == roles || !roles.contains("admin"))) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        String username = request.getUserPrincipal().getName();
        request.setAttribute("name", username);
        request.setAttribute("roles", roles);

        request
                .getRequestDispatcher("/profile.jsp")
                .forward(request, response);
    }
}
```

The profile servlet retrieves the user's roles from the ID token and checks if the user has the `admin` role when the user tries to access the `/profile/admin` path. If the user doesn't have the `admin` role, the servlet returns a 403 Forbidden error. In other cases, the servlet retrieves the user's name and forwards the request to the profile page with the user's name and roles.

The profile page is defined in [profile.jsp](https://github.com/Azure-Samples/liberty-entra-id/blob/2024-09-26/src/main/webapp/profile.jsp), as shown in the following example. This page displays the user's name and roles. The profile page also has a sign-out link at `/logout`. The profile page is written JSP (Jakarta Server Pages). Note the use of `${}` expressions in the page. The `${}` expressions are replaced with the values of the corresponding variables when the page is rendered.

```jsp
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <meta charset="UTF-8">
    <title>Profile</title>
</head>
<body>
<h1>Hello, ${name}</h1>
<h2>Roles</h2>
<ul>
    <c:forEach var="role" items="${roles}">
        <li>${role}</li>
    </c:forEach>
</ul>
<h1>
    <b><a href="/logout">Sign out</a></b>
</h1>
</body>
</html>
```

When the user selects to sign out, the app calls the logout servlet, defined in [LogoutServlet.java](https://github.com/Azure-Samples/liberty-entra-id/blob/2024-09-26/src/main/java/com/example/LogoutServlet.java), as shown in the following example code. The logout servlet calls the `request.logout()` method to log out the user, and then redirects the user to the welcome page.

```java
package com.example;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.HttpConstraint;
import jakarta.servlet.annotation.ServletSecurity;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "LogoutServlet", urlPatterns = "/logout")
@ServletSecurity(value = @HttpConstraint(rolesAllowed = {"users"},
        transportGuarantee = ServletSecurity.TransportGuarantee.CONFIDENTIAL))
public class LogoutServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {

        request.logout();
        response.sendRedirect("/");
    }
}
```

## Run and test the WebSphere Liberty/Open Liberty app

In this section, you run and test the WebSphere Liberty/Open Liberty app to see how it works with Microsoft Entra ID as the OIDC provider.

### Prepare the sample

Use the following steps to prepare the sample app:

1. Use the following commands to clone the sample app from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/liberty-entra-id
   cd liberty-entra-id
   git checkout 2024-09-26
   ```

   If you see a message about being in *detached HEAD* state, this message is safe to ignore. Because this article doesn't require any commits, detached HEAD state is appropriate.

1. Use the following commands to define the following environment variables with the values you wrote down earlier:

   ```bash
   export CLIENT_ID==<application/client-ID>
   export CLIENT_SECRET=<client-secret>
   export TENANT_ID=<directory/tenant-ID>
   ```

   These environment variables provide the values for the built-in support of OIDC in WebSphere Liberty/Open Liberty. The corresponding OIDC configuration in [server.xml](https://github.com/Azure-Samples/liberty-entra-id/blob/2024-09-26/src/main/liberty/config/server.xml#L24-L29) is shown in the following example.

   ```xml
    <oidcLogin
        id="liberty-entra-id" clientId="${client.id}"
        clientSecret="${client.secret}"
        discoveryEndpoint="https://login.microsoftonline.com/${tenant.id}/v2.0/.well-known/openid-configuration"
        signatureAlgorithm="RS256"
        userNameAttribute="preferred_username" />
   ```

   If the value of a variable is not defined in the configuration file, WebSphere Liberty/Open Liberty reads the value from the environment variables following its naming convention. For details on the naming conversion, see [Variable substitution precedence](https://openliberty.io/docs/latest/reference/config/server-configuration-overview.html#variable-substitution).

### Run the WebSphere Liberty/Open Liberty app

You can run the app using `liberty-maven-plugin` with different goals. Select one of the following methods to run the app. To enable WebSphere Liberty/Open Liberty to connect to Microsoft Entra ID, be sure to run the command in the shell in which you defined the environment variables shown in the preceding section.

* Run the app in development mode:

  ```bash
  mvn liberty:dev
  ```

* Run the app:

  ```bash
  mvn liberty:run
  ```

If you want to try different modes, use <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the app and then run the app in another mode.

### Test the WebSphere Liberty/Open Liberty app

After the app is running, open a web browser with a private tab and navigate to `https://localhost:9443`. Since the certificate is self-signed, you might see a warning about the certificate. You can safely ignore the warning and proceed to the site.

You should see the welcome page with links to sign in as a user or as an admin. Using a private tab avoids polluting any existing Microsoft Entra ID activity you might have in your regular browser.

:::image type="content" source="media/liberty-with-microsoft-entra-id/welcome-page.png" alt-text="Screenshot of the sample application that shows the welcome page." lightbox="media/liberty-with-microsoft-entra-id/welcome-page.png":::

#### Gather the credentials for the two users

[!INCLUDE [secure-with-entra-id-gather-user-credentials](includes/secure-with-entra-id-gather-user-credentials.md)]

#### Exercise the functionality of the app

Use the following steps to exercise the functionality:

1. Select the **Sign in as user** link. Sign in with the regular user you created earlier. After you sign in, Microsoft Entra ID redirects you to the profile page, where you see your name and roles.

   :::image type="content" source="media/liberty-with-microsoft-entra-id/user-profile.png" alt-text="Screenshot of the sample application that shows the user profile." lightbox="media/liberty-with-microsoft-entra-id/user-profile.png":::

1. If this is the first time you sign in, you're prompted to update your password. Follow the instructions to update your password.

1. If you're prompted with **Your organization requires additional security information. Follow the prompts to download and set up the Microsoft Authenticator app**, you can select **Ask later** to continue the test.

1. If you're prompted with **Permissions requested**, review the permissions requested by the app. Select **Accept** to continue the test.

1. Select **Sign out** to sign out from the app. After you sign out, you're redirected to the welcome page.

1. Select the **Sign in as admin** link. Microsoft Entra ID redirects you to the sign-in page. Sign in with the admin user you created earlier. After you sign in, Microsoft Entra ID redirects you to the similar profile page, with a different role `admin`.

   :::image type="content" source="media/liberty-with-microsoft-entra-id/admin-profile.png" alt-text="Screenshot of the sample application that shows the admin profile." lightbox="media/liberty-with-microsoft-entra-id/admin-profile.png":::

1. Sign out again and try to **Sign in as admin**  with the regular user you created earlier. You should see an error message because the regular user doesn't have the `admin` role.

   :::image type="content" source="media/liberty-with-microsoft-entra-id/forbidden.png" alt-text="Screenshot of the sample application that shows the access denied message." lightbox="media/liberty-with-microsoft-entra-id/forbidden.png":::

## Clean up resources

[!INCLUDE [secure-with-entra-id-clean-up-resources](includes/secure-with-entra-id-clean-up-resources.md)]

## Next steps

In this quickstart, you protect WebSphere Liberty/Open Liberty applications with Microsoft Entra ID using OIDC. To learn more, explore the following resources:

- [Deploy a Java application with Open Liberty or WebSphere Liberty on Azure Container Apps](/azure/developer/java/ee/deploy-java-liberty-app-aca)
- [Deploy WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift](/azure/openshift/howto-deploy-java-liberty-app)
- [Deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster](/azure/aks/howto-deploy-java-liberty-app)
- [OpenID Connect authentication with Microsoft Entra ID](/entra/architecture/auth-oidc)
- [Microsoft identity platform and OAuth 2.0 authorization code flow](/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Authenticating users through social media providers](https://openliberty.io/guides/social-media-login.html)
- [Social Media Login 1.0](https://openliberty.io/docs/latest/reference/feature/socialLogin-1.0.html)
- [OpenID Connect Client 1.0](https://openliberty.io/docs/latest/reference/feature/openidConnectClient-1.0.html)
- [What is OpenID Connect](https://openid.net/developers/how-connect-works/)
- [Programmatic Security Policy Configuration](https://jakarta.ee/specifications/servlet/6.1/jakarta-servlet-spec-6.1#programmatic-security-policy-configuration)
- [How to Secure a RESTful Web Service Using Jakarta EE](https://jakarta.ee/learn/starter-guides/how-to-secure-a-restful-web-service/)
