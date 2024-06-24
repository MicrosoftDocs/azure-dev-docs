## Configure the CI/CD pipeline

If your template includes support for GitHub Actions or Azure Pipelines, you can configure a CI/CD pipeline using the following steps:

1. Run the following command to push updates to the repository. The GitHub Actions workflow is triggered because of the update.

    ```bash
    azd pipeline config    
    ```

1. Using your browser, go to the GitHub repository for your project.

1. Select **Actions** to see the workflow running.

## Clean up resources

When you no longer need the resources created in this article, run the following command:

``` azdeveloper
azd down
```