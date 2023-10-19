---
title: Deploy an Azure OpenAI Chat app with your data in Python
description: Quickstart to deploy and use an Azure OpenAI Chat app supplemented with your data in Python. Easily deploy with Azure Developer CLI.
ms.date: 10/05/2023
ms.topic: quickstart
ms.custom: devx-track-python
# CustomerIntent: As a python developer new to Azure OpenAI, I want deploy and use sample code to interact with intelligent app infused with my own business data so that learn from the sample code.
---

# Quickstart: Deploy an Azure OpenAI Chat app with your data in Python

In this quickstart, you deploy and use an intelligent Chat app to get answers about employee benefits at a fictitious company. The employee benefits chat app is seeded with PDF files including the employee handbook, a benefits document and a list of company roles and expectations. By following the instructions in this quickstart, you will:

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

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository:

    > [!div class="nextstepaction"]
    > [Open this project in GitHub Codespaces](https://github.com/codespaces/new?azure-portal=true&hide_repo_select=true&ref=main&repo=599293758)

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
    azd init -t azure-search-openai-demo
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

The chat app is preloaded with employee benefits information from a [PDF file catalog](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main/data). You can use the chat app to ask questions about the benefits. The following steps walk you through the process of using the chat app.

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

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main#troubleshooting).

If your issued isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/azure-search-openai-demo/issues) so this quickstart can be improved.

## Clean up resources

## [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the GitHub Codespaces dashboard (<https://github.com/codespaces>).

1. Locate your currently running codespaces sourced from the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.

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

* a front-end JavaScript application using the React framework with the Vite build tool.
* a back-end Python application. 

### Review front-end application code

The front-end application is a Vite React application. The code is located in the [`./app/frontend`](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/app/frontend) folder. The following table describes the key files in the front-end application:

|File|Description|
|---|---|
|[package.json](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/app/frontend/package.json)|This file contains the dependencies for the front-end application. The design system is provided by [FluentUI](https://developer.microsoft.com/en-us/fluentui#/)|
|vite.config.ts|This file contains the configuration for the Vite application. This file includes the proxies to both the `/ask` and `/chat` APIs for the backend for local development. |
|index.html|This is the main HTML file for the application.|
|src/index.tsx|This is the main application file.|
|[pages/](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main/app/frontend/src/pages)|This folder contains the React components for the pages in the application.|
|[pages/chat/Chat.tsx](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/app/frontend/src/pages/chat/Chat.tsx)|This is the page that pulls the various components and API calls together to provide the chat functionality.|
|[components/](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main/app/frontend/src/components)|This folder contains the React components for the application.|
|[api/](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/app/frontend/src/api/api.ts)|This folder contains the requests to the clients API backend.|

The **Chat** page has several functions and components that are used to provide the chat functionality. 

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

The **makeApiRequest** function calls the **getAnswer** function in the **api** folder. 

```javascript
const makeApiRequest = async (question: string) => {
    lastQuestionRef.current = question;

    error && setError(undefined);
    setIsLoading(true);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);

    const token = client ? await getToken(client) : undefined;

    try {
        const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
        const request: ChatRequest = {
            history: [...history, { user: question, bot: undefined }],
            shouldStream: shouldStream,
            overrides: {
                promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                top: retrieveCount,
                retrievalMode: retrievalMode,
                semanticRanker: useSemanticRanker,
                semanticCaptions: useSemanticCaptions,
                suggestFollowupQuestions: useSuggestFollowupQuestions,
                useOidSecurityFilter: useOidSecurityFilter,
                useGroupsSecurityFilter: useGroupsSecurityFilter
            },
            idToken: token?.accessToken
        };

        const response = await chatApi(request);
        if (!response.body) {
            throw Error("No response body");
        }
        if (shouldStream) {
            const parsedResponse: AskResponse = await handleAsyncRequest(question, answers, setAnswers, response.body);
            setAnswers([...answers, [question, parsedResponse]]);
        } else {
            const parsedResponse: AskResponse = await response.json();
            if (response.status > 299 || !response.ok) {
                throw Error(parsedResponse.error || "Unknown error");
            }
            setAnswers([...answers, [question, parsedResponse]]);
        }
    } catch (e) {
        setError(e);
    } finally {
        setIsLoading(false);
    }
};
```

The **chatAPI** submits the question along with the chat history for context.

```javascript
export async function chatApi(options: ChatRequest): Promise<Response> {
    const url = options.shouldStream ? "chat_stream" : "chat";
    return await fetch(`${BACKEND_URI}/${url}`, {
        method: "POST",
        headers: getHeaders(options.idToken),
        body: JSON.stringify({
            history: options.history,
            overrides: {
                retrieval_mode: options.overrides?.retrievalMode,
                semantic_ranker: options.overrides?.semanticRanker,
                semantic_captions: options.overrides?.semanticCaptions,
                top: options.overrides?.top,
                temperature: options.overrides?.temperature,
                prompt_template: options.overrides?.promptTemplate,
                prompt_template_prefix: options.overrides?.promptTemplatePrefix,
                prompt_template_suffix: options.overrides?.promptTemplateSuffix,
                exclude_category: options.overrides?.excludeCategory,
                suggest_followup_questions: options.overrides?.suggestFollowupQuestions,
                use_oid_security_filter: options.overrides?.useOidSecurityFilter,
                use_groups_security_filter: options.overrides?.useGroupsSecurityFilter
            }
        })
    });
}
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

The back-end application is a Python application supporting the [Chat App protocol][Chat_API_protocol]. The code is located in the [./app/backend][Chat_Backend_Folder] folder. The following table describes the key files in the back-end application:

|File|Description|
|---|---|
|[requirements.in](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/app/backend/requirements.in)|This file contains the dependencies for the back-end python application.|
|[app.py](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/app/backend/app.py)|This is the main Python file for the application. The backend supports both streaming and nonstreaming return to the client application. This quickstart shows the code for streaming.|
|[core/](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main/app/backend/core)|This folder contains the core functionality for the API.|
|[approaches](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main/app/backend/approaches)|This file integrates with Azure Cognitive Search to get the answers. |

The `/chat` API gets the request and authentication then gets the answer.

```python
@bp.route("/chat_stream", methods=["POST"])
async def chat_stream():
    if not request.is_json:
        return jsonify({"error": "request must be json"}), 415
    request_json = await request.get_json()
    auth_helper = current_app.config[CONFIG_AUTH_CLIENT]
    auth_claims = await auth_helper.get_auth_claims_if_enabled(request.headers)
    try:
        impl = current_app.config[CONFIG_CHAT_APPROACH]
        response_generator = impl.run_with_streaming(
            request_json["history"], request_json.get("overrides", {}), auth_claims
        )
        response = await make_response(format_as_ndjson(response_generator))
        response.timeout = None  # type: ignore
        return response
    except Exception as e:
        logging.exception("Exception in /chat")
        return jsonify({"error": str(e)}), 500
```

The API gets the intelligent answer in the **run_with_streaming** function uses an AsyncGenerator to get the answer and stream back.

```python
async def run_with_streaming(
    self, history: list[dict[str, str]], overrides: dict[str, Any], auth_claims: dict[str, Any]
) -> AsyncGenerator[dict, None]:
    extra_info, chat_coroutine = await self.run_until_final_call(
        history, overrides, auth_claims, should_stream=True
    )
    yield extra_info
    async for event in await chat_coroutine:
        # "2023-07-01-preview" API version has a bug where first response has empty choices
        if event["choices"]:
            yield event
``````

The **run_until_final_call** function gets the answer from the Azure Cognitive Search index and then generates the answer:

1. Generate an optimized keyword search query based on the chat history and the last question.
1. Retrieve relevant documents from the search index with the GPT optimized query.
1. Generate a contextual and content specific answer using the search results and chat history.

```python
async def run_until_final_call(
    self,
    history: list[dict[str, str]],
    overrides: dict[str, Any],
    auth_claims: dict[str, Any],
    should_stream: bool = False,
) -> tuple:
    has_text = overrides.get("retrieval_mode") in ["text", "hybrid", None]
    has_vector = overrides.get("retrieval_mode") in ["vectors", "hybrid", None]
    use_semantic_captions = True if overrides.get("semantic_captions") and has_text else False
    top = overrides.get("top", 3)
    filter = self.build_filter(overrides, auth_claims)

    user_query_request = "Generate search query for: " + history[-1]["user"]

    functions = [
        {
            "name": "search_sources",
            "description": "Retrieve sources from the Azure Cognitive Search index",
            "parameters": {
                "type": "object",
                "properties": {
                    "search_query": {
                        "type": "string",
                        "description": "Query string to retrieve documents from azure search eg: 'Health care plan'",
                    }
                },
                "required": ["search_query"],
            },
        }
    ]

    # STEP 1: Generate an optimized keyword search query based on the chat history and the last question
    messages = self.get_messages_from_history(
        self.query_prompt_template,
        self.chatgpt_model,
        history,
        user_query_request,
        self.query_prompt_few_shots,
        self.chatgpt_token_limit - len(user_query_request),
    )

    chatgpt_args = {"deployment_id": self.chatgpt_deployment} if self.openai_host == "azure" else {}
    chat_completion = await openai.ChatCompletion.acreate(
        **chatgpt_args,
        model=self.chatgpt_model,
        messages=messages,
        temperature=0.0,
        max_tokens=32,
        n=1,
        functions=functions,
        function_call="auto",
    )

    query_text = self.get_search_query(chat_completion, history[-1]["user"])

    # STEP 2: Retrieve relevant documents from the search index with the GPT optimized query

    # If retrieval mode includes vectors, compute an embedding for the query
    if has_vector:
        embedding_args = {"deployment_id": self.embedding_deployment} if self.openai_host == "azure" else {}
        embedding = await openai.Embedding.acreate(**embedding_args, model=self.embedding_model, input=query_text)
        query_vector = embedding["data"][0]["embedding"]
    else:
        query_vector = None

    # Only keep the text query if the retrieval mode uses text, otherwise drop it
    if not has_text:
        query_text = None

    # Use semantic L2 reranker if requested and if retrieval mode is text or hybrid (vectors + text)
    if overrides.get("semantic_ranker") and has_text:
        r = await self.search_client.search(
            query_text,
            filter=filter,
            query_type=QueryType.SEMANTIC,
            query_language="en-us",
            query_speller="lexicon",
            semantic_configuration_name="default",
            top=top,
            query_caption="extractive|highlight-false" if use_semantic_captions else None,
            vector=query_vector,
            top_k=50 if query_vector else None,
            vector_fields="embedding" if query_vector else None,
        )
    else:
        r = await self.search_client.search(
            query_text,
            filter=filter,
            top=top,
            vector=query_vector,
            top_k=50 if query_vector else None,
            vector_fields="embedding" if query_vector else None,
        )
    if use_semantic_captions:
        results = [
            doc[self.sourcepage_field] + ": " + nonewlines(" . ".join([c.text for c in doc["@search.captions"]]))
            async for doc in r
        ]
    else:
        results = [doc[self.sourcepage_field] + ": " + nonewlines(doc[self.content_field]) async for doc in r]
    content = "\n".join(results)

    follow_up_questions_prompt = (
        self.follow_up_questions_prompt_content if overrides.get("suggest_followup_questions") else ""
    )

    # STEP 3: Generate a contextual and content specific answer using the search results and chat history

    # Allow client to replace the entire prompt, or to inject into the exiting prompt using >>>
    prompt_override = overrides.get("prompt_template")
    if prompt_override is None:
        system_message = self.system_message_chat_conversation.format(
            injected_prompt="", follow_up_questions_prompt=follow_up_questions_prompt
        )
    elif prompt_override.startswith(">>>"):
        system_message = self.system_message_chat_conversation.format(
            injected_prompt=prompt_override[3:] + "\n", follow_up_questions_prompt=follow_up_questions_prompt
        )
    else:
        system_message = prompt_override.format(follow_up_questions_prompt=follow_up_questions_prompt)

    messages = self.get_messages_from_history(
        system_message,
        self.chatgpt_model,
        history,
        history[-1]["user"] + "\n\nSources:\n" + content,
        max_tokens=self.chatgpt_token_limit,  # Model does not handle lengthy system messages well. Moving sources to latest user conversation to solve follow up questions prompt.
    )
    msg_to_display = "\n\n".join([str(message) for message in messages])

    extra_info = {
        "data_points": results,
        "thoughts": f"Searched for:<br>{query_text}<br><br>Conversations:<br>"
        + msg_to_display.replace("\n", "<br>"),
    }

    chat_coroutine = openai.ChatCompletion.acreate(
        **chatgpt_args,
        model=self.chatgpt_model,
        messages=messages,
        temperature=overrides.get("temperature") or 0.7,
        max_tokens=1024,
        n=1,
        stream=should_stream,
    )
    return (extra_info, chat_coroutine)
```


## Related content

* [Azure Developer CLI templates](overview-azd-templates.md)
* [Containerized Python web app on Azure with MongoDB](tutorial-containerize-deploy-python-web-app-azure-01.md)
* [Browse Python + AI code samples](/samples/browse/?branch=main&languages=python&products=azure-cognitive-services)

[Chat_API_protocol]: https://github.com/Azure/azureml_run_specification/blob/chat-protocol/specs/chat-protocol/chat-app-protocol.md
[Chat_Backend_Folder]:https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/app/backend