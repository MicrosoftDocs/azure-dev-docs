---
title: Tutorial - Terraform testing overview
description: Learn about the different testing options that you can configure to validate Terraform projects.
ms.topic: overview
ms.date: 07/31/2020
ms.custom: devx-track-terraform
---

# Tutorial: Terraform testing overview

[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

Terraform is an Infrastructure as Code (IaC) tool. This category of tool refers to the fact that you treat your Terraform files as you would the project's source code. Part of that process includes versioning and source code control. Also, testing should also be a part of your process. This article gives an overview of the different types of tests that can be run against a Terraform project.

[!INCLUDE [hashicorp-support.md](includes/hashicorp-support.md)]

## Integration Testing

Integration tests validate that a newly introduced code change doesn't break existing code. In DevOps, continuous integration (CI) refers to a process that builds the entire system whenever the code base is changed - such as someone wanting to merge a PR into a Git repo. The following list contains common examples of integration tests:

- Static code analysis tools such as lint and format.
- Run [terraform validate](https://www.terraform.io/docs/commands/validate.html) to verify the syntax of the configuration file.
- Run [terraform plan](https://www.terraform.io/docs/commands/validate.html) to ensure the configuration will work as expected.

> [!div class="nextstepaction"]
> [Learn more about integration testing](best-practices-integration-testing.md)

## Unit testing

Unit tests ensure a specific part or function of a program behave correctly. Unit tests are written by the developer of the functionality. Sometimes called test-driven development, or TDD, this type of testing involves continuous short development cycles. In the context of Terraform projects, unit testing can take the form of using `terraform plan` to ensure that the actual values available in the generated plan equal the expected values. 

Unit testing can be especially beneficial when your Terraform modules start to become more complex:

- Generate dynamic blocks
- Use loops
- Calculate local variables

As with integration tests, many times unit tests are included in the continuous integration process.

## Compliance testing

Compliance testing is used to ensure the configuration follows the policies you've defined for the project. For example, you might define geopolitical naming conventions for your Azure resources. Or you might want virtual machines to be created from a defined subset of images. Compliance testing would be used to enforce these rules.

Compliance testing is also typically defined as part of the continuous integration process.

> [!div class="nextstepaction"]
> [Learn more about compliance testing](best-practices-compliance-testing.md)

## End-to-end (E2E) testing

E2E tests validate a program works before deploying to production. An example scenario might be a Terraform module deploying two virtual machines into a virtual network. You might want to prevent the two machines from pinging each other. In this example, you could define a test to verify the intended outcome before deployment.

E2E testing is typically a three-step process. First, the configuration is applied to a test environment. Code would then be run to verify the results. Finally, the test environment is either reinitialized or taken down (such as deallocating a virtual machine).

> [!div class="nextstepaction"]
> [Learn more about End-to-end Testing](best-practices-end-to-end-testing.md)