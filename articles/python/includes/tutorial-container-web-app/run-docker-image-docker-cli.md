---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/28/2022
---

**Step 1.** Run the latest version of the image.
### [Local MongoDB](#tab/mongodb-local)

[!INCLUDE [Run latest image with local MongoDB](<./run-docker-image-docker-cli-local.md>)]
### [Azure Cosmos DB MongoDB](#tab/mongodb-azure)

[!INCLUDE [Run latest image with Azure MongoDB](<./run-docker-image-docker-cli-azure.md>)]

---

Passing in sensitive information as shown here is for demonstration purposes. The connection string information can be viewed by inspecting the container with the command [docker container inspect](https://docs.docker.com/engine/reference/commandline/container_inspect/). Another way to handle secrets that avoids this is to use the [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/) functionality of Docker.

**Step 2.** Confirm that the container is running.

Use the [docker container ls](https://docs.docker.com/engine/reference/commandline/container_ls/) command.

```Docker
docker container ls
```

You should see your container "\<image-name>:latest" in the list. Note the `NAMES` column of the output. You can use this name to stop the container.

**Step 3.** Test the web app.

Go to "http://172.0.0.1:5002/" for Flask or "http://127.0.0.1:8000" for Django.

**Step 4.** Shut down the container

```Docker
docker container stop <container-name>
```
