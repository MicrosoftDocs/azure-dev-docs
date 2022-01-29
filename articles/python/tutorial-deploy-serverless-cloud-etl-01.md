---
title: Overview of Cloud-based, serverless ETL using Python on Azure
description: High-level conceptual summary of the common data engineering scenario, serverless cloud ETL.
services: python, azure-functions, azure-key-vault, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
ms.date: 09/23/2021
---

# Overview: Cloud-based, serverless ETL using Python on Azure

This series shows you one way to create a serverless, cloud-based *Extract, Transform, and Load* Python solution using an Azure Function App.

![Serverless, Cloud ETL Solution Diagram](media\serverless-cloudetl\serverless_cloudetl_arch_01_v2.svg)

The Azure Function App [securely ingests data](tutorial-deploy-serverless-cloud-etl-03.md) from Azure Storage Blob. Then, the [data is processed using Pandas and loaded](tutorial-deploy-serverless-cloud-etl-04.md) into an Azure Data Lake Store. Finally, the source data file is [archived using Cool-Tier Access](tutorial-deploy-serverless-cloud-etl-05.md) in an Azure Storage Blob.

## Next Step

> [!div class="nextstepaction"]
> [Next: Get started >>>](tutorial-deploy-serverless-cloud-etl-02.md)
