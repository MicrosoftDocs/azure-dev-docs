---
title: Getting started materials for machine learning for Python apps on Azure
description: Index of getting started materials in the Azure documentation for machine learning for Python apps.
ms.date: 03/14/2023
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Machine learning for Python apps on Azure

The following articles help you get started with Azure Machine Learning. Azure Machine Learning's v2 REST APIs, Azure CLI extension, and Python SDK accelerate the production machine learning lifecycle.The links below are targeted at v2, which is recommended if you're starting a new machine learning project.

## Manage ML workspaces

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning.

- [Quickstart: Run Jupyter notebooks in studio and Python](/azure/machine-learning/quickstart-run-notebooks)
- [Tutorial: Azure Machine Learning in a day with the Python SDK](/azure/machine-learning/tutorial-azure-ml-in-a-day)
- [Manage Azure Machine Learning workspaces in the portal or with the Python SDK](/azure/machine-learning/how-to-manage-workspace)

## Automated machine learning

Automated machine learning, also referred to as automated ML or AutoML, is the process of automating the time-consuming, iterative tasks of machine learning model development. It allows data scientists, analysts, and developers to build ML models with high scale, efficiency, and productivity all while sustaining model quality.

- [Train a regression model with AutoML and Python (SDK v1)](/azure/machine-learning/v1/how-to-auto-train-models-v1)
- [Access datasets with Python using the Azure Machine Learning Python client library](/azure/architecture/data-science-process/python-data-access)
- [Set up AutoML training with the Azure Machine Learning Python SDK v2](/azure/machine-learning/how-to-configure-auto-train)

## Machine learning pipelines

Use machine learning pipelines to create a workflow that stitches together various ML phases. Publish pipelines for later access or sharing with others. Track pipelines to see how your model is performing in the real world and to detect data drift. ML pipelines are ideal for batch scoring scenarios, using various computes, reusing steps instead of rerunning them, and sharing ML workflows with others.

- [Create and run machine learning pipelines using components with the Azure Machine Learning SDK v2](/azure/machine-learning/how-to-create-component-pipeline-python)
- [Tutorial: Create production ML pipelines with Python SDK v2 in a Jupyter notebook](/azure/machine-learning/tutorial-pipeline-python-sdk)
- [Deploy a data pipeline with Azure DevOps](/azure/devops/pipelines/apps/cd/azure/cicd-data-overview)
