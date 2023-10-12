---
title: Deploy an Azure OpenAI Chat app with your data in JavaScript
description: Quickstart to deploy and use an Azure OpenAI Chat app supplemented with your data in JavaScript. Easily deploy with Azure Developer CLI.
ms.date: 10/05/2023
ms.topic: quickstart
ms.custom: devx-track-javascript
# CustomerIntent: As a JavaScript developer new to Azure OpenAI, I want deploy and use sample code to interact with intelligent app infused with my own business data so that learn from the sample code.
---

# Quickstart: Deploy an Azure OpenAI Chat app with your data in JavaScript

In this quickstart, you deploy and use an intelligent Chat app to get answers about employee benefits at a fictitious company. The employee benefits chat app is seeded with PDF file including the employee handbook, a benefits document and a list of company roles and expectations. By following the instructions in this quickstart, you will:

- Deploy an intelligent Chat app to Azure.
- Get answers about employee benefits.
- Change settings to change behavior of responses.
- Review code of intelligent Chat app.

It should take less than 15 minutes to complete this tutorial. Upon completion, you can start modifying the new project with your custom code.

This quickstart is part of a collection of quickstarts that show you how to build an intelligent Chat app using Azure Cognitive Search and OpenAI. To see the full collection, see [Build an intelligent Chat app with Azure Cognitive Search and OpenAI](/azure/search/cognitive-search-tutorial-blob).

## Architectural overview

A simple architecture of the intelligent Chat app is shown in the following diagram:

:::image type="content" source="./media/quickstart-intelligent-app-chat/simple-architecture-diagram.png" alt-text="Diagram showing architecture from client to backend app.":::

Key components of the architecture include:

* A web application to host the interactive chat experience.
* An Azure Cognitive Search to get answers from your own data.
* An Azure Cognitive Services to provide: 
    * keywords to enhance the search over your own data.
    * answers from the OpenAI model.

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this quickstart. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this quickstart, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
1. GitHub account

#### [Visual Studio Code](#tab/visual-studio-code)
1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
1. [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
1. [Visual Studio Code](https://code.visualstudio.com/)
1. [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this training module.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/azure-search-openai-javascript`](https://github.com/Azure-Samples/azure-search-openai-javascript) GitHub repository:

    > [!div class="nextstepaction"]
    > [Open this project in GitHub Codespaces](https://github.com/codespaces/new?azure-portal=true&hide_repo_select=true&ref=main&repo=684521881)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create new codespace**

    :::image type="content" source="./media/quickstart-intelligent-app-chat/github-create-codespace.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. The remaining tasks in this quickstart take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this training module.

1. Open **Visual Studio Code** in the context of an empty directory.

1. Ensure that you have the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed in Visual Studio Code.

1. Open a new terminal in the editor.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.
    >
    > :::image type="content" source="./media/quickstart-intelligent-app-chat/open-terminal-option.png" lightbox="./media/quickstart-intelligent-app-chat/open-terminal-option.png" alt-text="Screenshot of the menu option to open a new terminal.":::

1. Sign in to Azure with the Azure Developer CLI.

    ```bash
    az auth login
    ```

    Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Initialize the folder to use the sample project with Azure Developer CLI:

    ```bash
    azd init -t azure-search-openai-javascript
    ```

    You don't need to clone this repository.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen in Container**.

    > [!TIP]
    > Visual Studio Code may automatically prompt you to reopen the existing folder within a development container. This is functionally equivalent to using the command palette to reopen the current workspace in a container.

1. The remaining exercises in this project take place in the context of this development container.

---

## Deploy and run

The sample repository contains all the code and configuration files you need to deploy an intelligent Chat app to Azure. The following steps walk you through the process of deploying the sample to Azure.

### Deploy intelligent Chat app to Azure

> [!IMPORTANT]
> Azure resources created in this section immediate costs, primarily from the Cognitive Search resource. These resources may accrue costs even if you interrupt the command before it is fully executed. 

1. Run the following Azure Developer CLI command to provision the Azure resources and deploy the source code:

    ```bash
    azd up
    ```

1. When you're prompted to select a location the first time, select a location near you. This location is used for most the resources including hosting.
1. When you're prompted for a location for the OpenAI model, select a location that is near you. If the same location is available as your first location, select that.
1. Wait until app is deployed. It may take 5-10 minutes for the deployment to complete.
1. After the application has been successfully deployed, you see a URL displayed in the terminal. 
1. Select that URL to open the chat application in a browser.

    :::image type="content" source="./media/quickstart-intelligent-app-chat/browser-chat-with-your-data.png" alt-text="Screenshot of intelligent chat app in browser showing several suggetions for chat input and the chat text box to enter a question.":::

### Use intelligent Chat app to get answers from PDF file catalog

The chat app is preloaded with employee benefits information from a [PDF file catalog](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main/data). You can use the chat app to ask questions about the benefits. The following steps walk you through the process of using the chat app.

1. In the browser, enter a question about the catalog in the text box at the bottom of the page such as one of the following: 

    * Does my plan cover annual eye exams?
    * What is my deductible?
    * How do I switch roles? 

    :::image type="content" source="./media/quickstart-intelligent-app-chat/browser-chat-initial-answer.png" alt-text="Screenshot of intelligent chat app's first answer.":::

1. From the answer, select one of the citations.

    :::image type="content" source="./media/quickstart-intelligent-app-chat/browser-chat-initial-answer-citation-highlighted.png" alt-text="Screenshot of intelligent chat app's first answer with its citation highlighted in a red box.":::

1. In the right-pane, use the tabs to understand how the answer was generated.

    |Tab|Description|
    |---|---|
    |**Thought process**|This is a script of the interactions in chat.|
    |**Supporting content**|This includes the information to answer your question and the source material.|
    |**Citation**|This displays the PDF page that contains the citation.|

1. When you are done, select the selected tab again to close the pane.

### Use intelligent Chat app settings to change behavior of responses

The intelligence of the chat app is determined by the OpenAI model and the settings that are used to interact with the model. The following steps walk you through the process of changing the settings.

1. In the browser, select the **Developer Settings** tab.
1. Check the **Suggest follow-up questions** checkbox and ask the same question again.

    ```
    What is my deductible?
    ```

    The chat returned suggested follow-up questions such as the following:

    ```
    1. What is the cost sharing for out-of-network services?
    2. Are preventive care services subject to the deductible?
    3. How does the prescription drug deductible work?
    ```

1. In the **Settings** tab, deselect **Use semantic ranker for retrieval**.
1. Ask the same question again? 

    ```
    What is my deductible?
    ```

1. What is the difference in the answers?

    The answer, which used the Semantic ranker provided a single answer: `The deductible for the Northwind Health Plus plan is $2,000 per year`.

    The answer without semantic ranking returned an answer, which required more work to get the answer: `Based on the information provided, it is unclear what your specific deductible is. The Northwind Health Plus plan has different deductible amounts for in-network and out-of-network services, and there is also a separate prescription drug deductible. I would recommend checking with your provider or referring to the specific benefits details for your plan to determine your deductible amount`.



## Troubleshooting

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main#troubleshooting).

If your issued isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/azure-search-openai-javascript/issues) so this quickstart can be improved.

## Clean up resources

## [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the GitHub Codespaces dashboard (<https://github.com/codespaces>).

1. Locate your currently running codespaces sourced from the [`Azure-Samples/azure-search-openai-javascript`](https://github.com/Azure-Samples/azure-search-openai-javascript) GitHub repository.

    :::image type="content" source="./media/quickstart-intelligent-app-chat/github-codespace-dashboard.png" alt-text="Screenshot of all the running codespaces including their status and templates.":::

1. Open the context menu for the codespace and then select **Delete**.

    :::image type="content" source="./media/quickstart-intelligent-app-chat/github-codespace-delete.png" alt-text="Screenshot of the context menu for a single codespace with the delete option highlighted.":::

## [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="./media/quickstart-intelligent-app-chat/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Review code

The app is separated out into 2 apps:

* A front-end JavaScript application using the React framework with the Vite build tool.
* A chat web component built with LitElement used to interact with the Azure OpenAI API.
* A back-end JavaScript application. 

### Review front-end application code

The front-end application is a Vite React application. The code is located in the [`./packages/webapp`](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main/packages/webapp) folder. The following table describes the key files in the front-end application:

|File|Description|
|---|---|
|[package.json](https://github.com/Azure-Samples/azure-search-openai-javascript/blob/main/packages/webapp/package.json)|This file contains the dependencies for the front-end application. The design system is provided by [FluentUI](https://developer.microsoft.com/en-us/fluentui#/)|
|[vite.config.ts](https://github.com/Azure-Samples/azure-search-openai-javascript/blob/main/packages/webapp/vite.config.ts)|This file contains the configuration for the Vite application. This file includes the proxies to `/ask`, `/chat`, and `/content` APIs for the backend for local development. |
|[index.html](https://github.com/Azure-Samples/azure-search-openai-javascript/blob/main/packages/webapp/index.html)|This is the main HTML file for the application.|
|[src/index.tsx](https://github.com/Azure-Samples/azure-search-openai-javascript/blob/main/packages/webapp/src/index.tsx)|This is the main application file and contains the routes.|
|[pages/](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main/packages/webapp/src/pages)|This folder contains the React components for the pages in the application.|
|[pages/chat/Chat.tsx](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main/packages/webapp/src/pages/chat)|This is the page that pulls the various components and API calls together to provide the chat functionality.|
|[components/](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main/packages/webapp/src/components)|This folder contains the React components for the application.|
|[api/](https://github.com/Azure-Samples/azure-search-openai-javascript/tree/main/packages/webapp/src/api)|This folder contains the requests to the clients API backend.|

The [**Chat**](https://github.com/Azure-Samples/azure-search-openai-javascript/blob/main/packages/webapp/src/pages/chat/Chat.tsx) page has several functions and components that are used to provide the chat functionality. 

### Ask a question

The **QuestionInput** component is used to provide the input box for the user to ask a question and sends in the function to call the API to get the answer.

```javascript
<QuestionInput
    clearOnSend
    placeholder="Type a new question (e.g. does my plan cover annual eye exams?)"
    disabled={isLoading}
    onSend={question => makeApiRequest(question)}
/>
```

The **makeApiRequest** function calls the backend API. 

```javascript
  const makeApiRequest = async (question: string) => {
    lastQuestionReference.current = question;

    error && setError(undefined);
    setIsLoading(true);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);

    try {
      const history: ChatTurn[] = answers.map((a) => ({ user: a[0], bot: a[1].answer }));
      const request: ChatRequest = {
        history: [...history, { user: question, bot: undefined }],
        approach: Approaches.ReadRetrieveRead,
        stream: useStream,
        overrides: {
          promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
          excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
          top: retrieveCount,
          retrievalMode: retrievalMode,
          semanticRanker: useSemanticRanker,
          semanticCaptions: useSemanticCaptions,
          suggestFollowupQuestions: useSuggestFollowupQuestions,
        },
      };

      const chatResponse = await chatApi(request);
      if (useStream) {
        const response = chatResponse as Response;
        const askResponse: AskResponse = {
          answer: '',
          data_points: [],
          thoughts: '',
        };

        const chunks = await getChunksFromResponse<Partial<AskResponse> & { id: string }>(response);
        for await (const chunk of chunks) {
          if (chunk.data_points) {
            askResponse.data_points = chunk.data_points;
            askResponse.thoughts = chunk.thoughts ?? '';
          } else if (chunk.answer) {
            askResponse.answer += chunk.answer;
            setIsLoading(false);
            // Disable batching
            flushSync(() => {
              setAnswers([...answers, [question, { ...askResponse }]]);
            });
          }
        }
      } else {
        const result = chatResponse as AskResponse;
        setAnswers([...answers, [question, result]]);
      }
    } catch (error_) {
      setError(error_);
    } finally {
      setIsLoading(false);
    }
  };

```

The chat keeps a history of the answers in the **answers** array and displays the answer either based on a streamed data or nonstreamed data. The following shows the streamed answers.

```javascript
{
isStreaming &&
    streamedAnswers.map((streamedAnswer, index) => (
        <div key={index}>
            <UserChatMessage message={streamedAnswer[0]} />
            <div className={styles.chatMessageGpt}>
                <Answer
                    isStreaming={true}
                    key={index}
                    answer={streamedAnswer[1]}
                    isSelected={false}
                    onCitationClicked={c => onShowCitation(c, index)}
                    onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                    onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                    onFollowupQuestionClicked={q => makeApiRequest(q)}
                    showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                />
            </div>
        </div>
    ))
}
`````` 

### Review backend application code

The back-end application is a JavaScript application supporting the [Chat App protocol][Chat_API_protocol]. The code is located in the [./app/backend][Chat_Backend_Folder] folder. The following table describes the key files in the back-end application:

|File|Description|
|---|---|
|||


## Related content

* [Azure Developer CLI templates](overview-azd-templates.md)
* [Containerized JavaScript web app on Azure with MongoDB](tutorial-containerize-deploy-javascript-web-app-azure-01.md)
* [Browse JavaScript + AI code samples](/samples/browse/?branch=main&languages=javascript&products=azure-cognitive-services)

[Chat_API_protocol]: https://github.com/Azure/azureml_run_specification/blob/chat-protocol/specs/chat-protocol/chat-app-protocol.md
[Chat_Backend_Folder]:https://github.com/Azure-Samples/azure-search-openai-javascript/blob/main/app/backend