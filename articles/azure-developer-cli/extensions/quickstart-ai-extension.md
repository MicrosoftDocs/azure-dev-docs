---
title: Explore the demo extension
description: Use the demo extension to explore Azure Developer CLI extension capabilities.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/27/2025
ms.service: azure-dev-cli
ms.topic: quickstart
ms.custom: devx-track-azdevcli, devx-track-bicep
---

# Quickstart: Explore the demo extension

In this Quickstart, you install the Azure Developer CLI (`azd`) demo extension and use it to explore `azd` extension framework capabilities. [Extensions](overview.md) provide a way to add new capabilities, automate workflows, and integrate other services with `azd`. The demo extension provides examples of how to implement various features in an extension, such as how to prompt the user for input or display information about the project.

## Initialize the project

To follow the steps ahead, initialize the `hello-azd` starter template. You can also follow along using your own template.

```azdeveloper
azd init -t hello-azd
```

## Install the extension

Complete the following steps to install the demo extension:

1. Ensure that extensions are enabled in your `azd` configuration:

    ```azdeveloper
    azd config set alpha.extensions on
    ```

1. Install the demo extension from the official registry:

    ```azdeveloper
    azd extension install microsoft.azd.demo
    ```

1. Verify the extension is installed by listing your installed extensions:

    ```azdeveloper
    azd extension list --installed
    ```

## Use the demo extension workflow

Once installed, the demo extension adds new commands to `azd` you can use to explore examples of extension framework capabilities.

1. Run the `azd demo` command to see a list of the available demo commands:

    ```azdeveloper
    azd demo
    ```

    The output should resemble the following:

    ```output
    Demonstrates AZD extension framework capabilities.
    
    Usage:
      azd [command]
    
    Available Commands:
      colors      Displays all ASCII colors with their standard and high-intensity variants.        
      context     Get the context of the AZD project & environment.
      listen      Starts the extension and listens for events.
      prompt      Examples of prompting the user for input.
      version     Prints the version of the application
    
    Flags:
          --debug   Enable debug mode
      -h, --help    help for azd
    
    Use "azd [command] --help" for more information about a command.
    ```

1. Run the `azd demo version` command to display the version of the app:

    ```azdeveloper
    azd demo version
    ```

    The output formatting should resemble the following:

    ```output
    Version: 0.2.0
    Commit: 611d05a6f7190f3bda379e92b4ece6470584c6f0
    Build Date: 2025-04-23T17:21:58Z
    ```

1. Run the `azd demo context` command to display the context of the `azd` project and environment:

    ```azdeveloper
    azd demo context
    ```

1. Run the `azd demo prompt` command to explore examples of how to prompt the user for input using an extension:

    ```azdeveloper
    azd demo prompt
    ```

    The first step of the workflow demonstrates how to filter a list:

    ```output
    ? Which Azure services do you use most with AZD?: Container Apps

      Filter: Type to filter list
    
      > [✔] Container Apps
        [ ] Functions
        [ ] Static Web Apps
        [ ] App Service
        [ ] Cosmos DB
        [ ] SQL Database
        ...
    ````

    Select **Container Apps** and press Enter. Continue through the remaining prompts to see examples of other prompt options, such as boolean **Yes/No** or list selections.

## Related content

- [Extensions overview](overview.md)
- [Extension framework readme](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md)
