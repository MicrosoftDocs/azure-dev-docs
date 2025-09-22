---
ms.topic: include
ms.date: 09/11/2025
---

## Authenticate to Azure services from your app

The [Azure Identity library](/javascript/api/overview/azure/identity-readme) provides various *credentials*&mdash;implementations of `TokenCredential` adapted to supporting different scenarios and Microsoft Entra authentication flows. The steps ahead demonstrate how to use `DefaultAzureCredential` when working with user accounts locally.

### Implement the code

`DefaultAzureCredential` is an opinionated, ordered sequence of mechanisms for authenticating to Microsoft Entra ID. Each authentication mechanism is a class derived from the [TokenCredential](/javascript/api/@azure/identity/defaultazurecredential) class and is known as a *credential*. At runtime, `DefaultAzureCredential` attempts to authenticate using the first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. In this way, your app can use different credentials in different environments without writing environment-specific code.

To use `DefaultAzureCredential`, add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) packages to your application:

In a terminal of your choice, navigate to the application project directory and run the following commands:

```javascript
npm install @azure/identity
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. These classes and your own custom services should be registered so they can be accessed throughout your app. Complete the following programmatic steps to create a client class and `DefaultAzureCredential`:

1. Import the `@azure/identity` package.
1. Create the Azure service client with an instance of `DefaultAzureCredential` to the `UseCredential` method.


```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { SomeAzureServiceClient } from "@azure/arm-some-service";

const client = new SomeAzureServiceClient(new DefaultAzureCredential());
```
