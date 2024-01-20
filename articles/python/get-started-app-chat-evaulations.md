---
title: "Evaluating Chat App Prompts with Azure OpenAI"
description: "Learn how to effectively evaluate the prompt answers in your RAG-based chat app using Azure OpenAI. Generate sample prompts, run evaluations, and analyze results."
ms.date: 01/16/2024
ms.topic: get-started
ms.custom: devx-track-python, devx-track-python-ai
# CustomerIntent: As a python developer new to Azure OpenAI, I want evaluate the prompt answers of my chat app.
---

# Get started with evaluating prompt answers in a chat app

This article shows you how to evaluate a chat app that uses the RAG architecture. Whenever you're making changes to a RAG chat with the goal of improving the answers, you should evaluate the results. This demo application offers a tool you can use today to make it easier to run evaluations.

[Video overview of evaluations app](https://www.youtube.com/watch?v=mM8pZAI2C5w)

By following the instructions in this article, you will:

- Use provided sample prompts tailored to the subject domain. These are already in the repository.
- Generate sample user questions and ground truth answers from your own documents.
- Run evaluations using a sample prompt with the generated user questions.
- Review analysis of answers.

## Architectural overview

Key components of the architecture include:

* **Azure-hosted Chat app**: The chat app runs in Azure App Service. The chat app conforms to the Chat protocol, which allows the evaluations app to run against any chat app that conforms to the protocol.
* **Azure AI Search**: The chat app uses Azure AI Search to store the data from your own documents. 
* **Sample questions generator**: Can generate a number of questions for each document along with the ground truth answer. The more questions, the longer the evaluation.
* **Evaluations app** runs sample questions and prompts against the chat app and returns the results.
* **Review tool** allows you to review the results of the evaluations.
* **Diff tool** allows you to compare the answers between evaluations.

## Prerequisites

* Azure subscription with Azure OpenAI enabled. It's best to use a GPT-4 model for performing the evaluation, even if your chat app uses GPT-3.5 or another model. 

* Complete the [previous Chat App procedure](get-started-app-chat-template.md) to deploy the Chat app to Azure. This procedure loads the data into the Azure AI Search resource. This resource is required for the evaluations app to work. Don't complete the **Clean up resources** section of the previous procedure.     

    You'll need the following Azure resource information from that deployment, which is referred to as the **Chat app** in this article:

    * Web API URI: The URI of the deployed chat app API. 
    * Azure AI Search. The following values are required:
        * Resource name: The name of the Azure AI Search resource name.
        * Index name: The name of the Azure AI Search index where your documents are stored.
        * Query key: The key to query your Search index.
    * If you experimented with the Chat app authentication, you need to disable user authentication so the evaluation app can access the chat app.

    Once you have this information collected, you shouldn't need to use the **Chat app** development environment again. It's referred to later in this article several times to indicate how the **Chat app** is used by the **Evaluations app**. Don't delete the **Chat app** resources until you complete the entire procedure in this article.

## Start development environment

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

#### [Codespaces (recommended)](#tab/github-codespaces)

1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 
1. GitHub account

#### [Visual Studio Code](#tab/visual-studio-code)
1. An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)
1. [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
1. [Visual Studio Code](https://code.visualstudio.com/)
1. [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Begin now with a development environment that has all the dependencies installed to complete this article. You should arrange your monitor workspace so you can see both this documentation and the development environment at the same time. 

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/ai-rag-chat-evaluator`](https://github.com/Azure-Samples/ai-rag-chat-evaluator) GitHub repository.
1. Right-click on the following button, and select _Open link in new windows_ in order to have both the development environment and the documentation available at the same time. 

    > [!div class="nextstepaction"]
    > [Open this project in GitHub Codespaces](https://github.com/codespaces/new?azure-portal=true&hide_repo_select=true&ref=main&repo=721389005)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create new codespace**

    :::image type="content" source="./media/get-started-app-chat-evaluations/github-create-codespace.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

    If you are prompted to update the Azure Developer CLI (azd), complete that step then authenticate again.

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Provision the required Azure resource, Azure OpenAI, for the evaluations app.

    ```bash
    azd up
    ```

    This doesn't deploy the evaluations app, but it does create the **Azure OpenAI** resource required to run the app locally in the development environment.

1. The remaining tasks in this article take place in the context of this development container.
1. The name of the GitHub repository is shown in the search bar. This helps you distinguish between this evaluations app from the Chat app. This `ai-rag-chat-evaluator` repo is referred to as the **Evaluations app** in this article.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.


1. Clone the [Azure-Samples/ai-rag-chat-evaluator](https://github.com/Azure-Samples/ai-rag-chat-evaluator) GitHub repository to your local machine.

    ```bash
    git clone https://github.com/Azure-Samples/ai-rag-chat-evaluator
    ```

1. Open **Visual Studio Code** in the context of the cloned repo:

    ```bash
    cd ai-rag-chat-evaluator
    code .
    ```

1. Ensure that you have the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed in Visual Studio Code.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen in Container**.

    > [!TIP]
    > Visual Studio Code may automatically prompt you to reopen the existing folder within a development container. This is functionally equivalent to using the command palette to reopen the current workspace in a container.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

    If you are prompted to update the Azure Developer CLI (azd), complete that step then authenticate again.

    Follow the instructions to authenticate with your Azure account.

1. Provision the required Azure resource, Azure OpenAI, for the evaluations app.

    ```bash
    azd up
    ```

    This doesn't deploy the evaluations app, but it does create the **Azure OpenAI** resource required to run the app locally in the development environment.

1. The remaining exercises in this project take place in the context of this development container.
1. The name of the GitHub repository is shown in the bottom left corner Visual Studio Code. This helps you distinguish between this evaluations app from the Chat app. This `ai-rag-chat-evaluator` repo is referred to as the **Evaluations app** in this article.

---

## Prepare environment values and configuration information

Update the environment values and configuration information with the information you gathered during [Prerequisites](#prerequisites) for the evaluations app.

1. Use the following command to get the **Evaluations** app resource information into a `.env` file.:

    ```bash
    azd env get-values > .env
    ```

1. Add the following values from the **Chat app** for its **Azure AI Search** instance to the `.env`, which you gathered in the [prerequisites](#prerequisites) section:

    ```bash
    AZURE_SEARCH_SERVICE="<service-name>"
    AZURE_SEARCH_INDEX="<index-name>"
    ```

    The `AZURE_SEARCH_KEY` value is the **query key** for the Azure AI Search instance. 


1. Copy the `example_config.json` file at the root of the **Evaluations app** folder into a new file `my_config.json`. 
1. Replace the existing content of `my_config.json` with the following content:


    ```json
    {
        "testdata_path": "my_input/qa.jsonl",
        "results_dir": "my_results/experiment<TIMESTAMP>",
        "target_url": "http://localhost:50505/chat",
        "target_parameters": {
            "overrides": {
                "semantic_ranker": false,
                "prompt_template": "<READFILE>my_input/prompt_refined.txt"
            }
        }
    }
    ```

1. Change the `target_url` to the URI value of your **Chat app**, which you gathered in the [prerequisites](#prerequisites) section. The Chat app must conform to the Chat protocol. The URI has the following format `https://CHAT-APP-URL/chat`. Make sure the protocol and the `chat` route are part of the URI.

## Generate sample prompts

In order to evaluate new answers, they must be compared to a "ground truth" answer, which is the ideal answer for a particular question. Generate questions and answers from documents stored in Azure AI Search for the **Chat app**.

1. Copy the `example_input` folder into a new folder named`my_input`.

1. In a terminal, run the following command to generate the sample prompts:

    ```bash
    python3 -m scripts generate --output=my_input/qa.jsonl --numquestions=14 --persource=2
    ```

The prompts are generated and stored in `my_input/qa.jsonl` as input to the evaluator used in the next step. For a production evaluation, you would generate more prompts, perhaps more than 200 for this dataset. 

> [!NOTE]
> The few number of questions and answers per source is meant to allow you to quickly complete this procedure. It isn't meant to be a production evaluation which should have more questions and answers per source.

## Run first evaluation with a refined prompt

1. Edit the `my_config.json` config file properties:

    * Change `results_dir` to include the name of the prompt: `my_results/experiment_refined`

1. In a terminal, run the following command to run the evaluation:

    ````bash
    python3 -m scripts evaluate --config=my_config.json --numquestions=14
    ````

    This created a new experiment folder in `my_results` with the evaluation. The folder contains the results of the evaluation including:
    
    * `eval_results.jsonl`: Each question and answer, along with the GPT metrics for each QA pair.
    * `summary.json`: The overall results, like the average GPT metrics.
    
## Run second evaluation with a weak prompt

1. Edit the `my_config.json` config file properties:

    * Change `results_dir` to: `my_results/experiment_weak`
    * Change `prompt_template` to: `<READFILE>my_input/prompt_weak.txt` to use the weak prompt template in the next evaluation. 

    That weak prompt has no context about the subject domain:

    ```txt
    You are a helpful assistant.
    ```

1. In a terminal, run the following command to run the evaluation:

    ````bash
    python3 -m scripts evaluate --config=my_config.json --numquestions=14
    ````

## Run third evaluation with a specific temperature

Use a refined prompt but with shorter length. This is a common scenario when you want to use a refined prompt but don't want to use the full prompt length.

1. Edit the `my_config.json` config file properties:

    * Change `results_dir` to: `my_results/experiment_ignoresources_temp02`
    * Change `prompt_template` to: `<READFILE>my_input/prompt_ignoresources.txt` 
    * Add a new override, `"temperature": 0.2`

1. The config object should like the following except use your own `results_dir`:

    ```json
    {
        "testdata_path": "my_input/qa.jsonl",
        "results_dir": "my_results/experiment_ignoresources_temp02",
        "target_url": "https://YOUR-CHAT-APP/chat",
        "target_parameters": {
            "overrides": {
                "temperature": 0.2,
                "semantic_ranker": false,
                "prompt_template": "<READFILE>my_input/prompt_ignoresources.txt"
            }
        }
    }
    ```

1. In a terminal, run the following command to run the evaluation:

    ````bash
    python3 -m scripts evaluate --config=my_config.json --numquestions=14
    ````

## Review the evaluation results

You have three evaluations created from different prompts. The results are stored in the `my_results` folder. Review how the results differ based on the prompts.

1. Use the review tool to see the results of the evaluations: 

    ```bash
    python3 -m review_tools summary my_results
    ```
    
1. The results look like: 

    :::image type="content" source="./media/get-started-app-chat-evaluations/evaluations_review_summary.png" alt-text="Screenshot of evaluations review tool showing the three evaluations.":::

    Each value is returned as a number and a percentage.

1. Use the following table to understand the meaning of the values.

    |Value|Description|
    |--|--|
    | Groundedness |  This refers to how well the model's responses are based on factual, verifiable information. A response is considered grounded if it's factually accurate and reflects reality.|
    | Relevance | This measures how closely the model's responses align with the context or the prompt. A relevant response directly addresses the user's query or statement. |
    | Coherence | This refers to how logically consistent the model's responses are. A coherent response maintains a logical flow and doesn't contradict itself. |
    | Citation | This indicates if the answer was returned in the format requested in the prompt.|
    | Length | This measures the length of the response.|

1. The results should indicate all 3 evaluations had high relevance while the `experiment_ignoresources_temp02` had the lowest relevance.

1. Select the folder to see the configuration for the evaluation.
1. Enter <kbd>Ctrl</kbd> + <kbd>C</kbd> exit the app and return to the terminal.

## Compare the answers

Compare the returned answers from the evaluations. 

1. Select two of the evaluations to compare then use the same review tool to compare the answers:

    ```bash
    python3 -m review_tools diff my_results/experiment_refined my_results/experiment_ignoresources_temp02
    ```

1. Review the results.

    :::image type="content" source="./media/get-started-app-chat-evaluations/evaluations_difference_between_evaluation_answers.png" alt-text="Screenshot of comparison of evaluation answers between evaluations.":::

1. Enter <kbd>Ctrl</kbd> + <kbd>C</kbd> exit the app and return to the terminal.

## Suggestions for further evaluations

* Edit the prompts in `my_input ` to tailor the answers such as subject domain, length, and other factors.
* Edit the `my_config.json` file to change the parameters such as `temperature`, and `semantic_ranker` and rerun experiments.
* Compare different answers to understand how the prompt and question impact the value of the answers.
* Generate a separate set of questions and ground truth answers for each document in the Azure AI Search index. Then rerun the evaluations to see how the answers differ.
* Alter the prompts to indicate shorter or longer answers by adding the requirement to the end of the prompt. For example, `Please answer in about 3 sentences.` 


## Clean up resources

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

Run the following Azure Developer CLI command to delete the Azure resources and remove the source code:

```bash
azd down --purge
```

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the GitHub Codespaces dashboard (<https://github.com/codespaces>).

1. Locate your currently running Codespaces sourced from the [`Azure-Samples/ai-rag-chat-evaluator`](https://github.com/Azure-Samples/ai-rag-chat-evaluator) GitHub repository.

    :::image type="content" source="./media/get-started-app-chat-evaluations/github-codespace-dashboard.png" alt-text="Screenshot of all the running Codespaces including their status and templates.":::

1. Open the context menu for the codespace and then select **Delete**.

    :::image type="content" source="./media/get-started-app-chat-evaluations/github-codespace-delete.png" alt-text="Screenshot of the context menu for a single codespace with the delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="./media/get-started-app-chat-evaluations/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

1. After you clean up for the evaluations app, return to the Chat app and [clean up](get-started-app-chat-template.md#clean-up-resources) its resources. 

## Next steps

* [Evaluations repository](https://github.com/Azure-Samples/ai-rag-chat-evaluator)
* [Enterprise chat app GitHub repository](https://github.com/Azure-Samples/azure-search-openai-demo)
* [Build a chat app with Azure OpenAI](https://aka.ms/azai/chat) best practice solution architecture
* [Access control in Generative AI Apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408)
* [Build an Enterprise ready OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407)
* [Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)
