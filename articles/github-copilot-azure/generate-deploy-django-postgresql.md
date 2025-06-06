---
title: Generate a Django and PostgreSQL and deploy to Azure
description: This article demonstrates how to prompt GitHub Copilot along with GitHub Copilot for Azure to generate an entire app, then deploy to Azure App Service and Azure PostgreSQL Flexible Server.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: how-to
ms.date: 06/6/2025
ms.collection: ce-skilling-ai-copilot
---

# Generate a Django and PostgreSQL and deploy to Azure

This article guides you in how to interact with GitHub Copilot to generate a local Django web app that performs CRUD operations on a PostgreSQL database. Next, it guides you in how to interact with GitHub Copilot for Azure to deploy the web app and database to Azure App Service and Azure PostgreSQL Flexible Server (along with several supporting Azure services).

The specific application you create is a trivial contact management application that features CRUD operations with a List/Detail style architecture.

>[!NOTE]
> Using a Large Language Model (LLM) to generate an application yields inconsistent results. Your results depend on the LLM model, your instructions, and more. The focus of this guide is to help you understand how to get better results. However each time you go through this example, you get (potentially) dramatically different results.

## Prerequisites

- Visual Studio Code
- PostgreSQL, including pgAdmin
- Git Bash (available from the Git installer)
- A GitHub Copilot license
- GitHub Copilot for Azure extension to Visual Studio Code
- Python Extension to Visual Studio Code
- PostgreSQL Extension to Visual Studio Code
- Azure CLI
- Azure Developer CLI

## Set up the local database

While GitHub Copilot is capable of performing virtually any application development task that developers typically perform, some tasks might require forethought. To improve results, create the database and set up authentication and authorization before working with GitHub Copilot.

1. Use pgAdmin to create a new database named `contacts`.

1. Use pgAdmin to give the user the proper permissions to create tables and operate on data.

1. On Windows machines, the recommended security best practice is to store the database username and password in a local file:

   `c:\Users\<your-user-id>\AppSettings\Roaming\postgresql\pgpass.conf`
   
   The file should use the following format:

   ```
   localhost:5432:<database-name>:<database-user>:<password>
   ```
   
   Replace `<database-name>` with `contacts` and replace `<database-user>` and `<password>` with the credentials you used in the previous step.

1. Test the connection to ensure that it works.

## Perform a preflight check

Make sure your CLI tools and Visual Studio Code are updated, properly configured and operating correctly to improve your results.

1. In your terminal, update the Azure CLI with the command `az --upgrade`.

1. In your terminal, install the service connector passwordless extension for Azure CLI with the command: `az extension add --name serviceconnector-passwordless --upgrade`

1. In Visual Studio Code, set the default terminal to Git Bash. 

> [!Note] 
> Using Git Bash isn't strictly necessary, but at the time of this writing it yields the best results.

1. In Visual Studio Code, use the PostgreSQL extension and navigate to the `contacts` database.

1. In Visual Studio Code, use the Azure extension and ensure you're logged into your Azure account and subscription.

1. Create a new folder for your new application files and open it in Visual Studio Code as your workspace.

## Generate an app using GitHub Copilot

First you provide instructions and guidance on building and testing the application on your local computer.

1. In Visual Studio Code, use the Toggle Chat button in the title bar to open the Chat Window. Use the New Chat icon to create a new chat session.

1. In the chat area, select `Agent` mode. At the time of this writing,  `Claude Sonnette 4.0` yields the best results. Use the best model available for code generation.

1. Use the following prompt to begin application generation:

   ```copilot-prompt
   I want you to create a simple Contact Manager application using Django and PostgreSQL. 
   This should be a CRUD application, so create web pages that display a list of 
   contacts, view details, add a new contact, edit or delete a contact. Each Contact 
   is comprised of a contact's Name, Address, and Phone number. Since this is a 
   Python / Django project please make sure to work inside of a virtual environment (venv). 
   I've already created a PostgreSQL database at `localhost` named `contacts`. There are 
   no tables yet. For local development in PostgreSQL, I'm using a `pgpass.conf` file 
   and I have tested it works. Prefer Git Bash in the terminal. Beyond that, if there's 
   anything I need to do, please include instructions. But I want you to do as much as 
   you can on your own.
   ```

   The prompt has the following features:

   - **The type of application you want to create.** In this case, a contact management application.
   - **The technologies to use.** In this case, Django and PostgreSQL.
   - **The site architecture you want to generate.** In this case, a CRUD style application that features a page that lists all contact and allows you to drill down into a specific contact.
   - **More detail about the problem domain.** In this case, you provide the fields of data you want the application to manage, including the contact's name, address, and phone number.
   - **Specific instructions regarding the database.** In this case, you instruct GitHub Copilot to use a specific database that you already created, you provide the state of the database, and how to interact
   - **Specific instructions about the environment.** In this case, you instruct it to use Git Bash. You also tell it that you want the work to be performed in a Python environment (venv), which is a best practice. GitHub Copilot might choose these options on its own, but stating it explicitly makes the process go smoothly.
   - **Explicit expectations that you want it to do as much work on its own.** Otherwise, GitHub Copilot might provide instructions for you to take.
   - **Explicit expectations for instructions / context.** If it needs you to perform other actions, you set the expectation that you need it to help you by providing instructions and guidance.

   >[!IMPORTANT]
   > When GitHub Copilot uses the terminal to create a new virtual environment, Visual Studio Code detects the `venv` and displays a dialog asking whether you want to use it. Ignore that dialog. It goes away. Allow GitHub Copilot to use the terminal exclusively for this operation.

   GitHub Copilot uses the built-in terminal and the Visual Studio Code environment to:

   - Create a Python virtual environment
   - Install libraries and other dependencies
   - Generate code files
   - Generate database tables 
   - Generate readme files for further instructions
   - Create test data
   - Launch a local web server
   - Test the website (using Simple Browser or curl)

   Due to how LLMs generate code, the commands it uses and what it produces are different each time.

## Deploy to Azure with GitHub Copilot for Azure

After GitHub Copilot generates the site locally, you'll author a prompt asking GitHub Copilot to make changes to the site in preparation for deployment, and then to perform the deployment. The GitHub Copilot for Azure extension handles this request by creating Bicep files then running those files using the `azd` CLI.

Use the following prompt:

```copilot-prompt
Please help me deploy this Django app to Azure. Use Azure App Service for the Django app, 
and Azure PostgreSQL Flexible Server using Service Connector (and any other services you 
need to make this configuration work successfully). You may need to modify the 
application code to accommodate Service Connector. Please choose the least expensive 
options. Also, please ensure a secure connection between the Azure App Service web site 
and the Azure PostgreSQL Flexible Server. When prompted, use an environment named 
`contacts-env`. Create and use a Resource Group named `contacts-rg`. Use the `West US` 
location. Configure my firewall to allow my IP address. Beyond that, if there's anything 
I need to do, please include instructions. But I want you to do as much as you can on 
your own.
```

The prompt has the following features:

   - **Specific services you want to use.** In this case, you tell it that you want to use Azure App Service, Azure PostgreSQL Flexible Server, Service Connector. You also give it the instruction to "do whatever else you need to do" to ensure it works.
   - **Specific service options.** In this case, you indicate that you want to use the least expensive option possible for each service.
   - **Hint at probable next steps.** In this case, you suggest that some code modification is necessary in order to use Service Connector.
   - **Anticipate decisions ahead of time.** In this case, you provide the answer to settings it needs, such as an environment name for `azd`, 
   - **Explicit expectations that you want it to do as much work on its own.** Otherwise, it might provide instructions for you to take.
   - **Explicit expectations for instructions / context.** Set the expectation that you need help and guidance when it asks you to take action.

   GitHub Copilot uses the built-in terminal and the Visual Studio Code environment to:

   - Update the code files to accommodate Service Connector
   - Generate Bicep files
   - Run the `azd` CLI
   - Test the deployment
   - If necessary, debug the deployment using logs or other 


## Interact with GitHub Copilot

GitHub Copilot requires your input before performing many tasks. A pause for input is your opportunity to direct GitHub Copilot to course correct in order to prevent mistakes or customize generated output to your preferences.

While it's working, you can watch and agree to most of the questions it asks you using the `Continue` button.

   >[!IMPORTANT]
   > If you get unexpected results, restart using a new chat session.

Occasionally, you're required to provide input. There are a few distinct moments when you're prompted for input:

- **User credentials** - If the current operation in the terminal requires a username or password, 
- **Moment of decision** - Occasionally, GitHub Copilot gives you several options in a list and ask which you prefer.
- **The Command Palette** - Occasionally, GitHub Copilot uses the features of an extension and the options are displayed in the Command Palette. Once you make the proper selections, GitHub Copilot proceeds.
- **Interactive login** - The Azure CLI and `azd` CLI need you to authenticate, and initiates one of several authentication mechanisms.

### Testing and asking for changes

When GitHub Copilot finishes, it's possible that it considers the site to be complete and functional. However your testing might discover issues, or unexpected / undesirable app features.

Use prompts that describe the issue with as much detail as possible. For example, if the application isn't functioning, provide as much information as possible,**including the exact error message** and the expected result.


### Interrupting the flow

Occasionally, you might notice that GitHub Copilot is either stuck in a loop attempting to perform the same tasks repeatedly. Or occasionally, you might notice that GitHub Copilot is stuck in a process that never returns. For example, when diagnosing problems with the website, GitHub Copilot might want to run a command like:

```bash
az webapp log tail
```

When GitHub Copilot is stuck, you can interrupt GitHub Copilot in one of several ways:

- `Ctrl` + `c`
- Use the pause button in the chat
- End the chat session and start a new chat

> [!Important] 
> Ending the chat session destroys all the context built up during the session, which might or might not be desirable.

To provide it context to what just happened, and nudge it towards a possible solution, you could add a prompt immediately after interrupting the GitHub Copilot such as:

```copilot-prompt
You were just getting the logs from Azure App Service but it did not return 
so you got stuck. Try to interrupt after a minute once you get what you need 
from the logs.
```

## Next steps

- [What is the Azure Developer CLI?](/azure/developer/azure-developer-cli/overview?tabs=windows)
- [What is Bicep?](/azure/azure-resource-manager/bicep/overview?tabs=bicep)
