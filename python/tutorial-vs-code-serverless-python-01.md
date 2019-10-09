---
title: "Tutorial: Create and deploy serverless Azure Functions in Python with Visual Studio Code"
description: Tutorial step 1, introduction and prerequisites.
services: functions
author: kraigb
manager: barbkess
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: kraigb
ms.custom: seo-python-october2019
---

# Tutorial: Create and deploy serverless Azure Functions in Python with Visual Studio Code

In this article, you use Visual Studio Code and the Azure Functions extension to create a serverless HTTP endpoint with Python and to also add a connection (or "binding") to storage.

Azure Functions runs your code in a serverless environment without needing to provision a virtual machine or publish a web app. The Azure Functions extension for Visual Studio Code greatly simplifies the process of using Functions by automatically handling many configuration concerns.

If you encounter issues with any of the steps in this tutorial, we'd love to hear the details. Use the **I ran into an issue** button at the end of each article to submit feedback.

## Prerequisites

- An [Azure subscription](#azure-subscription).
- [Visual Studio Code with the Azure Functions extension](#visual-studio-code-python-and-the-azure-functions-extension).
- The [Azure Functions Core Tools](#azure-functions-core-tools).

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-functions-extension&mktingSource=vscode-tutorial-functions-extension) for a free 30-day account with $200 in Azure credits to try out any combination of services.

### Visual Studio Code, Python, and the Azure Functions extension

Install the following software:

- Python 3.6.x as required by Azure Functions. [Python 3.6.8](https://www.python.org/downloads/release/python-368/) is the latest 3.6.x version.
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) as described on [Visual Studio Code Python Tutorial - Prerequisites](https://code.visualstudio.com/docs/python/python-tutorial).
- The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). For general information, visit the [vscode-azurefunctions GitHub repository](https://github.com/Microsoft/vscode-azurefunctions).

> [!NOTE]
> The Azure Functions extension is included with the the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack).

### Azure Functions Core Tools

Follow the instructions for your operating system on [Work with Azure Functions Core Tools](/azure/azure-functions/functions-run-local#v2). The tools themselves are written in .NET Core, and the Core Tools package is best installed using the Node.js package manager, npm, which is why you need to install .NET Core and Node.js at present, even for Python code. You can, however bypass the .NET Core requirement using "extension bundles" as described in the aforementioned documentation. Whatever the case, you need install these components only once, after which Visual Studio Code automatically prompts you to install any updates.

### Sign in to Azure

[!INCLUDE [azure-sign-in](includes/azure-sign-in.md)]

### Verify prerequisites

To verify that all the Azure Functions tools are installed, open the Visual Studio Code Command Palette (**F1**), select the **Terminal: Create New Integrated Terminal** command, and once the terminal opens, run the command `func`:

![Checking Azure Functions core tools prerequisites](media/tutorial-vs-code-serverless-python/check-prereqs.png)

The output that starts with the Azure Functions logo (you need to scroll the output upwards) indicates that the Azure Functions Core Tools are present.

If the `func` command isn't recognized, then verify that the folder where you installed the Azure Functions Core Tools is included in your PATH environment variable.

> [!div class="nextstepaction"]
> [I signed into Azure](tutorial-vs-code-serverless-python-02.md)

[I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-functions-python&step=01-verify-prerequisites)
