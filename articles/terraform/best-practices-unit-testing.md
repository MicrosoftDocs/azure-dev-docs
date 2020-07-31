---
title: Tutorial - Configure unit tests for Terraform projects
description: Learn about unit testing Terraform projects and how to automate these tests using Azure DevOps
ms.topic: tutorial
ms.date: 07/24/2020
---

# Tutorial: Configure unit tests for Terraform projects

[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

> [!div class="checklist"]
> * Understand how integration and unit testing differ
> * Run unit tests on Terraform code

[!INCLUDE [hashicorp-support.md](includes/hashicorp-support.md)]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- **Install Terraform**: Based on your environment, [download and install Terraform](https://www.terraform.io/downloads.html).
- **Terratest:** [Getting Started](https://terratest.gruntwork.io/docs/#getting-started) with Terratest and its framework.

## Understand integration tests and unit tests

If you have used Terratest, you have run an [integration test](best-practices-integration-testing.md). Integration testing is run against multiple modules or subsystems to ensure that they work together as planned. Integration tests typically encompass an entire application or even a suite of interacting applications. As such, integration tests can become large and resource intensive. Integration testing is a critical part of your overall test plan. However, the time the tests take to run and their cost play a role in when you run they should be applied.

In contrast, unit tests are run against a relatively small piece of code. These tests are typically very focused tests that validate a handful of key elements. Many times, this type of testing is done by the programmer of the unit (module) to catch errors before integrating the code into the main codebase. The benefit to unit testing is that bugs are caught earlier in the test process where it's less expensive to fix them. In order to focus solely on the unit being tested, unit tests should not have dependencies on other modules in the system. As a result, some interactions between a module being unit-tested and another module  need to be mocked, or faked.

In this article's example, a unit test validates that naming logic in the code matches the requirements predefined in the deployment scope.

## Configuring your unit test

We will use Terratest to implement our unit test, and if you have not used it before you can access the [Terratest repo](https://github.com/gruntwork-io/terratest). Terratest is a Go library of automated tests that you can run against your infrastructure code. There are some great starter templates and patterns that you can reference for common infrastructure testing tasks. The [Terratest Getting Started Guide](https://terratest.gruntwork.io/docs/#getting-started) is a good place to start to get familiar with basic usage.

The test that we will be using in this example will test the naming logic declared in our Terraform code to what is actually going to be deployed, without having to deploy anything.  The naming logic that we declare using our variables, will be compared to the output of `terraform plan`. In this example, we have setup our code in the folder layout as shown below. We will be running our tests against the storage account name that was declared in our variables files, ensuring that the variable that we described in our variables file will match the expected output when the resources are actually built.  Effectively, we're testing the expected naming output before it is deployed. We will be working with the files marked with an asterisk (*):

```
📁 GoPath/src/staticwebpage
   ├ 📁 examples
   │   └ 📁 hello-world
   │       ├ 📄 index.html
   │       └ 📄 main.tf
   ├ 📁 test
   │   ├ 📁 fixtures
   │   │   └ 📁 storage-account-name
   │   │       ├ 📄 empty.html                (*)
   │   │       └ 📄 main.tf                   (*)
   │   ├ 📄 hello_world_example_test.go
   │   └ 📄 storage_account_name_unit_test.go (*)
   ├ 📄 main.tf
   ├ 📄 outputs.tf
   └ 📄 variables.tf
```

In the folder layout we have created a folder for our testing files, called 'test'. Create an empty HTML file as a placeholder, in the example above it is called 'empty.html'.  This will be used for the output of the `terraform plan` to compare against the test. The folder can be placed in another location, but to keep the tests close to our Terraform code, it is straight forward to keep the testing folder in the same structure as our code that we are testing against. The empty HTML file is referenced from the file location `./test/fixtures/storage-account-name/empty.html`

The unit test will have one input `website_name` and will be held in the test case framework, located in the file `./test/fixtures/storage-account-name/main.tf`. The configuration of this file is here:

```hcl
variable "website_name" {
  description = "The name of your static website."
}

module "staticwebpage" {
  source       = "../../../"
  location     = "West Europe"
  website_name = var.website_name
  html_path    = "empty.html"
}
```

### Breakdown of the unit test

The unit test itself is held in `./test/storage_account_name_unit_test.go`. The unit test is written in Go and very much resembles a classic Go test function.  The function accepts an argument of type `*testing.T`


```go

import (
	"os"
	"path"
	"testing"

	"github.com/gruntwork-io/terratest/modules/terraform"
	terraformCore "github.com/hashicorp/terraform/terraform"
)

func TestUT_StorageAccountName(t *testing.T) {
	t.Parallel()

	// Test cases for storage account name conversion logic
	testCases := map[string]string{
		"TestWebsiteName": "testwebsitenamedata001",
		"ALLCAPS":         "allcapsdata001",
		"S_p-e(c)i.a_l":   "specialdata001",
		"A1phaNum321":     "a1phanum321data001",
		"E5e-y7h_ng":      "e5ey7hngdata001",
	}

	for input, expected := range testCases {
		// Specify the test case folder and "-var" options
		tfOptions := &terraform.Options{
			TerraformDir: "./fixtures/storage-account-name",
			Vars: map[string]interface{}{
				"website_name": input,
			},
		}

		// Terraform init and plan only
		tfPlanOutput := "terraform.tfplan"
		terraform.Init(t, tfOptions)
		terraform.RunTerraformCommand(t, tfOptions, terraform.FormatArgs(tfOptions, "plan", "-out="+tfPlanOutput)...)

		// Read and parse the plan output
		f, err := os.Open(path.Join(tfOptions.TerraformDir, tfPlanOutput))
		if err != nil {
			t.Fatal(err)
		}
		defer f.Close()
		plan, err := terraformCore.ReadPlan(f)
		if err != nil {
			t.Fatal(err)
		}

		// Validate the test result
		for _, mod := range plan.Diff.Modules {
			if len(mod.Path) == 2 && mod.Path[0] == "root" && mod.Path[1] == "staticwebpage" {
				actual := mod.Resources["azurerm_storage_account.main"].Attributes["name"].New
				if actual != expected {
					t.Fatalf("Expect %v, but found %v", expected, actual)
				}
			}
		}
	}
}
```

The body of the unit test contains a total of five cases defined in the specified variable `testCases`.  The input is defined as `key` and the `value` is our expected output.  In this specific example we are testing against the attribute `name` of the `azurerm_storage_account` and comparing the results.

Now that we have an idea on the structure of writing the unit test and its components, let's review how we are going to run the unit test.

## Running the Unit Test

For each test we will need to initialize the project directory using the `init` command:

```console
./terraform/samples/unit-testing/src$ terraform init
```

For each initialization, the target folder is `./test/fixtures/storage-account-name/`

OUTPUT:

```console
Initializing the backend...

Initializing provider plugins...
- Checking for available provider plugins...
- Downloading plugin for provider "random" (hashicorp/random) 2.2.1...
- Downloading plugin for provider "azurerm" (hashicorp/azurerm) 2.13.0...

The following providers do not have any version constraints in configuration,
so the latest version was installed.

To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.

* provider.azurerm: version = "~> 2.13"
* provider.random: version = "~> 2.2"

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set, change modules, or the backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

Once initialization has completed, we are ready to run our unit test against `terraform plan`.  When running the following command, specific test case input will be saved to `./test/fixtures/storage-account-name/terraform.tfplan`, which is not listed in the overall folder structure as outlined above. It's created when you run `terraform plan`. The test case input will look at `website_name` as defined in `tfOptions` saving it to the test folder listed.

The generated file is created using the official Terraform plan parses, making the code a more human-readable format. Read more about how Terraform executes this [here](https://www.terraform.io/docs/internals/json-format.html).

Once you have created that file you can then run your code against the output from `terraform plan`.

From your the command line, initiate the Go unit test

```bash
cd GoPath/src/staticwebpage
dep init    # Run only once for this folder
dep ensure  # Required to run if you imported new packages in test cases
cd test
go fmt
go test -run TestUT_StorageAccountName
```

Results from the Go test should be returned in about one minute.

Your unit test on your Terraform code is now completed!

## Run your unit test in a pipeline

This process can be injected and executed from an Azure pipeline to ensure full automation of your deployment and testing.  Refer to [Terraform integration testing](articles\terraform\best-practices-integration-testing.md) to get started and review the prerequisites. To learn more about adding unit tests to Azure Pipelines, see [Build and test Go projects](https://docs.microsoft.com/azure/devops/pipelines/ecosystems/go?view=azure-devops&tabs=go-current).

You will use a similar folder structure as described earlier, but instead run your Terraform commands from the pipeline with your code in source control.

You will add in the `terraform init` and `terraform plan` commands as tasks into your pipeline, the YAML configuration is listed below.  You will need to create a test plan or task for the Go unit test itself.

## Next steps

> [!div class="nextstepaction"]
> [Create and run compliance tests in Terraform projects](best-practices-compliance-testing.md)