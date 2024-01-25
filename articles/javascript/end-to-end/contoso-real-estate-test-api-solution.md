---
title: Contoso Real Estate test API solution
description: Learn how to test the Contoso Real Estate APIs with Playwright.
ms.topic: tutorial
ms.date: 12/01/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
---

# Tutorial: Test serverless APIs with Playwright for Contoso Real Estate 

In this tutorial, learn how to test the deployed Contoso Real Estate APIs.

The Contoso Real Estate application is an example end to end architecture, along with full source code solution and deployment infrastructure. It's provided for JavaScript developers who need to learn how to design, develop, deploy, and devops (4Dx) to Azure.

> [!div class="checklist"]
> - Understand end to end testing with Playwright
> - Open project with GitHub Codespaces in browser
> - Run the Playwright tests 
> - Review the test results
> - Find resource information

> [!NOTE]
> The Contoso Real Estate project is a work in progress. When you complete this tutorial, your output may be different than what is shown in this tutorial.

## API testing with Playwright

The purpose of **Test Automation** is about executing tests automatically to validate [software specs](contoso-real-estate-user-scenarios.md), then using the reported insights to improve software quality iteratively. For APIs, this requires tools that can automate test actions and support this consistently across development, CICD, and production environments.

[Playwright](https://playwright.dev/) is an open-source framework for reliable end-to-end testing of modern web apps. It's built to enable cross-browser web automation that is ever-green, capable, reliable and fast. 

**What kinds of things can we test with Playwright?**

* Test if UI workflows are correct (navigation, inputs)
* Test UX behaviors in different contexts (with fixtures)
* Test API endpoints

## How to get the API endpoint

The API endpoint is available in an environment variable based on which environment the application is running in:

* **Local development on a local machine**: The local computer is running the Azure Functions API locally. The API is available at `http://localhost:7071/api/`.
* **GitHub Codespaces**: The Codespaces environment is run in a browser from a cloud-based container. Use environment variables to construct the API endpoint from the host and port:  `https://${process.env.CODESPACE_NAME}-${process.env.CODESPACE_PORT}.githubpreview.dev`.
* **Azure**: The API is deployed to Azure Functions. The deployed endpoint is available from the Azure Developer CLI's `.env` file based on the output variable used in the main.bicep. For this specific project, the environment variable name `SERVICE_API_ENDPOINTS`. This variable is a stringified array. In order to use it in the test, you need to parse it into an array and then select the first item in the array.

## Prerequisites 

* Azure subscription: a free account can be created [here](https://azure.microsoft.com/free/)
* GitHub account: access to the Contoso Real Estate repository and ability to fork and open with GitHub Codespaces is required to complete tutorial. 

## Prepare to test the APIs in Codespaces

The Contoso Real Estate monorepo is configured with DevContainers. The DevContainers include the required dependencies to develop locally including npm packages and database services such as PostGreSQL and MongoDB.

Use the following steps to prepare to test the API when running the API locally. 

1. Go to the Contoso Real Estate project on GitHub and select [fork](https://github.com/Azure-Samples/contoso-real-estate/fork). Complete the steps to fork the `main` branch into your own GitHub account.
1. Open the forked repository in GitHub Codespaces: select **Code** then select **Codespaces** tab, then select **New codespace**.
1. Wait for the Codespace to be created. This may take a few minutes. As part of the container to start, it runs the `./devcontainer/post-create-command.sh` script. This script installs the dependencies.

1. Start the services (MongoDB and PostgreSQL) and applications (CMS, front-end websites, and the API).

    ```bash
    npm start
    ```

    This is equivalent to running `docker compose up -d`, the `-d` indicates a detached state of the process, so the output of each service isn't shown in the terminal. This leaves the terminal free for other commands.

Now that the services and applications are running, you can test the API.

## Install Playwright in a new `test-api` package.

While you could install the testing infrastructure into the `./packages/api` folder (monorepo package), for this tutorial you'll create a new package to keep the testing infrastructure separated from the application code. This helps with troubleshooting. 

1. Create a new `api-testing` package in the `./packages` folder.

    ```bash
    cd packages
    mkdir api-testing
    cd api-testing
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

    The test should pass. Notice that the default test is a browser-based test but this tutorial is about API testing. There isn't any harm in installing the browsers and running the default test. You can remove the browsers later if you want to. Now you know the test infrastructure works. 

## Create an API test 


1. Create a new test file in the `tests` folder called `api.spec.ts`.

1. Add the following code to the `api.spec.ts` file.

    ```typescript
    import { test, expect  } from '@playwright/test';
    
    const LOCAL_BASE_URL = 'http://localhost:7072';

    const BASE_URL = process.env.SERVICE_API_ENDPOINTS
      ? JSON.parse(process.env.SERVICE_API_ENDPOINTS)[0]
      : process.env.CODESPACE_NAME
        ? LOCAL_BASE_URL;
    
    console.log(`BASE_URL: ${BASE_URL}`);
    
    test.use({
      baseURL: BASE_URL
    });
    
    // Test that PostgreSQL DB is up and running
    // Default: listings returns array of items
    test('should get listings', async ({ request }) => {
    
      const urlsResponse = await request.get('/api/listings');
    
      expect(urlsResponse.ok()).toBeTruthy();
    
      const responseJson = await urlsResponse.json();
      expect(Array.isArray(responseJson)).toBeTruthy();
      expect(responseJson.length).not.toEqual(0);
    });
    
    // Test that Cosmos DB is up and running
    // Default: users is empty so returns 404
    test('should get users', async ({ request }) => {
    
      const urlsResponse = await request.get('/api/users');
    
      expect(urlsResponse.ok()).toBeFalsy();
    
      // Test for correct error status code
      // Assumes users table is empty
      expect(urlsResponse.status()).toEqual(404);
    
    });
    ````

1. Run the test. This validates the API is running and can connect to the two databases.

    ```bash
    npx playwright test
    ```

1. The test should pass with output like the following:

    ```console
     $ npm run test --workspace=api-test
    
    > api-test@1.0.0 test
    > npx playwright test
    
    BASE_URL: http://localhost:7071
    
    Running 2 tests using 1 worker
    BASE_URL: http://localhost:7071
      2 passed (1.5s)
    
    To open last HTML report run:
    
      npx playwright show-report
    ```

## Change test reporter

1. In case you see errors in the output, change the reporter to include the line which errored. Open the `playwright.config.ts` file and change the `reporter` property to the following:

    ```JSON
    reporter: [['list'],['html']],
    ```

1. Run the test again with `npm test` to see the new output:

    ```console
    > api-test@1.0.0 test
    > npx playwright test
    
    BASE_URL: http://localhost:7071
    
    Running 2 tests using 1 worker
    
    BASE_URL: http://localhost:7071
      ✓  1 function.api.spec.ts:19:5 › should get listings (387ms)
      ✓  2 function.api.spec.ts:32:5 › should get users (351ms)
    
      2 passed (1.1s)
    ```

## Debug the test with Visual Studio extension for Playwright

Once you know the line that is causing the error, you can debug the test. The Contoso Real Estate project has been configured with the [Visual Studio Code extension for Playwright](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). This extension allows you to debug the test in the browser.

1. Open the `api.spec.ts` file and set a breakpoint on the line that is causing the error. For example, if the following line is causing an error, set a breakpoint:

    ```typescript
    expect(urlsResponse.ok()).toBeTruthy();
    ```

1. Open the **Testing** explorer (the icon with the test tube). 
1. Select the **Debug test** button next to the test. 

    :::image type="content" source="media/contoso-real-estate-test-api-solution/visual-studio-code-playwright-debug-test.png" alt-text="Screenshot of Visual Studio Code using Playwright extension with the debug tests icon highlighted in red.":::

1. The test will run and stop at the breakpoint.

    :::image type="content" source="media/contoso-real-estate-test-api-solution/visual-studio-code-playwright-debug-test-breakpoint.png" lightbox="media/contoso-real-estate-test-api-solution/visual-studio-code-playwright-debug-test-breakpoint.png" alt-text="Screenshot of Visual Studio Code debugging Playwright test, stopped at breakpoint.":::

## More resources

* [Contoso Real Estate](https://github.com/Azure-Samples/contoso-real-estate)
* [Playwright](https://playwright.dev/)
* [End to End Testing w/ Playwright: Mandy Whaley & Arjun Attam - Static Web Apps: Code to Scale (6 of 6)](https://youtu.be/VMl8aV-ddMA)