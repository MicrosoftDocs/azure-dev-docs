---
title: "Walkthrough, Part 4: Authenticate Python apps with Azure services"
description: An overview of the main app's implementation, including all its code.
ms.date: 08/24/2020
ms.topic: conceptual
---

# Part 4: Example main application implementation

[Previous part: Example third-party API implementation](walkthrough-tutorial-authentication-03.md)

The main app in our scenario is a simple Flask app that's deployed to Azure App Service. The app provides a public API endpoint named */api/v1/getcode*, which generates a code for some other purpose in the app (say, with two-factor authentication for human users).

To see the endpoint in action, visit [https://msdocs-main-app-example.azurewebsites.net/api/v1/getcode](https://msdocs-main-app-example.azurewebsites.net/api/v1/getcode) in a browser or make a request using curl.

The main app also provides a simple home page that displays a link to the API endpoint. You can see this part of the app on [https://msdocs-main-app-example.azurewebsites.net](https://msdocs-main-app-example.azurewebsites.net).

The sample's provisioning script performs the following steps:

1. Create the App Service host and deploy the code with the Azure CLI command, [`az webapp up`](/cli/azure/webapp?view=azure-cli-latest#az-webapp-up).

1. Provision an Azure Storage account for the main app (using [`az storage account create`](/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create)).

1. Create a Queue in the storage account named "code-requests" (using [`az storage queue create`](/cli/azure/storage/queue?view=azure-cli-latest#az-storage-queue-create)).

1. To ensure that the app is allowed to write to the queue, use [`az role assignment create`](/cli/azure/role/assignment?view=azure-cli-latest#az-role-assignment-create) to assign the "Storage Queue Data Contributor" role to the app. For more information about roles, see [How to assign role permissions](how-to-assign-role-permissions.md).

The main app code is as follows; explanations of important details are given in the next parts of this series.

```python
from flask import Flask, request, jsonify
import requests, random, string, os
from datetime import datetime
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from azure.storage.queue import QueueClient

app = Flask(__name__)

# Retrieve the URL of the third-party API endpoint we invoke.
number_url = os.environ["THIRD_PARTY_API_ENDPOINT"]

# Authenticate with Azure. First, obtain the credential object. To run locally,
# you must have the necessary environment variables set up to provide the
# local service principal information. When deployed to the cloud, the app must
# have managed identity enabled in Azure App Service.
credential = DefaultAzureCredential()

# Next, get a client object for the Key Vault. The client object is strictly
# a client-side construct provided by the Azure libraries as a layer on top
# of the Azure REST API.
key_vault_url = os.environ["KEY_VAULT_URL"]
keyvault_client = SecretClient(vault_url=key_vault_url, credential=credential)

# Obtain the secret: for this step to work you must add the app's identity to
# the key vault's access policies for secret management. When deployed to the cloud
# the identity is the name of the app in App Service; when running locally, the
# identity is the local service principal.
api_secret_name = os.environ["THIRD_PARTY_API_SECRET_NAME"]
vault_secret = keyvault_client.get_secret(api_secret_name)

# The "secret" from Key Vault is an object with multiple properties. The access key
# we want for the third-party API is in the secret's value property.
access_key = vault_secret.value

#Set up the Storage queue client to which we write messages
queue_url = os.environ["STORAGE_QUEUE_URL"]
queue_client = QueueClient.from_queue_url(queue_url=queue_url, credential=credential)


@app.route('/', methods=['GET'])
def home():
    return f'Home page of the main app. Make a request to <a href="./api/v1/getcode">/api/v1/getcode</a>.'


def random_char(num):
       return ''.join(random.choice(string.ascii_letters) for x in range(num))


@app.route('/api/v1/getcode', methods=['GET'])
def get_code():
    headers = {
        'Content-Type': 'application/json',
        'x-functions-key': access_key
        }

    r = requests.get(url = number_url, headers = headers)

    if (r.status_code != 200):
        return "Could not get you a code.", r.status_code

    data = r.json()
    chars1 = random_char(3)
    chars2 = random_char(3)
    code_value = f"{chars1}-{data['value']}-{chars2}"
    code = { "code": code_value, "timestamp" : str(datetime.utcnow()) }

    # Log a queue message with the code for, say, a process that invalidates
    # the code after a certain period of time.
    queue_client.send_message(code)

    return jsonify(code)


if __name__ == '__main__':
    app.run()
```

> [!div class="nextstepaction"]
> [Part 5 - Main app dependencies, imports, and environment variables >>>](walkthrough-tutorial-authentication-05.md)
