---
title: "Tutorial: Process JSON Data for a Python ETL Solution on Azure"
description: In this article, you'll process JSON data for a Python ETL Solution on Azure
services: python, azure-functions, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Tutorial: Use an Azure Function to process data with Python on Azure

In this tutorial, you'll create a local [Azure Function](/products/functions/) in Python that responds to an Azure Blob Storage Trigger. The Azure Function uses the various Python libraries to clean and normalize the news articles results data stored as a JSON file in [Azure Blob Storage](/products/storage/blobs/).

:::image type="content" source="./media/tutorial-deploy-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" border="false":::

## 1. Create a local BlobTrigger Azure Function

### [Azure portal](#tab/azure-portal)

Python functions can be created in an Azure Function App in the Azure portal or created locally, then publish to Azure. For this tutorial series, we'll start with creating an Azure Function within a local function project using Visual Studio Code or Azure CLI. Later in this series we'll deploy the functions to Azure.

### [Visual Studio Code](#tab/vscode)

To sign in to your Azure Account, **press F1** and type in **Azure: Sign in** (or select on the Sign-in to Azure... node in the Explorer).

:::row:::
    :::column:::
        **Step 1.** Create new local Azure Function in the Visual Studio Code workspace.
        1. Choose the **Azure icon** in the **Activity bar**.
        1. In the **Workspace (local) area**, select the **+ button**.
        1. Choose **Create Function** in the dropdown.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-create-new-function.png" alt-text="A screenshot showing how to create a new local function project in Visual Studio Code." lightbox="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-create-new-function.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.**  Enter the following information at the prompts:
        1. **Select a language**: Choose `Python`.
        1. **Select a Python interpreter to create a virtual environment**: Choose your *preferred Python interpreter*. If an option isn't shown, type in the full path to your Python binary.
        1. **Select a template for your project's first function**: Choose `Azure blob storage trigger`.
        1. **Provide a function name**: Enter `msdocs-cloud-python-etl-blobtrigger`.
        1. **Authorization level**: Choose `Function`.  For more information about the authorization level, see [Authorization keys](/azure/azure-functions/functions-bindings-http-webhook-trigger#authorization-keys).
        1. **Select how you would like to open your project**: Choose `Add to workspace`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-create-blobtrigger-function.gif" alt-text="Animated screenshot showing how to configure the new local function in Visual Studio Code." lightbox="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-create-blobtrigger-function.gif":::
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

**Step 1.** Run the `func init` command to create a functions project in a folder named **MSDocsCloudPythonETLProj** with the specified runtime and navigate to the directory.

**Step 2.** Navigate to the local Azure Function project and add a function to your project by running the `func new`. Enter a unique value for the `--name` parameter and set how the function will be triggered with the `--template` parameter.

```bash
cd MSDocsCloudPythonETLProj

func new --name msdocs-cloud-python-etl-blobtrigger --template "azure blob storage trigger" --authlevel "function"
```

---

## 2. Define data cleansing python functions

In the local BlobTrigger Azure Function, create a new function definition to cleanse the news search results data and filters data features from the JSON blob file.

```python
import html
import BeautifulSoup

# Strip HTML tags from a string.
def remove_html_tags(html_text):
    logging.info(f"Remove HTML tags from Bing News Search result.")
    return html.escape(re.compile(r'<[^>]+>').sub('', str(html_text)))

# Get all text of a news article, with the assumption that most of the 
# article text will use the <p> (paragraph) HTML tag.
def get_html_text(page_html):
    soup = BeautifulSoup(page_html, 'html.parser')
    text = soup.find_all('p', text=True)
    text = remove_html_tags(str(text))
    return text
```

## 3. Add data normalization function

The text data in the Bing News result set can be used to analyze and solve business problems. However, it's important to pre-process the data prior to using the data for analysis or prediction.

In the same local BlobTrigger Azure Function, create a new function definition to normalize the article content text news search results data from the Blob.

```python
import re
import json

def normalize_text(text_string):
    # Case conversion: Convert all letters of the string in the column to one case(lowercase).
    lower_string = text_string.lower()
    
    # remove numbers: If numbers are essential to convert to words else remove all numbers
    no_number_string = re.sub(r'\d+','',lower_string)
    
    # remove all punctuation except words and space
    no_punc_string = re.sub(r"(@\[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)|^rt|http.+?", "",no_number_string)
    
    # remove white spaces: Returns a copy of the string with both leading and trailing characters removed
    no_wspace_string = no_punc_string.strip()

    # decode unicode to properly handle special characters
    json_bytes = no_wspace_string.encode()
    json_str_decoded = json.dumps(json_bytes.decode('utf-8', errors='ignore'))

    return json_str_decoded
```

## 4. Modify the Main function

Modify the main function definition in the same local Azure Function to call each new function.

```python
import requests
import azure.functions as func
from azure.identity import DefaultAzureCredential

def main(myblob: func.InputStream):

    logging.info(f"Python blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")

    default_credential = DefaultAzureCredential(additionally_allowed_tenants=['*'])

    logging.info(f"Start processing Bing News Search results for '{myblob.name}'.")

    search_results_blob_str = myblob.read()
    blob_json = search_results_blob_str.decode("utf-8").replace("'", '"')
    data = json.loads(blob_json)

    json_str = ''

    for item in data:
        article_url = item['url']
        article_title = remove_html_tags(item['name'])
        article_descr = remove_html_tags(item['description'])
        article_text = get_html_text(requests.get(article_url).content)
        article_text = remove_html_tags(article_text)
        article_text_norm = normalize_text(article_text)
        json_str += '{"url": "' + article_url + '","title":"' + article_title + '","description":"' + article_descr + '","text":"'+ article_text + '","normalized_text":"' + article_text_norm + '"},'

    json_str = json_str.rstrip(json_str[-1])
    json_str = '{"values":[' + json_str + ']}'

    logging.info(f"Successfully processed Bing News Search results for '{myblob.name}'.")
```

## 5. Test the Azure blob storage trigger Function

To properly test the local Azure Storage Blob Trigger function, the Azure HTTP Trigger function must be executed first. Since the Azure HTTP Trigger function creates and uploads the results file to Azure Blob Storage, the Blob Trigger function will execute automatically.

**Step 1.**  Test running the Azure Storage Blob Trigger function locally by pressing `F5` or the play icon while in the editor window of the **__init__.py** file.

:::image type="content" source="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-test-blobtrigger-function.png" alt-text="A screenshot showing how to build and run the functions in Visual Studio Code." lightbox="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-test-blobtrigger-function.png":::

**Step 2.** Execute the function locally.

1. Choose the **Azure icon** in the **Activity bar**.
1. In the **Workspace area**, expand **Local Project** then **Functions**.
1. Right-click (Windows) or Ctrl + Select (macOS) the **msdocs-cloud-python-etl-HttpTrigger** function.
1. Choose **Execute Function Now**.
1. At the prompt, enter the request message body value `{ "search_term": "Azure"}` and press Enter.

:::image type="content" source="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-test-process-blobtrigger-function.gif" alt-text="Animated screenshot of testing the BlobTrigger Azure Function in Visual Studio." lightbox="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-test-process-blobtrigger-function.gif":::

**Step 3.** Review the logging output in the **Terminal** window. You'll see the Blob Trigger function execute after the JSON file was uploaded from the HTTP Trigger.

:::image type="content" source="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-output-blobtrigger-function.png" alt-text="A screenshot showing the logging output of both local functions in Visual Studio Code." lightbox="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-vscode-output-blobtrigger-function.png":::

## Next step

> [!div class="nextstepaction"]
> [Serve Data](tutorial-deploy-azure-cloud-python-etl-05-serve-data.md)
