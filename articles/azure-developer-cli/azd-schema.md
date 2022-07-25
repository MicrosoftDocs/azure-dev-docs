---
title: Azure Developer CLI schema
description: Describes the schema for the Azure Developer CLI.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 07/25/2022
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# Azure Developer CLI schema

[Templates](./overview.md#azure-developer-cli-templates) are sample repositories that include app code, tools, and infrastructure code. You can use these templates to create your own solutions using Azure Developer CLI (azd). The [azure.yaml](https://github.com/Azure/azure-dev/blob/main/schemas/v1.0/azure.yaml.json/) schema defines and describes the apps and types of Azure resources that are included in these templates.

## Sample

```json

```

## Property descriptions

| Element Name | Description |
| --- | --- |
| resourceName | Name of the Azure resource that implements the service. This value is optional; if not specified, the resource name will be constructed from the current environment name, concatenated with the service name. For example, `<environment-name><resource-name>`, or `prodapi`. |
| project | Path to the service source code directory. |
| host | Type of Azure resource used for service implementation. If omitted, App Service will be assumed. |
| language | Service implementation language. If omitted, .NET will be assumed. |
| moduleName | Name of the module used to deploy the service. If omitted, the CLI will assume the module name is the same as the service name. |
| dist | Relative path to the service deployment artifacts. The CLI will use files under this path to create the deployment artifact (.zip file). If omitted, all files under the service project directory will be included. |

## Next Steps