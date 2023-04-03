---
title: Azure Developer CLI versioning and feature release strategy
description: Learn about the versioning and feature release strategy of the Azure Developer CLI
keywords: azure developer cli, azd
author: alexwolfmsft
ms.author: alexwolf
ms.date: 4/03/2023
ms.topic: conceptual
ms.service: azure-dev-cli
ms.custom: devx-track-azdevcli
zone_pivot_group_filename: developer/azure-developer-cli/azd-zone-pivot-groups.json
zone_pivot_groups: azd-languages-set
---

# Azure Developer CLI feature versioning and release strategy

Azure Developer CLI (azd) features are introduced and supported using a phased approach. Features generally begin in the **alpha** stage and then advance to **beta** and **stable** after meeting various criteria. This article describes the definitions, expectations and advancement requirements for each phase.

## Alpha Features

All features start as alpha features (e.g., experimental). In this phase, the goal is to receive sufficient usage to get meaningful feedback around the feature’s design, functionality and user experience.  

### Definition

* These features are under active development.
* Hidden behind a feature flag which interested users must explicitly opt into.
* There are no guarantees about the long-term stability or supportability of experimental features.
* No commitment by the team that the feature is something we plan to advance to preview or stable stage (it’s an experiment).
* A reasonable outcome of an experiment is “it didn’t work” and we rip out the code.
* Recommended for non-business-critical uses because of potential for incompatible changes in subsequent releases.

### Advancement criteria (how to reach preview)

* The feature has been properly spec’d (initial draft) and approved by the product team.
* The product team has had a formal review meeting to sign off on feature advancement to next phase.
* The feature is documented and help text is available in the product.
* We’ve received signal that the UX is successful via sufficient user feedback.

## Beta/Preview Features

The goal of this phase is to iron out the rough edges and advance beyond proof of concept.  

### Definition

* Unlike beta features, a user does not need to take explicit action to use a preview feature.
* We do expect breaking changes across releases for preview features as we work with customers, but we expect the number of breaks to be smaller as the feature matures.
* We invest more time in documentation of breaking changes for preview features and explain to customers how to digest these breaks.
* Use for non-business-critical scenarios with caution as there is a small chance of incompatible changes in subsequent releases leading up to stable.
* If a command is in beta, we denote it as such in azd help in product.

### Advancement criteria (how to reach stable)

* Product team has had a formal review meeting to sign off on feature advancement to next phase.
* The feature is functionally complete and has been stabilized.
* Feature has been thoroughly manually tested and has sufficient unit and integration tests to catch regressions and bugs.
* Any remaining bugs are acceptable and non-blocking for users (e.g., UX improvements).
* We’ve received signal that the UX is successful via sufficient user feedback (via external feedback; depends on feature).
* We believe that the feature is truly adding value to the end-to-end UX.

## Stable Features

### Definition 

* We stand behind these features.
* Breaking changes in these areas are unexpected and would be extremely painful for us to roll out.
* In cases where we must break, we spend engineering time to minimize the impact and to move customers forward automatically, with no pain, whenever possible.
* Use in business-critical scenarios.
