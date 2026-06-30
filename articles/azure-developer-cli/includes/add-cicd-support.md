## Add support for a CI/CD pipeline

You can also add support for CI/CD in your template using GitHub actions or Azure DevOps using the following steps:

1. Add a `.github` folder for GitHub actions or a `.ado` folder for Azure DevOps to the root of your project.

1. Add a workflow file into the new folder. The `azd` starter template provides a [sample GitHub Actions workflow file](https://github.com/Azure-Samples/azd-starter-bicep/blob/main/.github/workflows/azure-dev.yml) and [sample Azure DevOps Pipelines file](https://github.com/Azure-Samples/azd-starter-bicep/blob/main/.azdo/pipelines/azure-dev.yml) for each platform. You can copy these files into your project and modify them as needed.

1. You might also need to update the `main.parameters.json` file in your `infra` folder with the required environment variables for your workflow to run.