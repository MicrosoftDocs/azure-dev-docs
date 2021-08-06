---
title: Make changes to the app code and redeploy to Azure
description: Tutorial part 6, Azure CLI make changes and redeploy
ms.topic: tutorial
ms.date: 08/04/2021
ms.custom: devx-track-js, devx-track-azurecli
---

# 6. Make changes and redeploy

In this step, you make changes to your app code, commit them to the local Git repository, and then redeploy your site by pushing to Azure.

1. In the `myExpressApp` folder, open the *public/index.html* file and change the message on line 10 from `Welcome to Express` to `Welcome to Azure!` and save the file.

1. In a terminal or command prompt, commit the changes to git by running the following command:

    ```bash
    git commit -a -m "Edited message"
    ```

1. Push the changes to the Git remote named Azure that we created earlier:

    ```bash
    git push azure main
    ```

    If you receive the error ` Error - Changes committed to remote repository but deployment to website failed.`. Try the command a second time.    

1. Refresh the app in the browser to see those changes:

    ![Published changes visible in the browser](../../media/azure-cli/remote-app-changes.png)

## Next steps

* []
