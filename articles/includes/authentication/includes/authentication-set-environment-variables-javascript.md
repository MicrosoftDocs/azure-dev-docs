---
ms.topic: include
ms.date: 01/05/2026
---

## Configure environment variables for application

At runtime, `DefaultAzureCredential` searches for service principal information in the following environment variables:

- `AZURE_CLIENT_ID`: The app ID value.
- `AZURE_TENANT_ID`: The Microsoft Entra tenant ID.
- `AZURE_CLIENT_SECRET`: The client secret value that was generated for the app.

You can set these environment variables in various ways, depending on your development environment and deployment target. The most common approaches are:

### [Linux/macOS](#tab/linux-macos)

```bash
export AZURE_CLIENT_ID="<your-client-id>"
export AZURE_TENANT_ID="<your-tenant-id>"
export AZURE_CLIENT_SECRET="<your-client-secret>"
```

### [Windows](#tab/windows)

```powershell
$env:AZURE_CLIENT_ID="<your-client-id>"
$env:AZURE_TENANT_ID="<your-tenant-id>"
$env:AZURE_CLIENT_SECRET="<your-client-secret>"
```

To set environment variables persistently in Windows, you can use the `setx` command or PowerShell:

```powershell
# Using PowerShell to set user environment variables
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_ID", "<your-client-id>", "User")
[Environment]::SetEnvironmentVariable("AZURE_TENANT_ID", "<your-tenant-id>", "User")
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_SECRET", "<your-client-secret>", "User")
```

### [.env file](#tab/env-file)

For local development, you can use a `.env` file. Node.js 20.6.0 and later support the `--env-file` flag to automatically load environment variables from a `.env` file.

1. Create a `.env` file in your project root:

    ```bash
    AZURE_CLIENT_ID=<your-client-id>
    AZURE_TENANT_ID=<your-tenant-id>
    AZURE_CLIENT_SECRET=<your-client-secret>
    ```

1. Run your application with the `--env-file` flag:

    ```bash
    node --env-file=.env app.js
    ```

For earlier Node.js versions, you can use the [dotenv](https://www.npmjs.com/package/dotenv) npm package:

1. Install the dotenv package:

    ```bash
    npm install dotenv
    ```

1. Load the environment variables in your application:

    ```javascript
    import 'dotenv/config';
    ```

> [!CAUTION]
> Never commit `.env` files or client secrets to source control. Add `.env` to your `.gitignore` file.

---
