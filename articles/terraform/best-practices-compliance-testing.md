---
title: Implement compliance testing with Terraform and Azure
description: Understand how to apply behavior driven development (BDD) style compliance testing to Terraform configurations
ms.topic: how-to
ms.date: 03/18/2023
ms.custom: devx-track-terraform
---

# Implement compliance testing with Terraform and Azure

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Many times, compliance testing is part of the continuous integration process and is used to ensure that user-defined policies are followed. For example, you might define geopolitical naming conventions for your Azure resources. Another common example is creating virtual machines from a defined subset of images. Compliance testing would be used to enforce rules in these and many other scenarios.

In this article, you learn how to:

> [!div class="checklist"]
> * Understand when to use compliance testing
> * Learn how to do a compliance test
> * See and run an example compliance test

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- **Docker:** [Install Docker](https://docs.docker.com/get-docker/).

- **Python:** [Install Python](https://www.python.org/downloads/).

- **Terraform-compliance tool:** Install the Terraform compliance tool by running the following command: `pip install terraform-compliance`.

- **Example code and resources:** Using the DownGit tool, download from GitHub the [compliance-testing project](https://downgit.github.io/#/home?url=https://github.com/Azure/terraform/tree/master/samples/compliance-testing) and unzip into a new directory to contain the example code. This directory is referred to as the *example directory*.

## 2. Understand compliance testing and checks

Compliance testing is a nonfunctional testing technique to determine if a system meets prescribed standards. Compliance testing is also known as *conformance testing*.

Most software teams do an analysis to check that the standards are properly enforced and implemented. Often working simultaneously to improve the standards that, in turn, lead to increased quality.

With compliance testing, there are two important concepts to consider: compliance testing and compliance checks.

- *Compliance testing* ensures that the output of each development lifecycle phase conforms to agreed-upon requirements.
- *Compliance checks* should be integrated into the development cycle at the beginning of the projects. Attempting to add compliance checks at a later stage becomes increasingly more difficult when the requirement itself isn't adequately documented.

Doing compliance checks is straight forward. A set of standards and procedures is developed and documented for each phase of the development lifecycle. The output of each phase is compared against the documented requirements. The results of the test are any "gaps" in not conforming to the predetermined standards. Compliance testing is done through the inspection process and the outcome of the review process should be documented.

Let's take a look at a specific example.

A common problem is environments that break when multiple developers apply incompatible changes. Let's say one person works on a change and applies resources such as creating a VM in a test environment. Another person then applies a different version of the code that provisions different version of that VM. What is needed here is oversight to ensure conformity to stated rules.

One way to address this issue would be to define a policy of tagging the resources - such as with `role` and `creator` tags. Once you define the policies, a tool like [Terraform-compliance](https://terraform-compliance.com) is used to ensure the policies are followed.

Terraform-compliance focuses on *negative testing*. Negative testing is the process of ensuring that a system can gracefully handle unexpected input or unwanted behavior. *Fuzzing* is an example of negative testing. With fuzzing, a system that receives input is tested to ensure that it can safely handle unexpected input.

Fortunately, Terraform is an abstraction layer for any API that creates, updates, or destroys cloud-infrastructure entities. Terraform also ensures the local configuration and the remote API responses are in synch. Since Terraform is mostly used against Cloud APIs, we still need a way to ensure the code deployed against the infrastructure follows specific policies. Terraform-compliance - a free and open-source tool - provides this functionality for Terraform configurations.

Using the VM example, a compliance policy might be as follows: *"If you're creating an Azure resource, it must contain a tag"*.

The Terraform-compliance tool provides a test framework where you create policies like the example. You then run those policies against your Terraform execution plan.

Terraform-compliance allows you to apply BDD, or *behavior-driven development*, principles. BDD is a collaborative process where all stakeholders work together to define what a system should do. These stakeholders generally include the developers, testers, and anyone with a vested interest in - or who will be impacted by - the system being developed. The goal of BDD is to encourage teams to build concrete examples that express a common understanding of how the system should behave.

## 3. Examine a compliance-test example

Previously in this article, you read about a compliance-testing example of creating a VM for a test environment. This section shows how to translate that example into a BDD Feature and Scenario. The rule is first expressed using *Cucumber*, which is a tool used to support BDD.

```Cucumber
when creating Azure resources, every new resource should have a tag
```

The previous rule is translated as follows:

```Cucumber
If the resource supports tags
Then it must contain a tag
And its value must not be null
```

The Terraform HCL code would then adhere to the rule as follows.

```hcl
resource "random_uuid" "uuid" {}

resource "azurerm_resource_group" "rg" {
  name     = "rg-hello-tf-${random_uuid.uuid.result}"
  location = var.location

  tags = {
    environment = "dev"
    application = "Azure Compliance"
  } 
}
```

The first policy could be written as a [BDD feature scenario](https://cucumber.io/docs/gherkin/reference/) as follows:

```Cucumber
Feature: Test tagging compliance  # /target/src/features/tagging.feature
    Scenario: Ensure all resources have tags
        If the resource supports tags
        Then it must contain a tag
        And its value must not be null
```

The following code shows a test for a specific tag:

```Cucumber
Scenario Outline: Ensure that specific tags are defined
    If the resource supports tags
    Then it must contain a tag <tags>
    And its value must match the "<value>" regex

    Examples:
      | tags        | value              |
      | Creator     | .+                 |
      | Application | .+                 |
      | Role        | .+                 |
      | Environment | ^(prod\|uat\|dev)$ |
```

## 4. Run the compliance-test example

In this section, you download and test the example.

1. Within the example directory, navigate to the `src` directory.

1. Run [terraform init](https://www.terraform.io/docs/commands/init.html) to initialize the working directory.

    ```console
    terraform init
    ```
    
1. Run [terraform validate](https://www.terraform.io/docs/commands/validate.html) to validate the syntax of the configuration files.

    ```console
    terraform validate
    ```
    
    **Key points:**

    - You see a message indicating that the Terraform configuration is valid.


1. Run [terraform plan](https://www.terraform.io/docs/commands/plan.html) to create an execution plan.

    ```console
    terraform plan -out main.tfplan
    ```

1. Run [terraform show](https://www.terraform.io/docs/commands/show.html) to convert the execution plan to JSON for the compliance step.

    ```bash
    terraform show -json main.tfplan > main.tfplan.json
    ```
    
1. Run [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) to download the terraform-compliance image.

    ```console
    docker pull eerkunt/terraform-compliance
    ```
    
1. Run [docker run](https://docs.docker.com/engine/reference/commandline/run/) to run the tests in a docker container.

    ```console
    docker run --rm -v $PWD:/target -it eerkunt/terraform-compliance -f features -p main.tfplan.json
    ```

    **Key points:**

    - The test will fail because - while the first rule requiring existence of tags succeeds - the second rule fails in that the `Role` and `Creator` tags are missing.

    ![Example of a failed test](media/best-practices-compliance-testing/best-practices-compliance-testing-tagging-fail.png)

1. Fix the error by modifying `main.tf` as follows (where a `Role` and `Creator` tag are added).

    ```terraform
      tags = {
        Environment = "dev"
        Application = "Azure Compliance"
        Creator     = "Azure Compliance"
        Role        = "Azure Compliance"
      } 
    
    ```

    **Key points:**

    - The configuration is now in compliance with the policy.
    
## 5. Verify the results

1. Run `terraform validate` again to verify the syntax.

    ```console
    terraform validate
    ```
    
1. Run `terraform plan` again to create a new execution plan.

    ```console
    terraform plan -out main.tfplan
    ```

1. Run [terraform show](https://www.terraform.io/docs/commands/show.html) to convert the execution plan to JSON for the compliance step.

    ```bash
    terraform show -json main.tfplan > main.tfplan.json
    ```

1. Run [docker run](https://docs.docker.com/engine/reference/commandline/run/) again to test the configuration. If the full spec has been implemented, the test succeeds.

    ```console
    docker run --rm -v $PWD:/target -it eerkunt/terraform-compliance -f features -p main.tfplan.json
    ```
    
    ![Example of a successful test](media/best-practices-compliance-testing/best-practices-compliance-testing-tagging-succeed.png)


1. Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan.

    ```console
    terraform apply main.tfplan -target=random_uuid.uuid
    ```

    **Key points:**

    - A resource group is created with a name following the pattern: `rg-hello-tf-<random_number>`.


## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
