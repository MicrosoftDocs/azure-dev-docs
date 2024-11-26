---
ms.custom: devx-track-js, devx-track-ts, 
ms.topic: include
ms.date: 11/08/2024
# Used as part of /developer/ai/get-started-securing-your-ai-app
---

1. Create a new local directory on your computer for the project.

    ```shell
    mkdir my-secure-chat-app
    ```

1. Open the directory in Visual Studio Code.

    ```shell
    code my-secure-chat-app
    ```

1. Open a new terminal in Visual Studio Code.

1. Run the following AZD command to bring the GitHub repository to your local computer.

    ```azdeveloper
    azd init -t openai-chat-app-quickstart-javascript
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.

1. Sign in to Azure with the Azure Developer CLI.

    ```azdeveloper
    azd auth login
    ```

1. The remaining exercises in this project take place in the context of this development container.