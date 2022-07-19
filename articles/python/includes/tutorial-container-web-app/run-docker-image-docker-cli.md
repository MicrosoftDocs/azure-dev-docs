---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

**Step 1.** Run the latest version of the image.
### [Local MongoDB](#tab/mongodb-local)

```Docker
export YOUR_IP_ADDRESS=<your-machine-ip-address>

docker run --rm -it \
  --publish 8000:8000 --publish 27017:27017 \
  --add-host mongoservice:$YOUR_IP_ADDRESS \
  --env 'CONNECTION_STRING=mongodb://mongoservice:27017' --env 'DB_NAME=restaurants_reviews' --env 'COLLECTION_NAME=restaurants_reviews' \
  msdocspythoncontainerwebapp:latest  
```

The command above is formatted for the Bash shell. If you prefer to use PowerShell, Command Prompt, or another shell, you may need to adjust the line continuation and environment variable format accordingly.

### [Azure Cosmos DB MongoDB](#tab/mongodb-azure)

```Docker
export CONNECTION_STRING=<connection-string>

docker run --rm -it \
  --publish-all \
  --env 'CONNECTION_STRING=$CONNECTION_STRING' --env "DB_NAME=restaurants_reviews" --env "COLLECTION_NAME=restaurants_reviews \
  msdocspythoncontainerwebapp:latest  
```

The command above is formatted for the Bash shell. If you prefer to use PowerShell, Command Prompt, or another shell, you may need to adjust the line continuation and environment variable format accordingly.

---

Passing in sensitive information as shown here is for demonstration purposes. The connection string information can be viewed by inspecting the container with the command [docker container inspect](https://docs.docker.com/engine/reference/commandline/container_inspect/). Another way to handle secrets is to use the [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/) functionality of Docker.

**Step 2.** Confirm that the container is running.

Use the [docker container ls](https://docs.docker.com/engine/reference/commandline/container_ls/) command.

```Docker
docker container ls
```

You should see your container "msdocspythoncontainerwebapp:latest:latest" in the list. Note the `NAMES` column of the output. You can use this name to stop the container.

**Step 3.** Test the web app.

Go to "http://172.0.0.1:5002/" for Flask or "http://127.0.0.1:8000" for Django.

**Step 4.** Shut down the container

```Docker
docker container stop <container-name>
```
