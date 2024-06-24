## Add support for a CI/CD pipeline

You can also add support for CI/CD in your template using GitHub actions or Azure DevOps using the following steps:

1. Add a `.github` folder for GitHub actions or a `.ado` folder for Azure DevOps to the root of your project.

1. Add a workflow file into the new folder. The `azd` starter template provides a [Sample GitHub Actions workflow file](https://github.com/Azure-Samples/azd-starter-bicep/blob/main/.github/workflows/azure-dev.yml) and [Sample Azure DevOps Pipelines](https://github.com/Azure-Samples/azd-starter-bicep/blob/main/.azdo/pipelines/azure-dev.yml) files for each platform that you can copy into your project and modify as needed.

1. You may also need to update the `main.parameters.json` file in your `infra` folder with the required environment variables for your workflow to run.