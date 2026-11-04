---
title: Configure a Custom Model in Visual Studio Code for Network-Restricted Environments
description: Learn how to configure a custom model for GitHub Copilot modernization in Visual Studio Code in a network-restricted environment.
author: KarlErickson
ms.author: karler
ms.reviewer: puichan
ms.topic: how-to
ai-usage: ai-generated
ms.date: 08/29/2026
---

# Configure a custom model in Visual Studio Code for network-restricted environments

You can use a custom model with GitHub Copilot modernization in Visual Studio Code when you work in a network-restricted environment. Install the extension and AppCAT manually, and then configure Visual Studio Code to use a model endpoint that your environment can reach.

You don't need to sign in to GitHub Copilot for this workflow.

> [!WARNING]
> Your source code and assessment context are sent to the model endpoint that you configure. A custom model doesn't guarantee full network isolation, and some modernization capabilities still require network access. You're responsible for the security and compliance posture of the model provider.

## Prerequisites

- Visual Studio Code.
- A computer with network access that you can use to download the extension and AppCAT packages.
- A way to transfer the downloaded packages to the network-restricted computer.
- A custom model endpoint that the network-restricted computer can reach.
- The endpoint URL, model or deployment name, and an API key if the endpoint requires authentication.

## Install the extension from a VSIX

Download the extension package on a connected computer, and then install it on the network-restricted computer.

1. On the connected computer, open the **Extensions** view in Visual Studio Code.
1. Find the **GitHub Copilot app modernization extension**.
1. Open the extension's context menu, and then select **Download VSIX**.

   :::image type="content" source="media/configure-custom-model-visual-studio-code/download-extension.png" alt-text="Screenshot that shows the Visual Studio Code Extensions view with Download VSIX selected for the GitHub Copilot app modernization extension." lightbox="media/configure-custom-model-visual-studio-code/download-extension.png":::

1. Transfer the VSIX file to the network-restricted computer.
1. On the network-restricted computer, open the **Extensions** view.
1. Select **Views and More Actions** (**...**), and then select **Install from VSIX...**.

   :::image type="content" source="media/configure-custom-model-visual-studio-code/install-extension.png" alt-text="Screenshot that shows the Visual Studio Code Extensions view with Install from VSIX selected." lightbox="media/configure-custom-model-visual-studio-code/install-extension.png":::

1. Select the transferred VSIX file.

## Install AppCAT manually

The extension can't download AppCAT automatically without access to the public network. Install AppCAT before you run an assessment.

1. On the connected computer, go to [Install AppCAT](https://aka.ms/appcat-install), and download the application package.
1. Transfer the package to the network-restricted computer.
1. Extract the package to `~/.appcat`.
1. Verify that the AppCAT executable is in one of the following locations:

   - Windows: `~/.appcat/appcat.exe`
   - Linux or macOS: `~/.appcat/appcat`

1. Add `~/.appcat` to the system `PATH`.
1. Restart Visual Studio Code.

> [!NOTE]
> If the installed AppCAT version doesn't match the version that the extension expects, the extension attempts to download another version. Without network access, the download fails and the assessment might appear to run indefinitely. Install the latest AppCAT package manually to resolve the problem.

## Add a custom language model

1. Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> to open the Command Palette.
1. Run **Chat: Manage Language Models**.

   :::image type="content" source="media/configure-custom-model-visual-studio-code/manage-language-models.png" alt-text="Screenshot that shows the Visual Studio Code Command Palette with Chat: Manage Language Models selected." lightbox="media/configure-custom-model-visual-studio-code/manage-language-models.png":::

1. In the **Language Models** dialog, select **Add Models...**.
1. Select the provider that matches your endpoint. For example, select **Azure**, **OpenAI**, **OpenAI Compatible**, or **Custom Endpoint**.
1. Enter the connection details that the provider requires, including the model name, API key, and endpoint.
1. Verify that the model appears under **Language Models**.

## Select and test the custom model

1. Open **Chat** in Visual Studio Code.
1. Select the custom model from the **Pick Model** list.

   :::image type="content" source="media/configure-custom-model-visual-studio-code/select-custom-model.png" alt-text="Screenshot that shows the Visual Studio Code Chat model picker with a custom Ollama model selected." lightbox="media/configure-custom-model-visual-studio-code/select-custom-model.png":::

1. Send a test message, and verify that the model responds.

   :::image type="content" source="media/configure-custom-model-visual-studio-code/test-custom-model.png" alt-text="Screenshot that shows Visual Studio Code Chat with a response from the selected custom model." lightbox="media/configure-custom-model-visual-studio-code/test-custom-model.png":::

## Configure the utility models

GitHub Copilot modernization uses the Visual Studio Code utility model settings for built-in utility flows.

1. Open **Settings**.
1. Search for `chat.utility`.
1. Set **Chat: Utility Model** to the custom model.
1. Set **Chat: Utility Small Model** to the custom model.

   :::image type="content" source="media/configure-custom-model-visual-studio-code/configure-utility-models.png" alt-text="Screenshot that shows Visual Studio Code Settings with the custom model selected for Chat Utility Model and Chat Utility Small Model." lightbox="media/configure-custom-model-visual-studio-code/configure-utility-models.png":::

## Run an assessment and create a plan

1. Open **GitHub Copilot Modernization**.
1. Select **Start Assessment** or **Open Assessment Dashboard**.
1. Run the assessment, and then open the assessment report.
1. Select the modernization findings that you want to address.
1. Select **Create Plan**.

The extension sends the selected assessment findings to Chat and invokes the modernization agent, tools, and skills with the configured model.

## Limitations and known issues

- The **Security** assessment domain requires network access and isn't available in a network-restricted environment.
- **Scan & Resolve Security Issues** requires network access.
- AppCAT version mismatches can trigger an automatic download that fails without public network access.
- Results depend on the capabilities of the custom model. A model that doesn't support the required tools or context might not complete the workflow.
- Configuring a custom model doesn't provide full network isolation. Use network controls to enforce your organization's egress requirements.

## Related content

- [Configure BYOM/BYOK for the Modernize CLI](modernization-agent/configure-bring-your-own-model-key.md)
- [Install AppCAT](https://aka.ms/appcat-install)
- [Use BYOK models in offline mode with GitHub Copilot CLI](https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/use-byok-models#running-in-offline-mode)
