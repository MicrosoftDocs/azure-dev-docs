---
author: hhunter-ms
ms.service: azure-dev-cli
ms.topic: include
ms.date: 08/05/2022
ms.author: hannahhunter
---

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
| `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. [What is an Environment Name in `azd`?](../faq.yml#what-is-an-environment-name) |
| `Azure Location`   | The Azure location where your resources will be deployed. |
| `Azure Subscription` | The Azure Subscription where your resources will be deployed. |