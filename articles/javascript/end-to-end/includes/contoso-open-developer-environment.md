---
ms.custom: devx-track-js, contoso-real-estate
ms.topic: include
ms.date: 11/15/2023
---

## Open development environment

To start local development:

1. [Fork](https://github.com/Azure-Samples/contoso-real-estate/fork) the repository on GitHub. 
1. Open your forked source code repository from one of the following choices.
    * Open in **browser-based Codespaces** in your GitHub fork.
    * **Clone the repository locally**. Docker is required to run the application locally then open in Visual Studio Code. When prompted, open the repository in the DevContainer. 

1. If you're running this project in a Dev Container, then you don't need to install any dependencies because that is done in the `./.devcontainer/post-create-command.sh` Bash script. If you're running this project _without_ the Dev Container, then you need to install the dependencies. To install the dependencies, run the following command in the root of the repository:

    ```bash
    npm install
    ``````
