---
title: Implement end-to-end Terratest testing on Terraform projects
description: Learn more about end-to-end testing with Terratest on a Terraform project.
ms.topic: how-to
ms.date: 08/31/2021
ms.custom: devx-track-terraform
---

# Implement end-to-end Terratest testing on Terraform projects

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

End-to-end (E2E) testing is used to validate a program works before deploying it to production. An example scenario might be a Terraform module deploying two virtual machines into a virtual network. You might want to prevent the two machines from pinging each other. In this example, you could define a test to verify the intended outcome before deployment.

E2E testing is typically a three-step process.

1. A configuration is applied to a test environment.
1. Code is run to verify the results.
1. The test environment is either reinitialized or taken down (such as deallocating a virtual machine).

In this article, you learn how to:
> [!div class="checklist"]

> * Understand the basics of end-to-end testing with [Terratest](https://github.com/gruntwork-io/terratest)
> * Learn how to write end-to-end test using Golang
> * Learn how to use Azure DevOps to automatically trigger end-to-end tests when code is committed to your repo

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- **Go programming language**: [Install Go](https://golang.org/dl/).

- **Example code and resources:** Using the DownGit tool, download from GitHub the [end-to-end-testing project](https://downgit.github.io/#/home?url=https://github.com/Azure/terraform/tree/master/samples/end-to-end-testing) and unzip into a new directory to contain the example code. This directory is referred to as the *example directory*.

## 2. Understand end-to-end testing

End-to-end tests validate a system works as a collective whole. This type of testing is as opposed to testing specific modules. For Terraform projects, end-to-end testing allows for the validation of what has been deployed. This type of testing differs from many other types that test pre-deployment scenarios. End-to-end tests are critical for testing complex systems that include multiple modules and act on multiple resources. In such scenarios, end-to-end testing is the only way to determine if the various modules are interacting correctly.

This article focuses on using [Terratest](https://github.com/gruntwork-io/terratest) to implement end-to-end testing. Terratest provides all the plumbing that is required to do the following task:

- Deploy a Terraform configuration
- Enables you to write a test using the Go language to validate what has been deployed
- Orchestrate the tests into stages
- Tear down the deployed infrastructure

## 3. Understand the test example

For this article, we're using a sample available in the [Azure/terraform sample repo](https://github.com/Azure/terraform/blob/master/samples/end-to-end-testing/README.md).

This sample defines a Terraform configuration that deploys two Linux virtual machines into the same virtual network. One VM - named `vm-linux-1` - has a public IP address. Only port 22 is opened to allow SSH connections. The second VM - `vm-linux-2` - has no defined public IP address.

The test validates the following scenarios:

- The infrastructure is deployed correctly
- Using port 22, it's possible to open an SSH session to `vm-linux-1`
- Using the SSH session on `vm-linux-1`, it's possible to ping `vm-linux-2`

![Sample end-to-end test scenario](media/best-practices-end-to-end-testing/scenario.png)

If you [downloaded the sample](#1-configure-your-environment), the Terraform configuration for this scenario can be found in the `src/main.tf` file. The `main.tf` file contains everything necessary to deploy the Azure infrastructure represented in the preceding figure.

If you're unfamiliar with how to create a virtual machine, see [Create a Linux VM with infrastructure in Azure using Terraform](/azure/virtual-machines/linux/quick-create-terraform).

> [!CAUTION]
> The sample scenario presented in this article is for illustration purposes only. We've purposely kept things simple in order to focus on the steps of an end-to-end test. We don't recommend having production virtual machines that exposes SSH ports over a public IP address.

## 4. Examine the test example

The end-to-end test is written in the Go language and uses the Terratest framework. If you [downloaded the sample](#1-configure-your-environment), the test is defined in the `src/test/end2end_test.go` file.

The following source code shows the standard structure of a Golang test using Terratest:

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

    // Use Terratest to deploy the infrastructure
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

As you can see in the previous code snippet, the test is composed by three stages:

- **setup**: Runs Terraform to deploy the configuration
- **validate**`: Does the validation checks and assertions
- **teardown**: Cleans up the infrastructure after the test has run

The following list shows some of the key functions provided by the Terratest framework:

- **terraform.InitAndApply**: Enables running `terraform init` and `terraform apply` from Go code
- **terraform.Output**: Retrieves the value of the deployment output variable.
- **terraform.Destroy**: Runs the `terraform destroy` command from Go code.
- **test_structure.LoadTerraformOptions**: Loads Terraform options - such as configuration and variables - from the state
- **test_structure.SaveTerraformOptions**: Saves Terraform options - such as configuration and variables - to the state

## 5. Run the test example

The following steps run the test against the sample configuration and deployment.

1. Open a bash/terminal window.

1. Log in to your Azure account.

1. To run this sample test, you need an SSH private/public key pair name `id_rsa` and `id_rsa.pub` in your home directory. Replace `<your_user_name>` with the name of your home directory.

    ```bash
    export TEST_SSH_KEY_PATH="~/.ssh/id_rsa"
    ```
    
1. Within the example directory, navigate to the `src/test` directory.

1. Run the test.

    ```go
    go test -v ./ -timeout 10m
    ```

## 6. Verify the results

After successfully running `go test`, you see results similar to the following output:
    
```output
--- PASS: TestEndToEndDeploymentScenario (390.99s)
PASS
ok      test    391.052s
```
    
## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)