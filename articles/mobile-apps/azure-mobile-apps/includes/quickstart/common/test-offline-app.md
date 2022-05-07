---
ms.topic: include
ms.date: 05/06/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

## Test the app

The app does not synchronize with the backend until the refresh icon is pressed.  To test:

1. Open the [Azure portal](https://portal.azure.com).
1. Open the resource group that contains the resources for the quickstart.
1. Select the `quickstart` database.
1. Select the **Query editor (preview)**.
1. Log in with SQL server authentication using the same credentials you set up for the database.

  * If necessary, you will be prompted to allow access for your IP address.  Select the link to update the allowlist, then press **OK** to retry the login.

1. In the query editor, enter `SELECT * FROM [dbo].[TodoItems]`.  Then select **Run**.

A list of the current TodoItems will be displayed.

![Todo Items](~/mobile-apps/azure-mobile-apps/media/quickstart/common/query-results.png)

Now, make some changes through your app.  **DO NOT PRESS REFRESH** (yet).  

Repeat the SQL statement in the Azure portal and verify that no changes have been made to the data in the database.

Select the **Refresh** icon on your app.  This will push the data in queue to the remote service.

Repeat the SQL statement in the Azure portal and verify that your changes have been pushed to the remote service.