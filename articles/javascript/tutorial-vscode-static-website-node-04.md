---
title: Deploy the static Node.js app files to Azure Storage from Visual Studio Code
description: Static web app tutorial part 4, deploy the files to Azure Storage
ms.topic: tutorial
ms.date: 09/24/2019
ms.author: buhollan
ms.custom: devx-track-js
---

# Deploy the website to Azure Storage

[Previous step: Create a Storage account](tutorial-vscode-static-website-node-03.md)

In this step, you use Visual Studio Code to deploy the static website files created in the previous steps to Azure Storage, which then hosts and serves those files.

# [Angular](#tab/angular)

1. In Visual Studio Code, go to the **Azure Storage** explorer, expand your subscription, expand the node for the Azure Storage account that you created in the previous step, then expand the **Blob Containers** node. The `$web` container is where you deploy your app code.

   ![Azure Storage nodes in the Azure Storage explorer](media/static-website/storage-nodes.png)

1. Select the **Files** explorer, right-click on your _dist/my-static-app_ folder, and choose **Deploy to Static Website**:

    ![Deploy to Static Website command](media/static-website/deploy-build-angular.png)

1. When prompted, choose the Storage account that you created previously.

1. When deployment is complete, a message appears with a **Browse to website** button. Select that button to open the primary endpoint of the deployed app code.

    ![Deployment complete message](media/static-website/deployment-complete.png)

    ![Static website running in Azure](media/static-website/azure-app-angular.png)

# [React](#tab/react)

1. In Visual Studio Code, go to the **Azure Storage** explorer, expand your subscription, expand the node for the Azure Storage account that you created in the previous step, then expand the **Blob Containers** node. The `$web` container is where you deploy your app code.

   ![Azure Storage nodes in the Azure Storage explorer](media/static-website/storage-nodes.png)

1. Select the **Files** explorer, right-click on your _build_ folder, and choose **Deploy to Static Website**:

    ![Deploy to Static Website command](media/static-website/deploy-build-react.png)

1. When prompted, choose the Storage account that you created previously.

1. When deployment is complete, a message appears with a **Browse to website** button. Select that button to open the primary endpoint of the deployed app code.

    ![Deployment complete message](media/static-website/deployment-complete.png)

    ![Static website running in Azure](media/static-website/azure-app-react.png)

# [Vue](#tab/vue)

1. In Visual Studio Code, go to the **Azure Storage** explorer, expand your subscription, expand the node for the Azure Storage account that you created in the previous step, then expand the **Blob Containers** node. The `$web` container is where you deploy your app code.

   ![Azure Storage nodes in the Azure Storage explorer](media/static-website/storage-nodes.png)

1. Select the **Files** explorer, right-click on your _dist_ folder, and choose **Deploy to Static Website**:

    ![Deploy to Static Website command](media/static-website/deploy-build-vue.png)

1. When prompted, choose the Storage account that you created previously.

1. When deployment is complete, a message appears with a **Browse to website** button. Select that button to open the primary endpoint of the deployed app code.

    ![Deployment complete message](media/static-website/deployment-complete.png)

    ![Static website running in Azure](media/static-website/azure-app-vue.png)

# [Svelte](#tab/svelte)

1. In Visual Studio Code, go to the **Azure Storage** explorer, expand your subscription, expand the node for the Azure Storage account that you created in the previous step, then expand the **Blob Containers** node. The `$web` container is where you deploy your app code.

   ![Azure Storage nodes in the Azure Storage explorer](media/static-website/storage-nodes.png)

1. Select the **Files** explorer, right-click on your _public_ folder, and choose **Deploy to Static Website**:

    ![Deploy to Static Website command](media/static-website/deploy-build-svelte.png)

1. When prompted, choose the Storage account that you created previously.

1. When deployment is complete, a message appears with a **Browse to website** button. Select that button to open the primary endpoint of the deployed app code.

    ![Deployment complete message](media/static-website/deployment-complete-svelte.png)

    ![Static website running in Azure](media/static-website/azure-app-svelte.png)

---

> [!div class="nextstepaction"]
> [My site is on azure](tutorial-vscode-static-website-node-05.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-staticwebsite&step=create-storage)
