# Connecting GitHub Actions to Azure Key Vault

## In this article
- [Prerequisites](#prerequisites)
- [Configuring Azure Key Vault](#configuring-azure-key-vault)
- [Approach 1: Authentication Using OpenID Connect (OIDC) (Recommended)](#approach-1-authentication-using-openid-connect-oidc-recommended)
- [Approach 2: Authentication Using a Service Principal with a Client Secret](#approach-2-authentication-using-a-service-principal-with-a-client-secret)
- [Updating GitHub Actions Workflow (Same for Both Approaches)](#updating-github-actions-workflow-same-for-both-approaches)
- [Limitations](#limitations)
- [Security Best Practices](#security-best-practices)
- [Next Steps](#next-steps)

## Prerequisites

Before starting, ensure you have:

- An **Azure subscription**.
- An **Azure Key Vault** created and configured.
- A **GitHub repository** where the workflow will run.
- **Azure CLI** installed.
- Appropriate **permissions**:
  - **Azure Role-Based Access Control (RBAC)**: Assign the **Key Vault Secrets User** role to the service principal or managed identity. This role allows applications to read secrets from the key vault without granting full administrative access.
  - **Key Vault Access Policies**: Alternatively, configure an access policy granting **Get** and **List** permissions for secrets to the service principal or managed identity.

## Configuring Azure Key Vault

To ensure seamless integration between GitHub Actions and Azure Key Vault, configure your key vault as follows:

1. **Set Access Policies or RBAC**: Grant the necessary permissions to the service principal or managed identity used by your GitHub Actions workflow.
   - Using **Access Policies**:
     - Navigate to your Key Vault in the Azure Portal.
     - Select **Access policies** > **Add Access Policy**.
     - Assign **Get** and **List** permissions for secrets.
     - Select the service principal or managed identity and save the policy.
   - Using **Azure RBAC**:
     - Navigate to your Key Vault in the Azure Portal.
     - Select **Access control (IAM)** > **Add role assignment**.
     - Choose the **Key Vault Secrets User** role.
     - Assign it to the service principal or managed identity.

2. **Network Configuration**: Ensure that your Key Vault is accessible from GitHub Actions. If you have network restrictions, such as firewall rules or virtual network service endpoints, configure them to allow access from GitHub's IP ranges or service tags.

## Approach 1: Authentication Using OpenID Connect (OIDC) (Recommended)

### What is Federated Identity?

Federated identity allows external identities, like GitHub, to access Azure resources without storing secrets. By establishing a trust relationship between Azure AD and the external identity provider, Azure can issue access tokens based on assertions from the trusted provider. This approach enhances security by eliminating the need to manage and rotate secrets.

### Why Use OIDC?

- **Enhanced Security**: Eliminates the need to store long-lived secrets in GitHub by using short-lived tokens.
- **Simplified Management**: Reduces the operational overhead associated with secret rotation and management.
- **Granular Access Control**: Allows precise permissions by defining specific federated credentials for each workflow or repository.

### Step 1: Configure Federated Identity in Azure

1. **Sign in to Azure**:
   ```sh
   az login
   ```

2. **Set your subscription**:
   ```sh
   az account set --subscription <SUBSCRIPTION_ID>
   ```

3. **Create a Service Principal**:
   ```sh
   az ad sp create --id <CLIENT_ID>
   ```

4. **Create a Federated Credential**:
   ```sh
   az ad app federated-credential create --id <CLIENT_ID> --parameters '{
     "name": "github-oidc",
     "issuer": "https://token.actions.githubusercontent.com",
     "subject": "repo:<GITHUB_ORG>/<REPO>:ref:refs/heads/main",
     "audiences": ["api://AzureADTokenExchange"]
   }'
   ```

5. **Grant Key Vault Access**:
   ```sh
   az keyvault set-policy --name <KEYVAULT_NAME> --spn <CLIENT_ID> --secret-permissions get list
   ```

## Approach 2: Authentication Using a Service Principal with a Client Secret

### Step 1: Create a Service Principal

```sh
az ad sp create-for-rbac --name "github-actions-sp" --role "Contributor" --scopes /subscriptions/<SUBSCRIPTION_ID>
```

Save the output (`appId`, `password`, `tenant`) securely.

### Step 2: Store Credentials in GitHub Secrets

Go to **Settings > Secrets and Variables > Actions** in your GitHub repository and add:
- `AZURE_CLIENT_ID`: `appId`
- `AZURE_CLIENT_SECRET`: `password`
- `AZURE_TENANT_ID`: `tenant`
- `AZURE_SUBSCRIPTION_ID`: `<SUBSCRIPTION_ID>`
- `KEYVAULT_NAME`: `<KEYVAULT_NAME>`

## Updating GitHub Actions Workflow (Same for Both Approaches)

The following GitHub Actions workflow configuration is the same for both **Approach 1 (OIDC)** and **Approach 2 (Service Principal with Client Secret)**:

```yaml
name: Access Azure Key Vault

on:
  push:
    branches:
      - main

permissions:
  id-token: write
  contents: read

jobs:
  get-secret:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Retrieve Secret from Key Vault
        id: keyvault
        uses: azure/CLI@v1
        with:
          inlineScript: |
            SECRET_VALUE=$(az keyvault secret show --name <SECRET_NAME> --vault-name ${{ secrets.KEYVAULT_NAME }} --query value -o tsv)
            echo "::add-mask::$SECRET_VALUE"
            echo "SECRET_VALUE=$SECRET_VALUE" >> $GITHUB_ENV

      - name: Use Retrieved Secret
        run: echo "The secret is successfully retrieved!"
```

## Limitations

- **OIDC authentication requires defining specific branches**. Wildcard (`*`) usage for all branches is not supported.
- **OIDC access token is valid one hour**.
- **OIDC authentication is limited to GitHub Actions** and cannot be used in external scripts.
- **Service Principal authentication requires secret management and secret rotation**.

## Security Best Practices

- Use OpenID Connect (OIDC) authentication to avoid storing secrets in GitHub.
- Limit Azure Key Vault permissions to only required actions (`get` and `list`).
- Rotate secrets regularly when using a service principal.
- Enable auditing in Azure Key Vault to monitor access attempts.
- Use GitHub Actions environment protection rules to restrict workflows running with elevated permissions.
- Always use `echo "::add-mask::"` when handling secrets in workflows to prevent accidental exposure in logs.

## Additional References

- **[Federated Identity](https://learn.microsoft.com/en-us/azure/active-directory/external-identities/what-is-b2b)**
- **[Service Tags in Network Security Rules](https://learn.microsoft.com/en-us/azure/virtual-network/service-tags-overview)**
