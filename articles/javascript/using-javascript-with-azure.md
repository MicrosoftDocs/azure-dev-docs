
### Recommended VSCode features and extensions

VSCode provides the following features to improve the JavaScript development experience:
* Local debugging including recipes
* Monorepo support with workspaces
* Integrated terminal for command-line execution
* [Deployment](https://code.visualstudio.com/docs/azure/deployment#_deployment-tutorials) to Azure
* Other common editor features: remote debugging, working with a container, and version control

There any many VSCode extensions to provide access and management tools for Azure resources. VSCode provides recommendations for extensions or you can search the [Marketplace](https://marketplace.visualstudio.com/) for other extensions.

| Name/Installer | Description |
| --- | --- |
| [JavaScript extension for VS Code](https://code.visualstudio.com/docs/nodejs/extensions) | VSCode recommendations for JavaScript extensions |
| [Azure extension for VS Code](https://code..visualstudio.com/docs/azure/extensions) | VSCode recommendations for JavaScript extensions. |
| [Docker extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) | Adds Docker support to VS Code, which is helpful if you regularly work with containers. |


## Azure SDK usage

Azure SDK libraries are published to [NPM](https://www.npmjs.com/).

### Modern packages

Modern packages are:

* Scoped to `@azure`.
* Support promises and the async/await pattern
* Provide typescript definitions with no additional installation
* Depend on Azure core libraries for common tasks such as authentication, HTTP requests, and async task management


### Older packages

Older packages aren't scoped but are part of the Azure organization on GitHub, such as `https://github.com/Azure/azure-storage-node`. Many packages use the prefix `azure-` name but are not made my Microsoft. Check the GitHub repository to verify a package is published by Microsoft.

## Browser, server, and tool usage

The Azure SDK libraries wrap around REST-based APIs to the Azure cloud. These libraries use common patterns for cloud-based development. They aren't meant to be used solely for the browser or the server, but instead to work in all environments, as long as cloud-based best practices are used.
