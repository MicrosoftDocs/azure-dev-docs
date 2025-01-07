---
title: CDN changes impacting the Azure Developer CLI
description: Information regarding CDN changes that impact the Azure Developer CLI
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/14/2024
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

## CDN changes for Azure Developer CLI installation endpoints

The Edgio Content Delivery Network (CDN) endpoint for downloading and installing `azd` is changing due to the [Azure CDN from Edgio retirement effective January 15, 2025](https://learn.microsoft.com/en-us/azure/cdn/edgio-retirement-faq).

The following CDN endpoints will go offline as part of this retirement:

- `azdrelease.azureedge.net`
- `azure-dev.azureedge.net` (legacy)

The new installation hostname is `azd-release-gfgac2cmf7b8cuay.b02.azurefd.net`.

> [!NOTE]
> The `azd-release-gfgac2cmf7b8cuay.b02.azurefd.net` hostname may change in the future if a more permanent hosting setup is made available.

### Impacted services and tools

The CDN changes impact the following:

- `azure/setup-azd` GitHub Action
- Older downloaded versions of `install-azd.ps1` and `install-azd.sh` scripts
- Any hardcoded references in your system to the older CDN endpoints
- Firewall rules that enable traffic to the `*.azureedge.net` CDN hosts

### Unimpacted services and tools

The following concerns are not impact by the CDN changes:

- The `azd` client and `Azure Developer CLI` VS Code extension aren't directly impacted
- WinGet, Choco, and brew installers
- GitHub releases
- `https://aka.ms/install-azd.ps1` and `https://aka.ms/install-azd.sh` scripts

### Recommended actions and resources

The legacy installation hostnames must be updated to point to the new CDN endpoint at `azd-release-gfgac2cmf7b8cuay.b02.azurefd.net` wherever the original hostnames are directly referenced.

Additionally:

- Ensure you're using the [latest GitHub Action](https://github.com/marketplace/actions/setup-azd) (`v2`) for `azure/setup-azd` in your workflows.
- Ensure you're using the latest [Azure DevOps task version](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azd).
- Ensure any custom install scripts reference the new host name. There's no change to file paths after the host name.
- Update any firewall rules which allow traffic to `azdrelease.azureedge.net` to instead use the new hostname.

For more on this change, follow [the issue in the azd repository](https://github.com/Azure/azure-dev/issues/4661) or read the [FAQs on Microsoft Learn documentation](https://learn.microsoft.com/en-us/azure/cdn/edgio-retirement-faq). For related news on the change, see [the issue in the .NET Core repository](https://github.com/dotnet/core/issues/9671).

If you run into any problems or have suggestions, file an issue or start a discussion in the [Azure Developer CLI repository](https://github.com/Azure/azure-dev). You can also explore our [troubleshooting documentation](https://aka.ms/azd-troubleshoot).