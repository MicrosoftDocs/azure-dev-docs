---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

Fill out the information to build the image.

* **Tag image**  &rarr; Use the fully qualified name **\<repository-name>.azurecr.io**.
* **Registry** &rarr; Select the registry you created, that is **\<registry-name>**.
* **Base OS image** &rarr; Select **Linux**

Check the **OUTPUT** window for progress and information on the build. If the get a credentials error, use [az login](/cli/azure/reference-index#az-login) to refresh your credentials.
