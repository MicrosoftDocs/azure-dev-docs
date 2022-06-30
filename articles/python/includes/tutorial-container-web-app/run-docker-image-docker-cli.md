---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/28/2022
---

**Step 1.** Build the latest version of the image.

#### [bash](#tab/terminal-bash)

```Docker
export CONNECTION_STRING=<connection-string>
export DB_NAME=<db-name>
export COLLECTION_NAME=<collection-name>

docker run --rm --detach \
  --env "$CONNECTION_STRING" --env "$DB_NAME" --env "$COLLECTION_NAME \
  --publish 5002:5002/tcp <image-name>:latest  
```

#### [PowerShell terminal](#tab/terminal-powershell)

```Docker
$CONNECTION_STRING='<connection-string>'
$DB_NAME='<db-name>'
$COLLECTION_NAME='<collection-name>'

docker run --rm --detach `
  --env "$CONNECTION_STRING" --env "$DB_NAME" --env "$COLLECTION_NAME `
  --publish 5002:5002/tcp <image-name>:latest  
```

---

Passing in sensitive information as shown here is for demonstration purposes. The connection string information can be viewed by inspecting the container with the command [docker container inspect](https://docs.docker.com/engine/reference/commandline/container_inspect/). A better way to handle secrets is to use the [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/) functionality of Docker.

**Step 2.** Confirm that the container is running.

Use the [docker container ls](https://docs.docker.com/engine/reference/commandline/container_ls/) command.

```Docker
docker container ls
```

You should see your container "\<image-name>:latest" in the list. Note the `NAMES` column of the output. You can use this name to stop the container.

**Step 3.** Test the web app.

Go to "http://localhost:5002/" for Flask or "http://localhost:8000" for Django.

**Step 4.** Shut down the container

```Docker
docker container stop <container-name>
```
