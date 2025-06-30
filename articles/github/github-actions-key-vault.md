---
title: Use Azure Key Vault secrets in a GitHub Actions workflow
description: Securely retrieve secrets with GitHub Actions and Azure Key Vault.
ms.topic: sample
ms.service: azure
ms.date: 06/30/2025
ms.custom: github-actions-azure
---

# Integrate Azure Key Vault into a GitHub Actions workflow

Integrate [Azure Key Vault](/azure/key-vault/) into your GitHub Actions workflow to securely manage sensitive credentials in one place. This approach reduces the risk of accidental exposure or unauthorized access to sensitive data.

This GitHub Actions sample workflow demonstrates how to securely retrieve secrets from Azure Key Vault using OpenID Connect (OIDC) authentication.

## Prerequisites

- Configure a federated identity credential on a Microsoft Entra application or a user-assigned managed identity. Learn how in [Authenticate to Azure from GitHub Actions by OpenID Connect](connect-from-azure-openid-connect.md). When you set up your federated credential, store these secrets in GitHub:
    - `AZURE_CLIENT_ID`: Your Azure service principal's client ID.
    - `AZURE_TENANT_ID`: Your Azure AD tenant ID.
    - `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID.
    - `KEYVAULT_NAME`: Your Key Vault name.
- Grant permissions: Make sure the service principal has appropriate access to the Key Vault (example, "Key Vault Secrets User" role).
- Replace <SECRET_NAME> with your Key Vault secret name.

## GitHub Actions workflow sample

What the workflow does:

- Triggers on pushes to the main branch
- Uses OIDC authentication to connect to Azure (no passwords stored in GitHub)
- Retrieves a secret from Azure Key Vault
- Masks the secret value with `::add-mask::` to prevent it from appearing in logs
- Makes the secret available as an environment variable for subsequent steps


```yaml
name: Access Azure Key Vault and pass secret to workflow

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

      - name: Retrieve secret from Key Vault
        id: keyvault
        uses: azure/CLI@v1
        with:
          inlineScript: |
            SECRET_VALUE=$(az keyvault secret show --name <SECRET_NAME> --vault-name ${{ secrets.KEYVAULT_NAME }} --query value -o tsv)
            echo "::add-mask::$SECRET_VALUE"
            echo "SECRET_VALUE=$SECRET_VALUE" >> $GITHUB_ENV
      - name: Use retrieved secret
        run: echo "The secret is successfully retrieved!"

      - name: Use SECRET_VALUE in deployment
        run: |
          ./deploy.sh
        env:
          SECRET_VALUE: ${{ env.SECRET_VALUE }}
```


## Additional resources

- [Authenticate to Azure from GitHub Actions by OpenID Connect](connect-from-azure-openid-connect.md)
- [About Azure Key Vault](/azure/key-vault/general/overview)