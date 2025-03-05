---
title: "Extract Entities Using Azure OpenAI Structured Outputs Mode"
description: "Learn how to improve your Azure OpenAI model responses with structured outputs."
ms.date: 03/06/2025
ms.topic: how-to 
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As an AI app developer, I want to learn how to use Azure OpenAI  structured outputs to improve my model responses from a simple example.
---
# Extract Entities using Azure OpenAI Structured Outputs Mode

In this article, you explore several examples to extract different types of entities. These examples demonstrate how to create an object schema and get a response from the Azure OpenAI model. It uses Python and the Azure OpenAI Structured Outputs Mode.

> [!NOTE]
> This article uses one or more [AI app templates](../intelligent-app-templates.md) for examples and guidance. AI app templates give you well-maintained, easy-to-deploy reference implementations, ensuring a high-quality starting point for your AI apps.

The sample provides everything you need. It includes the infrastructure and Python files to set up an Azure OpenAI `gpt-4o` model deployment. You can then use it to perform entity extraction with the Azure OpenAI structured outputs mode and the Python OpenAI SDK.

By following the instructions in this article, you will:

- Deploy a model [from the list of models supported for structured outputs](/azure/ai-services/openai/how-to/structured-outputs?tabs=python-secure#supported-models).
- Run the example Python files that use the [openai Python package](https://pypi.org/project/openai/) and [Pydantic models](https://docs.pydantic.dev/) to make requests for structured outputs.

Structured outputs in Azure OpenAI make sure the AI model's responses follow a predefined [JSON Schema](https://json-schema.org/overview/what-is-jsonschema). This feature provides several key benefits by:

1. Making sure the responses match the defined schema, reducing errors and inconsistencies.
1. Helping turn unstructured data into well-defined, structured formats, making integration with other systems easier.
1. Reducing the need for post-processing, optimizing token usage and improving efficiency.

Structured outputs are useful for function calling, extracting structured data, and building complex multi-step workflows.

Use this same general approach for entity extraction across many file types, as long as they can be represented in either a text or image form.

> [!NOTE]
> Currently structured outputs aren't supported with:
> - [Bring your own data](/azure/ai-services/openai/concepts/use-your-data) scenarios.
> - [Assistants](/azure/ai-services/openai/how-to/assistant) or [Azure AI Agents Service](/azure/ai-services/agents/overview).
> - `gpt-4o-audio-preview` and `gpt-4o-mini-audio-preview` version: `2024-12-17`.

## Architectural diagram

:::image type="content" source="../media/get-started-structured-output/architecture-diagram.png" lightbox="../media/get-started-structured-output/architecture-diagram.png" alt-text="Diagram that shows Microsoft Entra managed identity connecting to Azure AI services":::

## Cost

To keep pricing as low as possible in this sample, most resources use a Basic or Consumption pricing tier. Alter your tier as needed based on your intended usage. To stop incurring charges, delete the resources when you're done with the article.

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/azure-openai-entity-extraction#costs).

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally by using Visual Studio Code.

To use this article, you need to fulfill the following prerequisites:

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).

- Azure account permissions. Your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

#### [Visual Studio Code](#tab/visual-studio-code)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)

- Azure account permissions - Your Azure Account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

- [Azure Developer CLI](/azure/developer/azure-developer-cli)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running

- [Visual Studio Code](https://code.visualstudio.com/)

- [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 

---

## Open a development environment

Follow these instructions to set up a preconfigured development environment with all the required dependencies to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. Use GitHub Codespaces for the easiest development environment. It comes with the right developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

Use the following steps to create a new GitHub codespace on the `main` branch of the [`Azure-Samples/azure-openai-entity-extraction`](https://github.com/Azure-Samples/azure-openai-entity-extraction) GitHub repository.

1. Right-click the following button, and then select **Open link in new window**. This action makes the development environment and the documentation available for review.

    [![Button that says Open in GitHub Codespaces.](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-openai-entity-extraction)

1. On the **Create codespace** page, review the information, and then select **Create new codespace**.

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure by using the Azure Developer CLI:

    ```azdeveloper
    azd auth login --use-device-code
    ```

1. Open the URL in the terminal.
1. Copy the code from the terminal and paste it into the URL you just opened. 
1. Follow the instructions to sign in to your Azure account.

The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Create a new local directory on your computer for the project.

    ```shell
    mkdir my-structured-output-app
    ```

1. Navigate to the directory you created.

    ```shell
    cd my-structured-output-app
    ```

1. Open Visual Studio Code in that directory:

    ```shell
    code .
    ```

1. Open a new terminal in Visual Studio Code.

1. Run the following AZD command to bring the GitHub repository to your local computer.

    ```azdeveloper
    azd init -t azure-openai-entity-extraction
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.

1. Sign in to Azure with the Azure Developer CLI.

    ```azdeveloper
    azd auth login
    ```

Complete the remaining exercises in this project within this development container.

---

## Deploy and run

The sample repository has all the code and configuration files for an Azure OpenAI gpt-4o model deployment. It also performs entity extraction using Structured Outputs mode and the Python `openai` SDK. Follow these steps to go through the sample Entity extraction app Azure deployment process:

### Deploy Entity extraction app to Azure

1. Provision the OpenAI account:

    ```shell
    azd provision
    ```

1. Use the following table to answer the prompts:

    |Prompt|Answer|
    |--|--|
    |Environment name|Keep it short and lowercase. Add your name or alias. For example, `struct-output`. It's used as part of the resource group name.|
    |Subscription|Select the subscription to create the resources in. |
    |Location (for hosting)|Select a location near you from the list.|
    |Location for the OpenAI model|Select a location near you from the list. If the same location is available as your first location, select that.|

> [!NOTE]
> If you get an error or time-out during deployment, try changing the location. There might be availability constraints for the OpenAI resource. To change the location run:

>    ```shell
>    azd env set AZURE_LOCATION "yournewlocationname"
>    ```

1. Wait until app is deployed. Deployment usually takes between 5 and 10 minutes to complete.

## Run the entity extraction examples

The sample includes the following examples:

| Example walkthrough | Example filename | Description |
|---------------------|------------------|-------------|
|[Example 1](#example-1-use-a-deployed-azure-openai-resource-to-extract-information-from-an-input-string) | `basic_azure.py` | A basic example that uses a deployed Azure OpenAI resource to extract information from an input string. |
|[Example 2](#example-2-fetch-a-public-github-issue-using-the-github-api-and-then-extract-details)| `extract_github_issue.py` | This example fetches a public GitHub issue using the GitHub API and then extracts details. |
|[Example 3](#example-3-fetch-a-public-readme-using-the-github-api-and-then-extract-details)| `extract_github_repo.py`| This example fetches a public README using the GitHub API and then extracts details. |
|[Example 4](#example-4-parse-a-local-image-of-a-graph-and-extract-details-like-title-axis-and-legend)| `extract_image_graph.py`| This example parses a local image of a graph and extracts details like title, axis, legend. |
|[Example 5](#example-5-parse-a-local-image-with-tables-and-extract-nested-tabular-data)| `extract_image_table.py`| This example parses a local image with tables and extracts nested tabular data. |
|[Example 6](#example-6-parses-a-local-pdf-receipt-by-converting-to-markdown-and-then-extracting-order-details)| `extract_pdf_receipt.py` | This example parses a local PDF receipt using the `pymupdf` package to first convert it to Markdown and then extract order details. |
|[Example 7](#example-7-parse-a-blog-post-and-extract-metadata)| `extract_webpage.py` | This example parses a blog post using the `BeautifulSoup` package, and extracts metadata (title, description, and tags.). |

Run an example by either typing python `<example filename>.py` or clicking the Run button on the opened file.

## Exploring the sample code examples

This AI App Template contains several examples highlighting different structured output use cases. The next sections walk through the relevant code in each example.  

### Example 1: Use a deployed Azure OpenAI resource to extract information from an input string

This example demonstrates how to use the Azure OpenAI service to extract structured information from a text input. It sets up Azure authentication, initializes the OpenAI client, defines a Pydantic model for the expected output, sends a request to the GPT model, and validates and prints the response. This approach ensures that the extracted information is well-structured and validated, making it easier to work with in downstream applications.

#### Defining the data model

Defining a [Pydantic model](https://docs.pydantic.dev/latest/concepts/models/) ensures that the extracted information from the Azure OpenAI service is well-structured and validated. Pydantic models provide a clear schema for the expected output, which helps in:

1. Ensuring the extracted data matches the expected types and formats.
1. Reducing errors and inconsistencies by enforcing a predefined structure.
1. Making it easier to work with the extracted data in other applications by providing a clear and consistent data model.
1. Helping integrate with other systems by converting unstructured data into well-defined, structured formats.

#### `CalendarEvent` model definition

The `CalendarEvent` model is a Pydantic model that defines the structure of the expected output from the GPT model.

```python
class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]
```

- `name`: The event's name.
- `date`: The event's date.
- `participants`: A list of the event's participants.

#### How `CalendarEvent` is used in the call to the model

The `CalendarEvent` model specifies the expected response format when sending a request to the GPT model. This approach makes sure the extracted information follows a specific schema.

The following code snippet sends a request to the GPT model using the `CalendarEvent` for the response:

```python
completion = client.beta.chat.completions.parse(
    model=os.getenv("AZURE_OPENAI_GPT_DEPLOYMENT"),
    messages=[
        {"role": "system", "content": "Extract the event information."},
        {"role": "user", "content": "Alice and Bob are going to a science fair on Friday."},
    ],
    response_format=CalendarEvent,
)
```

**client.beta.chat.completions.parse**: Sends a request to the GPT model to parse the input text and extract information.

- **model**: The GPT model to use.
- **messages**: A list of messages for the model. The system message gives instructions, and the user message has the image URL.
- **response_format**: The expected response format using the `CalendarEvent` model.

#### Parsing and validating the response

The following code snippet handles the response from the GPT model. It first extracts the message from the response. Then, it checks if the model refused to process the request. If there's a refusal, it prints the refusal message. Otherwise, it prints the parsed response, which contains the structured information extracted. This approach ensures that the script can handle both successful and unsuccessful responses from the GPT model.

```python
message = completion.choices[0].message
if (message.refusal):
    rich.print(message.refusal)
else:
    rich.print(message.parsed)
```

#### Why checking for refusal is important

1. **Error Handling**: The code checks if the GPT model refused to process the request. If it did, it prints the refusal message. This approach helps the user understand the issue and improve the input data or request format.

1. **Validation of Extracted Data**: The code prints the parsed response to show the extracted information in a readable format. This approach helps verify that the data matches the expected structure defined by the `CalendarEvent` model.

1. **User Feedback**: The code provides feedback about the success or failure of the extraction process. This approach helps users understand if the extraction was successful or if there were issues to address.

1. **Structured Output**: Using structured outputs ensures the extracted data follows a predefined schema. This approach makes it easier to work with the data in other applications, providing type safety and readability.

### Example 2: Fetch a public GitHub issue using the GitHub API and then extract details

This example shows how to use the Azure OpenAI service to extract structured information from a GitHub issue. This walkthrough focuses only on the example code dealing with structured output.

#### Defining the `Issue` model

The `Issue` model is a Pydantic model that defines the structure of the expected output from the GPT model.

```python
class Issue(BaseModel):
    title: str
    description: str = Field(..., description="A 1-2 sentence description of the project")
    type: IssueType
    operating_system: str
```

- **title**: The issue's title.
- **description**: A brief description of the issue.
- **type**: The type of issue from the `IssueType` enumeration.
- **operating_system**: The operating system related to the issue.

#### `IssueType` Enumeration Definition

The `IssueType` Python class is an enumeration that defines possible values for the type of issue (for example, Bug Report, Feature, Documentation, Regression).

```python
class IssueType(str, Enum):
    BUGREPORT = "Bug Report"
    FEATURE = "Feature"
    DOCUMENTATION = "Documentation"
    REGRESSION = "Regression"
```

#### Relationship between `Issue` and `IssueType`

The `Issue` model uses the `IssueType` enumeration to ensure that the `type` field contains only valid values. This relationship enforces consistency and validation in the extracted data.


> [!NOTE]
> While Example 1 focuses on a simple text input and uses a basic `CalendarEvent` Pydantic model, Example 2 introduces a more complex `Issue` model with enumerations for issue types. This approach ensures the extracted information follows specific types and values. It shows how to handle more detailed and varied data while keeping the structured output approach from Example 1.

#### Fetching the GitHub Issue

The following code snippet fetches the issue from a specified GitHub repository.

```python
url = "https://api.github.com/repos/Azure-Samples/azure-search-openai-demo/issues/2231"
response = requests.get(url)
if response.status_code != 200:
    logging.error(f"Failed to fetch issue: {response.status_code}")
    exit(1)
issue_body = response.json()["body"]
```

- **requests.get**: Sends a GET request to fetch the issue from the GitHub API.
- **response.status_code**: Checks if the request was successful.
- **issue_body**: Extracts the body of the issue from the JSON response.

#### How `Issue` Is Used in the Call to the Model

The `Issue` model is used to specify the expected response format when sending a request to the GPT model. This approach makes sure the extracted information follows a specific schema.

#### Sending a Request to the GPT Model

```python
completion = client.beta.chat.completions.parse(
    model=model_name,
    messages=[
        {"role": "system", "content": "Extract the info from the GitHub issue markdown."},
        {"role": "user", "content": issue_body},
    ],
    response_format=Issue,
)
```

- **model**: The GPT model to use.
- **messages**: A list of messages for the model. The system message gives instructions, and the user message has the image URL.
- **response_format**: The expected response format using the `Issue` model.

#### Parsing and validating the response

The following code snippet handles the response from the GPT model. It first extracts the message from the response. Then, it checks if the model refused to process the request. If there's a refusal, it prints the refusal message. Otherwise, it prints the parsed response, which contains the structured information extracted. This approach ensures that the script can handle both successful and unsuccessful responses from the GPT model.

```python
message = completion.choices[0].message
if (message.refusal):
    print(message.refusal)
else:
    print(message.parsed)
```

- **message**: Extracts the message from the first choice in the response.
- **message.refusal**: Checks if the GPT model refused to process the request.
- **print(message.refusal)**: Prints the refusal message if the model refused the request.
- **print(message.parsed)**: Prints the parsed response if the extraction was successful.

### Example 3: Fetch a public README using the GitHub API and then extract details

This example shows how to use the Azure OpenAI service to get structured information from a GitHub repository's README file. This walkthrough focuses only on the example code dealing with structured output.

#### How `RepoOverview` Uses the Other Defined Models

The `RepoOverview` model uses the `Language`, `AzureService`, and `Framework` enumerations to define a structured and validated schema for the extracted information. This model is used in the call to the GPT model to ensure that the response adheres to the expected format, providing type safety, validation, and readability. The script then parses, validates, and prints the extracted information, making it easy to work with in downstream applications.

#### `RepoOverview` Model Definition

The `RepoOverview` model is a Pydantic model that defines the structure of the expected output from the GPT model. It uses the other defined models (`Language`, `AzureService`, and `Framework`) to ensure that the extracted information adheres to specific enumerations and types.

```python
class RepoOverview(BaseModel):
    name: str
    description: str = Field(..., description="A 1-2 sentence description of the project")
    languages: list[Language]
    azure_services: list[AzureService]
    frameworks: list[Framework]
```

- **name**: A string representing the name of the repository.
- **description**: A string providing a brief description of the project.
- **languages**: A list of `Language` enumeration values, representing the programming languages used in the project.
- **azure_services**: A list of `AzureService` enumeration values, representing the Azure services used in the project.
- **frameworks**: A list of `Framework` enumeration values, representing the frameworks used in the project.

#### Enumerations Used in `RepoOverview`

- **Language**: Defines possible values for programming languages.

  ```python
  class Language(str, Enum):
      JAVASCRIPT = "JavaScript"
      PYTHON = "Python"
      DOTNET = ".NET"
  ```

- **AzureService**: Defines possible values for Azure services.

  ```python
  class AzureService(str, Enum):
      AIFOUNDRY = "AI Foundry"
      AISEARCH = "AI Search"
      POSTGRESQL = "PostgreSQL"
      COSMOSDB = "CosmosDB"
      AZURESQL = "Azure SQL"
  ```

- **Framework**: Defines possible values for frameworks.

  ```python
  class Framework(str, Enum):
      LANGCHAIN = "Langchain"
      SEMANTICKERNEL = "Semantic Kernel"
      LLAMAINDEX = "Llamaindex"
      AUTOGEN = "Autogen"
      SPRINGBOOT = "Spring Boot"
      PROMPTY = "Prompty"
  ```

> [!NOTE]
> Example 3 builds on Example 2 by introducing more complex models (`RepoOverview`) and enumerations (`Language`, `AzureService`, `Framework`) to ensure that the extracted information follows specific types and values. Example 3 shows how to handle more detailed and varied data while keeping the structured output approach from Example 2.

#### How `RepoOverview` is used in the call to the model

The `RepoOverview` model specifies the expected response format when sending a request to the GPT model. This approach makes sure the extracted information follows a specific schema.

- **model**: The GPT model to use.
- **messages**: A list of messages for the model. The system message gives instructions, and the user message has the image URL.
- **response_format**: The expected response format using the `RepoOverview` model.

```python
completion = client.beta.chat.completions.parse(
    model=model_name,
    messages=[
        {
            "role": "system",
            "content": "Extract the information from the GitHub issue markdown about this hack submission.",
        },
        {"role": "user", "content": readme_content},
    ],
    response_format=RepoOverview,
)
```

#### Parsing and validating the response

The following code snippet handles the response from the GPT model. It first extracts the message from the response. Then, it checks if the model refused to process the request. If there's a refusal, it prints the refusal message. Otherwise, it prints the parsed response, which contains the structured information extracted. This approach ensures that the script can handle both successful and unsuccessful responses from the GPT model.

```python
message = completion.choices[0].message
if (message.refusal):
    print(message.refusal)
else:
    print(message.parsed)
```

- **message**: Extracts the message from the first choice in the response.
- **message.refusal**: Checks if the GPT model refused to process the request.
- **print(message.refusal)**: Prints the refusal message if the model refused the request.
- **print(message.parsed)**: Prints the parsed response if the extraction was successful.

### Example 4: Parse a local image of a graph and extract details like title, axis, and legend

This example shows how to use the Azure OpenAI service to get structured information from an image of a graph. The `Graph` model defines the expected output structure, making sure the data is well-structured and validated. The script converts the image to a base64-encoded URI, sends it to the GPT model, and checks the response against the `Graph` model. This approach ensures the information is reliable and easy to work with, providing type safety and readability.

#### Defining the `Graph` model

The `Graph` model is a Pydantic model that defines the structure of the expected output from the GPT model.

```python
class Graph(BaseModel):
    title: str
    description: str = Field(..., description="1 sentence description of the graph")
    x_axis: str
    y_axis: str
    legend: list[str]
```

- **title**: A string that shows the title of the graph.
- **description**: A string that gives a brief description of the graph.
- **x_axis**: A string that shows the label of the x-axis.
- **y_axis**: A string that shows the label of the y-axis.
- **legend**: A list of strings that shows the legend entries of the graph.

> [!NOTE]
> Using images as input needs extra steps for encoding and specifying the content type, but the overall process is similar to using text for structured output.

#### Preparing the image for input

To use an image as input for structured output, the script converts the image to a base64-encoded URI. This approach allows the image to be sent as part of the request to the GPT model.

```python
def open_image_as_base64(filename):
    with open(filename, "rb") as image_file:
        image_data = image_file.read()
    image_base64 = base64.b64encode(image_data).decode("utf-8")
    return f"data:image/png;base64,{image_base64}"

image_url = open_image_as_base64("example_graph_treecover.png")
```

- **open_image_as_base64**: A function that reads an image file, encodes it in base64, and returns it as a data URI.
- **image_url**: The base64-encoded URI of the image, used as input for the GPT model.

> [!NOTE]
> Example 4 builds on Example 3 by extending the concept of extracting structured information from text sources to extracting details from images. Example 4 shows how to handle visual data by converting a graph image to a base64-encoded URI and sending it to the GPT model. Example 4 introduces the `Graph` Pydantic model to make sure the extracted information from the image is well-structured and validated, similar to the approach used for text in Example 3.

#### Sending a request to the GPT model

The script sends a request to the GPT model to extract information from the image using structured outputs. The `Graph` model is specified as the expected response format. This approach makes sure the extracted information follows a specific schema.

```python
completion = client.beta.chat.completions.parse(
    model=model_name,
    messages=[
        {"role": "system", "content": "Extract the information from the graph"},
        {
            "role": "user",
            "content": [
                {"image_url": {"url": image_url}, "type": "image_url"},
            ],
        },
    ],
    response_format=Graph,
)
```

- **model**: The GPT model to use.
- **messages**: A list of messages for the model. The system message gives instructions, and the user message has the image URL.
- **response_format**: The expected response format using the `Graph` model.

#### Using images for input vs. using text

Using images as input for structured output differs from using text in several ways:

1. **Input Format**: Images need to be converted to a base64-encoded URI before being sent to the GPT model, whereas text can be sent directly.
2. **Content Type**: The content type for images is specified as `image_url`, while text is sent as plain text.
3. **Processing**: The GPT model processes images differently from text, extracting visual information and converting it into structured data based on the provided schema.

#### Parsing and validating the response

The following code snippet handles the response from the GPT model. It first extracts the message from the response. Then, it checks if the model refused to process the request. If there's a refusal, it prints the refusal message. Otherwise, it prints the parsed response, which contains the structured information extracted. This approach ensures that the script can handle both successful and unsuccessful responses from the GPT model.

```python
message = completion.choices[0].message
if (message.refusal):
    print(message.refusal)
else:
    print(message.parsed)
```

- **message**: Extracts the message from the first choice in the response.
- **message.refusal**: Checks if the GPT model refused to process the request.
- **print(message.refusal)**: Prints the refusal message if the model refused the request.
- **print(message.parsed)**: Prints the parsed response if the extraction was successful.

### Example 5: Parse a local image with tables and extract nested tabular data

This example shows how to use the Azure OpenAI service to extract structured information from an image of a table. The example converts the image to a base64-encoded URI, sends it to the GPT model, and validates the response against the `PlantInventory` model. The `Plant` and `PlantInventory` models define the expected output structure, ensuring that the extracted data is well-structured and validated.

#### Defining the `Plant` and `PlantInventory` models

The `Plant` and `PlantInventory` models are Pydantic models that define the structure of the expected output from the GPT model. This approach makes sure the extracted information follows a specific schema.

- **Plant**: Represents individual plant entries with fields for species, common name, quantity, size, price, county, and notes.

    ```python
    class Plant(BaseModel):
        species: str
        common_name: str
        quantity: int
        size: str
        price: float
        county: str
        notes: str
    ```
    
    - **species**: The plant's species.
    - **common_name**: The plant's common name.
    - **quantity**: The number of plants.
    - **size**: The plant's size.
    - **price**: The plant's price.
    - **county**: The county where the plant is located.
    - **notes**: Any other notes about the plant.

- **PlantInventory**: Represents the overall inventory, categorizing plants into lists of annuals, bulbs, and grasses.

    ```python
    class PlantInventory(BaseModel):
        annuals: list[Plant]
        bulbs: list[Plant]
        grasses: list[Plant]
    ```

    - **annuals**: A list of `Plant` objects that are annuals.
    - **bulbs**: A list of `Plant` objects that are bulbs.
    - **grasses**: A list of `Plant` objects that are grasses.

#### How `PlantInventory` Uses the `Plant` Model

The `PlantInventory` model groups multiple `Plant` objects into lists. Each category (annuals, bulbs, grasses) is a list of `Plant` objects. This structure helps the example organize and check the plant data.

#### Preparing the Image for Input

To use an image as input, the following code snippet converts the image to a base64-encoded URI. This approach lets the image be sent in the request to the GPT model.

```python
def open_image_as_base64(filename):
    with open(filename, "rb") as image_file:
        image_data = image_file.read()
    image_base64 = base64.b64encode(image_data).decode("utf-8")
    return f"data:image/png;base64,{image_base64}"

image_url = open_image_as_base64("example_table_plants.png")
```

- **open_image_as_base64**: A function that reads an image file, encodes it in base64, and returns it as a data URI.
- **image_url**: The base64-encoded URI of the image, used as input for the GPT model.

> [!NOTE]
> Example 5 shows how to extract structured information from an image of a table. It introduces the `Plant` and `PlantInventory` Pydantic models to define the expected output structure, ensuring the extracted data is well-organized and validated. This approach shows how to handle more detailed and nested data while keeping the structured output method used in Example 4.

#### Using the models in the call to the GPT model

The following code snippet sends a request to the GPT model to extract information from an image of a table using structured outputs. The `PlantInventory` model is specified as the expected response format, which ensures that the extracted data is structured according to the defined schema.

#### Sending a request to the GPT model

```python
completion = client.beta.chat.completions.parse(
    model=model_name,
    messages=[
        {"role": "system", "content": "Extract the information from the table"},
        {
            "role": "user",
            "content": [
                {"image_url": {"url": image_url}, "type": "image_url"},
            ],
        },
    ],
    response_format=PlantInventory,
)
```

- **model**: The GPT model to use.
- **messages**: A list of messages for the model. The system message gives instructions, and the user message has the image URL.
- **response_format**: The expected response format using the `PlantInventory` model.

#### Parsing and validating the response

The following code snippet handles the response from the GPT model. It first extracts the message from the response. Then, it checks if the model refused to process the request. If there's a refusal, it prints the refusal message. Otherwise, it prints the parsed response, which contains the structured information extracted. This approach ensures that the script can handle both successful and unsuccessful responses from the GPT model.

```python
message = completion.choices[0].message
if (message.refusal):
    print(message.refusal)
else:
    print(message.parsed)
```

- **message**: Extracts the message from the first choice in the response.
- **message.refusal**: Checks if the GPT model refused to process the request.
- **print(message.refusal)**: Prints the refusal message if the model refused the request.
- **print(message.parsed)**: Prints the parsed response if the extraction was successful.
 
### Example 6: Parses a local PDF receipt by converting to Markdown and then extracting order details

This example shows how to use the Azure OpenAI service to extract structured information from a PDF receipt. The `Item` and `Receipt` models define the expected output structure, ensuring the data is well-structured and validated. The example converts the PDF to markdown text, sends it to the GPT model, and checks the response against the `Receipt` model. Using PDF files as input needs extra steps for content extraction and conversion, but the process is similar to using text for structured output.

#### Extracting from PDF files

Similar to using images as input, you extract the PDF as text. You can use a hosted service like [Azure Document Intelligence](/azure/ai-services/document-intelligence/overview?view=doc-intel-4.0.0) or a local Python package like [pymupdf](https://pymupdf.readthedocs.io/en/latest/pymupdf4llm/index.html#).

#### Using PDF Files for input vs. using text

Using PDF files as input for structured output differs from using text in several ways:

1. **Input Format**: Convert PDF files to markdown text before sending them to the GPT model. Text can be sent directly.
2. **Content Extraction**: Extract and convert the PDF content to markdown text that the GPT model can process.
3. **Processing**: The GPT model processes the extracted text from the PDF and converts it into structured data based on the provided schema.

#### Defining the `Item` and `Receipt` models

The `Item` and `Receipt` models are Pydantic models that define the structure of the expected output from the GPT model. This approach makes sure the extracted information follows a specific schema.

- **Item**: Represents individual items on the receipt with fields for product name, price, and quantity.

    ```python
    class Item(BaseModel):
        product: str
        price: float
        quantity: int
    ```

    - **product**: The name of the product.
    - **price**: The price of the product.
    - **quantity**: The quantity of the product.

- **Receipt**: Represents the overall receipt, including fields for total amount, shipping cost, payment method, a list of items, and the order number. The `Receipt` model uses the `Item` model to represent a structured receipt with detailed information about each item.

    ```python
    class Receipt(BaseModel):
        total: float
        shipping: float
        payment_method: str
        items: list[Item]
        order_number: int
    ```

    - **total**: The total amount of the receipt.
    - **shipping**: The shipping cost.
    - **payment_method**: The payment method used.
    - **items**: A list of `Item` objects on the receipt.
    - **order_number**: The order number.

> [!NOTE]
> Example 6 builds on Example 5 by extending the concept of extracting structured information from images to handling PDF files. Example 6 shows an extra step converting the PDF file to markdown text as input to the GPT model, while keeping the structured output method used in Example 5.

#### Using the Models in the Call to the GPT Model

The example sends a request to the GPT model to extract information from a PDF receipt using structured outputs. The `Receipt` model is specified as the expected response format, which ensures that the extracted data is structured according to the defined schema.

```python
completion = client.beta.chat.completions.parse(
    model=model_name,
    messages=[
        {"role": "system", "content": "Extract the information from the receipt"},
        {"role": "user", "content": md_text},
    ],
    response_format=Receipt,
)
```

- **model**: The GPT model to use.
- **messages**: A list of messages for the model. The system message gives instructions, and the user message has the image URL.
- **response_format**: The expected response format using the `Receipt` model.

#### Parsing and validating the response

The following code snippet handles the response from the GPT model. It first extracts the message from the response. Then, it checks if the model refused to process the request. If there's a refusal, it prints the refusal message. Otherwise, it prints the parsed response, which contains the structured information extracted. This approach ensures that the script can handle both successful and unsuccessful responses from the GPT model.

```python
message = completion.choices[0].message
if (message.refusal):
    print(message.refusal)
else:
    print(message.parsed)
```

- **message**: Extracts the message from the first choice in the response.
- **message.refusal**: Checks if the GPT model refused to process the request.
- **print(message.refusal)**: Prints the refusal message if the model refused the request.
- **print(message.parsed)**: Prints the parsed response if the extraction was successful.

### Example 7: Parse a blog post and extract metadata

This example shows how to use the Azure OpenAI service to extract structured information from a blog post. The `BlogPost` model defines the expected output structure, ensuring the extracted data is well-structured and validated. The example fetches the webpage, extracts the relevant content, sends it to the GPT model, and validates the response against the `BlogPost` model.

#### Using Web Pages for input vs. using text

Using web pages as input for structured output differs from using text in several ways:

1. **Input Format**: Fetch and parse web pages to extract relevant content before sending them to the GPT model. Text can be sent directly.
2. **Content Extraction**: Extract and convert the webpage content to a text format that the GPT model can process.
3. **Processing**: The GPT model processes the extracted text from the webpage and converts it into structured data based on the provided schema.

#### Defining the `BlogPost` model

The `BlogPost` model is a Pydantic model that defines the structure of the expected output from the GPT model. This approach makes sure the extracted information follows a specific schema.

```python
class BlogPost(BaseModel):
    title: str
    summary: str = Field(..., description="A 1-2 sentence summary of the blog post")
    tags: list[str] = Field(..., description="A list of tags for the blog post, like 'python' or 'openai'")
```

- **title**: The blog post's title.
- **summary**: A brief summary of the blog post.
- **tags**: Tags associated with the blog post.

#### Preparing the Webpage for input

To use a webpage as input for structured output, the following code snippet fetches the webpage content and extracts the relevant parts (title and body) using the BeautifulSoup Python library. This process prepares the content of the webpage to be sent to the GPT model.

```python
url = "https://blog.pamelafox.org/2024/09/integrating-vision-into-rag-applications.html"
response = requests.get(url)
if response.status_code != 200:
    print(f"Failed to fetch the page: {response.status_code}")
    exit(1)
soup = BeautifulSoup(response.content, "html.parser")
post_title = soup.find("h3", class_="post-title")
post_contents = soup.find("div", class_="post-body").get_text(strip=True)
```

- **requests.get**: Sends a GET request to fetch the webpage content.
- **BeautifulSoup**: Parses the HTML content of the webpage.
- **post_title**: Extracts the title of the blog post.
- **post_contents**: Extracts the body of the blog post."

> [!NOTE]
> Example 7 builds on Example 6 by extending the concept of extracting structured information from PDFs to handling web pages. This approach shows how to handle web content by parsing the webpage with BeautifulSoup. Then the parsed content is sent to the GPT model and returns structured output as the `BlogPost` model.

#### Using `BlogPost` in the call to the model

The following code snippet sends a request to the GPT model to extract information from the prepared web page text (`post_title` and `post_contents`) using structured outputs. The `BlogPost` model is specified as the expected response format, which ensures that the extracted data is structured according to the defined schema.

```python
completion = client.beta.chat.completions.parse(
    model=model_name,
    messages=[
        {"role": "system", "content": "Extract the information from the blog post"},
        {"role": "user", "content": f"{post_title}\n{post_contents}"},
    ],
    response_format=BlogPost,
)
```

- **model**- **model**: The GPT model to use.
- **messages**: A list of messages for the model. The system message gives instructions, and the user message has the image URL.
- **response_format**: The expected response format using the `BlogPost` model.

#### Parsing and validating the response

The following code snippet handles the response from the GPT model. It first extracts the message from the response. Then, it checks if the model refused to process the request. If there's a refusal, it prints the refusal message. Otherwise, it prints the parsed response, which contains the structured information extracted. This approach ensures that the script can handle both successful and unsuccessful responses from the GPT model.

```python
message = completion.choices[0].message
if (message.refusal):
    print(message.refusal)
else:
    print(message.parsed)
```

- **message**: Extracts the message from the first choice in the response.
- **message.refusal**: Checks if the GPT model refused to process the request.
- **print(message.refusal)**: Prints the refusal message if the model refused the request.
- **print(message.parsed)**: Prints the parsed response if the extraction was successful.

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

1. Locate your currently running codespace sourced from the [`Azure-Samples//azure-openai-entity-extraction`](https://github.com/Azure-Samples/azure-openai-entity-extraction) GitHub repository.

1. Open the context menu for the codespace and select **Delete**.

#### [Visual Studio Code](#tab/visual-studio-code)

Stop the running development container and return to running Visual Studio Code in the context of a local workspace.

Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

> [!TIP]
> After Visual Studio Code stops the running development container, the container still exists in Docker in a stopped state. You can delete the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

Log your issue to the repository's [issues page](https://github.com/Azure-Samples/azure-openai-entity-extraction/issues).

## Resources

- [How to use structured outputs](/azure/ai-services/openai/how-to/structured-outputs?tabs=python-secure#supported-models)