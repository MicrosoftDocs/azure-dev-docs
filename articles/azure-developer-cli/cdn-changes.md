---
title: CDN changes impacting the Azure Developer CLI
description: Information regarding critical Content Delivery Network (CDN) changes for azd due to the CDN provider changing from Edgio to Azure Front Door.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/14/2024
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# CDN changes for the Azure Developer CLI installation endpoints

The Edgio Content Delivery Network (CDN) endpoint used to download and install `azd` is changing due to the [Azure CDN from Edgio retirement](/azure/cdn/edgio-retirement-faq) effective January 15, 2025.During the transition to a new CND endpoint, it's recommended you install `azd` using the latest install scripts hosted at `https://aka.ms/install-azd.ps1` and `https://aka.ms/install-azd.sh`. Customers who use this approach will not be impacted by the CDN change.

The following CDN hostnames will go offline as part of this retirement:

- `azdrelease.azureedge.net`
- `azure-dev.azureedge.net` (legacy)

The new installation hostname is `azd-release-gfgac2cmf7b8cuay.b02.azurefd.net`.

> [!NOTE]
> The `azd-release-gfgac2cmf7b8cuay.b02.azurefd.net` hostname may change in the future if a more permanent hosting setup is made available.

### Impacted services and tools

The CDN changes impact the following:

- The `azure/setup-azd` GitHub Action
- Older downloaded versions of `install-azd.ps1` and `install-azd.sh` scripts
- Any hardcoded references in your system to the older CDN endpoints
  - Users should instead use the latest `https://aka.ms/install-azd.ps1` and `https://aka.ms/install-azd.sh` scripts to install azd.
- Firewall rules that enable traffic to the `*.azureedge.net` CDN hosts

### Unimpacted services and tools

The CDN changes do *not* impact the following:

- The `azd` client and `Azure Developer CLI` VS Code extension functionality
- WinGet, Choco, and brew installers
- GitHub releases
- Normal usage of `https://aka.ms/install-azd.ps1` and `https://aka.ms/install-azd.sh` scripts

  > [!NOTE]
  > The scripts available at the `https://aka.ms/*` Microsoft short links are correctly updated and the supported way to run the install script.

### Recommended actions and resources

The legacy installation hostnames must be updated to point to the new CDN endpoint at `azd-release-gfgac2cmf7b8cuay.b02.azurefd.net` wherever the original hostnames are directly referenced.

Additionally:

- Ensure you're using the [latest GitHub Action](https://github.com/marketplace/actions/setup-azd) (`v2`) for `azure/setup-azd` in your workflows.
- Ensure you're using the latest [Azure DevOps task version](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azd).
- Ensure any custom install scripts reference the new host name. There's no change to file paths after the host name.
- Update any firewall rules which allow traffic to `azdrelease.azureedge.net` to instead use the new hostname.

For more on this change, follow [the issue in the azd repository](https://github.com/Azure/azure-dev/issues/4661) or read the [FAQs on Microsoft Learn documentation](/azure/cdn/edgio-retirement-faq). For related news on the change, see [the issue in the .NET Core repository](https://github.com/dotnet/core/issues/9671).

If you run into any problems or have suggestions, file an issue or start a discussion in the [Azure Developer CLI repository](https://github.com/Azure/azure-dev). You can also explore our [troubleshooting documentation](https://aka.ms/azd-troubleshoot).