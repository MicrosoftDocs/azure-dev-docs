---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

#### [bash](#tab/terminal-bash)

```Docker
export DB_NAME=<db-name>
export COLLECTION_NAME=<collection-name>
export YOUR_IP_ADDRESS=<your-machine-ip-address>

docker run --rm --detach \
  --publish 8000:8000 --publish 27017:27017 \
  --add-host mongoservice:$YOUR_IP_ADDRESS \
  --env "mongodb://mongoservice:27017" --env "$DB_NAME" --env "$COLLECTION_NAME \
  <image-name>:latest  
```

#### [PowerShell terminal](#tab/terminal-powershell)

```Docker
$DB_NAME='<db-name>'
$COLLECTION_NAME='<collection-name>'
YOUR_IP_ADDRESS='<your-machine-ip-address>'

docker run --rm --detach `
  --publish 8000:8000 --publish 27017:27017 `
  --add-host mongoservice:$YOUR_IP_ADDRESS `
  --env "mongodb://monogservice:27017" --env "$DB_NAME" --env "$COLLECTION_NAME `
  <image-name>:latest  
```

---
