---
title: Add a second Python function to Azure Functions with Visual Studio Code
description: Tutorial step 6, expanding an Azure Functions project by adding a second function.
services: functions
author: kraigb
manager: barbkess
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: kraigb
---

# Add a second function

[Previous step: deploy to Azure](tutorial-vs-code-serverless-python-05.md)

After your first deployment, you can make changes to your code, such as adding additional functions, and redeploy to the same Functions App.

1. In the **Azure: Functions** explorer, select the **Create Function** command or use **Azure Functions: Create Function** from the Command Palette. Specify the following details for the function:

    - Template: HTTP trigger
    - Name: "DigitsOfPi"
    - Authorization level: Anonymous

1. In the Visual Studio Code file explorer is a subfolder with your function name that again contains files named *\_\_init\_\_.py*, *function.json*, and *sample.dat*.

1. Replace the contents of *\_\_init\_\_.py* to match the following code, which generates a string containing the value of PI to a number of digits specified in the URL (this code uses only a URL parameter)

    ```python
    import logging

    import azure.functions as func

    """ Adapted from the second, shorter solution at http://www.codecodex.com/wiki/Calculate_digits_of_pi#Python
    """

    def pi_digits_Python(digits):
        scale = 10000
        maxarr = int((digits / 4) * 14)
        arrinit = 2000
        carry = 0
        arr = [arrinit] * (maxarr + 1)
        output = ""

        for i in range(maxarr, 1, -14):
            total = 0
            for j in range(i, 0, -1):
                total = (total * j) + (scale * arr[j])
                arr[j] = total % ((j * 2) - 1)
                total = total / ((j * 2) - 1)

            output += "%04d" % (carry + (total / scale))
            carry = total % scale

        return output;

    def main(req: func.HttpRequest) -> func.HttpResponse:
        logging.info('DigitsOfPi HTTP trigger function processed a request.')

        digits_param = req.params.get('digits')

        if digits_param is not None:
            try:
                digits = int(digits_param)
            except ValueError:
                digits = 10   # A default

            if digits > 0:
                digit_string = pi_digits_Python(digits)

                # Insert a decimal point in the return value
                return func.HttpResponse(digit_string[:1] + '.' + digit_string[1:])

        return func.HttpResponse(
             "Please pass the URL parameter ?digits= to specify a positive number of digits.",
             status_code=400
        )
    ```

1. Because the code supports only HTTP GET, modify *function.json* so that the `"methods"` collection contains only `"get"` (that is, remove `"post"`). The whole file should appear as follows:

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
            "get"
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

1. Start the debugger by pressing F5 or selecting the **Debug** > **Start Debugging** menu command. The **Output** window should now show both endpoints in your project:

    ```output
    Http Functions:

            DigitsOfPi: [GET] http://localhost:7071/api/DigitsOfPi

            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ```

1. In a browser, or from curl, make a request to `http://localhost:7071/api/DigitsOfPi?digits=125` and observe the output. (You might notice that the code algorithm isn't entirely accurate, but we'll leave the improvements to you!) Stop the debugger when you're finished.

1. Redeploy the code by using the **Deploy to Function App** in the **Azure: Functions** explorer. If prompted, select the Function App created previously.

1. Once deployment finishes (it takes a few minutes!), the **Output** window shows the public endpoints with which you can repeat your tests.

> [!div class="nextstepaction"]
> [Next: Add a storage binding](tutorial-vs-code-serverless-python-07.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-functions-python&step=06-second-function)
