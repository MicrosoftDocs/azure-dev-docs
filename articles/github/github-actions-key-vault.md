---
title: Use Azure Key Vault secrets in a GitHub Actions workflow
description: Securely retrieve secrets with GitHub Actions and Azure Key Vault.
ms.topic: sample
ms.service: azure
ms.date: 06/30/2025
ms.custom: github-actions-azure
---

# Integrate Azure Key Vault into a GitHub Actions workflow

Integrate [Azure Key Vault](/azure/key-vault/) into your GitHub Actions workflows to securely manage your sensitive credentials in a centralized repository. This approach minimizes the risk of accidental exposure or unauthorized access to sensitive data.

This GitHub Actions example workflow demonstrates how to securely retrieve secrets from Azure Key Vault using OpenID Connect (OIDC) authentication.

What the workflow does:

- Triggers on pushes to the main branch
- Uses OIDC authentication to connect to Azure (no passwords stored in GitHub)
- Retrieves a secret from Azure Key Vault
- Masks the secret value with `::add-mask::` to prevent it from appearing in logs
- Makes the secret available as an environment variable for subsequent steps

**Prerequisites**

- Configure [OpenID Connect (OIDC)](https://www.microsoft.com/security/business/security-101/what-is-openid-connect-oidc) in Azure. To use [Azure Login action](https://github.com/marketplace/actions/azure-login) with OIDC, you need to configure a federated identity credential on a Microsoft Entra application or a user-assigned managed identity. Learn how in [Authenticate to Azure from GitHub Actions by OpenID Connect](connect-from-azure-openid-connect.md).
- Store these secrets in GitHub:
    - `AZURE_CLIENT_ID`: Your Azure service principal's client ID.
    - `AZURE_TENANT_ID`: Your Azure AD tenant ID.
    - `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID.
    - `KEYVAULT_NAME`: Your Key Vault name.
- Grant permissions: Ensure the service principal has appropriate access to the Key Vault (example, "Key Vault Secrets User" role).
- Replace placeholder: Change <SECRET_NAME> to your actual secret name in the Key Vault.

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

## Additional resources

- [Authenticate to Azure from GitHub Actions by OpenID Connect](connect-from-azure-openid-connect.md)
- [About Azure Key Vault](/azure/key-vault/general/overview)