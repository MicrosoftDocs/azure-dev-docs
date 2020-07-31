---
title: Tutorial - Setup end-to-end Terratest testing on Terraform projects
description: Learn more about end-to-end testing with Terratest on a Terraform project.
ms.topic: tutorial
ms.date: 07/31/2020
---

# Tutorial: Setup end-to-end Terratest testing on Terraform projects

[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

In this article, you learn how to do the following tasks:

> [!div class="checklist"]
> * Understand the basics of end-to-end testing with [Terratest](https://github.com/gruntwork-io/terratest)
> * Learn how to write end-to-end test using Golang
> * Learn how to use Azure DevOps to automatically trigger end-to-end tests when code is committed to your repo

[!INCLUDE [hashicorp-support.md](includes/hashicorp-support.md)]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- **Install Terraform**: Based on your environment, [download and install Terraform](https://www.terraform.io/downloads.html).
- **Fork testing samples:** to get started quickly, we recommend that you fork [this repository](https://github.com/Azure/terraform) into your own GitHub organization.
- **Go programming language**: Terraform test cases are written in [Go](https://golang.org/dl/). The sample in this article uses [Go modules](https://blog.golang.org/using-go-modules). Go 1.13 (or later) is recommended for this article.

## What is end-to-end testing

End-to-end tests validate that a system works as a collective whole. This is as opposed to testing specific modules. For Terraform projects, end-to-end testing allows for the validation of what has been deployed. This type of testing differs from many other types that test pre-deployment scenarios. End-to-end tests are critical for testing complex systems that include multiple modules and act on multiple resources. In such scenarios, end-to-end testing is the only way to determine if the various modules are interacting correctly.

This article focuses on using [Terratest](https://github.com/gruntwork-io/terratest) to facilitate end-to-end testing. Terratest provides all the plumbing that is required to do the following task:

- Deploy a Terraform configuration
- Enables you to write a test using the Go language to validate what has been deployed
- Orchestrate the tests into stages
- Tear down the deployed infrastructure

## Tutorial scenario

For this tutorial, we are using a sample available in the [Azure/terraform sample repo](https://github.com/Azure/terraform/samples/end-to-end-testing/README.md).

This sample defines a Terraform configuration that deploys two Linux virtual machines into the same virtual network. One VM - named `vm-linux-1` - has a public IP address. Only port 22 is opened to allow SSH connections. The second VM - `vm-linux-2` - has no defined public IP address. 

Our test should validate the following scenarios:

- The infrastructure is deployed correctly
- Using port 22, it's possible to open an SSH session to `vm-linux-1`
- Using the SSH session on `vm-linux-1`, it's possible to ping `vm-linux-2`

![Sample end-to-end test scenario](media/best-practices-end-to-end-testing/scenario.png)

> NOTE: This sample scenario presented in this article is for illustration purposes only. We've purposely kept things simple in order to focus on the steps of an end-to-end test. We don't recommend having production virtual machines that exposes SSH ports over a public IP address.

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
