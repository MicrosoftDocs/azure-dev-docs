---
title: Contoso Real Estate test Portal solution
description: Learn how to test the Contoso Real Estate Portal with Playwright.
ms.topic: tutorial
ms.date: 12/01/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
---

# Tutorial: Test UI with Playwright for Contoso Real Estate 

In this tutorial, learn how to test the Contoso Real Estate portal.

The Contoso Real Estate application is an example end to end architecture, along with full source code solution and deployment infrastructure. It's provided for JavaScript developers who need to learn how to design, develop, deploy, and devops (4Dx) to Azure.

> [!div class="checklist"]
> - Understand end to end testing with Playwright
> - Open project with GitHub Codespaces in browser
> - Run the Playwright tests 
> - Review the test results
> - Find resource information

> [!NOTE]
> The Contoso Real Estate project is a work in progress. When you complete this tutorial, your output may be different than what is shown in this tutorial.

## UI testing with Playwright

The purpose of **Test Automation** is about executing tests automatically to validate [software specs](contoso-real-estate-user-scenarios.md), then using the reported insights to improve software quality iteratively. For UIs, this requires tools that can automate test actions in the browser (web automation) and support this consistently across browsers.

Playwright is an open-source framework for reliable end-to-end testing of modern web apps. It's built to enable cross-browser web automation that is ever-green, capable, reliable and fast. 

**What kinds of things can we test with Playwright?**

* Test if UI workflows are correct (navigation, inputs)
* Test UX behaviors in different contexts (with fixtures)
* Test API endpoints

## How to get the portal UI endpoint

The portal UI endpoint is available in an environment variable based on which environment the application is running in:

* **Local development on a local machine**: The local computer is running the portal locally. The portal UI is available at `http://localhost:4280/`.
* **GitHub Codespaces**: The Codespaces environment is run in a browser from a cloud-based container. Use environment variables to construct the portal UI endpoint from the host and port:  `https://${process.env.CODESPACE_NAME}-${process.env.CODESPACE_PORT}.githubpreview.dev`.
* **Azure**: The portal UI is deployed to Azure Static Web Apps. The deployed endpoint is available from the Azure Developer CLI's `.env` file based on the output variable used in the main.bicep. For this specific project, the environment variable name `SERVICE_WEB_UI`. 

## Prerequisites 

* GitHub account: access to the Contoso Real Estate repository and ability to fork and open with GitHub Codespaces is required to complete tutorial. 
* Azure subscription: a free account can be created [here](https://azure.microsoft.com/free/)

## Prepare to test the portal UI in Codespaces

The Contoso Real Estate monorepo is configured with DevContainers. The DevContainers include the required dependencies to develop locally including npm packages and database services such as PostGreSQL and MongoDB.

Use the following steps to prepare to test the portal UI locally. 

1. Go to the Contoso Real Estate project on GitHub and select [fork](https://github.com/Azure-Samples/contoso-real-estate/fork). Complete the steps to fork the `main` branch into your own GitHub account.
1. Open the forked repository in GitHub Codespaces: select **Code** then select **Codespaces** tab, then select **New codespace**.
1. Wait for the Codespace to be created. This may take a few minutes. As part of the container to start, it runs the `./devcontainer/post-create-command.sh` script. This script installs the dependencies.

1. Start the services (MongoDB and PostgreSQL) and applications (CMS, front-end websites, and the API).

    ```bash
    npm start
    ```

Now that the services and applications are running, you can test the poral UI.

## Install Playwright in a new `testing` package.

While you could install the testing infrastructure into the `./packages/portal` folder (monorepo package), for this tutorial you'll create a new package to keep the testing infrastructure separate from the application code. This helps with troubleshooting. 

1. Create a new `testing` package in the `./packages` folder.

    ```bash
    cd packages
    mkdir api-testing
    ```

1. Initialize the package for Playwright

    ```bash
    npm init playwright@latest
    ```

    Answer the prompts as follows:

    |Question|Answer|
    |--|--|
    |Do you want to use TypeScript or JavaScript?|TypeScript|
    |Where to put your end-to-end tests?|tests|
    |Add a GitHub Actions workflow? (y/N)|false|
    |Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n)|y|
    |Install Playwright operating system dependencies (requires sudo / root - can be done manually via 'sudo npx playwright install-deps')? (y/N)|y|

    The initialization process created the typical Node.js file, `package.json` and also created the Playwright configuration file, `playwright.config.ts`. Playwright handles a lot of the infrastructure for you. One example is that while this is a TypeScript test project, the `tsconfig.json` file isn't created by default.


1. Run the default test to validate your test infrastructure is working.

    ```bash
    npx playwright test
    ```

    The test should pass. Now you know the test infrastructure works. 


## Playwright test configuration

Open the `package.json` file and add the following script. This allows the tests to be run from the workspace root.

```json
"scripts": {
    "test": "playwright test"
},
```

## Create a UI test 

1. Delete this `tests/example.spec.ts` test file.
1. Create a new test file in the `tests` folder called `portal.spec.ts`.

    ```bash
    touch tests/portal.spec.ts
    ```

1. Add the following code to the `portal.spec.ts` file.

    ```typescript
    import { test, expect  } from '@playwright/test';
    import { HomePage } from "../models/home-page";

    // create base URL from 3 sources:
    // 1. Azure: JSON.parse(process.env.SERVICE_API_ENDPOINTS)[0] - output array as string from `./infra/main.bicep`
    // 2. GitHub Codespaces: `https://${process.env.CODESPACE_NAME}-${process.env.CODESPACE_PORT}.githubpreview.dev`
    // 3. Local development on a local machine: `localhost:7071`
    const BASE_URL = process.env.SERVICE_WEB_UI
      ? SERVICE_WEB_UI
      : process.env.CODESPACE_NAME
        ? 'http://localhost:4280';
    
    console.log(`BASE_URL: ${BASE_URL}`);
    
    test.use({
      baseURL: BASE_URL
    });
    
    import { test, expect } from "@playwright/test";
    
    /**
     * Test Hooks
     * (set state or take actions before/after each test)
     */
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });
    test.afterEach(async ({ page }) => {});


    test.describe("As guest, I visit the Portal ", () => {
        test("it should have the /home route", async ({ page }) => {
        await new HomePage(page).isAtHome();
        });
        test("it should have a navbar", async ({ page }) => {
        await new HomePage(page).hasNavBar();
        });
        test("it should have a hero section", async ({ page }) => {
        await new HomePage(page).hasHeroSection();
        });
        test("it should have featured listings", async ({ page }) => {
        await new HomePage(page).hasFeaturedListings();
        });
        test("it should have a footer", async ({ page }) => {
        await new HomePage(page).hasFooter();
        });
    });
    ````

1. Run the test. This validates the API is running and can connect to the two databases.

    ```bash
    npm test
    ```

1. The test should pass with output like the following:

    ```console

    ```

## Change test reporter

1. In case you see errors in the output, change the reporter to include the line which errored. Open the `playwright.config.ts` file and change the `reporter` property to the following:

    ```JSON
    reporter: [['list'],['html']],
    ```

1. Run the test again with `npm test` to see the new output:

    ```console
    ```

## Debug the test with Visual Studio extension for Playwright

Once you know the line that is causing the error, you can debug the test. The Contoso Real Estate project has been configured with the [Visual Studio Code extension for Playwright](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). This extension allows you to debug the test in the browser.

1. Open the `portal.spec.ts` file and set a breakpoint on the line that is causing the error. For example, if the following line is causing an error, set a breakpoint:

    ```typescript
    await new HomePage(page).isAtHome();
    ```

1. Open the **Testing** explorer (the icon with the test tube). 
1. Select the **Debug test** button next to the test. 

1. The test will run and stop at the breakpoint.


## More resources

* [Playwright](https://playwright.dev/)
* [End to End Testing w/ Playwright: Mandy Whaley & Arjun Attam - Static Web Apps: Code to Scale (6 of 6)](https://youtu.be/VMl8aV-ddMA)