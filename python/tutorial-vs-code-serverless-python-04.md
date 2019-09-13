---
title: Debug the Azure Functions Python code locally with Visual Studio Code
description: Tutorial step 4, running the VS Code debugger locally to check your Python code.
services: functions
author: kraigb
manager: barbkess
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: kraigb
---

# Debug the function code locally

[Previous step: examine the code files](tutorial-vs-code-serverless-python-03.md)

1. When you create the Functions project, the Visual Studio Code extension also creates a launch configuration in `.vscode/launch.json` that contains a single configuration named **Attach to Python Functions**. This configuration means you can just press F5 or use the Debug explorer to start the project:

    ![Debug explorer showing the Functions launch configuration](media/tutorial-vs-code-serverless-python/launch-configuration.png)

1. When you start the debugger, a terminal opens showing output from Azure Functions, including a summary of the available endpoints. Your URL might be different if you used a name other than "HttpExample":

    ```output
    Http Functions:

            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ```

1. Use **Ctrl+click** or **Cmd+click** on the URL in the Visual Studio Code **Output** window to open a browser to that address, or start a browser and paste in the same URL. In either case, the endpoint is `api/<function_name>`, in this case `api/HttpExample`. However, because that URL doesn't include a name parameter, the browser window should just show, "Please pass a name on the query string or in the request body" as appropriate for that path in the code.

1. Now try adding a name parameter to the use, such as `http://localhost:7071/api/HttpExample?name=VS%20Code`, and the browser window should display the message, "Hello Visual Studio Code!", demonstrating that you've run that code path.

1. To pass the name value in a JSON request body, you can use a tool like curl with the JSON inline:

    ```bash
    # Mac OS/Linux: modify the URL if you're using a different function name
    curl --header "Content-Type: application/json" --request POST \
        --data {"name":"Visual Studio Code"} http://localhost:7071/api/HttpExample
    ```

    ```ps
    # Windows (escaping on the quotes is necessary; also modify the URL
    # if you're using a different function name)
    curl --header "Content-Type: application/json" --request POST \
        --data {"""name""":"""Visual Studio Code"""} http://localhost:7071/api/HttpExample
    ```

    Alternately, create a file like *data.json* that contains `{"name":"Visual Studio Code"}` and use the command `curl --header "Content-Type: application/json" --request POST --data @data.json http://localhost:7071/api/HttpExample`.

1. To test debugging the function, set a breakpoint on the line that reads `name = req.params.get('name')` and make a request to the URL again. The Visual Studio Code debugger should stop on that line, allowing you to examine variables and step through the code. (For a short walkthrough of basic debugging, see [Visual Studio Code Tutorial - Configure and run the debugger](https://code.visualstudio.com/docs/python/python-tutorial.md#configure-and-run-the-debugger).)

1. When you're satisfied that you've thoroughly tested the function locally, stop the debugger (with the **Debug** > **Stop Debugging** menu command or the **Disconnect** command on the debugging toolbar).

> [!div class="nextstepaction"]
> [I ran the debugger locally](tutorial-vs-code-serverless-python-05.md)

[I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-functions-python&step=04-test-debug)
