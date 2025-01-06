---
title: Quarkus with Microsoft Entra ID
description: Shows you how to secure Red Hat Quarkus applications with Microsoft Entra ID using OpenID Connect (OIDC).
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 10/07/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-quarkus, devx-track-javaee-quarkus-entra-id, devx-track-extended-java, devx-track-azurecli
---

# Secure Quarkus applications with Microsoft Entra ID using OpenID Connect

This article shows you how to secure Red Hat Quarkus applications with Microsoft Entra ID using OpenID Connect (OIDC).

In this article, you learn how to:

> [!div class="checklist"]
> - Set up an OpenID Connect provider with Microsoft Entra ID.
> - Protect a Quarkus app by using OpenID Connect.
> - Run and test the Quarkus app.

## Prerequisites

[!INCLUDE [secure-with-entra-id-prerequisites](includes/secure-with-entra-id-prerequisites.md)]

## Set up an OpenID Connect provider with Microsoft Entra ID

In this section, you set up an OpenID Connect provider with Microsoft Entra ID for use with your Quarkus app. In a later section, you configure the Quarkus app by using OpenID Connect to authenticate and authorize users in your Microsoft Entra tenant.

### Create users in Microsoft Entra tenant

[!INCLUDE [secure-with-entra-id-create-users](includes/secure-with-entra-id-create-users.md)]

### Register an application in Microsoft Entra ID

[!INCLUDE [secure-with-entra-id-register-app](includes/secure-with-entra-id-register-app.md)]

### Add app roles to your application

[!INCLUDE [secure-with-entra-id-add-app-roles](includes/secure-with-entra-id-add-app-roles.md)]

## Protect a Quarkus app by using OpenID Connect

In this section, you secure a Quarkus app that authenticates and authorizes users in your Microsoft Entra tenant by using OpenID Connect. You also learn how to give users access to certain parts of the app using role-based access control (RBAC).

The sample Quarkus app for this quickstart is on GitHub in the [quarkus-azure](https://github.com/Azure-Samples/quarkus-azure/tree/2024-09-26) repository, and located in the [entra-id-quarkus](https://github.com/Azure-Samples/quarkus-azure/tree/2024-09-26/entra-id-quarkus) directory.

### Enable authentication and authorization to secure app

The app has a welcome page resource defined in [WelcomePage.java](https://github.com/Azure-Samples/quarkus-azure/blob/2024-09-26/entra-id-quarkus/src/main/java/com/example/WelcomePage.java), which is shown in the following example code. This page is accessible to unauthenticated users. The root path of the welcome page is at `/`.

```java
@Path("/")
public class WelcomePage {

    private final Template welcome;

    public WelcomePage(Template welcome) {
        this.welcome = requireNonNull(welcome, "welcome page is required");
    }

    @GET
    @Produces(MediaType.TEXT_HTML)
    public TemplateInstance get() {
        return welcome.instance();
    }

}
```

From the welcome page, users can sign in to the app to access the profile page. The welcome page has links to sign in as a user or as an admin. The links are at `/profile/user` and `/profile/admin`, respectively. The welcome page UI is defined in [welcome.qute.html](https://github.com/Azure-Samples/quarkus-azure/blob/2024-09-26/entra-id-quarkus/src/main/resources/templates/welcome.qute.html) and shown in the following example:

```html
<html>
    <head>
        <meta charset="UTF-8">
        <title>Greeting</title>
    </head>
    <body>
        <h1>Hello, welcome to Quarkus and Microsoft Entra ID integration!</h1>
        <h1>
            <a href="/profile/user">Sign in as user</a>
        </h1>
        <h1>
            <a href="/profile/admin">Sign in as admin</a>
        </h1>
    </body>
</html>
```

Both `/profile/user` and `/profile/admin` links point to the profile page resource, defined in [ProfilePage.java](https://github.com/Azure-Samples/quarkus-azure/blob/2024-09-26/entra-id-quarkus/src/main/java/com/example/ProfilePage.java), as shown in the following example code. This page is accessible only to authenticated users by using the `@RolesAllowed("**")` annotation from the `jakarta.annotation.security.RolesAllowed` package. The `@RolesAllowed("**")` annotation specifies that only authenticated users can access the `/profile` path.

```java
@Path("/profile")
@RolesAllowed("**")
public class ProfilePage {

    private final Template profile;

    @Inject
    SecurityIdentity identity;

    @Inject
    JsonWebToken accessToken;

    public ProfilePage(Template profile) {
        this.profile = requireNonNull(profile, "profile page is required");
    }

    @Path("/admin")
    @GET
    @Produces(MediaType.TEXT_HTML)
    @RolesAllowed("admin")
    public TemplateInstance getAdmin() {
        return getProfile();
    }

    @Path("/user")
    @GET
    @Produces(MediaType.TEXT_HTML)
    @RolesAllowed({"user","admin"})
    public TemplateInstance getUser() {
        return getProfile();
    }

    private TemplateInstance getProfile() {
        return profile
                .data("name", identity.getPrincipal().getName())
                .data("roles", identity.getRoles())
                .data("scopes", accessToken.getClaim("scp"));
    }

}
```

The profile page resource enables RBAC by using the `@RolesAllowed` annotation. The arguments to the `@RolesAllowed` annotation specify that only users with the `admin` role can access the `/profile/admin` path, and users with the `user` or `admin` role can access the `/profile/user` path.

Both the `/profile/admin` and `/profile/user` endpoints return the profile page. The profile page UI is defined in [profile.qute.html](https://github.com/Azure-Samples/quarkus-azure/blob/2024-09-26/entra-id-quarkus/src/main/resources/templates/profile.qute.html), as shown in the following example. This page displays the user's name, roles, and scopes. The profile page also has a sign-out link at `/logout`, which redirects the user to OIDC provider to sign out. The profile page is written using the Qute templating engine. Note the use of `{}` expressions in the page. These expressions make use of the values passed to the `TemplateInstance` using the `data()` method. For more information on Qute, see [Qute templating engine](https://quarkus.io/guides/qute).

```html
<html>
    <head>
        <meta charset="UTF-8">
        <title>Profile</title>
    </head>
    <body>
        <h1>Hello, {name}</h1>
        <h2>Roles</h2>
        <ul>
            {#if roles}
                {#for role in roles}
                    <li>{role}</li>
                {/for}
            {#else}
                <li>No roles found!</li>
            {/if}
        </ul>
        <h2>Scopes</h2>
        <p>
            {scopes}
        </p>
        <h1>
            <b><a href="/logout">Sign out</a></b>
        </h1>
    </body>
</html>
```

After sign out, the user is redirected to the welcome page and can sign in again.

## Run and test the Quarkus app

In this section, you run and test the Quarkus app to see how it works with Microsoft Entra ID as the OpenID Connect provider.

### Add a redirect URI to the app registration

[!INCLUDE [secure-with-entra-id-add-redirect-uri](includes/secure-with-entra-id-add-redirect-uri.md)]

- For **Configure platforms**, select **Web**.
- For **Redirect URIs**, enter `http://localhost:8080`.

### Prepare the sample

Use the following steps to prepare the sample Quarkus app:

1. Use the following commands to clone the sample Quarkus app from GitHub and navigate to the **entra-id-quarkus** directory:

   ```bash
   git clone https://github.com/Azure-Samples/quarkus-azure
   cd quarkus-azure/entra-id-quarkus
   git checkout 2024-09-26
   ```

   If you see a message about being in *detached HEAD* state, this message is safe to ignore. Because this article doesn't require any commits, detached HEAD state is appropriate.

1. Use the following commands to define the following environment variables with the values you wrote down earlier:

   ```bash
   export QUARKUS_OIDC_CLIENT_ID=<application/client-ID>
   export QUARKUS_OIDC_CREDENTIALS_SECRET=<client-secret>
   export QUARKUS_OIDC_AUTH_SERVER_URL=https://login.microsoftonline.com/<directory/tenant-ID>/v2.0
   ```

   These environment variables provide the values for the built-in support of OpenID Connect in Quarkus. The corresponding properties in `application.properties` are shown in the following example.

   ```properties
   quarkus.oidc.client-id=
   quarkus.oidc.credentials.secret=
   quarkus.oidc.auth-server-url=
   ```

   If the value of a property is blank in `application.properties`, Quarkus converts the property name into an environment variable and reads the value from the environment. For details on the naming conversion, see [the MicroProfile Config specification](https://download.eclipse.org/microprofile/microprofile-config-3.0/microprofile-config-spec-3.0.html#default_configsources.env.mapping).

### Run the Quarkus app

You can run the Quarkus app in different modes. Select one of the following methods to run the Quarkus app. To enable Quarkus to connect to Microsoft Entra ID, be sure to run the command in the shell in which you defined the environment variables shown in the preceding section.

* Run the Quarkus app in development mode:

  ```bash
  mvn quarkus:dev
  ```

* Run the Quarkus app in JVM mode:

  ```bash
  mvn install
  java -jar target/quarkus-app/quarkus-run.jar
  ```

* Run the Quarkus app in native mode:

  ```bash
  mvn install -Dnative -Dquarkus.native.container-build
  ./target/quarkus-ad-1.0.0-SNAPSHOT-runner
  ```

If you want to try different modes, use <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the Quarkus app and then run the Quarkus app in another mode.

### Test the Quarkus app

After the Quarkus app is running, open a web browser with a private tab and navigate to `http://localhost:8080`. You should see the welcome page with links to sign in as a user or as an admin. Using a private tab avoids polluting any existing Microsoft Entra ID activity you might have in your regular browser.

:::image type="content" source="media/quarkus-with-microsoft-entra-id/welcome-page.png" alt-text="Screenshot of the sample application that shows the welcome page." lightbox="media/quarkus-with-microsoft-entra-id/welcome-page.png":::

#### Gather the credentials for the two users

[!INCLUDE [secure-with-entra-id-gather-user-credentials](includes/secure-with-entra-id-gather-user-credentials.md)]

#### Exercise the functionality of the app

Use the following steps to exercise the functionality:

1. Select the **Sign in as user** link. Sign in with the regular user you created earlier. After you sign in, Microsoft Entra ID redirects you to the profile page, where you see your name, roles, and scopes.

   :::image type="content" source="media/quarkus-with-microsoft-entra-id/user-profile.png" alt-text="Screenshot of the sample application that shows the user profile." lightbox="media/quarkus-with-microsoft-entra-id/user-profile.png":::

1. If this is the first time you sign in, you're prompted to update your password. Follow the instructions to update your password.

1. If you're prompted with **Your organization requires additional security information. Follow the prompts to download and set up the Microsoft Authenticator app**, you can select **Ask later** to continue the test.

1. If you're prompted with **Permissions requested**, review the permissions requested by the app. Select **Accept** to continue the test.

1. Select **Sign out** to sign out from the Quarkus app. Microsoft Entra ID performs the sign out. After you sign out, Microsoft Entra ID redirects you to the welcome page.

1. Select the **Sign in as admin** link. Microsoft Entra ID redirects you to the sign-in page. Sign in with the admin user you created earlier. After you sign in, Microsoft Entra ID redirects you to the similar profile page, with a different role `admin`.

   :::image type="content" source="media/quarkus-with-microsoft-entra-id/admin-profile.png" alt-text="Screenshot of the sample application that shows the admin profile." lightbox="media/quarkus-with-microsoft-entra-id/admin-profile.png":::

1. Sign out again and try to **Sign in as admin**  with the regular user you created earlier. You should see an error message because the regular user doesn't have the `admin` role.

   :::image type="content" source="media/quarkus-with-microsoft-entra-id/forbidden.png" alt-text="Screenshot of the sample application that shows the access denied message." lightbox="media/quarkus-with-microsoft-entra-id/forbidden.png":::

## Clean up resources

[!INCLUDE [secure-with-entra-id-clean-up-resources](includes/secure-with-entra-id-clean-up-resources.md)]

## Next steps

In this quickstart, you protect Quarkus applications with Microsoft Entra ID using OpenID Connect. To learn more, explore the following resources:

- [Deploy a Java application with Quarkus on an Azure Container Apps](/azure/developer/java/ee/deploy-java-quarkus-app)
- [OpenID Connect authentication with Microsoft Entra ID](/entra/architecture/auth-oidc)
- [Microsoft identity platform and OAuth 2.0 authorization code flow](/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Protect a web application by using OpenId Connect (OIDC) authorization code flow](https://quarkus.io/guides/security-oidc-code-flow-authentication-tutorial)
- [OpenID Connect authorization code flow mechanism for protecting web applications](https://quarkus.io/guides/security-oidc-code-flow-authentication)
- [OpenID Connect (OIDC) configuration properties](https://quarkus.io/guides/security-oidc-configuration-properties-reference)
