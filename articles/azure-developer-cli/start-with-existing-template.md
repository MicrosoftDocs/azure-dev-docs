---
title: Start from an Existing azd Template
description: Learn how to select and initialize an existing Azure Developer CLI (azd) template to use as the starting point for your application project.
ms.date: 09/11/2026
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
ai-usage: ai-generated
---

# Start from an existing Azure Developer CLI template

Start from a template from Microsoft, your organization, or the developer community when it provides a useful architecture for your project. After initialization, the template becomes a local set of standard `azd` files that you can review and edit for your requirements.

If you didn't select a template, browse the [Azure Developer CLI template galleries](azd-template-galleries.md). Review the template's source, documentation, license, security configuration, and deployment costs before you use it.

## Initialize a template

Run `azd init` with the template repository name, path, or URL:

```azdeveloper
azd init --template <template>
```

For example, the following command initializes the `hello-azd` template:

```azdeveloper
azd init --template hello-azd
```

By default, `azd` creates a project directory for the template. To initialize it in the current empty directory, add `.` after the template argument:

```azdeveloper
azd init --template hello-azd .
```

## Review the starting template

After initialization, inspect the local files and identify which parts you plan to retain, replace, or remove. Review:

- The services, source paths, languages, and hosts in `azure.yaml`.
- The resources and role assignments in the Bicep or Terraform files.
- The parameters and environment values required during provisioning.
- The application code, container definitions, hooks, and pipeline files.
- Any assumptions about subscriptions, regions, service tiers, networking, or external dependencies.

At this point, the existing template is your project's starting template. Continue to [Explore and edit template files](explore-edit-templates.md) to review how the files work together, make changes, and test the result.

## Related content

- [Template development overview](build-templates-overview.md)
- [Azure Developer CLI templates](azd-templates.md)
- [Explore and edit template files](explore-edit-templates.md)
- [Extend a template](extend-template.md)
- [Azure Developer CLI template galleries](azd-template-galleries.md)

[!INCLUDE [request-help](includes/request-help.md)]
