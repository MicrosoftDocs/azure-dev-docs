---
title: Azure Test Guide for JavaScript Applications
description: "Learn unit, integration, CI/CD, and AI testing strategies with Azure SDKs for JavaScript applications to ensure code quality and performance. Start testing today!"
ms.topic: article
ms.date: 06/09/2025
ms.custom: devx-track-js
intent: As a JavaScript developer, new to Azure, you want to learn about test Azure cloud applications.
---

# Azure test guide for JavaScript applications

As a JavaScript developer new to Azure, use this Azure test guide to learn unit, integration, CI/CD, and AI testing strategies with Azure SDKs and ensure your application’s quality, performance, and reliability.

## Inner and outer test loops for Azure SDKs in JavaScript

Inner and outer test loops are foundational concepts in software testing, especially for applications deployed on cloud platforms like Azure:

* The *inner loop* refers to a local environment where developers frequently run unit and integration tests during the development phase. This loop focuses on quick feedback and iteration.

* The *outer loop* encompasses tests that developers run in continuous integration and continuous delivery (CI/CD) pipelines, staging, and production environments. These tests often take advantage of Azure DevOps or GitHub Actions.

These tests include end-to-end (E2E), performance, and security tests. They validate the application's behavior in environments that closely mirror or are identical to the final production environment. Efficient testing strategies use both loops to help ensure comprehensive coverage and quality assurance before and after deployment.

Learn more:

* [CI/CD: The what, why, and how](https://resources.github.com/devops/ci-cd/)
* [A beginner's guide to CI/CD and automation on GitHub](https://github.blog/2022-06-03-a-beginners-guide-to-ci-cd-and-automation-on-github/)
* [GitHub Actions starter workflows](https://github.com/actions/starter-workflows)
* [Use cloud-hosted browsers for locally deployed apps](/azure/playwright-testing/how-to-test-local-applications)

## Local and cloud-based testing with Azure SDK

*Local testing without Azure* involves simulating Azure services. Use this approach to test changes quickly without incurring the costs or network latency associated with real Azure services.

On the other hand, *cloud-based testing with Azure* takes advantage of actual Azure resources to validate the application's integration, security, and performance in a cloud environment. This method is crucial for final validation in a production-like setting. It helps ensure that the application behaves as expected with live Azure services.

Emulators and development containers enhance local development with Azure services differently. Emulators mimic Azure services for cost-effective, early-stage testing without Azure charges, but they might not fully replicate live service features. Development containers replicate the production environment more closely, including application dependencies and services, to help facilitate a seamless transition to production. Development containers suit complex applications but require more setup than emulators.

### Emulators

Emulators include:

* [Azurite (Azure Storage Emulator)](https://www.npmjs.com/package/azurite)
* [Azure Cosmos DB Emulator](/azure/cosmos-db/how-to-develop-emulator)
* [Azure SignalR Emulator](/azure/azure-signalr/signalr-howto-emulator)
* [Azure Event Hubs Emulator](/azure/event-hubs/overview-emulator)
* [Azure Functions Core Tools (Local Azure Functions Runtime)](/azure/azure-functions/functions-run-local)
* [Azure Logic Apps Standard (Local Development)](/azure/logic-apps/create-standard-workflows-visual-studio-code)
* [Azure API Management Self-hosted Gateway](/azure/api-management/self-hosted-gateway-overview)
* [Azure IoT Edge Runtime](/azure/iot-edge/about-iot-edge)

### Development containers

Development containers offer a powerful alternative to using emulators for local development, especially in working with Azure services.

By running services in containers, create a local environment that closely mirrors the production environment to provide consistency across development, testing, and deployment stages. It also enhances the reliability of testing by simulating real-world conditions more accurately.

Configure containers to replicate the settings and data of Azure services. In this way, containers provide a robust platform for developing and testing applications without the overhead of connecting to live Azure services.

Development containers include [Azure SQL Database](https://github.com/microsoft/azuresql-devcontainers).

Learn more:

* [Development Container Specification](https://containers.dev/)
* [Open Container Initiative](https://opencontainers.org/about/overview/)

## Unit tests in JavaScript

Unit testing with Azure SDKs in JavaScript often uses frameworks like [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/) to isolate and test individual components or functions.

For native Node.js tests, stub Azure SDK calls manually without additional libraries by overriding methods on the SDK client prototypes or using simple mock functions.

For more information, see the [Azure SDK tests](#azure-sdk-tests) section later in this article.

## Integration tests in JavaScript

Integration testing assesses the interaction between your application and Azure services, to help ensure that components work together as expected.

Set up [automated integration tests](/entra/identity-platform/test-automate-integration-testing) by using Azure Pipelines in Azure DevOps or workflows in GitHub Actions. This approach automates the deployment and testing of components in a cloud environment. It helps identify problems that might not be apparent during unit testing, such as network latency or service configuration errors.

## Mock Azure services

Mocking Azure services is a common practice in testing JavaScript applications that integrate with Azure SDKs. By simulating Azure service responses, isolate your application logic from external dependencies, which helps ensure that tests run quickly and reliably.

Learn more about [how to test Azure SDK integrations](../sdk/test-sdk-integration.md).

## Continuous integration tests

CI testing involves automatically running tests every time a change is made to the codebase. CI tools like Azure DevOps provide integrated environments for automating builds, tests, and deployments. Configuring pipelines to include automated tests helps ensure that every change is verified, which reduces the likelihood of bugs and regressions.

Proper *pipeline configuration* is crucial for efficient CI processes. It includes setting up triggers for automatic test execution and configuring environments for various stages of testing.

Learn more:

* [A beginner's guide to CI/CD and automation on GitHub](https://github.blog/2022-06-03-a-beginners-guide-to-ci-cd-and-automation-on-github/)
* [GitHub action starter workflows](https://github.com/actions/starter-workflows)
* [Example Node.js workflows](https://docs.github.com/actions/guides/building-and-testing-nodejs)

## Azure Test Plans

[Azure Test Plans](https://azure.microsoft.com/products/devops/test-plans) offers a comprehensive suite for manual and exploratory testing within Azure DevOps.

This service can help in scenarios that require human judgment or are difficult to automate, by providing a structured approach to manual testing. Teams can use it to plan, execute, and track test activities, including capturing rich data like screenshots and videos to aid in bug reporting. Integrating Azure Test Plans into your CI/CD process provides a holistic testing strategy that covers both automated and manual test cases.

## End-to-end tests

End-to-end testing validates the complete operation of an application in an environment that simulates real user scenarios. By using frameworks like [Playwright](https://playwright.dev/), you can automate browser-based tests to interact with your applications as users would.

*Scenario-based testing* involves creating test cases for complete user flows, such as signing up, performing a task, and signing out. Use this testing to verify the application's functionality and user experience on Azure.

Learn more:

* [Get started with Playwright](https://playwright.dev/docs/intro)
* [Run end-to-end tests at scale](/azure/playwright-testing/quickstart-run-end-to-end-tests)

## Performance tests

Performance testing is essential for applications deployed on Azure to help ensure that they can handle expected loads and perform well under stress.

*Benchmarking* involves measuring the performance of your application against defined metrics or standards. Use the Azure Load Testing service to simulate high traffic and analyze an application's scalability and resilience.

CLI example:

```bash
az load test create --resource-group MyResourceGroup --name MyLoadTest --file loadTestConfig.json
```

Learn more:

* [Recommendations for performance testing](/azure/well-architected/performance-efficiency/performance-test)
* [Azure Load Testing documentation](/azure/load-testing/)
* [Tutorial on identifying performance bottlenecks in a web app](/azure/load-testing/tutorial-identify-bottlenecks-azure-portal)
* [GitHub: Azure Load Testing](https://github.com/microsoft/azure-load-testing)

## Security tests

Security testing on Azure involves identifying potential vulnerabilities in your application to prevent unauthorized access or data breaches.

*Vulnerability scanning* tools are essential for automatically detecting security weaknesses in your code or configurations. By integrating [GitHub Advanced Security](https://docs.github.com/github/getting-started-with-github/about-github-advanced-security) features with traditional Static Application Security Testing (SAST) tools, you can improve the security posture of applications deployed on Azure. Key features include:

* *Code scanning*: Identifies vulnerabilities within the codebase before deployment.
* *Secret scanning*: Helps prevent the exposure of sensitive data.
* *Supply chain monitoring*: Helps protect against potentially compromised dependencies.
  
These integrated security measures can help you identify vulnerabilities early, prevent data breaches, and ensure the integrity of your application's supply chain.

*Penetration testing* simulates cyberattacks against your application to evaluate its security posture. Azure provides guidance and tools for conducting these tests, to help ensure that applications deployed on the platform are secure against threats.

[Azure SDK Security Checklist](https://github.com/Azure/azure-sdk-for-js/blob/main/docs/security-best-practices.md)

Recommend integrating CodeQL into your CI pipeline to catch vulnerabilities early.

Learn more:

* [Recommendations for security testing](/azure/well-architected/security/test)
* [Penetration testing](/azure/security/fundamentals/pen-testing)

## Compliance and governance tests

Ensuring that applications comply with legal, regulatory, and policy requirements is crucial, especially in cloud environments. *Regulatory compliance* testing verifies that your application meets standards such as GDPR, HIPAA, or SOC 2.

Azure offers policy and compliance tools, such as Azure Policy and Azure Blueprints, to help automate and enforce compliance across your Azure resources. These tools simplify the process of maintaining governance and compliance standards in your application deployments.

Learn more:

* [Governance, security, and compliance in Azure](/azure/cloud-adoption-framework/ready/azure-setup-guide/govern-org-compliance?tabs=AzurePolicy)
* [Implement compliance testing with Terraform and Azure](/azure/developer/terraform/best-practices-compliance-testing)

## Accessibility tests

Accessibility testing is essential for making software inclusive and compliant with legal standards. Tools like [Accessibility Insights](https://accessibilityinsights.io/) help identify and fix accessibility issues in web and mobile apps. Integrating Accessibility Insights into development workflows facilitates automated and manual checks by offering guidance and reports based on Web Content Accessibility Guidelines (WCAG) standards.

## A/B tests

A/B testing, or split testing, is a method of comparing two versions of a webpage or app against each other to determine which one performs better. Azure provides the following services that support A/B testing:

* [Azure App Service](/azure/app-service/deploy-staging-slots): Offers deployment slots to allow for staging environments where you can test app versions without affecting the live app.
  
* [Azure Container Apps](/azure/container-apps/): Offers a flexible environment for running microservices-based applications. You can implement A/B testing in this environment to test app versions.

Use these services to deploy variations of your applications and then gauge user response and effectiveness.

## Azure SDK tests

For developers who work with Azure services, gaining proficiency with the Azure SDKs is essential for crafting robust and scalable applications. The following Azure SDK tests, hosted on GitHub for the JavaScript SDKs, are invaluable resources:

* [Azure Storage](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob/test)
* [Azure Event Grid](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventgrid/eventgrid/test)
* [Azure Key Vault](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/keyvault/keyvault-secrets/test)
* [Azure IoT Hub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/iothub/arm-iothub/test)

Exploring these tests offers insights into seamless Azure service integration, showcases best practices for Azure resource interaction, and aids in ensuring efficient and secure implementations. Explore a broader range of SDK examples for a comprehensive understanding.

## Additional resources

- [Unit testing Azure SDKs with Jest or Vitest](../sdk/test-sdk-integration.md)  
