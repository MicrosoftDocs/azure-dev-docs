---
title: Contoso Real Estate test solution
description: Learn how to test the Contoso Real Estate project.
ms.topic: tutorial
ms.date: 10/17/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
---

# Tutorial: Test solutions for Contoso Real Estate 

In this tutorial, learn how to test the deployed Contoso Real Estate portal.

The Contoso Real Estate application is an example end to end architecture, along with full source code solution and deployment infrastructure. It's provided for JavaScript developers who need to learn how to design, develop, deploy, and devops (4Dx) to Azure.

> [!div class="checklist"]
> - Understand end to end testing with Playwright
> - Open project with GitHub Codespaces in browser
> - Run the Playwright tests 
> - Review the test results
> - Find resource information

> [!NOTE]
> The Contoso Real Estate project is a work in progress. When you complete this tutorial, your output may be different than what is shown in this tutorial.

## End to end testing with Playwright

<!--https://dev.to/azure/16-test-automation-with-playwright-odk-->
Modern mobile web applications have to work correctly and consistently across all modern browsers (like Chromium, Firefox or WebKit) and the device platforms they run on (with varying screen sizes, orientations). The purpose of **Test Automation** is about executing tests automatically to validate [software specs](contoso-real-estate-user-scenarios.md), then using the reported insights to improve software quality iteratively. For web apps, this requires tools that can automate test actions in the browser (web automation) and support this consistently across browsers.

Playwright is an open-source framework for reliable end-to-end testing of modern web apps. It features a built-in [Playwright Test Runner](https://playwright.dev/docs/1.21/intro) for automating test execution, and supports a [Playwright Library](https://playwright.dev/docs/1.21/library) to simplify integration into third-party solutions.

**What kinds of things can we test with Playwright?**

* Test if UI component behaviors work as expected (events)
* Test if UI workflows are correct (navigation, inputs)
* Test UX behaviors in different contexts (with fixtures)
* Modify network traffic (auth, proxy etc.) for testing
* Validate behaviors under network conditions (modified)
* Validate behaviors for device contexts (emulated profiles)
* Automate capture of evidence (videos, screenshots) in tests

## Prerequisites 

* GitHub account: access to the Contoso Real Estate repository and ability to fork and open with GitHub Codespaces is required to complete tutorial. 
* Azure subscription: a free account can be created [here](https://azure.microsoft.com/free/)

## Prepare to test the portal in Codespaces

The testing package is part of the Contoso Real Estate monorepo, which has been configured with DevContainers. The DevContainers include the required dependencies to develop locally including npm packages and database services such as PostGreSQL and MongoDB.

Use the following steps to prepare to test locally. 

1. Go to the Contoso Real Estate project on GitHub and select [fork](https://github.com/Azure-Samples/contoso-real-estate/fork). Complete the steps to fork the `main` branch into your own GitHub account.
1. Open the forked repository in GitHub Codespaces: select **Code** then select **Codespaces** tab, then select **New codespace**.
1. Wait for the Codespace to be created. This may take a few minutes.
1. In the development environment, install the dependencies.

    ```bash
    npm install
    ```

1. Start the application so the portal is available for testing.

    ```bash
    npm run start
    ```

## Get the URL for the portal

1. From the **Ports** tab, select the _globe_ icon on the **Portal App (4280)** port to open the API in a new browser tab.
1. Copy the URL for the portal. The URL should look similar to `https://localhost:4280/home/`.
1. Create a new `.env.local` file in the `./packages/testing` folder.
1. Add a new environment variable to the `.env.local` file.

    ```env
    PROD_EP=https://localhost:4280/home/
    ```
1. Open the Command palette: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>. 
1. Search for and select **Testing: focus on Test explorer view**.

## More resources

* [Playwright](https://playwright.dev/)
* [Playwright CLI](https://playwright.dev/docs/cli)
* [End to End Testing w/ Playwright: Mandy Whaley & Arjun Attam - Static Web Apps: Code to Scale (6 of 6)](https://youtu.be/VMl8aV-ddMA)