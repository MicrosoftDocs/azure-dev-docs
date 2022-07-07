---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

#### [bash](#tab/terminal-bash)

```Docker
export CONNECTION_STRING=<connection-string>
export DB_NAME=<db-name>
export COLLECTION_NAME=<collection-name>

docker run --rm --detach \
  --publish-all \
  --env "$CONNECTION_STRING" --env "$DB_NAME" --env "$COLLECTION_NAME \
  <image-name>:latest  
```

#### [PowerShell terminal](#tab/terminal-powershell)

```Docker
$DB_NAME='<db-name>'
$COLLECTION_NAME='<collection-name>'
YOUR_IP_ADDRESS='<your-machine-ip-address>'

docker run --rm --detach `
  --publish-all `
  --env "$CONNECTION_STRING" --env "$DB_NAME" --env "$COLLECTION_NAME `
  <image-name>:latest  
```

---
