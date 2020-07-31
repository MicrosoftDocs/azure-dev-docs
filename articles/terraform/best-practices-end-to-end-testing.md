---
title: Tutorial - Setup end-to-end Terratest testing on Terraform projects
description: Learn more about end-to-end testing with Terratest on a Terraform project.
ms.topic: tutorial
ms.date: 06/15/2020
---

# Tutorial: Setup end-to-end Terratest testing on Terraform projects

In this tutorial, you'll learn more about end-to-end testing with [Terratest](https://github.com/gruntwork-io/terratest) on a Terraform project. You will also learn how to use Azure DevOps to automatically trigger end-to-end tests when you commit new configuration code to your repository.

**Test cases are written in Go** - Many developers who use Terraform are Go developers. If you're a Go developer, you don't have to learn another programming language to use Terratest.

In this article, you learn how to do the following tasks:
> [!div class="checklist"]
> * What are end-to-end tests and why it is considered as best practices to have them on a Terraform project.
> * What is [Terratest](https://github.com/gruntwork-io/terratest) and how to use it to write end-to-end test using Golang.
> * Use Azure Pipeline to automatically trigger end-to-end tests.

[!INCLUDE [hashicorp-support.md](includes/hashicorp-support.md)]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- **Go programming language**: Terraform test cases are written in [Go](https://golang.org/dl/). We are using [Go modules](https://blog.golang.org/using-go-modules) so we recommend using Go 1.13, at least.
- **Terraform:** [install and run](configure-vs-code-extension-for-terraform.md) your first Terraform command from your machine.
- **Fork testing samples:** to get started quickly, we recommend that you fork [this repository](https://github.com/Azure/terraform) into your own GitHub organization.

## What are end-to-end tests

End-to-end tests allow to validate that a program actually works in real conditions. For Terraform projects, end-to-end testing allows to validate that what has been deployed to Azure actually works as expected. Meaning that we want to test the whole scenario, end to end.

End-to-end tests are really useful and important When you are deploying complex system that involve different compute resources, databases, etc. to validate that they have been correctly deployed and configured and are able to interact together.

For example, the goal is not only to validate that Terraform deployed the resource correctly: if you decide to use Terraform, it is because you already trust it to deploy the resource you asked for. Let's consider you write the following Terraform configuration:

```hcl
resource "azure_resource_group" "rg" {
  location = "westeurope"
  name     = "rg-terratest"
}
```

Here, it does not make sense to run a end-to-end test to make sure that Terraform has actually deployed a resource group named `rg-terratest` in the Azure region `westeurope`. It's possible that the deployment of this resource group will fail, because its name is already in use or a lot of other good reasons. But in that case, the Terraform deployment itself will fail with an error, so you get notified about that.

## How Terratest helps to write end-to-end

It's possible to write end-to-end test without [Terratest](https://github.com/gruntwork-io/terratest). For example by running `terraform init` and `terraform apply` by yourself, running a Bash or Powershell script responsible for doing the validation checks and then calling `terraform destroy`. We chose to document Terratest here because it is commonly used in the industry, is written in Go and relies on the Go test Framework. It provides all the plumbing that is required to:

1. Deploy a Terraform configuration
2. Give you the hand back to write any Go test to validate what has been actually deployed
3. Tear down the deployed infrastructure
4. Orchestrate the tests into stages

## Tutorial scenario

For this tutorial we are using a sample available in the [Azure/terraform](https://github.com/Azure/terraform/samples/end-to-end-testing/README.md) repository.

This sample defines a Terraform configuration that deploys two Linux virtual machines into the same virtual network. `vm-linux-1` has a public IP address. Only port 22 is opened to allow SSH connection. `vm-linux-2` has no public IP address. The scenario we want to validate with the end-to-end test is to make sure that:

- infrastructure is deployed correctly
- it's possible to open an SSH session to `vm-linux-1` using port 22
- it's possible to ping `vm-linux-2` from `vm-linux-1` SSH session

![End-to-End Scenario](media/best-practices-end-to-end-testing/scenario.png)

> NOTE: this is a simple scenario to illustrate how to write a basic end-to-end test. We don't recommend having production virtual machines that exposes SSH port over a public IP address.

## Terraform configuration

The Terraform configuration for this scenario can be found in the [src/main.tf](src/main.tf) file. It contains everything to deploy the Azure infrastructure represented on the figure above.

If you are not familiar with creating a Linux virtual machine using Terraform we recommend that you read [this page of the documentation](https://docs.microsoft.com/azure/developer/terraform/create-linux-virtual-machine-with-infrastructure) before.

## End-to-end test

The end-to-end test is written in Go language and uses the Terratest framework. It is defined in the [src/test/end2end_test.go](https://github.com/Azure/terraform/samples/end-to-end-testing/src/test/end2end_test.go) file.

This is the common structure of a Golang test using Terratest:

```Go
package test

import (
    "testing"

    "github.com/gruntwork-io/terratest/modules/terraform"
    test_structure "github.com/gruntwork-io/terratest/modules/test-structure"
)

func TestEndToEndDeploymentScenario(t *testing.T) {
    t.Parallel()

    fixtureFolder := "../"

    // User Terratest to deploy the infrastructure
    test_structure.RunTestStage(t, "setup", func() {
        terraformOptions := &terraform.Options{
            // Indicate the directory that contains the Terraform configuration to deploy
            TerraformDir: fixtureFolder,
        }

        // Save options for later test stages
        test_structure.SaveTerraformOptions(t, fixtureFolder, terraformOptions)

        // Triggers the terraform init and terraform apply command
        terraform.InitAndApply(t, terraformOptions)
    })

    test_structure.RunTestStage(t, "validate", func() {
        // run validation checks here
        terraformOptions := test_structure.LoadTerraformOptions(t, fixtureFolder)
		    publicIpAddress := terraform.Output(t, terraformOptions, "public_ip_address")
    })

    // When the test is completed, teardown the infrastructure by calling terraform destroy
    test_structure.RunTestStage(t, "teardown", func() {
        terraformOptions := test_structure.LoadTerraformOptions(t, fixtureFolder)
        terraform.Destroy(t, terraformOptions)
    })
}
```

As you can see in the snippet above, the test is composed by three stages:

1. `setup`: this stage is responsible for running Terraform to deploy the configuration.
2. `validate`: this stage is responsible for doing the validation checks / assertions.
3. `teardown`: this stage is responsible for cleaning up the infrastructure.

Some relevant functions provided by Terratest framework are:

- `terraform.InitAndApply` allows to run the `terraform init` and `terraform apply` commands from Go code.
- `terraform.Output` allows to retrieve the value of a deployment output variable.
- `terraform.Destroy` allows to run the `terraform destroy` command from Go code.
- `test_structure.LoadTerraformOptions` allows to load Terraform options (config, variables etc.) from the state.
- `test_structure.SaveTerraformOptions` allows to save Terraform options (config, variables etc.) to the state.

## Run the end-to-end test

> [!NOTE]
> To run this end-to-end sample test, we assume that you have an SSH private/public key pair name `id_rsa` and `id_rsa.pub` into your home directory. You might want to change the value of this variable into the Terraform configuration and the `TEST_SSH_KEY_PATH` environment variable in the snippet below.

Running the test requires that Terraform is installed and configured on your machine and that you are connected to your Azure subscription with the Azure CLI command `az login`.

Once ready, since the end-to-end test is just a Go test, it can be run like the following:

```console
# Set the path of the SSH private key to use to connect the virtual machine
export TEST_SSH_KEY_PATH="/home/bob/.ssh/id_rsa"
cd test
go test -v ./ -timeout 10m
```

Once the test is ended, it displays the results:

```console
--- PASS: TestEndToEndDeploymentScenario (390.99s)
PASS
ok      test    391.052s
```

## Next steps

> [!div class="nextstepaction"]
> [Create and run compliance tests in Terraform projects](best-practices-compliance-testing.md)

> [!div class="nextstepaction"]
> [Create and run integration tests in Terraform projects](best-practices-integration-testing.md)
