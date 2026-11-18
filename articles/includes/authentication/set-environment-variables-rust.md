`ClientSecretCredential` takes the tenant ID, client ID, and client secret as
constructor arguments. Set these values in environment variables and read them
in your app, as shown in the following example.

Set the following environment variables with values you get from the app registration process:

- `AZURE_CLIENT_ID`: Identifies the registered app in Azure.
- `AZURE_TENANT_ID`: The ID of the Microsoft Entra tenant.
- `AZURE_CLIENT_SECRET`: The secret credential that you generate for the app.

# [Bash](#tab/bash)

```bash
export AZURE_CLIENT_ID=<your-client-id>
export AZURE_TENANT_ID=<your-tenant-id>
export AZURE_CLIENT_SECRET=<your-client-secret>
```

# [Windows command prompt](#tab/cmd)

Set environment variables for Windows from the command line. However, all apps running on that operating system can access the values, which might cause conflicts. Use caution with this approach.

```cmd
set AZURE_CLIENT_ID=<your-client-id>
set AZURE_TENANT_ID=<your-tenant-id>
set AZURE_CLIENT_SECRET=<your-client-secret>
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_CLIENT_ID="<your-client-id>"
$env:AZURE_TENANT_ID="<your-tenant-id>"
$env:AZURE_CLIENT_SECRET="<your-client-secret>"
```

---
