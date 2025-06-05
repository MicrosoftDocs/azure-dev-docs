---
title: Azure Developer CLI versioning and feature release strategy
description: Learn about the versioning and feature release strategy of the Azure Developer CLI
keywords: azure developer cli, azd
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/14/2023
ms.topic: how-to
ms.service: azure-dev-cli
ms.custom: devx-track-azdevcli
---

# Azure Developer CLI feature versioning and release strategy

Azure Developer CLI (`azd`) features are introduced and supported using a phased approach. Features begin in the **alpha** stage and then advance to **beta** and **stable** after meeting various criteria. This article describes the definitions, expectations and advancement requirements for each phase. See a full list of each feature /command supported by `azd` and its current stage [on GitHub](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/feature-stages.md)

## Alpha Features

All features start as **alpha** features (e.g., experimental). In this phase, the goal is to receive sufficient usage to get meaningful feedback around the feature's design, functionality and user experience. Alpha features can be enabled and managed using the [`azd config`](reference.md) command.

> [!IMPORTANT]
> **Alpha** features are only recommended for non-business-critical scenarios with caution as there is a small chance of incompatible changes in subsequent releases leading up to stable.

### Definition

* These features are under active development.
* Features are hidden behind a feature flag, which interested users must explicitly opt into. 
* There are no guarantees about the long-term stability or support of experimental features.
* No commitment that the feature is something the product team plans to advance to preview or stable stage (it's an experiment).

### How to opt into alpha features

1. To list available experimental features, run:

    ```azdeveloper
    azd config list-alpha
    ```

1. To enable a specific experimental feature, e.g. `resourceGroupDeployments` to support infrastructure deployments at resource group scope, run:

    ```azdeveloper
    azd config set alpha.resourceGroupDeployments on
    ```

1. To disable the `resourceGroupDeployments` feature, run:

    ```azdeveloper
    azd config set alpha.resourceGroupDeployments off
    ```

    For more information, visit the [azure-dev](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/alpha-features.md) GitHub repository.

### Advancement criteria (how to reach beta)

* The feature has been properly spec'd and approved by the product team.
* The product team has formally signed off on advancing the feature to next phase.
* The feature is documented and help text is available in the product.
* Confirmation that the UX is successful via sufficient user feedback.

## Beta Features

The goal of this phase is to improve the feature experience and advance beyond proof of concept.

> [!IMPORTANT]
> **Beta** features are only recommended for non-business-critical scenarios with caution as there is a small chance of incompatible changes in subsequent releases leading up to stable.

### Definition

* Unlike **alpha** features, a user doesn't need to take explicit action to use a **beta** feature.
* Reduced number of breaking changes across releases for **beta** features as functionality matures updates are made based on customer feedback.
* Breaking changes are documented with explanations regarding how to digest these breaks.
* Beta commands are denoted as such (Beta) in azd product help.

### Advancement criteria (how to reach stable)

* The Product team has formally reviewed and signed off on feature advancement to next phase.
* The feature is functionally complete and stable.
* Feature has been thoroughly manually tested and has sufficient unit and integration tests to catch regressions and bugs.
* Any remaining bugs are acceptable and nonblocking for users (e.g., UX improvements).
* The product team has received signals that the UX is successful via sufficient user feedback.
* The product team believes that the feature is truly adding value to the end-to-end UX.

## Stable Features

### Definition 

* The product team stand behind these features.
* Breaking changes in these areas are unexpected.
* The product team ensures that any breaking changes are rolled out in a way that minimizes impact.
* Use in business-critical scenarios.

[!INCLUDE [request-help](includes/request-help.md)]
