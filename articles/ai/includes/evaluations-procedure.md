---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Open development environment

Begin now with a development environment that has all the dependencies installed to complete this article. You should arrange your monitor workspace so you can see both this documentation and the development environment at the same time. 

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/ai-rag-chat-evaluator`](https://github.com/Azure-Samples/ai-rag-chat-evaluator) GitHub repository.
1. Right-click on the following button, and select _Open link in new window_ in order to have both the development environment and the documentation available at the same time. 

    > [!div class="nextstepaction"]
    > [Open this project in GitHub Codespaces](https://github.com/codespaces/new?azure-portal=true&hide_repo_select=true&ref=main&repo=721389005)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create new codespace**

    :::image type="content" source="../media/get-started-app-chat-evaluations/github-create-codespace.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login --use-device-code
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

1. Provision the required Azure resource, Azure OpenAI, for the evaluations app.

    ```bash
    azd up
    ```

    This doesn't deploy the evaluations app, but it does create the **Azure OpenAI** resource with a GPT-4 deployment that's required to run the evaluations locally in the development environment.

1. The remaining tasks in this article take place in the context of this development container.
1. The name of the GitHub repository is shown in the search bar. This helps you distinguish between this evaluations app from the chat app. This `ai-rag-chat-evaluator` repo is referred to as the **Evaluations app** in this article.

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
    azd auth login --use-device-code
    ```

    Follow the instructions to authenticate with your Azure account.

1. Provision the required Azure resource, Azure OpenAI, for the evaluations app.

    ```bash
    azd up
    ```

    This doesn't deploy the evaluations app, but it does create the **Azure OpenAI** resource required to run the app locally in the development environment.

1. The remaining exercises in this project take place in the context of this development container.
1. The name of the GitHub repository is shown in the bottom left corner Visual Studio Code. This helps you distinguish between this evaluations app from the chat app. This `ai-rag-chat-evaluator` repo is referred to as the **Evaluations app** in this article.

---

## Prepare environment values and configuration information

Update the environment values and configuration information with the information you gathered during [Prerequisites](#prerequisites) for the evaluations app.

1. Use the following command to get the **Evaluations** app resource information into a `.env` file:

    ```bash
    azd env get-values > .env
    ```

1. Add the following values from the **chat app** for its **Azure AI Search** instance to the `.env`, which you gathered in the [prerequisites](#prerequisites) section:

    ```bash
    AZURE_SEARCH_SERVICE="<service-name>"
    AZURE_SEARCH_INDEX="<index-name>"
    AZURE_SEARCH_KEY="<query-key>"
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

1. Change the `target_url` to the URI value of your **chat app**, which you gathered in the [prerequisites](#prerequisites) section. The chat app must conform to the chat protocol. The URI has the following format `https://CHAT-APP-URL/chat`. Make sure the protocol and the `chat` route are part of the URI.

## Generate sample data

In order to evaluate new answers, they must be compared to a "ground truth" answer, which is the ideal answer for a particular question. Generate questions and answers from documents stored in Azure AI Search for the **chat app**.

1. Copy the `example_input` folder into a new folder named`my_input`.

1. In a terminal, run the following command to generate the sample data:

    ```bash
    python3 -m scripts generate --output=my_input/qa.jsonl --numquestions=14 --persource=2
    ```

The question/answer pairs are generated and stored in `my_input/qa.jsonl` (in [JSONL format](https://jsonlines.org/)) as input to the evaluator used in the next step. For a production evaluation, you would generate more QA pairs, perhaps more than 200 for this dataset. 

> [!NOTE]
> The few number of questions and answers per source is meant to allow you to quickly complete this procedure. It isn't meant to be a production evaluation which should have more questions and answers per source.

## Run first evaluation with a refined prompt

1. Edit the `my_config.json` config file properties:

    * Change `results_dir` to include the name of the prompt: `my_results/experiment_refined`.
    * Change `prompt_template` to: `<READFILE>my_input/experiment_refined.txt` to use the refined prompt template in the evaluation. 

    The refined prompt is very specific about the subject domain.

    ```txt
    If there isn't enough information below, say you don't know. Do not generate answers that don't use the sources below. If asking a clarifying question to the user would help, ask the question.

    Use clear and concise language and write in a confident yet friendly tone. In your answers ensure the employee understands how your response connects to the information in the sources and include all citations necessary to help the employee validate the answer provided.
    
    For tabular information return it as an html table. Do not return markdown format. If the question is not in English, answer in the language used in the question.
    
    Each source has a name followed by colon and the actual information, always include the source name for each fact you use in the response. Use square brackets to reference the source, e.g. [info1.txt]. Don't combine sources, list each source separately, e.g. [info1.txt][info2.pdf].
    ```

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

Use a prompt which allows for more creativity. 

1. Edit the `my_config.json` config file properties:

    * Change `results_dir` to: `my_results/experiment_ignoresources_temp09`
    * Change `prompt_template` to: `<READFILE>my_input/prompt_ignoresources.txt` 
    * Add a new override, `"temperature": 0.9` - the default temperature is 0.7. The higher the temperature, the more creative the answers.

    The ignore prompt is short: 

    ```text
    Your job is to answer questions to the best of your ability. You will be given sources but you should IGNORE them. Be creative!
    ```


1. The config object should like the following except use your own `results_dir`:

    ```json
    {
        "testdata_path": "my_input/qa.jsonl",
        "results_dir": "my_results/experiment_ignoresources_temp09",
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
    python3 -m scripts evaluate --config=my_config.json --numquestions=14
    ````

## Review the evaluation results

You have performed three evaluations based on different prompts and app settings. The results are stored in the `my_results` folder. Review how the results differ based on the settings.

1. Use the review tool to see the results of the evaluations: 

    ```bash
    python3 -m review_tools summary my_results
    ```
    
1. The results look like: 

    :::image type="content" source="../media/get-started-app-chat-evaluations/evaluations-review-summary.png" alt-text="Screenshot of evaluations review tool showing the three evaluations.":::

    Each value is returned as a number and a percentage.

1. Use the following table to understand the meaning of the values.

    |Value|Description|
    |--|--|
    | Groundedness |  This refers to how well the model's responses are based on factual, verifiable information. A response is considered grounded if it's factually accurate and reflects reality.|
    | Relevance | This measures how closely the model's responses align with the context or the prompt. A relevant response directly addresses the user's query or statement. |
    | Coherence | This refers to how logically consistent the model's responses are. A coherent response maintains a logical flow and doesn't contradict itself. |
    | Citation | This indicates if the answer was returned in the format requested in the prompt.|
    | Length | This measures the length of the response.|

1. The results should indicate all 3 evaluations had high relevance while the `experiment_ignoresources_temp09` had the lowest relevance.

1. Select the folder to see the configuration for the evaluation.
1. Enter <kbd>Ctrl</kbd> + <kbd>C</kbd> exit the app and return to the terminal.

## Compare the answers

Compare the returned answers from the evaluations. 

1. Select two of the evaluations to compare, then use the same review tool to compare the answers:

    ```bash
    python3 -m review_tools diff my_results/experiment_refined my_results/experiment_ignoresources_temp09
    ```

1. Review the results.

    :::image type="content" source="../media/get-started-app-chat-evaluations/evaluations-difference-between-evaluation-answers.png" alt-text="Screenshot of comparison of evaluation answers between evaluations.":::

1. Enter <kbd>Ctrl</kbd> + <kbd>C</kbd> exit the app and return to the terminal.

## Suggestions for further evaluations

* Edit the prompts in `my_input` to tailor the answers such as subject domain, length, and other factors.
* Edit the `my_config.json` file to change the parameters such as `temperature`, and `semantic_ranker` and rerun experiments.
* Compare different answers to understand how the prompt and question impact the answer quality.
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

    :::image type="content" source="../media/get-started-app-chat-evaluations/github-codespace-dashboard.png" alt-text="Screenshot of all the running Codespaces including their status and templates.":::

1. Open the context menu for the codespace and then select **Delete**.

    :::image type="content" source="../media/get-started-app-chat-evaluations/github-codespace-delete.png" alt-text="Screenshot of the context menu for a single codespace with the delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

:::image type="content" source="../media/get-started-app-chat-evaluations/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

Return to the chat app article to clean up those resources. 

* [Javascript](/azure/developer/javascript/get-started-app-chat-template#clean-up-resources)
* [Python](/azure/developer/python/get-started-app-chat-template#clean-up-resources)


## Next steps

* [Evaluations repository](https://github.com/Azure-Samples/ai-rag-chat-evaluator)
* [Enterprise chat app GitHub repository](https://github.com/Azure-Samples/azure-search-openai-demo)
* [Build a chat app with Azure OpenAI](https://aka.ms/azai/chat) best practice solution architecture
* [Access control in Generative AI Apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408)
* [Build an Enterprise ready OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407)
* [Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)
