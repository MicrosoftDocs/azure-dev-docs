---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/28/2022
---

Copy the *.env.sample* file to *.env.local* and fill in MongoDB values.

CONNECTION_STRING=\<connection-string>
COLLECTION_NAME=\<collection-name>
DB_NAME=\<database-name>

The VS Code build command creates a image using the *.dockerignore* file to exclude files and directories. The default *.dockerignore* ignores *.env* variables. 

The sample app looks for a *.env.local* file that should only be used in local environments. The *.env.local* file is not used in production and you should make sure to not include it the production image. Also, make sure you add