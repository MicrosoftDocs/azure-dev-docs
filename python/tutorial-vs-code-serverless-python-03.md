---
title: Examine the Python code files for Azure Functions in Visual Studio Code
description: Tutorial part 3, understanding the template Python code provided by Azure Functions.
services: functions
author: kraigb
manager: barbkess
ms.service: azure-functions
ms.topic: conceptual
ms.date: 00/02/2019
ms.author: kraigb
---

# Examine the code files

[Previous step: create the function](tutorial-vs-code-serverless-python-02.md)

In the newly created function subfolder are three files: *\_\_init\_\_.py* contains the function's code, *function.json* describes the function to Azure Functions, and *sample.dat* is a sample data file. You can delete *sample.dat* if you want, as it exists only to show that you can add other files to the subfolder.

Let's look at *function.json* first, then the code in *\_\_init\_\_.py*.

## function.json

The function.json file provides the necessary configuration information for the Azure Functions endpoint:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

The `scriptFile` property identifies the startup file for the code, and that code must contain a Python function named `main`. You can factor your code into multiple files so long as the file specified here contains a `main` function.

The `bindings` element contains two objects, one to describe incoming requests, and the other to describe the HTTP response. For incoming requests (`"direction": "in"`), the function responds to HTTP GET or POST requests and doesn't require authentication. The response (`"direction": "out"`) is an HTTP response that returns whatever value is returned from the `main` Python function.

## \_\_init.py\_\_

When you create a new function, Azure Functions provides default Python code in *\_\_init\_\_.py*:

```python
import logging

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello {name}!")
    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )
```

The important parts of the code are as follows:

- You must import `func` from `azure.functions`; importing the logging module is optional but recommended.
- The required `main` Python function receives a `func.request`  object named `req`, and returns a value of type `func.HttpResponse`. You can learn more about the capabilities of these objects in the [func.HttpRequest](/python/api/azure-functions/azure.functions.httprequest?view=azure-python) and [func.HttpResponse](/python/api/azure-functions/azure.functions.httpresponse?view=azure-python) references.
- The body of `main` then processes the request and generates a response. In this case, the code looks for a `name` parameter in the URL. Failing that, it checks if the request body contains JSON (using `func.HttpRequest.get_json`) and that the JSON contains a `name` value (using the `get` method of the JSON object returned by `get_json`).
- If a name is found, the code returns the string "Hello" with the name appended; otherwise it returns an error message.

> [!div class="nextstepaction"]
> [Next: Debug locally](tutorial-vs-code-serverless-python-04.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=python-functions-extension&step=03-examine-code-files)
