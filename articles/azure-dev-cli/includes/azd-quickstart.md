### Run Up Command

The fastest way for you to get this application up and running on Azure is to use the `azd up` command. This single command will create and configure all necessary Azure resources - including access policies and roles for your account and service-to-service communication with Managed Identities. Because the command will create all of the resources on Azure, it can take some time. 

The `azd up` command will:

1. Provision the Azure resources, policies, and roles required
1. Deploy the code from your local machine to the previously provisioned Azure resources

```bash
azd up
```

> NOTE: This may take a while to complete as it performs two steps: `azd provision` (creates Azure services) and `azd deploy` (deploys code). You will see a progress indicator as it provisions and deploys your application.

This command will print the following URLs:

- Azure portal link to view resources created
- ToDo web application frontend
- ToDo API application

!["azd Up output"](assets/azdevupurls.png)

Select the web application URL to launch the ToDo app. Create a new collection and add some items. The command will create monitoring activity in the application that you'll be able to see later when you `monitor` the application.

> Known issue: clicking the provisioning link will not redirect to the correct page in **Visual Studio Code integrated terminal**. A fix is being released for this [VS Code known issue](https://github.com/microsoft/vscode/issues/144898#issuecomment-1079496948). For the meantime, please copy and paste the link in browser.

> :warning: **Cleanup**
>
> Please be aware that Azure resources, e.g. a Cosmos DB, have been created. You can clean up these resources by deleting the resource group that was create, or issuing the `azd infra delete` command.

### Next Steps

At this point, you have a complete application deployed on Azure. But there's much more that the Azure Developer CLI can do. These next steps will introduce you to more commands that will make creating applications on Azure much easier. Using the Azure Developer CLI, you can set up your DevOps pipelines, monitor your application, test and debug locally.

#### Set up DevOps pipeline using `azd pipeline`

This template includes a GitHub Actions pipeline configuration file that will deploy your application whenever code is pushed to the main branch. You can find that pipeline file here: `.github/workflow`.

Setting up this pipeline requires you to give GitHub permission to deploy to Azure on your behalf, which is done via a Service Principal stored in a GitHub secret named `AZURE_CREDENTIALS`. The `azd pipeline config` command will automatically create a service principal for you. The command also helps to create a private GitHub repository and pushes code to the newly created repo.  

Run the following command to set up a GitHub Action:

```
azd pipeline config
```

#### Monitor the application using `azd monitor`

To help with monitoring applications, the Azure Dev CLI provides a `monitor` command to help you get to the various Application Insights dashboards.

- Run the following command to open the "Overview" dashboard:

  ```bash
  azd monitor --overview
  ```

- Live Metrics Dashboard

  Run the following command to open the "Live Metrics" dashboard:

  ```bash
  azd monitor --live
  ```

- Logs Dashboard

  Run the following command to open the "Logs" dashboard:

  ```bash
  azd monitor --logs
  ```

#### Run and Debug Locally

The easiest way to run and debug is to leverage the Azure Developer CLI Visual Studio Code Extension. For more information, see this [walkthrough](how-to-use-vscode-extension-to-debug-locally.md).  

### Clean up resources
When you are done, you can delete all the Azure resources created with this template by running the following command:

``` bash
azd infra delete
```

### Additional azd commands

For a complete list of available commands, see the [azd overview](azure-dev-cli-ref.md).

## Troubleshooting/Known issues

For known issues, refer to [Troubleshooting/known issues](azure-dev-cli-known-issues.md) 
