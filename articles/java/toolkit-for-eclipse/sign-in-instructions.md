---
title: Sign-in instructions for the Azure Toolkit for Eclipse
description: Learn how to sign into Microsoft Azure by using the Azure Toolkit for Eclipse.
documentationcenter: java
ms.date: 02/01/2018
ms.service: azure-java
ms.tgt_pltfrm: multiple
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Sign-in instructions for the Azure Toolkit for Eclipse

The Azure Toolkit for Eclipse provides two methods for signing into your Azure account:

  - [Sign in to your Azure account by Device Login](#sign-in-to-your-azure-account-by-device-login)
  - [Sign in to your Azure account by Service Principal](#sign-in-to-your-azure-account-by-service-principal)

[**Sign out**](#sign-out-of-your-azure-account) methods are also provided.

[!INCLUDE [prerequisites](includes/prerequisites.md)]

## Sign in to your Azure account by Device Login

This section walks you through the Azure sign in process by device login.

1. Open your project with Eclipse.

1. Click **Tools**, then click **Azure**, and then click **Sign In**.

      :::image type="content" source="media/sign-in-instructions/eclipse-azure-signin.png" alt-text="Sign in to Azure in Eclipse IDE.":::

1. In the **Azure Sign In** window, select **Device Login**, and then click **Sign in**.

   ![The Azure Sign In window with device login selected][I02]

1. Click **Copy&Open** in **Azure Device Login** dialog .

> [!NOTE]
>
> If the browser doesn't open, configure Eclipse to use an external browser like Internet Explorer, Firefox, or Chrome:
>
> 1. Open Preferences -> General -> Web Browser -> Use external web browser in Eclipse
>
> 2. Select the browser you prefer to use
>

1. In the browser, paste your device code (which has been copied when you clicked **Copy&Open** in last step) and then click **Next**.

1. Select your Azure account and complete any authentication procedures necessary in order to sign in.

1. Once signed in, close your browser and switch back to your Eclipse IDE. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, then click **OK**.

## Sign in to your Azure account by Service Principal

This section walks you through creating a credentials file that contains your service principal data. After you have completed this process, Eclipse uses the credentials file to automatically sign you into Azure when opening your project.

1. Open your project with Eclipse.

2. Click **Tools**, then click **Azure**, and then click **Sign In**.

      :::image type="content" source="media/sign-in-instructions/eclipse-azure-signin.png" alt-text="Sign in to Azure in Eclipse IDE.":::

3. In the **Azure Sign In** window, select **Service Principal**. If you do not have the service principal authentication file yet, click **New** to create one. Otherwise you can click **Browse** to open it and jump to step 8.

   ![The Azure Sign In window with service principal selected][A02]

4. Click **Copy&Open** in **Azure Device Login** dialog.

> [!NOTE]
>
> If the browser doesn't open, configure eclipse to use an external browser like IE or Chrome:
>
> 1. Open Preferences -> General -> Web Browser -> Use external web browser in Eclipse
>
> 2. Select the browser you prefer to use
>

5. In the browser, paste your device code (which has been copied when you click **Copy&Open** in last step) and then click **Next**.

6. In the **Create Authentication Files** window, select the subscriptions that you want to use, choose your destination directory, and then click **Start**.

7. In the **Service Principal Creation Status** dialog box, click **OK** after your files have been created successfully.

8. Address of the created file will be automatically filled in the **Azure Sign In** window, now click **Sign in**.

   ![Azure Log In Dialog Box][A06]

9. Finally, in the **Select Subscriptions** dialog box, select the subscriptions that you want to use, then click **OK**.


## Sign out of your Azure account

After you have configured your account by preceding steps, you will be automatically signed in each time you start Eclipse. However, if you want to sign out of your Azure account, use the following steps.

1. In Eclipse, click **Tools**, then click **Azure**, and then click **Sign Out**.

2. When the **Azure Sign Out** dialog box appears, click **Yes**.

## Next steps

[!INCLUDE [additional-resources](includes/additional-resources.md)]

<!-- URL List -->


<!-- IMG List -->

[I02]: media/sign-in-instructions/I02.png

[A02]: media/sign-in-instructions/A02.png
[A06]: media/sign-in-instructions/A06.png
