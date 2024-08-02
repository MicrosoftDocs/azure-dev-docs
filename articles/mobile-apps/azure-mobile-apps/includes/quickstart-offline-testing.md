---
ms.topic: include
ms.date: 05/05/2021
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

## Test the app

In this section, test the behavior with WiFi on, and then turn off WiFi to create an offline scenario.

Items in the todo list are stored in a SQLite database on the device.  When you refresh the data, the changes are sent to the service (push). The app then requests any new items (pull).  In the tutorial, the refresh is selected by pressing an icon or by using "pull to refresh".

1. Place the device or simulator in *Airplane Mode*.
1. Add some Todo items, or mark some items as complete.
1. Quit the device or simulator (or forcibly close the app) and restart the app.
1. Verify that your changes have been persisted on the device.
1. View the contents of the Azure *TodoItem* table.  Use a SQL tool such as *SQL Server Management Studio*, or a REST client such *Curl*. Verify that the new items *haven't* been synced to the server
1. Turn on WiFi in the device or simulator.
1. Refresh the data, either by "pull to refresh" or by pressing the refresh icon.
1. Review the *TodoItem* table data again. The new and changed items should now appear.
