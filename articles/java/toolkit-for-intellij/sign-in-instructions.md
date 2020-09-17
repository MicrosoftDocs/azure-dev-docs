---
title: Sign-in instructions for the Azure Toolkit for IntelliJ
description: Learn how to sign in to Microsoft Azure by using the Azure Toolkit for IntelliJ.
documentationcenter: java
ms.date: 02/01/2018
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
ms.custom: devx-track-java
---

# Sign-in instructions for the Azure Toolkit for IntelliJ

Once [installed](https://www.jetbrains.com/help/idea/managing-plugins.html), the [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053) provides two methods for signing in to your Azure account:

  - [Sign in to your Azure account by Device Login](#sign-in-to-your-azure-account-by-device-login)
  - [Sign in to your Azure account by Service Principal](#sign-in-to-your-azure-account-by-service-principal)

[**Sign out**](#sign-out-of-your-azure-account) methods are also provided.

[!INCLUDE [basic-prerequisites](includes/basic-prerequisites.md)]

## Sign in to your Azure account by Device Login

To sign in Azure by device login, do the following:

1. Open your project with IntelliJ IDEA.

1. Open sidebar **Azure Explorer**, and then click the **Azure Sign In** icon in the bar on top (or from the IntelliJ menu, navigate to **Tools>Azure>Azure Sign in**).

   ![The IntelliJ Azure Sign In command][I01]

1. In the **Azure Sign In** window, select **Device Login**, and then click **Sign in**.

   ![The Azure Sign In window with device login selected][I02]

1. Click **Copy&Open** in **Azure Device Login** dialog .

1. In the browser, paste your device code (which has been copied when you click **Copy&Open** in last step) and then click **Next**.

1. Select your Azure account and complete any authentication procedures necessary in order to sign in.

1. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, and then click **OK**.


## Sign in to your Azure account by Service Principal

This section walks you through creating a credentials file that contains your service principal data. After you have completed this process, IntelliJ uses the credentials file to automatically sign you in to Azure when open your project.

1. Open your project with IntelliJ IDEA.

1. Open sidebar **Azure Explorer**, and then click the **Azure Sign In** icon in the bar on top (or from the IntelliJ menu, navigate to **Tools>Azure>Azure Sign in**).

   ![The IntelliJ Azure Sign In command][I01]

1. In the **Azure Sign In** window, select **Service Principal**, and then click **New**.

   ![The Azure Sign In window with service principal selected][A02]

1. Click **Copy&Open** in **Azure Device Login** dialog .

1. In the browser, paste your device code (which has been copied when you click **Copy&Open** in last step) and then click **Next**.

1. Select your Azure account and complete any authentication procedures necessary in order to sign in. After authentication, close the browser and switch back to IntelliJ.

1. In the **Create Authentication Files** window, select the subscriptions that you want to use, choose your destination directory, and then click **Start**.

1. In the **Service Principal Creation Status** dialog box, click **OK** after your files have been created successfully.

1. In the **Azure Sign In** window, click **Sign in**. 

1. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, and then click **OK**.

   > [!TIP]
   > Once you have created the service principal authentication file, you can start from step 3, choose your authentication file and sign in.

## Sign out of your Azure account

After you have configured your account by preceding steps, you will be automatically signed in each time you start IntelliJ IDEA. 

However, if you want to sign out of your Azure account, navigate to the Azure Explorer side bar, click the **Azure Sign Out** icon or from the IntelliJ menu, navigate to **Tools>Azure>Azure Sign Out**).


## Next steps

[!INCLUDE [additional-resources](includes/additional-resources.md)]

<!-- URL List -->

<!-- IMG List -->

[I01]: media/sign-in-instructions/I01.png
[I02]: media/sign-in-instructions/I02.png

[A02]: media/sign-in-instructions/A02.png

