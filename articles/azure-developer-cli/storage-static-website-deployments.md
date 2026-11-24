---
title: Deploy to an Azure Storage static website with azd
description: Learn how Azure Developer CLI deploys static content to an Azure Storage static website, how to configure azure.yaml, and what infrastructure and permissions your storage account requires.
ms.date: 11/19/2026
ms.service: azure-dev-cli
ms.topic: concept-article
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
#customer intent: As an azd user, I want to deploy a static site or single-page app to an Azure Storage static website, so that I can host static content without provisioning a compute service.
---

# Deploy to an Azure Storage static website with Azure Developer CLI

Azure Developer CLI (`azd`) can deploy static content, such as HTML, CSS, JavaScript, images, and fonts, to the [static website](/azure/storage/blobs/storage-blob-static-website) of an Azure Storage account. Use the `storage` host in `azure.yaml`:

```yaml
services:
  web:
    project: ./src/web
    host: storage
```

During `azd deploy`, `azd` uploads the content to the account's `$web` container, removes files you deleted, and enables static website hosting if it's off. The service endpoint is the account's static website URL, for example `https://<account>.z13.web.core.windows.net/`.

> [!NOTE]
> The `storage` host is in **beta**. For more information, see [Feature versioning and release strategy](./feature-versioning.md).

## Choose between the storage and Static Web Apps hosts

Both hosts serve static content. Choose the one that matches your app:

| Behavior | `storage` host | `staticwebapp` host |
| --- | --- | --- |
| Azure resource | Storage account (`Microsoft.Storage/storageAccounts`) | Static Web App (`Microsoft.Web/staticSites`) |
| Content | Static files only | Static files plus optional managed Azure Functions APIs |
| Routing and authentication | Index document and custom 404 document only | Route rules, fallback routes, and built-in authentication through `staticwebapp.config.json` |
| Deployment tooling | Built into `azd`, no extra tools | Uses the Static Web Apps CLI |
| Custom domains and CDN | Configure Azure Front Door or a CDN in your infrastructure | Built-in custom domains |

## Configure the service

How `azd` finds the content to upload depends on whether the service has a `language`.

### Deploy prebuilt static content

Omit `language` when your files are ready to publish as-is. `azd` uploads the `project` folder, or the `dist` subfolder when you set it:

```yaml
services:
  web:
    project: ./src/web
    host: storage
    dist: public   # optional; defaults to the project folder
```

### Build the site before deployment

Set `language` to have `azd` run the normal build for that language before upload. When `language` is set, `dist` is required and must point to the build output folder. This requirement prevents `azd` from publishing source code, dependencies such as `node_modules`, or configuration files.

For Node.js frameworks such as Vite, React, Angular, or Vue, use `language: js` or `language: ts`. `azd` runs your package manager's install and `build` script, then uploads only the `dist` folder:

```yaml
services:
  web:
    project: ./src/web
    language: ts
    host: storage
    dist: dist   # for example, use "build" for Create React App
```

The build runs with the `azd` environment values available as environment variables. Build-time settings, such as a `VITE_API_URL` that comes from an infrastructure output, are embedded in the bundle.

For a .NET Blazor WebAssembly app, `azd` runs `dotnet publish`. Set `dist` to the `wwwroot` folder in the publish output:

```yaml
services:
  web:
    project: ./src/BlazorApp
    language: dotnet
    host: storage
    dist: wwwroot
```

For other build tools, use a `prepackage` [service hook](./azd-extensibility.md) to produce the site, and set `dist` to the generated folder.

### Content rules

- `dist` is relative to `project`.
- The content folder can't be the project root (the folder that contains `azure.yaml`) or a folder above it, so `azure.yaml` and `.azure` are never published.
- Symbolic links inside the content folder aren't supported. Replace them with real files before deploying.

## Understand the deployment

For each `azd deploy` command, `azd` performs the following steps:

1. Verifies that the target resource is a `StorageV2` or `BlockBlobStorage` account.
1. Creates the `$web` container if it doesn't exist.
1. Uploads every file in the content folder, setting each blob's `Content-Type` from the file extension.
1. Deletes blobs in `$web` that are no longer in the content folder, so the site matches your local content.
1. Enables static website hosting if it's off. `azd` uses `index.html` as the index document, and `404.html` as the error document when that file exists. If static website hosting is already enabled, `azd` doesn't change its configuration.

`azd` enables static website hosting only after the upload succeeds, so a failed first deployment never exposes partial content.

> [!IMPORTANT]
> `azd` treats the `$web` container as fully owned by the service. Any blob in `$web` that isn't part of your content folder is deleted on the next deployment.

### Package and deploy separately

`azd package <service> --output-path <path>` copies the content folder to `<path>/<service>` and writes a `.<service>.azd-package` marker file next to it. Later runs replace the folder only if `azd` created it or it's empty. If a different folder already exists at that location, the command fails instead of deleting it. Deploy the exported folder later by using `--from-package`:

```bash
azd package web --output-path ./artifacts
azd deploy web --from-package ./artifacts/web
```

## Provision a compatible storage account

`azd` doesn't create the storage account. Provision it through Bicep or Terraform with the following settings:

| Requirement | Details |
| --- | --- |
| Account kind | `StorageV2` (general-purpose v2) or `BlockBlobStorage`. |
| Resource discovery | Apply an `azd-service-name` tag whose value matches the service name in `azure.yaml`, or set `resourceName` (and optionally `resourceGroup`) on the service. For the `storage` host, `azd` only considers `Microsoft.Storage/storageAccounts` resources. |
| Static website setting | Optional. You can enable static website hosting in infrastructure, or let `azd` enable it on the first deployment. |
| Network access | Blob public network access must allow the machine or pipeline agent that runs `azd`. |
| Authentication | `azd` uses Microsoft Entra ID. Shared key access (`allowSharedKeyAccess`) and anonymous blob access (`allowBlobPublicAccess`) can stay disabled. |

### Grant permissions to the deploying identity

The user or service principal that runs `azd deploy` needs two kinds of access on the storage account:

| Access | Why it's needed | Built-in roles that include it |
| --- | --- | --- |
| `Microsoft.Storage/storageAccounts/blobServices/read` and `.../blobServices/write` | Read the static website setting, and enable it when it's off. | Owner, Contributor, Storage Account Contributor |
| Blob data read, write, and delete | Create `$web`, and upload and delete blobs. | Storage Blob Data Contributor, Storage Blob Data Owner |

Owner and Contributor don't grant blob data access, so assign a blob data role even when the identity already manages the account. Role assignments can take a few minutes to take effect, so a deployment that runs immediately after provisioning might fail with an authorization error. If that happens, rerun `azd deploy`.

### Example Bicep

The following example provisions a storage account tagged for a service named `web` and grants the identity running `azd` the Storage Blob Data Contributor role. Pass the `principalId` parameter by using `${AZURE_PRINCIPAL_ID}` in `main.parameters.json`.

```bicep
param location string = resourceGroup().location
param resourceToken string
param principalId string

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'st${resourceToken}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  tags: {
    'azd-service-name': 'web'
  }
  properties: {
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
    minimumTlsVersion: 'TLS1_2'
  }
}

var storageBlobDataContributor = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
)

resource blobDataContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, principalId, storageBlobDataContributor)
  scope: storage
  properties: {
    principalId: principalId
    roleDefinitionId: storageBlobDataContributor
  }
}

output WEBSITE_URL string = storage.properties.primaryEndpoints.web
```

## Related content

- [Static website hosting in Azure Storage](/azure/storage/blobs/storage-blob-static-website)
- [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access)
- [Azure Developer CLI schema reference](./azd-schema.md)
- [Supported languages and environments](./supported-languages-environments.md)
- [Customize your Azure Developer CLI workflows using command and event hooks](./azd-extensibility.md)
