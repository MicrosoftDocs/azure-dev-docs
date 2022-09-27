---
author: hhunter-ms
ms.service: azure-dev-cli
ms.topic: include
ms.date: 09/12/2022
ms.author: hannahhunter
---

## Initialize your project

1. Open your preferred terminal and create a new empty directory.
1. Change into the new empty directory.
1. Run the following command to initialize the project:

   ```bash
   azd init --template <TEMPLATE>
   ```

## Provide parameters

When you run the `azd up` command, you'll be prompted to provide the following information:

| Parameter | Description |
| --------- | ----------- |
| `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. [What is an Environment Name in `azd`?](../faq.yml#what-is-an-environment-name) |
| `Azure Location`   | The Azure location where your resources will be deployed. |
| `Azure Subscription` | The Azure Subscription where your resources will be deployed. |

## Open DevContainer

1. Open your project in Visual Studio Code.
1. Press F1 and select `Remote-Containers: Rebuild and Reopen in Container`.

## Run `azd up`

In the terminal, run the `azd up` command with the `--template` flag.

```bash
azd up --template <TEMPLATE>
```

For DevContainer, the `azd up` command will:

- Create and configure all necessary Azure resources (`azd provision`), including:
  - Access policies and roles for your account
  - Service-to-service communication with Managed Identities
- Deploy the code (`azd deploy`)