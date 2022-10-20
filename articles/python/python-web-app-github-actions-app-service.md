---
title: Use GitHub Actions to deploy a Python web app to Azure App Service on Linux
description: Use CI/CD with GitHub Actions to automatically build, test, and deploy Python web apps to Azure App Service on Linux.
ms.topic: conceptual
ms.date: 10/29/2022
ms.custom: devx-track-python
ms.prod: azure-python
---

# Use CI/CD with GitHub Actions to deploy a Python web app to Azure App Service on Linux

Use GitHub Actions continuous integration and continuous delivery (CI/CD) to deploy a Python web app to Azure App Service on Linux. Your Github Actions workflow automatically builds the code and deploys it to the App Service whenever there's a commit to the repository. You can add other functionalities in your pipeline, such as test scripts, security checks, and multistages deployment.

## Create a repository for your app code


