---
title: "Get Started with Multi-agent Applications Using Azure OpenAI"
description: "Learn how to effectively use Azure OpenAI models with multiple agents to perform tasks and create results based on user instructions. Easily deploy with the Azure Developer CLI."
ms.date: 12/20/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As an AI app developer new to agents, I want to learn how to use Azure OpenAI multi-agent workflows to process tasks and return results based on user instructions from a simple example.
---
# Quickstart: Get started with multi-agent applications by using Azure OpenAI

In this quickstart, you explore a multi-agent app for a creative writing assistant. The app shows how to orchestrate multiple models together by using Python, Prompty and Azure OpenAI Service.

The sample in the quickstart includes the full generative AI operations (GenAIOps): continuous integration and continuous delivery (CI/CD), evaluation, tracing, monitoring, and experimentation. The sample also includes all the infrastructure and configuration needed to provision Azure OpenAI resources and deploy the app to Azure Container Apps by using the Azure Developer CLI.

By following the instructions in this article, you will:

- Deploy an Azure Container Apps multi-agent chat app that uses a managed identity for authentication.
- Run the web app with the multi-agent workflow orchestration.
- Explore and understand the app architecture and implementation.

After you complete this article, you can start modifying the new project with your custom code.

This article uses one or more [AI app templates](./intelligent-app-templates.md) as the basis for examples and guidance. AI app templates provide you with well-maintained, easy-to-deploy reference implementations that help to ensure a high-quality starting point for your AI apps.

## Architectural overview

The following diagram shows a simple architecture of the chat app:

:::image type="content" source="./media/get-started-multiagents/simple-architecture-diagram.png" lightbox="./media/get-started-multiagents/simple-architecture-diagram.png" alt-text="Diagram that shows the architecture of a chat app from the client to the back end.":::

The difference between this template and a simple chat template is in the orchestration required for processing the user request (*prompt*) in this application:

1. The prompt query is expanded to extract relevant article query terms and relevant products retrieved through Bing Search and Azure AI Search.
1. The expanded query is sent to a `writer` agent (chat model). The writer uses the provided query and grounding context to generate a draft article based on the designed prompt template.
1. The draft article is sent to an `editor` agent (chat model). The editor assesses the article for acceptance based on the designed prompt template.
1. An approved article is published as a blog post. The user interface enables you to view the progression of these tasks visually, so you can get an intuitive sense of the multi-agent coordination.

The application architecture relies on the following services and components:

- [Azure OpenAI](/azure/ai-services/openai/) represents the AI provider that we send the user's queries to.
- [Azure Container Apps](/azure/container-apps/) is the container environment where the application is hosted.
- A [managed identity](/entra/identity/managed-identities-azure-resources/) helps us ensure best-in-class security and eliminates the requirement for you as a developer to securely manage a secret.
- [Bicep files](/azure/azure-resource-manager/bicep/) are for provisioning Azure resources, including Azure OpenAI, Azure Container Apps, Azure Container Registry, Log Analytics, and role-based access control (RBAC) roles.
- [Microsoft AI Chat Protocol](https://github.com/microsoft/ai-chat-protocol/) provides standardized API contracts across AI solutions and languages. The chat app conforms to the Microsoft AI Chat Protocol.
- [Bing Search API](/bing/search-apis/bing-web-search) is used by the research agent to research the article.
- [Azure AI Search](/azure/search/) is used by the product agent to do a semantic similarity search for related products from a vector store.

## Cost

To keep pricing as low as possible in this sample, most resources use a Basic or Consumption pricing tier. Alter your tier as needed based on your intended usage. To stop incurring charges, delete the resources when you're done with the article.

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/contoso-creative-writer#costs).

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally by using Visual Studio Code.

To use this article, you need to fulfill the following prerequisites:

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).

- Azure account permissions. Your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

- Access to your Azure subscription enabled for the [Bing Search API](https://www.microsoft.com/bing/apis/bing-web-search-api).

- Access to your Azure subscription enabled for [Azure AI Search](https://azure.microsoft.com/products/ai-services/ai-search).

- A GitHub account.

#### [Visual Studio Code](#tab/visual-studio-code)

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).

- Azure account permissions. Your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

- The ability to deploy `gpt-35-turbo-0613`,`gpt-4-1106-Preview`, and `gpt-4o-2024-05-13` Azure OpenAI models.

- An appropriate region. We recommend using Canada East, because this region has access to all required models and services.

- The [Azure Developer CLI](/azure/developer/azure-developer-cli).

- [Docker Desktop](https://www.docker.com/products/docker-desktop/). Start Docker Desktop if it's not already running

- [Visual Studio Code](https://code.visualstudio.com/).

- The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code.

---

## Open a development environment

Use the following instructions to deploy a preconfigured development environment that contains all required dependencies to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

Use the following steps to create a new GitHub codespace on the `main` branch of the [`Azure-Samples/contoso-creative-writer`](https://github.com/Azure-Samples/contoso-creative-writer) GitHub repository.

1. Right-click the following button, and then select **Open link in new window**. This action makes the development environment and the documentation available for review.

    [![Button that says Open in GitHub Codespaces.](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/contoso-creative-writer)

1. On the **Create codespace** page, review the information and then select **Create new codespace**.

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure by using the Azure Developer CLI:

    ```azdeveloper
    azd auth login
    ```

1. In the terminal at the bottom of the screen, sign in to Azure by using the Azure CLI:

    ```bash
    az login --use-device-code
    ```

1. Open the URL from the terminal, and then copy the code from the terminal and paste it into the URL that you just opened. Follow the instructions to authenticate with your Azure account.

The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally by using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Create a new local directory on your computer for the project:

    ```shell
    mkdir my-creative-writer-app
    ```

1. Go to the directory that you created:

    ```shell
    cd my-creative-writer-app
    ```

1. Open Visual Studio Code in that directory:

    ```shell
    code .
    ```

1. Open a new terminal in Visual Studio Code.

1. Run the following Azure Developer CLI command to bring the GitHub repository to your local computer:

    ```azdeveloper
    azd init -t agent-openai-python-prompty
    ```

1. Install required packages:

    ```bash
    cd src/api
    pip install -r requirements.txt
    ```

1. Open the **Command Palette**, and then search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.

1. Sign in to Azure by using the Azure Developer CLI:

    ```azdeveloper
    azd auth login
    ```

1. Sign in to Azure by using the Azure CLI:

    ```bash
    az login --use-device-code
    ```

1. Open the URL from the terminal, and then copy the code from the terminal and paste it into the URL that you just opened. Follow the instructions to authenticate with your Azure account.

    > [!NOTE]
    > The `az login` command creates a folder under `.azure/` in your project to store the deployment configuration.

The remaining exercises in this project take place in the context of this development container.

---

## Deploy and run

The sample repository contains all the code and configuration files for the deployment of the sample chat app to Azure. The following steps walk you through the deployment.

### Deploy the Contoso Creative Writer app to Azure

> [!IMPORTANT]
> Azure resources that you create in this section incur immediate costs. These resources might accrue costs even if you interrupt the command before it's fully executed.

1. Run the following Azure Developer CLI command for Azure resource provisioning and source code deployment:

    ```azdeveloper
    azd up
    ```

    > [!NOTE]
    > This project uses `gpt-35-turbo-0613`,`gpt-4-1106-Preview`, and `gpt-4o-2024-05-13`, which might not be available in all Azure regions. During deployment, check for [up-to-date region availability](/azure/ai-services/openai/concepts/models#standard-deployment-model-availability) and select a region accordingly. We recommend using Canada East for this project.

1. After you run `azd up`, you might be asked the following question during GitHub setup:

   ```shell
   Do you want to configure a GitHub action to automatically deploy this repo to Azure when you push code changes?
   (Y/n) Y
   ```

    Skip this step by entering `N`.

1. Use the following table to answer the prompts:

    |Prompt|Answer|
    |--|--|
    |Environment name|Keep it short and lowercase. Add your name or alias. For example, enter `creative-writer`. It's used as part of the resource group name.|
    |Subscription|Select the subscription to create the resources in.|
    |Location (for hosting)|Select a location near you from the list. We recommend Canada East as the region for this project.|
    |Location for the OpenAI model|Select a location near you from the list. If the same location is available as your first location, select that.|

1. Wait until the app is deployed. Deployment usually takes 5 to 10 minutes to finish.

## Use orchestrated agents to create an article

1. The terminal displays two container app URLs after successful application deployment:

    - The `agent-web` container app (the front end)
    - The `agent-api` container app (the back end)

1. Select the `agent-web` container app URL to open the Contoso Creative Writer application in a browser.

### Create an article by using the example in the running Contoso Creative Writer app

1. Select the **Example** button to add some example data.

    :::image type="content" source="./media/get-started-multiagents/select-example-button.png" lightbox="./media/get-started-multiagents/select-example-button.png" alt-text="Screenshot of the Contoso Creative Writer app that shows an introduction and steps to begin using the application.":::

1. Select the small bug button (bottom right of the page) to show the agent and the panel for task workflow progress.

    :::image type="content" source="./media/get-started-multiagents/select-debug-button.png" lightbox="./media/get-started-multiagents/select-debug-button.png" alt-text="Screenshot of the Contoso Creative Writer app that shows the button to display the agent and the panel for task workflow progress.":::

1. Select the **Start Work** button to begin the workflow.

    :::image type="content" source="./media/get-started-multiagents/select-start-work-button.png" lightbox="./media/get-started-multiagents/select-start-work-button.png" alt-text="Screenshot of the Contoso Creative Writer app that shows the Start Work button.":::

### Examine the orchestration workflow progress and results

1. The right-side panel displays the workflow progress and the results of each agent. Examine each agent's results.

    :::image type="content" source="./media/get-started-multiagents/show-workflow-progress.png" lightbox="./media/get-started-multiagents/show-workflow-progress.png" alt-text="Screenshot of the Contoso Creative Writer app that shows the agent and task workflow progress in the panel on the right side of the page.":::

1. During the workflow progress, your article is generated and streamed on the page.

    :::image type="content" source="./media/get-started-multiagents/finished-workflow.png" lightbox="./media/get-started-multiagents/finished-workflow.png" alt-text="Screenshot of the Contoso Creative Writer app that shows the agent and task workflow progress in the panel on the right side of the page and the completed article in the middle.":::

## Explore the sample code

Although OpenAI and Azure OpenAI Service rely on a [common Python client library](https://github.com/openai/openai-python), you need to make small code changes when you're using Azure OpenAI endpoints.

### Understanding AI agents

In artificial intelligence, an agent is a program designed to:

- Perceive its environment.
- Make decisions.
- Achieve specific goals by taking actions.

For the Contoso Creative Writer app, the goal is to help the marketing team at the fictitious company write well-researched, product-specific articles. The Contoso Creative Writer app consists of agents that help achieve this goal.

:::image type="content" source="./media/get-started-multiagents/agents.png" lightbox="./media/get-started-multiagents/agents.png" alt-text="Diagram that shows the architecture and interaction of the agents in the Contoso Creative Writer multi-agent system.":::

### Coordinating the multi-agent workflow with the orchestrator

The workflow starts in `src/api/main.py` by creating a FastAPI application named `app`.

To begin orchestration, the web app calls the API endpoint `article` defined via the FastAPI `@app.post` decorator. The endpoint accepts a `Task` object as input. The `Task` class encapsulates the research, products, and assignment results. The `Task` class is defined in `src\api\orchestrator.py`.  

```python
class Task(BaseModel):
    research: str
    products: str
    assignment: str
```

The following code snippet shows the `main.py` `create_article` function calling the `create` function from `orchestrator.py`. The function passes the `research`, `products`, and `assignment` attributes of the `Task` object. The result of the `create` function is streamed back to the client via `PromptyStream` and `StreamingResponse`.

```python
@app.post("/api/article")
@trace
async def create_article(task: Task):
    return StreamingResponse(
        PromptyStream(
            "create_article", create(task.research, task.products, task.assignment)
        ),
        media_type="text/event-stream",
    )
```

### Creating the workflow

In `orchestrator.py`, the `create` function orchestrates the workflow by:

- Sending start and complete messages for each agent task.
- Invoking the `researcher` agent to perform research based on the topic.
- Invoking the `product` agent to find products.
- Invoking the `writer` agent to write content based on the results from the `researcher` and `product` agents.
- Processing the `writer` agent's result and sending it to the `editor` agent for review.
- Handling feedback loops when the `editor` agent requests revisions.

#### Setting up workflow logistics

The `Literal` type alias `types` defines a set of specific variable string values that are allowed. This restriction ensures that only these specific string values are assigned to variables by using this type alias, providing better type safety and code clarity. In this case, `types` is one of the following string values: `"message"`, `"researcher"`, `"marketing"`, `"writer"`, `"editor"`, `"error"`, or `"partial"`.

```python
types = Literal["message", "researcher", "marketing", "writer", "editor", "error", "partial", ]
```

The `Message` class is a data model that represents a message with a specific type, content, and optional data. It uses `BaseModel` from the `pydantic` library to define and validate its structure. The `to_json_line` method returns a JSON representation of the `Message` instance as a single line.

```python
class Message(BaseModel):
    type: types
    message: str
    data: List | dict = Field(default={})

    def to_json_line(self):
        return self.model_dump_json().replace("\n", "") + "\n"
```

The `start_message` function creates a message instance to indicate the start of a specific agent task, and then it converts the instance to a JSON string.

```python
def start_message(type: types):
    return Message(
        type="message", message=f"Starting {type} agent task..."
    ).to_json_line()
```

The `complete_message` function creates a `Message` instance to indicate the completion of a specific agent task, and then it converts the instance to a JSON string.

```python
def complete_message(type: types, result: Union[dict, list] = {}):
    return Message(
        type=type, message=f"Completed {type} task", data=result
    ).to_json_line()
```

#### Starting the workflow

The following code snippet uses the `feedback` variable in the `create` function to provide feedback to the `researcher` and `writer` results. This variable is initially set to `No Feedback`. The `editor` agent updates the feedback to improve the `researcher` and `writer` results in subsequent task iterations.

```python
feedback = "No Feedback"
```

#### Initial research phase

The following code snippet handles the start and completion of the `researcher` agent task. It yields appropriate messages before and after the task is performed.

```python
yield start_message("researcher")
research_result = researcher.research(research_context, feedback)
yield complete_message("researcher", research_result)
```

#### Product matching phase

The following code snippet handles the start and completion of the `product` agent task. It yields appropriate messages before and after the task is performed.

```python
yield start_message("marketing")
product_result = product.find_products(product_context)
yield complete_message("marketing", product_result)
```

#### Initial writing phase

The following code snippet handles the start and initial completion state of the `writer` agent task. It yields appropriate messages before and after the task is performed. It calls the `write` method to generate a document based on the provided contexts and feedback. The `write` method uses the configuration and instructions from the `writer.prompty` prompt to interact with the model and generate the writing result.

```python
yield start_message("writer")
    yield complete_message("writer", {"start": True})
    writer_result = writer.write(
        research_context,
        research_result,
        product_context,
        product_result,
        assignment_context,
        feedback,
    )
```

The following code snippet accumulates the results from `writer_result` into `full_result` and yields partial completion messages for each item in `writer_result`. This process ensures that the writing task is performed according to the specified instructions and the results are communicated in a structured manner.  

```python
full_result = " "
    for item in writer_result:
        full_result = full_result + f'{item}'
        yield complete_message("partial", {"text": item})
```

The next step ensures that the accumulated writing result is parsed into `article` and `feedback` for further use or processing. The `writer.process` method passes in `full_result` and splits the string into `article` and `feedback` by using the delimiter `---`. It returns a dictionary that contains the parsed `article` and `feedback`.

```python
processed_writer_result = writer.process(full_result)
```

#### Editing phase

The editing phase sends the processed writing result to the editor for review and handles the editor's response.

The following code snippet begins by sending a start message that indicates the beginning of the `editor` agent task. Next, it calls the `editor.edit` method to review the processed writing result by using the configuration and instructions from the `editor.prompty` prompt file. The `editor.edit` method then uses the `prompty` library to interact with the model and generate the `editor` agent's response, which is stored in `editor_response`. Finally, task completion messages for the `writer` and `editor` agents are sent. These messages indicate the results of the review and the final completion state.

```python
yield start_message("editor")
editor_response = editor.edit(processed_writer_result['article'], processed_writer_result["feedback"])

yield complete_message("editor", editor_response)
yield complete_message("writer", {"complete": True})
```

#### Editor feedback loop

The following code implements a feedback loop that:

1. Checks if the `editor` agent's decision is to accept (via `accept`) the feedback.
2. Sends a `message` value that indicates the `editor` feedback iteration.
3. Extracts `researchFeedback` and `editorFeedback` information from the editor's response.
4. Regenerates `research_result` by using `researchfeedback`.
5. Starts the `writer` task and regenerates `writer_result` by using `editorFeedback`.
6. Accumulates the `writer_result` information in `full_result` and processes it with `writer.process()`.
7. Sends the `processed_writer_result` information back to `editor.edit` for review and an updated `editor_response` value.
8. Increments `retry_count` and breaks the loop if it exceeds two iterations.
9. Sends task completion messages for `editor` and `writer`.

```python
retry_count = 0
while(str(editor_response["decision"]).lower().startswith("accept")):
    yield ("message", f"Sending editor feedback ({retry_count + 1})...")

    researchFeedback = editor_response.get("researchFeedback", "No Feedback")
    editorFeedback = editor_response.get("editorFeedback", "No Feedback")

    research_result = researcher.research(research_context, researchFeedback)
    yield complete_message("researcher", research_result)

    yield start_message("writer")
    yield complete_message("writer", {"start": True})
    writer_result = writer.write(research_context, research_result, product_context, product_result, assignment_context, editorFeedback)

    full_result = " "
    for item in writer_result:
        full_result = full_result + f'{item}'
        yield complete_message("partial", {"text": item})

    processed_writer_result = writer.process(full_result)

    yield start_message("editor")
    editor_response = editor.edit(processed_writer_result['article'], processed_writer_result["feedback"])

    retry_count += 1
    if retry_count >= 2:
        break

    yield complete_message("editor", editor_response)
    yield complete_message("writer", {"complete": True})
```

#### Sending the results

The following code snippet formats the research, product finding, and writing task results as a response to the API endpoint for display in the web app. Specifically, the code:

1. Sends `research_result` to the `send_research` function, which converts it to a JSON string and yields it.
2. Sends `product_result` to the `send_products` function, which converts it to a JSON string and yields it.
3. Sends `full_result` (accumulated writing result) to the `send_writer` function, which converts it to a JSON string and yields it.

```python
yield send_research(research_result)
yield send_products(product_result)
yield send_writer(full_result) 
```

### Researching article information with the researcher agent

You explored the orchestration workflow and saw how each agent participated. In this section, you examine how the `researcher` agent uses tools to perform tasks.

The `researcher` agent searches for relevant information online by calling functions that use tools like Bing Search, Azure OpenAI models, and a vector database. The agent consists of the following files:

|File name|Description|
|--|--|
|`functions.json`|Contains the `find_information`, `find_entities`, and `find_news` tool descriptions.|
|`researcher.prompty`|Includes the large language model (LLM) base prompt, the agent description, model details, and the `functions.json` tool parameter.|
|`researcher.py`|Contains the code for the functions described in `functions.json`. Has functions to pass user instructions, the `researcher.prompty` file, and `editor` feedback to the LLM.|

#### Setting up research logistics and helper functions

The needed environment variables are loaded.

```python
BING_SEARCH_ENDPOINT = os.getenv("BING_SEARCH_ENDPOINT")
BING_SEARCH_KEY = os.getenv("BING_SEARCH_KEY")
BING_HEADERS = {"Ocp-Apim-Subscription-Key": BING_SEARCH_KEY}
```

[!INCLUDE [Azure key vault](~/reusable-content/ce-skilling/azure/includes/ai-services/security/microsoft-entra-id-akv-new.md)]

The `_make_endpoint` function constructs a full URL by combining a base endpoint with a specific path, with exactly one slash (`/`) between them. This helper function is useful for creating properly formatted URLs for API requests.

```python
def _make_endpoint(endpoint, path):
    """Make an endpoint URL"""
    return f"{endpoint}{'' if endpoint.endswith('/') else '/'}{path}"
```

The `make_request` function constructs a full URL by using the `_make_endpoint` function. It then makes a `GET` request to the Bing Search API with the specified headers and query parameters, parses the `JSON` response, and returns it. This helper function is useful for making API requests and handling the responses in a structured manner.

```python
def _make_request(path, params=None):
    """Make a request to the API"""
    endpoint = _make_endpoint(BING_SEARCH_ENDPOINT, path)
    response = requests.get(endpoint, headers=BING_HEADERS, params=params)
    items = response.json()
    return items
```

The `find_information` function searches for information by using the Bing Search API and returns the results in a structured format. It makes an API request with the specified query and market, extracts relevant information from the response, and returns a dictionary that contains the webpages and related search terms.

```python
def find_information(query, market="en-US"):
    """Find information using the Bing Search API"""
    params = {"q": query, "mkt": market, "count": 5}
    items = _make_request("v7.0/search", params)
    pages = [
        {"url": a["url"], "name": a["name"], "description": a["snippet"]}
        for a in items["webPages"]["value"]
    ]
    related = [a["text"] for a in items["relatedSearches"]["value"]]
    return {"pages": pages, "related": related}
```

The `find_entities` function performs entity searches by using the Bing Entity Search API and returns the results in a structured format. It constructs the query parameters, makes an API request, extracts relevant information from the response, and returns a list of dictionaries that contain entity names and descriptions.

```python
def find_entities(query, market="en-US"):
    """Find entities using the Bing Entity Search API"""
    params = "?mkt=" + market + "&q=" + urllib.parse.quote(query)
    items = _make_request(f"v7.0/entities{params}")
    entities = []
    if "entities" in items:
        entities = [
            {"name": e["name"], "description": e["description"]}
            for e in items["entities"]["value"]
        ]
    return entities
```

The `find_news` function performs news article searches by using the Bing News Search API and returns the results in a structured format. It makes an API request with the specified query and market, extracts relevant information from the response, and returns a dictionary list that contains news article details.

```python
def find_news(query, market="en-US"):
    """Find images using the Bing News Search API"""
    params = {"q": query, "mkt": market, "count": 5}
    items = _make_request("v7.0/news/search", params)
    articles = [
        {
            "name": a["name"],
            "url": a["url"],
            "description": a["description"],
            "provider": a["provider"][0]["name"],
            "datePublished": a["datePublished"],
        }
        for a in items["value"]
    ]
    return articles
```

#### Starting the research task

Previously, you saw how to [invoke](#initial-research-phase) the `researcher` agent by calling the `research` method:

```python
research_result = researcher.research(research_context, feedback)
```

In `src/api/agents/researcher/researcher.py`, the `research` function is the main entry point for performing research tasks. It relies on the `execute` and `process` functions to carry out and process the research.

```python
def research(instructions: str, feedback: str = "No feedback"):
    r = execute(instructions=instructions)
    p = process(r)
    return p
```

#### Understanding the execute function

The `execute` function in `researcher.py` assigns a research task to a researcher by executing specific functions based on the provided instructions. Specifically, the `execute` function:

1. Takes research instructions and optional feedback as input.

1. Defines a dictionary of available functions (`find_information`, `find_entities`, `find_news`).

1. Calls the `prompty.execute` function with the path to the `researcher.prompty` configuration file and the provided inputs. The `prompty.execute` function uses the configuration to determine which functions to call and how to process the instructions. The function returns a list of `ToolCall` objects.

1. The `for` loop processes each `ToolCall` object that `prompty.execute` returns by:

    - Retrieving the corresponding function from the dictionary of functions.
    - Parsing the JSON-encoded arguments.
    - Calling the function with the parsed arguments.
    - Appending the function call details and result to the research list.

```python
def execute(instructions: str, feedback: str = "No feedback"):
    """Assign a research task to a researcher"""
    functions = {
        "find_information": find_information,
        "find_entities": find_entities,
        "find_news": find_news,
    }

    fns: List[ToolCall] = prompty.execute(
        "researcher.prompty", inputs={"instructions": instructions, "feedback": feedback}
    )

    research = []
    for f in fns:
        fn = functions[f.name]
        args = json.loads(f.arguments)
        r = fn(**args)
        research.append(
            {"id": f.id, "function": f.name, "arguments": args, "result": r}
        )

    return research
```

#### Understanding the process function

The `process` function processes the `research` results from the `execute` function.

The information searches are the first results processed. The following code snippet:

- Filters the information research list to include only the results from the `find_information` function.
- Extracts the `web_item` pages and flattens them into a single `web_items` list.

```python
def process(research):
    """Process the research results"""
    # process web searches
    web = filter(lambda r: r["function"] == "find_information", research)
    web_items = [page for web_item in web for page in web_item["result"]["pages"]]
```

The entity searches are the second results processed. The following code snippet:

- Filters the research list to include only the results from the `find_entities` function.
- Extracts the entities from each `entity_item` instance and creates an `entity_items` dictionary list that contains the entity name and description, with a placeholder URL (`"None Available"`).

```python
    # process entity searches
    entities = filter(lambda r: r["function"] == "find_entities", research)
    entity_items = [
        {"url": "None Available", "name": it["name"], "description": it["description"]}
        for e in entities
        for it in e["result"]
    ]
```

The news article searches are the third and final results processed. The following code snippet:

- Filters the research list to include only the results from the `find_news` function.
- Extracts the news articles from each `news_item` instance and creates a `news_items` dictionary list that contains the article URL, name, and description.

```python
    # process news searches
    news = filter(lambda r: r["function"] == "find_news", research)
    news_items = [
        {
            "url": article["url"],
            "name": article["name"],
            "description": article["description"],
        }
        for news_item in news
        for article in news_item["result"]
    ]
```

Finally, the `execute` function returns a dictionary that contains the processed `web`, `entity`, and `news` results:

```python
    return {
        "web": web_items,
        "entities": entity_items,
        "news": news_items,
    }
```

## Explore other sample resources

In addition to the Contoso Creative Writer sample, there are resources in the repo to explore for further learning. Check out the following notebooks in the `docs/workshop` directory:

|Notebook|Description|
|--|--|
|`LAB-SETUP.ipynb`|This notebook is a utility for authentication and refreshing your Azure Developer CLI environment.|
|`workshop-1-intro.ipynb`|This notebook explains agents and prompt engineering with Prompty.|
|`workshop-2-tracing.ipynb`|This notebook is for exploring how to use Prompty tracing for debugging and observability.|
|`workshop-3-build.ipynb`|This notebook is for experimentation with building and running Contoso Creative Writer.|
|`workshop-4-ci-cd.ipynb`|This notebook is for learning how to set up automated evaluations and deployment with GitHub Actions.|

## Clean up resources

### Clean up Azure resources

The Azure resources that you created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

To delete the Azure resources and remove the source code, run the following Azure Developer CLI command:

```azdeveloper
azd down --purge
```

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment helps you maximize the amount of free per-core-hours entitlement that you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign in to the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running codespace sourced from the [`Azure-Samples//contoso-creative-writer`](https://github.com/Azure-Samples/contoso-creative-writer) GitHub repository.

1. Open the context menu for the codespace and select **Delete**.

#### [Visual Studio Code](#tab/visual-studio-code)

Stop the running development container and return to running Visual Studio Code in the context of a local workspace.

Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

:::image type="content" source="./media/get-started-app-chat-vision/reopen-local-command-palette.png" lightbox="./media/get-started-app-chat-vision/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within a local environment.":::

> [!TIP]
> After Visual Studio Code stops the running development container, the container still exists in Docker in a stopped state. You have the option to delete the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

Log your issue to the repository's [issues page](https://github.com/Azure-Samples/contoso-creative-writer/issues).

## Resources for further study

- [Using C#: Creative Writing Assistant - Working with Agents using Semantic Kernel and .NET Aspire](/samples/azure-samples/aspire-semantic-kernel-creative-writer/aspire-semantic-kernel-creative-writer/)
- [Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks](https://www.microsoft.com/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/?msockid=077b8d5b355a6b170bba999334d46aa3)
- [AutoGen - An Open-Source Programming Framework for Agentic AI](https://www.microsoft.com/research/project/autogen/)
