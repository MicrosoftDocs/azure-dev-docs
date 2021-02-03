---
title: Use Azure Storage for static websites
description: Links to Azure Storage documentation that discusses how to load files into storage and directly serve those files on the web.
ms.date: 02/03/2021
ms.topic: conceptual 
ms.custom: devx-track-python
---

# How to create static websites on Azure Storage

A static website is composed of HTML, CSS, JavaScript, and other static files such as images or fonts. A static site is typically a single-page application (or <a href="https://en.wikipedia.org/wiki/Single-page_application">SPA</a>) written with any number of JavaScript frameworks such as Angular, React, or Vue.

However you design the app, you host and serve these files directly from Azure Storage rather than using a web server. Hosting in storage is simpler and significantly less expensive than maintaining a web server. To what extent you might need server-side processing, you can often meet those needs through serverless functions as supported by Azure Functions.

The resources below provide all the details on creating static websites.

- [Static website hosting in Azure Storage](/azure/storage/blobs/storage-blob-static-website): An overview of how to configure Azure Storage for static hosting.

- [Host a static website in Azure Storage](/azure/storage/blobs/storage-blob-static-website-how-to?tabs=azure-cli): A walkthrough of how to enable static hosting, upload files, and perform other tasks using the Azure portal, the Azure CLI, or Azure PowerShell.

- [How to use GitHub Actions to deploy a static website to Azure Storage](/azure/storage/blobs/storage-blobs-static-site-github-actions): A walkthrough on configuring GitHub Actions to automatically copy updated files from a repository into Azure Storage.

- [Deploy a static website to Azure from Visual Studio Code](/azure/developer/javascript/tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-01): A tutorial that covers creating a simple SPA in Angular, React, Vue, and Svelte and then deploying that app to Azure Storage from within Visual Studio Code.
