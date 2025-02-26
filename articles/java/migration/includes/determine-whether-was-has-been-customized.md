---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 05/31/2023
---

### Determine whether WAS has been customized

Determine which of the following customizations have been made, and capture what's been done.

* Have the startup scripts been changed? Such scripts include **wsadmin**, **AdminControl**, **AdminConfig**, **AdminApp**, and **AdminTask**.
* Are there any specific parameters passed to the JVM?
* Are there JARs added to the server classpath?
* Have OS-level facilities such as `systemd` been used to cause WAS components to start automatically after a server restart?

You need to account for migration considerations depending on the answers to these questions.
