---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/28/2022
---

There are a number of ways to get environment variables passed to container. Each has advantages and disadvantages for security. Here, we show one way to it.  In the *tasks.json* section for the Docker run task, add the values needed:

```json
"dockerRun": {
    "env": {
        "FLASK_APP": "app.py",
        "FLASK_DEBUG": "1",
        "CONNECTION_STRING": "<connection-string>",
        "COLLECTION_NAME": "<collection-name>",
        "DB_NAME": "<db-name>",
    },
}
```
Be sure to remove these when finished testing locally. 
