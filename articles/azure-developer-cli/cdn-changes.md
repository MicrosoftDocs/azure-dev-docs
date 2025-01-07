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

The Content Delivery Network (CDN) endpoint used to download and install `azd` is changing due to the [Azure CDN from Edgio retirement](/azure/cdn/edgio-retirement-faq) effective January 15, 2025. If you install `azd` using a script, it's recommended you use the latest install scripts hosted at `https://aka.ms/install-azd.ps1` and `https://aka.ms/install-azd.sh`. Customers who use this approach will not be impacted by the CDN change.

> [!NOTE]
> Hard coding the CDN hostname directly to reference install scripts isn't a supported scenario. If your logic depends on the hostname, then future changes to hostnames could result in a breaking change to your application.

## Who is impacted by this change?

Your application or system may be impacted and require updates due to the CDN change if you're using any of the following in your application:

- The `azure/setup-azd@1.0.0` GitHub Action (and earlier versions)
- Older downloaded versions of `install-azd.ps1` and `install-azd.sh` scripts
  - The latest versions are available at `https://aka.ms/install-azd.ps1` and `https://aka.ms/install-azd.sh`
- Any hardcoded references in your system to the older CDN endpoints

## Actions if you're impacted by this change

Complete or verify the following to ensure your system is compatible with the CDN changes:

- Ensure you're using the [latest GitHub Action](https://github.com/marketplace/actions/setup-azd) (`v2`) for `azure/setup-azd` in your workflows.
- Ensure you're using the latest [Azure DevOps task version](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azd).
- Ensure any custom install scripts reference the new host name. There's no change to file paths after the host name.

## Where to find more information

For more on this change, follow [the issue in the azd repository](https://github.com/Azure/azure-dev/issues/4661) or read the [FAQs on Microsoft Learn documentation](/azure/cdn/edgio-retirement-faq).

If you run into any problems or have suggestions, file an issue or start a discussion in the [Azure Developer CLI repository](https://github.com/Azure/azure-dev). You can also explore the [troubleshooting documentation](https://aka.ms/azd-troubleshoot).
