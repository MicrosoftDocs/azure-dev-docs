---
title: "Quarkus with Microsoft Entra ID"
description: Shows how to secure Quarkus applications with Microsoft Entra ID using OpenID Connect.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 06/14/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-quarkus, devx-track-javaee-quarkus-entra-id, devx-track-extended-java, devx-track-azurecli
---

# Secure Quarkus applications with Microsoft Entra ID using OpenID Connect

This article shows you how to secure Red Hat Quarkus applications with Microsoft Entra ID using OpenID Connect (OIDC) with a simple web application.

In this article, you learn how to:

> [!div class="checklist"]
> - Set up an OpenID Connect provider with Microsoft Entra ID.
> - Protect a Quarkus app by using OpenID Connect.
> - Run and test the Quarkus app.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- The Azure account must be at least a [Cloud Application Administrator](/entra/identity/role-based-access-control/permissions-reference#cloud-application-administrator).
- If you don't have an existing Microsoft Entra tenant, [set up a tenant](/entra/identity-platform/quickstart-create-new-tenant).
- Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, or Windows Subsystem for Linux).
- Install and set up [Git](/devops/develop/git/install-and-set-up-git).
- Install a Java SE implementation, version 21 or later - for example, [the Microsoft build of OpenJDK](/java/openjdk).
- Install [Maven](https://maven.apache.org/download.cgi), version 3.9.3 or later.

## Set up an OpenID Connect provider with Microsoft Entra ID

In this section, you set up an OpenID Connect provider with Microsoft Entra ID for use with your Quarkus app. In a later section, you configure the Quarkus app by using OpenID connect to authenticate and authorize users in your Microsoft Entra tenant.

### Create users in Microsoft Entra tenant

First, create two users in your Microsoft Entra tenant by following steps in [How to create, invite, and delete users](/entra/fundamentals/how-to-create-delete-users). You just need the section [Create a new user](/entra/fundamentals/how-to-create-delete-users#create-a-new-user). Use the following directions as you go through the article, then return to this article after you create users in your Microsoft Entra tenant.

1. When you reach the **Basics** of section [Create a new user](/entra/fundamentals/how-to-create-delete-users#create-a-new-user):
   1. Enter a unique username for **User principal name** and copy the **User principal name** value. You use this value later when you sign in to the Quarkus app.
   1. Select **Derive from user principal name** for **Mail nickname**.
   1. Enter the user's name for **Display name**.
   1. Select **Auto-generate password** for **Password** and copy the **Password** value. You use this value later when you sign in to the Quarkus app.
   1. Select **Account enabled**.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/create-admin-user.png" alt-text="Screenshot of creating an user acting as admin." lightbox="media/quarkus-with-microsoft-entra-id/create-admin-user.png":::

   1. Select **Review + create** > **Create**. Wait until the user is created.
   1. Select **Refresh** and you should see the new user in the list.

   1. Repeat the above steps to create a second user.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/create-regular-user.png" alt-text="Screenshot of creating a user acting as regular user." lightbox="media/quarkus-with-microsoft-entra-id/create-regular-user.png":::

   The first user is used as an administrator, and the second user is used as a regular user.

### Register an application in Microsoft Entra ID

Next, register an application by following steps in [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app). Use the following directions as you go through the article, then return to this article after you register and configure the application.

1. When you reach the section [Register an application](/entra/identity-platform/quickstart-register-app#register-an-application):
   1. Select **Accounts in this organizational directory only (Personal only - Single tenant)** for **Supported account types** in this quickstart.
   1. When registration finishes, write down the **Application (client) ID** and **Directory (tenant) ID**. You use these values later in the Quarkus app configuration.

1. When you reach the section [Add a redirect URI](/entra/identity-platform/quickstart-register-app#add-a-redirect-uri):
   1. Select **Web** for the **Configure platforms** and enter `http://localhost:8080` for the **Redirect URIs**.

1. When you reach the section [Add credentials](/entra/identity-platform/quickstart-register-app#add-credentials), select [Add a client secret](/entra/identity-platform/quickstart-register-app#add-a-client-secret) in this quickstart.
   1. When you add a client secret, write down the **Client secret** value. You use this value later in the Quarkus app configuration.

### Add app roles to your application

Then, add app roles to your application by following steps in [Add app roles to your application and receive them in the token](/entra/identity-platform/howto-add-app-roles-in-apps). You just need section [Declare roles for an application](/entra/identity-platform/howto-add-app-roles-in-apps#declare-roles-for-an-application) and section [Assign users and groups to Microsoft Entra roles](/entra/identity-platform/howto-add-app-roles-in-apps#assign-users-and-groups-to-microsoft-entra-roles). Use the following directions as you go through the article, then return to this article after you declare roles for the application.

1. When you reach the section [Declare roles for an application](/entra/identity-platform/howto-add-app-roles-in-apps#declare-roles-for-an-application), in **App roles UI**:
   1. Enter `Admin` for **Display name**.
   1. Select **Users/Groups** for **Allowed member types**.
   1. Enter `admin` for **Value**.
   1. Enter `Admin` for **Description**.
   1. Select **Do you want to enable this app role?**.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/create-admin-role.png" alt-text="Screenshot of creating a role used by admin." lightbox="media/quarkus-with-microsoft-entra-id/create-admin-role.png":::

   1. Select **Apply**. Wait until the role is created.

   1. Repeat the steps to create a second role.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/create-user-role.png" alt-text="Screenshot of creating a role used by regular user." lightbox="media/quarkus-with-microsoft-entra-id/create-user-role.png":::

   The first role is used by the administrator, and the second role is used by the regular user.

1. When you reach the section [Assign users and groups to Microsoft Entra roles](/entra/identity-platform/howto-add-app-roles-in-apps#assign-users-and-groups-to-microsoft-entra-roles):
   1. Select **Add user/group**. In **Add Assignment** pane, select user **Admin** for **Users** and select role **Admin** for **Select a role**. Select **Assign**. Wait until the application assignment succeeded.
   1. Repeat the above steps to assign the **User** role to user **User**.
   1. Select **Refresh** and you should see the users and roles assigned in the **Users and groups** pane.

      :::image type="content" source="media/quarkus-with-microsoft-entra-id/users-and-roles-assigned.png" alt-text="Screenshot of users and roles assigned." lightbox="media/quarkus-with-microsoft-entra-id/users-and-roles-assigned.png":::

## Protect a Quarkus app by using OpenID Connect

In this section, you secure a Quarkus app that authenticates and authorizes users in your Microsoft Entra tenant by using OpenID Connect. You also learn how to give users access to certain parts of the app using role-based access control (RBAC).

The sample Quarkus app for this quickstart is on [GitHub](https://github.com/majguo/quarkus-azure), and located in the [entra-id-quarkus](https://github.com/majguo/quarkus-azure/tree/main/entra-id-quarkus) directory.

### Enable authentication and authorization to secure app

The app has a [welcome page resource](https://github.com/majguo/quarkus-azure/blob/main/entra-id-quarkus/src/main/java/no/kantega/WelcomePage.java) that is accessible to unauthenticated users. The root path of the welcome page is at `/`.

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

From the [welcome page](https://github.com/majguo/quarkus-azure/blob/main/entra-id-quarkus/src/main/resources/templates/welcome.qute.html), users can sign in to the app to access the profile page. The welcome page has links to sign in as a user or as an admin. The links are at `/profile/user` and `/profile/admin`, respectively.

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

Both links `/profile/user` and `/profile/admin` point to the [profile page resource](https://github.com/majguo/quarkus-azure/blob/main/entra-id-quarkus/src/main/java/no/kantega/ProfilePage.java), which is accessible only to authenticated users by using the `@Authenticated` annotation. The `@Authenticated` annotation specifies that only authenticated users can access the `/profile` path.

```java
@Path("/profile")
@Authenticated
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

Moreover, the profile page resource enables role-based access control (RBAC) by using the `@RolesAllowed` annotation. The `@RolesAllowed` annotation specifies that only users with the `admin` role can access the `/profile/admin` path, and users with the `user` or `admin` role can access the `/profile/user` path.

Both endpoints `/profile/admin` and `/profile/user` return the [profile page](https://github.com/majguo/quarkus-azure/blob/main/entra-id-quarkus/src/main/resources/templates/profile.qute.html). It displays the user's name, roles, and scopes. The profile page also has a logout link at `/logout`, which redirects the user to OIDC provider to sign out.

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

After logout, the user is redirected to the welcome page and can sign in again.

### Configure the Quarkus app

To use Microsoft Entra ID as the OpenID Connect provider, you need to configure the Quarkus app with the following values:

| Property | Description | Value |
| --- | --- | --- |
| `quarkus.oidc.client-id` | The client ID of the registered application. | **Application (client) ID** value you wrote down earlier. |
| `quarkus.oidc.credentials.secret` | The client secret of the registered application. | **Client secret** value you wrote down earlier. |
| `quarkus.oidc.auth-server-url` | The base URL of the OpenID Connect (OIDC) server. | `https://login.microsoftonline.com/{tenant-id}/v2.0`. Replace `{tenant-id}` with the **Directory (tenant) ID** value you wrote down earlier. |
| `quarkus.oidc.application-type` | The application type. Use `web-app` to tell Quarkus that you want to enable the OIDC authorization code flow so that your users are redirected to the OIDC provider to authenticate. | `web-app` |
| `quarkus.oidc.authentication.redirect-path` | The relative path for calculating a `redirect_uri` query parameter. | `/` |
| `quarkus.oidc.authentication.restore-path-after-redirect` | Whether to restore the path after redirect. | `true` |
| `quarkus.oidc.roles-claim` | The claim that contains the roles of the authenticated user. | `roles` |
| `quarkus.oidc.provider` | Well known OpenId Connect provider identifier. | `microsoft` |
| `quarkus.oidc.token.customizer-name` | The name of the token customizer. | `azure-access-token-customizer` |
| `quarkus.oidc.logout.path` | The relative path of the logout endpoint at the application. | `/logout` |
| `quarkus.oidc.logout.post-logout-path` | The relative path of the application endpoint where the user should be redirected to after logging out from the OpenID Connect Provider. | `/` |

You can see the configuration in the [application.properties](https://github.com/majguo/quarkus-azure/blob/main/entra-id-quarkus/src/main/resources/application.properties) file.

## Run and test the Quarkus app

In this section, you run and test the Quarkus app to see how it works with Microsoft Entra ID as the OpenID Connect provider.

### Clone the Quarkus app

First, use the following command to clone the sample Quarkus app from GitHub and navigate to the `entra-id-quarkus` directory:

```bash
git clone https://github.com/majguo/quarkus-azure
cd quarkus-azure/entra-id-quarkus
# TODO: Checkout the specific tag for this article
# git checkout <tag>
```

If you see a message about being in *detached HEAD* state, this message is safe to ignore. Because this article doesn't require any commits, detached HEAD state is appropriate.

Next, define the following environment variables with the values you wrote down earlier:

```bash
export QUARKUS_OIDC_CLIENT_ID=<Application (client) ID>
export QUARKUS_OIDC_CREDENTIALS_SECRET=<Client secret>
export QUARKUS_OIDC_AUTH_SERVER_URL=https://login.microsoftonline.com/<Directory (tenant) ID>/v2.0
```

Values for these environment variables are feed into the following configuration properties in the `application.properties` file you saw earlier:

```properties
quarkus.oidc.client-id=
quarkus.oidc.credentials.secret=
quarkus.oidc.auth-server-url=
```

### Run the Quarkus app

You can run the Quarkus app in different modes. Select one of the following methods to run the Quarkus app:

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

Once the Quarkus app is running, open a web browser and navigate to `http://localhost:8080`. You should see the welcome page with links to sign in as a user or as an admin.

:::image type="content" source="media/quarkus-with-microsoft-entra-id/welcome-page.png" alt-text="Screenshot of welcome page." lightbox="media/quarkus-with-microsoft-entra-id/welcome-page.png":::

Select the **Sign in as user** link. You are redirected to the Microsoft Entra ID sign-in page. Sign in with the regular user you created earlier. After you sign in, you are redirected to the profile page, where you see your name, roles, and scopes.

:::image type="content" source="media/quarkus-with-microsoft-entra-id/user-profile.png" alt-text="Screenshot of user profile." lightbox="media/quarkus-with-microsoft-entra-id/user-profile.png":::

> [!NOTE]
> For the first time you sign in, you will be prompted to **Update your password**. Follow the instructions to update your password.
> If you're prompted with *Your organization requires additional security information. Follow the prompts to download and set up the Microsoft Authenticator app*, you can select **Ask later** to continue the test.
> If you're prompted to **Permissions requested**, review the permissions requested by the app. Select **Accept** to continue the test.

Select **Sign out** to sign out from the Quarkus app. You are redirected to Microsoft Entra ID to sign out. After you sign out, you are redirected to the welcome page.

Select the **Sign in as admin** link. You are redirected to the Microsoft Entra ID sign-in page. Sign in with the admin user you created earlier. After you sign in, you are redirected to the similar profile page, with a different role `admin`.

:::image type="content" source="media/quarkus-with-microsoft-entra-id/admin-profile.png" alt-text="Screenshot of admin profile." lightbox="media/quarkus-with-microsoft-entra-id/admin-profile.png":::

Sign out again and try to **Sign in as admin**  with the regular user you created earlier. You should see an error message because the regular user doesn't have the `admin` role.

:::image type="content" source="media/quarkus-with-microsoft-entra-id/forbidden.png" alt-text="Screenshot of forbidden access." lightbox="media/quarkus-with-microsoft-entra-id/forbidden.png":::

## Next steps

You can learn more from references used in this guide:

* [OpenID Connect authentication with Microsoft Entra ID](/entra/architecture/auth-oidc)
* [Microsoft identity platform and OAuth 2.0 authorization code flow](/entra/identity-platform/v2-oauth2-auth-code-flow)
* [PROTECT A WEB APPLICATION BY USING OPENID CONNECT (OIDC) AUTHORIZATION CODE FLOW](https://quarkus.io/guides/security-oidc-code-flow-authentication-tutorial)
* [OPENID CONNECT AUTHORIZATION CODE FLOW MECHANISM FOR PROTECTING WEB APPLICATIONS](https://quarkus.io/guides/security-oidc-code-flow-authentication)
* [OPENID CONNECT (OIDC) CONFIGURATION PROPERTIES](https://quarkus.io/guides/security-oidc-configuration-properties-reference)
