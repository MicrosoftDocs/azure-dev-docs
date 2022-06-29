---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/28/2022
---

**Step 1.** Build the latest version of the image.

```Docker
docker run --rm --detach  --env-file ".env" --publish 5002:5002/tcp <container-name>:latest  
```

**Step 2.** Confirm that the container is running.

Use the [docker container ls](https://docs.docker.com/engine/reference/commandline/container_ls/) command.

```Docker
docker container ls
```

You should see your container "\<container-name>:latest" in the list. Note the `NAMES` column of the output. You can use this name to stop the container.

**Step 3.** Test the web app.

Go to "http://localhost:5002/" for Flask or "http://localhost:8000" for Django.

**Step 4.** Shut down the container

```Docker
docker container stop <container-name>
```
