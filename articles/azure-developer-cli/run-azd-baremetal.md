---
title: Run the Azure Developer CLI (preview) in BareMetal
description: Once you've installed the Azure Developer CLI and chosen a template, run the `azd up` command.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/05/2022
ms.topic: how-to
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Run the Azure Developer CLI (preview) in BareMetal

The fastest way to get your app up and running on Azure with the Azure Developer CLI is via the `azd up` command. 

## Pre-requisites

- [Install the Azure Developer CLI in BareMetal](./install-azd-baremetal.md).
- [Choose an `azd` template](./azd-templates.md) to run with your application.

## Run `azd up`

Run the `azd up` command with the `--template` flag. 

```bash
azd up --template <TEMPLATE>
```

## What happens when you run `azd up`?

This single `azd up` command will:

- Download code
- Initialize your project (`azd init`)
- Create and configure all necessary Azure resources (`azd provision`), including:
  - Access policies and roles for your account
  - Service-to-service communication with Managed Identities
- Deploy the code (`azd deploy`)

## Provide parameters

When you run the `azd up` command, you'll be prompted to provide the following information:

| Parameter | Description |
| --------- | ----------- |
| `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name) |
| `Azure Location`   | The Azure location where your resources will be deployed. |
| `Azure Subscription` | The Azure Subscription where your resources will be deployed. |

## Next steps

- Walk through one of the quickstarts to see Azure Developer CLI in action. You can try either [Node.js], [Python], or [C#].
- Learn more about [`azd` templates](./azd-templates.md).