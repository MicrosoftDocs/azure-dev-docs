---
ms.topic: include
ms.date: 05/05/2021
author: adrianhall
ms.author: adhal
---

## Test the app

In this section, test the behavior with WiFi on, and then turn off WiFi to create an offline scenario.  It is best to use the Android or iOS versions of the application for this purpose, as it is easier to turn the simulated WiFi on and off.

When you add data items, they are held in the local SQLite store, but not synced to the mobile service until you "pull to refresh" the list. Other apps may have different requirements regarding when data needs to be synchronized, but for demo purposes this tutorial has the user explicitly request it.

When you "pull to refresh" (or press the refresh icon), a new background task starts. It first pushes all changes made to the local store using synchronization context, then pulls all changed data from Azure to the local table.

1. Place the device or simulator in *Airplane Mode*.
1. Add some Todo items, or mark some items as complete.
1. Quit the device or simulator (or forcibly close the app) and restart the app.
1. Verify that your changes have been persisted on the device.
1. View the contents of the Azure *TodoItem* table.  Use a SQL tool such as *SQL Server Management Studio*, or a REST client such as *Fiddler* or *Postman*. Verify that the new items *haven't* been synced to the server
1. Turn on WiFi in the device or simulator.
1. Refresh the data with "pull to refresh" or by pressing the Refresh icon.
1. Review the *TodoItem* table data again. The new and changed items should now appear.
