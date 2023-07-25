---
title: Using Azure Export with Terraform Import Blocks
description: Learn how to use Terraform 1.5 import blocks with Azure Export for Terraform
keywords: azure export terraform import blocks
ms.topic: how-to
ms.date: 07/25/2023
ms.author: stema
ms.custom: devx-track-terraform,devx-track-export-terraform
---
# Using Azure Export with Terraform Import Blocks
This article covers using Azure Export with import blocks for Terraform with version 1.5 or newer, as well as the benefits of both.

## Workflow
When running `aztfexport` with v0.13 or greater alongside Terraform version 1.5 or greater, the `--generate-mapping-file` or `-g` command will not only generate a mapping file but also an `import.tf` file which will include import blocks for each of the resources `aztfexport` was able to map. From this point on the behavior of the configuration is identical to [the preexisting import block workflow]. To run the import block, simply specify `terraform plan` and the config will be generated.

## Differences Between Import Blocks and Azure Export
Azure Export for Terraform supports import blocks as of v0.13 as long as the user has a Terraform version of 1.5 or greater installed. It is important to understand the benefits and differences between the two tools:
- Azure Export for Terraform aids in resource discovery. Whether it's through manual (specify a resource group) or automated (all resources under networking) methods, there are a variety of ways to discover and export the resources you want.
- Azure Export for Terraform provides resource filtering, also through manual and automated means.
- Azure Export for Terraform auto-generates import blocks with its outputs, saving time and effort on the authoring process.
- Terraform import blocks are natively supported in Terraform, which makes them easy to use.
Combined together, we believe that the use of both will provide tremendous benefit for a variety of scenarios to you.

## Summary
In this article you learned how to use Azure Export with import blocks for Terraform and the benefits of both.
