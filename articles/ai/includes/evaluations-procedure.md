---
ms.custom: overview
ms.topic: include
ms.date:  07/23/2024
ms.author: johalexander
author: ms-johnalex
ms.service: azure
---

## Open a development environment

Begin now with a development environment that has all the dependencies installed to complete this article. Arrange your monitor workspace so that you can see this documentation and the development environment at the same time.

This article was tested with the `switzerlandnorth` region for the evaluation deployment.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use GitHub Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub codespace on the `main` branch of the [Azure-Samples/ai-rag-chat-evaluator](https://github.com/Azure-Samples/ai-rag-chat-evaluator) GitHub repository.
1. To display the development environment and the documentation available at the same time, right-click the following button, and select **Open link in new window**.

    ![Open in GitHub Codespaces.](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/ai-rag-chat-evaluator)

1. On the **Create codespace** page, review the codespace configuration settings, and then select **Create new codespace**.

    :::image type="content" source="../media/get-started-app-chat-evaluations/github-create-codespace.png" alt-text="Screenshot that shows the confirmation screen before you create a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI:

    ```bash
    azd auth login --use-device-code
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Provision the required Azure resource, Azure OpenAI Service, for the evaluations app:

    ```bash
    azd up
    ```

    This `AZD` command doesn't deploy the evaluations app, but it does create the Azure OpenAI resource with a required `GPT-4` deployment to run the evaluations in the local development environment.

The remaining tasks in this article take place in the context of this development container.

The name of the GitHub repository appears in the search bar. This visual indicator helps you distinguish the evaluations app from the chat app. This `ai-rag-chat-evaluator` repo is referred to as the *evaluations app* in this article.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally by using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Ensure that you have the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed in Visual Studio Code.

    [![Open this project in Dev Containers.](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/Azure-Samples/ai-rag-chat-evaluator)

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login --use-device-code
    ```

    Follow the instructions to authenticate with your Azure account.

1. Provision the required Azure resource, Azure OpenAI, for the evaluations app.

    ```bash
    azd up
    ```

The remaining exercises in this project take place in the context of this development container.

The name of the GitHub repository is shown in the bottom-left corner of Visual Studio Code. This visual indicator helps you distinguish the evaluations app from the chat app. This `ai-rag-chat-evaluator` repo is referred to as the evaluations app in this article.

---

## Prepare environment values and configuration information

Update the environment values and configuration information with the information you gathered during [Prerequisites](#prerequisites) for the evaluations app.

1. Create a `.env` file based on `.env.sample`.

    ```bash
    cp .env.sample .env
    ```

1. Run this command to get the required values for `AZURE_OPENAI_EVAL_DEPLOYMENT` and `AZURE_OPENAI_SERVICE` from your deployed resource group. Paste those values into the `.env` file.

    ```shell
    azd env get-value AZURE_OPENAI_EVAL_DEPLOYMENT
    azd env get-value AZURE_OPENAI_SERVICE
    ```

1. Add the following values from the chat app for its Azure AI Search instance to the `.env`, which you gathered in the [Prerequisites](#prerequisites) section.

    ```bash
    AZURE_SEARCH_SERVICE="<service-name>"
    AZURE_SEARCH_INDEX="<index-name>"
    ```

### Use the Microsoft AI Chat Protocol for configuration information

The chat app and the evaluations app both implement the Microsoft AI Chat Protocol specification, an open-source, cloud, and language-agnostic AI endpoint API contract that's used for consumption and evaluation. When your client and middle-tier endpoints adhere to this API specification, you can consistently consume and run evaluations on your AI backends.

1. Create a new file named `my_config.json` and copy the following content into it:

    ```json
    {
        "testdata_path": "my_input/qa.jsonl",
        "results_dir": "my_results/experiment<TIMESTAMP>",
        "target_url": "http://localhost:50505/chat",
        "target_parameters": {
            "overrides": {
                "top": 3,
                "temperature": 0.3,
                "retrieval_mode": "hybrid",
                "semantic_ranker": false,
                "prompt_template": "<READFILE>my_input/prompt_refined.txt",
                "seed": 1
            }
        }
    }
    ```

    The evaluation script creates the `my_results` folder.

    The `overrides` object contains any configuration settings that are needed for the application. Each application defines its own set of settings properties.

1. Use the following table to understand the meaning of the settings properties that are sent to the chat app.

    |Settings property|Description|
    |---|---|
    |`semantic_ranker`|Whether to use [semantic ranker](/azure/search/semantic-search-overview#what-is-semantic-search), a model that reranks search results based on semantic similarity to the user's query. We disable it for this tutorial to reduce costs. |
    |`retrieval_mode`|The retrieval mode to use. The default is `hybrid`.|
    |`temperature`|The temperature setting for the model. The default is `0.3`.|
    |`top`|The number of search results to return. The default is `3`.|
    |`prompt_template`|An override of the prompt used to generate the answer based on the question and search results.|
    |`seed`|The seed value for any calls to GPT models. Setting a seed results in more consistent results across evaluations.|

1. Change the `target_url` value to the URI value of your chat app, which you gathered in the [Prerequisites](#prerequisites) section. The chat app must conform to the chat protocol. The URI has the following format: `https://CHAT-APP-URL/chat`. Make sure the protocol and the `chat` route are part of the URI.

## Generate sample data

To evaluate new answers, they must be compared to a *ground truth* answer, which is the ideal answer for a particular question. Generate questions and answers from documents that are stored in Azure AI Search for the chat app.

1. Copy the `example_input` folder into a new folder named `my_input`.

1. In a terminal, run the following command to generate the sample data:

    ```bash
    python -m evaltools generate --output=my_input/qa.jsonl --persource=2 --numquestions=14
    ```

The question-and-answer pairs are generated and stored in `my_input/qa.jsonl` (in [JSONL format](https://jsonlines.org/)) as input to the evaluator that's used in the next step. For a production evaluation, you would generate more question-and-answer pairs. More than 200 are generated for this dataset.

> [!NOTE]
> Ony a few questions and answers are generated per source so that you can quickly complete this procedure. It isn't meant to be a production evaluation, which should have more questions and answers per source.

## Run the first evaluation with a refined prompt

1. Edit the `my_config.json` config file properties.

    |Property|New value|
    |--|--|
    |`results_dir`|`my_results/experiment_refined`|
    |`prompt_template`|`<READFILE>my_input/prompt_refined.txt`|

    The refined prompt is specific about the subject domain.

    ```txt
    If there isn't enough information below, say you don't know. Do not generate answers that don't use the sources below. If asking a clarifying question to the user would help, ask the question.

    Use clear and concise language and write in a confident yet friendly tone. In your answers, ensure the employee understands how your response connects to the information in the sources and include all citations necessary to help the employee validate the answer provided.
    
    For tabular information, return it as an html table. Do not return markdown format. If the question is not in English, answer in the language used in the question.
    
    Each source has a name followed by a colon and the actual information. Always include the source name for each fact you use in the response. Use square brackets to reference the source, e.g. [info1.txt]. Don't combine sources, list each source separately, e.g. [info1.txt][info2.pdf].
    ```

1. In a terminal, run the following command to run the evaluation:

    ````bash
    python -m evaltools evaluate --config=my_config.json --numquestions=14
    ````

     This script created a new experiment folder in `my_results/` with the evaluation. The folder contains the results of the evaluation.

    | File name | Description |
    |--|--|
    | `config.json` | A copy of the configuration file used for the evaluation.|
    | `evaluate_parameters.json` | The parameters used for the evaluation. Similar to `config.json` but includes other metadata like time stamp. |
    | `eval_results.jsonl`| Each question and answer, along with the GPT metrics for each question-and-answer pair.|
    | `summary.json`| The overall results, like the average GPT metrics.|

## Run the second evaluation with a weak prompt

1. Edit the `my_config.json` config file properties.

    |Property|New value|
    |--|--|
    |`results_dir`|`my_results/experiment_weak`|
    |`prompt_template`|`<READFILE>my_input/prompt_weak.txt`|

    That weak prompt has no context about the subject domain.

    ```txt
    You are a helpful assistant.
    ```

1. In a terminal, run the following command to run the evaluation:

    ````bash
    python -m evaltools evaluate --config=my_config.json --numquestions=14
    ````

## Run the third evaluation with a specific temperature

Use a prompt that allows for more creativity.

1. Edit the `my_config.json` config file properties.

    |Existing|Property|New value|
    |--|--|--|
    |Existing|`results_dir`|`my_results/experiment_ignoresources_temp09`|
    |Existing|`prompt_template`|`<READFILE>my_input/prompt_ignoresources.txt`|
    |New| `temperature` | `0.9`|

    The default `temperature` is 0.7. The higher the temperature, the more creative the answers.

    The `ignore` prompt is short.

    ```text
    Your job is to answer questions to the best of your ability. You will be given sources but you should IGNORE them. Be creative!
    ```

1. The config object should look like the following example, except that you replaced `results_dir` with your path:

    ```json
    {
        "testdata_path": "my_input/qa.jsonl",
        "results_dir": "my_results/prompt_ignoresources_temp09",
        "target_url": "https://YOUR-CHAT-APP/chat",
        "target_parameters": {
            "overrides": {
                "temperature": 0.9,
                "semantic_ranker": false,
                "prompt_template": "<READFILE>my_input/prompt_ignoresources.txt"
            }
        }
    }
    ```

1. In a terminal, run the following command to run the evaluation:

    ````bash
    python -m evaltools evaluate --config=my_config.json --numquestions=14
    ````

## Review the evaluation results

You performed three evaluations based on different prompts and app settings. The results are stored in the `my_results` folder. Review how the results differ based on the settings.

1. Use the **review tool** to see the results of the evaluations.

    ```bash
    python -m evaltools summary my_results
    ```

1. The results look _something_ like:

    :::image type="content" source="../media/get-started-app-chat-evaluations/evaluations-review-summary.png" alt-text="Screenshot that shows the evaluations review tool showing the three evaluations.":::

    Each value is returned as a number and a percentage.

1. Use the following table to understand the meaning of the values.

    |Value|Description|
    |--|--|
    | Groundedness | Checks how well the model's responses are based on factual, verifiable information. A response is considered grounded if it's factually accurate and reflects reality.|
    | Relevance | Measures how closely the model's responses align with the context or the prompt. A relevant response directly addresses the user's query or statement. |
    | Coherence | Checks how logically consistent the model's responses are. A coherent response maintains a logical flow and doesn't contradict itself. |
    | Citation | Indicates if the answer was returned in the format requested in the prompt.|
    | Length | Measures the length of the response.|

1. The results should indicate that all three evaluations had high relevance while the `experiment_ignoresources_temp09` had the lowest relevance.

1. Select the folder to see the configuration for the evaluation.
1. Enter <kbd>Ctrl</kbd> + <kbd>C</kbd> to exit the app and return to the terminal.

## Compare the answers

Compare the returned answers from the evaluations.

1. Select two of the evaluations to compare, and then use the same **review tool** to compare the answers.

    ```bash
    python -m evaltools diff my_results/experiment_refined my_results/experiment_ignoresources_temp09
    ```

1. Review the results. Your results might vary.

    :::image type="content" source="../media/get-started-app-chat-evaluations/evaluations-difference-between-evaluation-answers.png" alt-text="Screenshot that shows comparison of evaluation answers between evaluations.":::

1. Enter <kbd>Ctrl</kbd> + <kbd>C</kbd> to exit the app and return to the terminal.

## Suggestions for further evaluations

* Edit the prompts in `my_input` to tailor the answers such as subject domain, length, and other factors.
* Edit the `my_config.json` file to change the parameters such as `temperature`, and `semantic_ranker` and rerun experiments.
* Compare different answers to understand how the prompt and question affect the answer quality.
* Generate a separate set of questions and ground truth answers for each document in the Azure AI Search index. Then rerun the evaluations to see how the answers differ.
* Alter the prompts to indicate shorter or longer answers by adding the requirement to the end of the prompt. An example is `Please answer in about 3 sentences.`

## Clean up resources and dependencies

The following steps walk you through the process of cleaning up the resources you used.

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

To delete the Azure resources and remove the source code, run the following Azure Developer CLI command:

```bash
azd down --purge
```

### Clean up GitHub Codespaces and Visual Studio Code

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement that you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign in to the [GitHub Codespaces dashboard](<https://github.com/codespaces>).

1. Locate your currently running codespaces that are sourced from the [Azure-Samples/ai-rag-chat-evaluator](https://github.com/Azure-Samples/ai-rag-chat-evaluator) GitHub repository.

    :::image type="content" source="../media/get-started-app-chat-evaluations/github-codespace-dashboard.png" alt-text="Screenshot that shows all the running codespaces, including their status and templates.":::

1. Open the context menu for the codespace, and then select **Delete**.

    :::image type="content" source="../media/get-started-app-chat-evaluations/github-codespace-delete.png" alt-text="Screenshot that shows the context menu for a single codespace with the Delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command** palette, and search for the **Dev Containers** commands.

1. Select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="../media/get-started-app-chat-evaluations/reopen-local-command-palette.png" alt-text="Screenshot that shows the Command palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code stops the running development container, but the container still exists in Docker in a stopped state. You always have the option to delete the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

Return to the chat app article to clean up those resources.

* [JavaScript](/azure/developer/javascript/get-started-app-chat-template#clean-up-resources)
* [Python](/azure/developer/python/get-started-app-chat-template#clean-up-resources)

## Related content

* See the [evaluations repository](https://github.com/Azure-Samples/ai-rag-chat-evaluator).
* See the [enterprise chat app GitHub repository](https://github.com/Azure-Samples/azure-search-openai-demo).
* Build a [chat app with Azure OpenAI](https://aka.ms/azai/chat) best-practices solution architecture.
* Learn about [access control in Generative AI apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408).
* Build an [enterprise-ready Azure OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407).
* See [Azure AI Search: Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167).
