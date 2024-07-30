---
ms.topic: include
ms.date: 12/13/2023
---
In this method, a developer must be signed in to Azure from the Azure CLI or Azure PowerShell on their local workstation. The application then can access the developer's credentials from the credential store and use those credentials to access Azure resources from the app.<br>
<br>
This method has the advantage of easier setup because a developer only needs to sign in to their Azure account in the Azure CLI. The disadvantage of this approach is that the developer's account likely has more permissions than required by the application. As a result, the application doesn't accurately replicate the permissions it will run with in production.<br>
<br>
> [!div class="nextstepaction"]
> [Learn about auth using developer accounts](../authentication-local-development-dev-accounts.md)
