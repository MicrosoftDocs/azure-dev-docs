---
title: Sign-in instructions for the Azure Toolkit for IntelliJ
description: Learn how to sign in to Microsoft Azure by using the Azure Toolkit for IntelliJ.
author: KarlErickson
ms.author: karler
ms.reviewer: jialuogan
ms.date: 03/04/2022
ms.topic: article
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java
---

# Sign-in instructions for the Azure Toolkit for IntelliJ

Once [installed](https://www.jetbrains.com/help/idea/managing-plugins.html), the [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053) provides four methods for signing in to your Azure account:

- [Sign in to your Azure account with Azure CLI](#sign-in-to-your-azure-account-with-azure-cli)
- [Sign in to your Azure account with OAuth](#sign-in-to-your-azure-account-with-oauth)
- [Sign in to your Azure account with Device Login](#sign-in-to-your-azure-account-with-device-login)
- [Sign in to your Azure account with Service Principal](#sign-in-to-your-azure-account-with-service-principal)

[**Sign out**](#sign-out-of-your-azure-account) methods are also provided.

[!INCLUDE [basic-prerequisites](includes/basic-prerequisites.md)]

> [!TIP]
> To use all the latest features of [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053), please download the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) as well as the plugin itself.

## Sign in to your Azure account with Azure CLI

> [!NOTE]
> For more information on using Azure CLI to sign in, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

To sign in Azure with Azure CLI, do the following:

1. Open your project with IntelliJ IDEA.

1. Navigate to the left-hand **Azure Explorer** sidebar, and then click the **Azure Sign In** icon. Alternatively, you can navigate to **Tools**, expand **Azure**, and then click **Azure Sign in**.

   ![The IntelliJ Azure Sign In command.][I01]

1. In the **Azure Sign In** window, **Azure CLI** will be selected by default after waiting a few seconds. When the option is available, click **Sign in**.

   ![The Azure Sign In window with Azure CLI selected.][A01]

1. In the browser, sign in with your account and then go back to IntelliJ. In the **Select Subscriptions** dialog box, click on the subscriptions that you want to use, then click **Select**.

## Sign in to your Azure account with OAuth

To sign in Azure with OAuth 2.0, do the following:

1. Open your project with IntelliJ IDEA.

1. Navigate to the left-hand **Azure Explorer** sidebar, and then click the **Azure Sign In** icon. Alternatively, you can navigate to **Tools**, expand **Azure**, and then click **Azure Sign in**.

   ![The IntelliJ Azure Sign In command.][I01]

1. In the **Azure Sign In** window, select **OAuth 2.0**, and then click **Sign in**.

   ![The Azure Sign In window with OAuth selected.][O01]

1. In the browser, sign in with your account and then go back to IntelliJ. In the **Select Subscriptions** dialog box, click on the subscriptions that you want to use, then click **Select**.

## Sign in to your Azure account with Device Login

To sign in Azure with Device Login, do the following:

1. Open your project with IntelliJ IDEA.

1. Open sidebar **Azure Explorer**, and then click the **Azure Sign In** icon in the bar on top (or from the IntelliJ menu, navigate to **Tools>Azure>Azure Sign in**).

   ![The IntelliJ Azure Sign In command.][I01]

1. In the **Azure Sign In** window, select **Device Login**, and then click **Sign in**.

   ![The Azure Sign In window with device login selected.][I02]

1. Click **Copy&Open** in **Azure Device Login** dialog.

1. In the browser, paste your device code (which has been copied when you click **Copy&Open** in last step) and then click **Next**.

1. Select your Azure account and complete any authentication procedures necessary in order to sign in.

1. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, and then click **Select**.

## Sign in to your Azure account with Service Principal

> [!NOTE]
> To create an Azure service principal, see [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).

To sign in Azure with Service Principal, do the following:

1. Open your project with IntelliJ IDEA.

1. Open sidebar **Azure Explorer**, and then click the **Azure Sign In** icon in the bar on top (or from the IntelliJ menu, navigate to **Tools>Azure>Azure Sign in**).

   ![The IntelliJ Azure Sign In command.][I01]

1. In the **Azure Sign In** window, select **Service Principal**, and then click **Sign In**.

   ![The Azure Sign In window with service principal selected.][A03]

1. In the **Sign In - Service Principal** window, complete any information necessary (you can copy the JSON output, which has been generated after using the `az ad sp create-for-rbac` command into the **JSON Panel** of the window), and then click **Sign In**.

   ![The JSON Panel window with paste information.][S01]

1. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, and then click **Select**.

## Sign out of your Azure account

After you have configured your account by preceding steps, you will be automatically signed in each time you start IntelliJ IDEA.

However, if you want to sign out of your Azure account, navigate to the Azure Explorer side bar, click the **Azure Sign Out** icon or from the IntelliJ menu, navigate to **Tools>Azure>Azure Sign Out**).

## Next steps

[!INCLUDE [additional-resources](includes/additional-resources.md)]

<!-- URL List -->

<!-- IMG List -->

[I01]: media/sign-in-instructions/I01.png
[I02]: media/sign-in-instructions/I02.png
[O01]: media/sign-in-instructions/O01.png
[A01]: media/sign-in-instructions/A01.png
[A03]: media/sign-in-instructions/A03.png
[S01]: media/sign-in-instructions/S01.png
