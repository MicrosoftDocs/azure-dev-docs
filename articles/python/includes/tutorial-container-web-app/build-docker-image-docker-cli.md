---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/28/2022
---

**Step 1.** At a shell prompt, confirm that Docker is accessible.

```Docker
docker
```

If after running this command you help for the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/), then continue. Otherwise, make sure Docker is installed or your shell has access to the Docker CLI.

**Step 2.** Build the image.

The general form of the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command is:

#### [bash](#tab/terminal-bash)

```Docker
 docker build --rm --pull \
  --file "<path-to-project-root>/Dockerfile" \
  --label "com.microsoft.created-by=docker-cli" \
  --tag "<container-name>:latest" \
  "<path-to-project-root>" 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```Docker
 docker build --rm --pull `
  --file "<path-to-project-root>/Dockerfile" `
  --label "com.microsoft.created-by=docker-cli" `
  --tag "<container-name>:latest" `
  "<path-to-project-root>" 
```

---

For example, if you are at the root of the project directory, you can use a command like this:

#### [bash](#tab/terminal-bash)

```Docker
docker build --rm --pull \
  --file "Dockerfile" \
  --label "com.microsoft.create-by=docker-cli" \
  --tag "msdocspythondjangocontainerwebapp:latest" \
  .
```

#### [PowerShell terminal](#tab/terminal-powershell)

```Docker
docker build --rm --pull `
  --file "Dockerfile" `
  --label "com.microsoft.create-by=docker-cli" `
  --tag "msdocspythondjangocontainerwebapp:latest" `
  .
```

---

If you started with the Flask version of the sample app, then use "msdocspythonflaskcontainerwebapp" as the tag name. Note the dot (".") at the end of the command. You can add `--no-cache` to force a rebuild.

**Step 3.** Confirm the image was built.

Use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to return a list of images.

```Docker
docker images
```

You should see images listed by REPOSITORY name, TAG, and CREATED date among other image characteristics.
