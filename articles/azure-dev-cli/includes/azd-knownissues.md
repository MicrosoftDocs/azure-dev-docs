## Troubleshooting/Known issues

Sometimes, things go awry. If you happen to run into issues, here are some things to check out.

- Windows Subsystem for Linux (WSL) and Ubuntu are not fully supported yet.
- Verify that all prerequisites are installed, e.g. Github CLI.
- The Az Dev CLI assumes that folders under .azure folder are dev CLI environments. Do not run `azd` commands from the home directory of a user that has Azure CLI installed.
- Environment name is used as a prefix to the name of each Azure resource created for this project. Azure resources have [naming rules and restrictions](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-name-rules), make sure you use a name that is less than 15-character long and unique.
- `azd up` and `azd provision` require the latest release of az bicep cli. Run `az bicep upgrade` if you this: "Error: failed to compile bicep template: failed running az bicep build: exit code: 1, stdout: , stderr: WARNING: A new Bicep release is available: v0.4.1272. Upgrade now by running "az bicep upgrade"."
- If `azd up` or `azd provision` fails, go to the [Azure Portal](https://portal.azure.com), locate your resource group which is `<your-environment-name>rg`. Click link under **Deployments** to get more information.
  > Additional resource: [Troubleshoot common Azure deployment errors - Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/troubleshooting/common-deployment-errors)
- If `azd pipeline` fails to deploy your latest change, verify that you have specified a basename that is the same as your environment name. You can also go to `https://github.com/<your repo>/actions` and refer to the log in the pipeline run to get more information.
- Text-based browser is currently not supported by `azd monitor`.
- Live Metrics (`azd monitor --live`) is currently not supported for Python app refer to [this](https://docs.microsoft.com/azure/azure-monitor/app/live-stream#get-started) for more information.
