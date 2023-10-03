---
title: User authentication with Contoso real estate
description: Understand how user authentication is implemented in the enterprise portal for Contoso real estate.
ms.topic: conceptual
ms.date: 10/03/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a Senior JavaScript Developer new to the Contoso real estate enterprise app, I want understand how the user authentication through social provides works.
---

# User authentication with Contoso Real Estate

The Contoso Real app has two front-end applications: blog and portal. The blob is publicly available, but the portal requires authentication to see Real Estate listings. 

The portal application is found in the [**portal** package](https://github.com/Azure-Samples/contoso-real-estate/tree/main/packages/portal). The portal is a single-page application (SPA) built with Angular. The portal uses [Azure Static Web Apps](/azure/static-web-apps/) for hosting and authentication. The portal uses the [Azure Functions API](/azure/azure-functions/) for data access.

## Use social providers for authentication

The Contoso Real Estate app uses social providers for authentication. 

:::image type="content" source="media/contoso-real-estate-user-authentication/social-provider-login-screen.png" lightbox="media/contoso-real-estate-user-authentication/social-provider-login-screen.png" alt-text="Screenshot displaying web page with links to several social authentication providers such as Microsoft, Facebook, and Google.":::

Each social provider has its own authentication flow which includes granting access to the Contoso Real Estate app. The following consent is specific to Google authentication.

:::image type="content" source="media/contoso-real-estate-user-authentication/grant-social-provider-access.png" lightbox="media/contoso-real-estate-user-authentication/grant-social-provider-access.png" alt-text="Screenshot displaying web page with request to give consent to the Contoso Real Estate app to have access to specific properties of your account from the social provider.":::

Once authentication is complete, the user has access to a profile page in the portal, which include social profile data and app-specific data such as saved listings, payment history, and reservations.

:::image type="content" source="media/contoso-real-estate-user-authentication/profile-page.png" lightbox="media/contoso-real-estate-user-authentication/profile-page.png" alt-text="Screenshot displaying web page with profile information.":::

## Configure social providers

During local development, use the Static Web Apps CLI to mock the social providers.

When deployed to Azure, there's no additional configuration required to turn on social authentication. 

## Use routes for social providers

To provide user authentication with social providers, the Contoso Real Estate app uses Azure Static Web Apps, which provides built-in authentication to the hosting service. This allows you get up and running quickly with authentication without having to write any code for the authentication to social providers. 

The Static Web Apps **built-in authentication** provides several routes your front-end application can use to provide authentication to your users, and provides the redirection to the social authentication providers:

Routes for authentication:

* `/.auth/login/aad` - Redirects to Azure Active Directory (AAD) login page.
* `/.auth/login/facebook` - Redirects to Facebook login page.
* `/.auth/login/github` - Redirects to GitHub login page.
* `/.auth/login/google` - Redirects to Google login page.
* `/.auth/logout` - Redirects to the logout page.


## Add links to use provider routes

The portal's front-end code provides access to these routes with links:

```typescript
// imports removed for brevity

@Component({
  selector: "app-authentication",
  templateUrl: "./authentication.component.html",
  styleUrls: ["./authentication.component.scss"],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, TextBlockComponent, MatIconModule,FontAwesomeModule],
  standalone: true,
})
export class AuthenticationComponent implements OnInit {

  public constructor(iconRegistry: MatIconRegistry, santizer: DomSanitizer) {
    for (const provider of this.providers) {
      iconRegistry.addSvgIcon(provider.id, santizer.bypassSecurityTrustResourceUrl(`../assets/company-logos/${provider.id}.svg`));
    }
  }

  @Input() redirectURL = "";

  getRedirectURLWithDefault() {
    return this.redirectURL || "/home";
  }

  providers = [
    { name: "Microsoft", id: "microsoft", icon: faMicrosoft },
    { name: "Facebook", id: "facebook", icon: faFacebook },
    { name: "Google", id: "google", icon: faGoogle },
    { name: "Twitter", id: "twitter", icon: faTwitter },
    { name: "GitHub", id: "github", icon: faGithub },
    { name: "Apple", id: "apple", icon: faApple }
  ];
  private router = inject(Router);
  private authService = inject(AuthService);


  async ngOnInit() {
    if (this.isAuthenticated()) {
      this.router.navigate([this.redirectURL]);
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  loginWith(provider: string) {
    return `/.auth/login/${provider}?post_login_redirect_uri=${this.getRedirectURLWithDefault()}`;
  }
}
```

## Secure access to API with authentication

To lock down access to the APIs used by the front-end portal, you need to configure the API routes to require authentication in the `staticwebapp.config.json`. Because the front-end app and API are deployed in the same environment (subdomain), this is enough to lock down access to the API.

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    }
  ]
}
```

## Get profile information

To get profile information about the user, the front-end app calls the `/.auth/me` route. 

```typescript
async loadUserSession() {
    const response = await fetch("/.auth/me");
    const payload = await response.json();
    const { clientPrincipal }: { clientPrincipal: UserClientPrincipal } = payload;
    let user = this.guestUser();
    
    if (clientPrincipal) {
        user = this.authenticatedUser(clientPrincipal);
    }
    
    this.localStorageService.save("user", user);
    
    this.userSource.next(user);
    return user;
}
```

This returns a JSON object with the profile information about the user. 

```json
{
  "identityProvider": "github",
  "userId": "d75b260a64504067bfc5b2905e3b8182",
  "userDetails": "username",
  "userRoles": ["anonymous", "authenticated"],
  "claims": [{
    "typ": "name",
    "val": "Azure Static Web Apps"
  }]
}
```

This information is also sent to the Azure Functions API, `/api/users`. 

```typescript
  async saveUserSession(user: User) {
    const response = await fetch("/api/users", { method: "POST", body: JSON.stringify(user) });
    const payload = await response.json();

    if (response.status !== 200) {
      // report error but don't block navigation
      console.error("User session not saved", payload.error);
      return user;
    }

    return payload;
  }
```

The API saves the user information to the Cosmos DB for MongoDB database in the **users** collection.

```json
{
	"_id" : ObjectId("651c7bc9c086b9b050b38aaa"),
	"id" : "d75b260a64504067bfc5b2905e3b8182",
	"name" : "username",
	"role" : "renter",
	"status" : "active",
	"photo" : "account_circle",
	"address" : "fake address",
	"email" : "username",
	"auth" : {
		"provider" : "github",
		"lastLogin" : {
			"$date" : 1696366067756
		}
	},
	"createdAt" : "1696365512160",
	"__v" : 0
}
```

In the Contoso application, this information is used to display the user's name in the header and on the profile page. 
