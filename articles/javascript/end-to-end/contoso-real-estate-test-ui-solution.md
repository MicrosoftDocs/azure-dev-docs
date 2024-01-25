---
title: Contoso Real Estate test Portal solution
description: Learn how to test the Contoso Real Estate Portal with Playwright.
ms.topic: tutorial
ms.date: 01/24/2024
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

[Playwright](https://playwright.dev/) is an open-source framework for reliable end-to-end testing of modern web apps. It's built to enable cross-browser web automation that is ever-green, capable, reliable and fast. 

**What kinds of things can we test with Playwright?**

* Test if UI workflows are correct (navigation, inputs)
* Test UX behaviors in different contexts (with fixtures)
* Test API endpoints

## How to get the portal UI endpoint

The portal UI endpoint is available in an environment variable based on which environment the application is running in:

* **Local development on a local machine**: The local computer is running the portal locally. The portal UI is available at `http://127.0.0.1:4280/`.
* **GitHub Codespaces**: The Codespaces environment is run in a browser from a cloud-based container. Use environment variables to construct the portal UI endpoint from the host and port:  `https://${process.env.CODESPACE_NAME}-${process.env.CODESPACE_PORT}.githubpreview.dev`.
* **Azure**: The portal UI is deployed to Azure Static Web Apps. The deployed endpoint is available from the Azure Developer CLI's `.env` file based on the output variable used in the main.bicep. For this specific project, the environment variable name `SERVICE_WEB_UI`. 

## Prerequisites 

* Azure subscription: a free account can be created [here](https://azure.microsoft.com/free/)
* GitHub account: access to the Contoso Real Estate repository and ability to fork and open with GitHub Codespaces is required to complete tutorial. 

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

    This is equivalent to running `docker compose up -d`, the `-d` indicates a detached state of the process, so the output of each service isn't shown in the terminal. This leaves the terminal free for other commands.

Now that the services and applications are running, you can test the portal UI.

## Install Playwright in a new `testing` package

While you could install the testing infrastructure into the `./packages/portal` folder (monorepo package), for this tutorial you'll create a new package to keep the end-to-end testing infrastructure separated from the application code. This helps with troubleshooting. 

1. Create a new `ui-testing` package in the `./packages` folder.

    ```bash
    cd packages
    mkdir ui-testing
    cd ui-testing
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

## Create a TypeScript class for the Home page 

Create a new class file to define the Home Page named `home-page.ts`.

```TypeScript
import { expect, Locator, Page } from "@playwright/test";
import { CONFIG } from "../config";

interface Config {
    navProfileMenuName: string;
    footerAboutLinkName: string;
    guestLoginLinkName: string;
    navLinkName: string;
    heroTitleName: string;
    footerLogoName: string;
}

export class HomePage {

    readonly page: Page;
    readonly path: string = CONFIG.BASE_URL + "/home";

    readonly appShortName = "Contoso Rentals"
    readonly appLongName = "Contoso Real Estate"

    readonly config: Config = {
    navProfileMenuName: "User profile menu",
    footerAboutLinkName: "About",
    guestLoginLinkName: "Login",
    navLinkName: `${this.appShortName}`,
    heroTitleName: `${this.appLongName}`,
    footerLogoName: `${this.appShortName}`,
    };
    navLogo: Locator;
    navAuth: Locator;
    heroTitle: Locator;
    heroLogo: Locator;
    guestLoginLink: Locator;
    footerLogo: Locator;
    footerAboutLink: Locator;

    constructor(page: Page) {
    this.page = page;

        // Get elements of page
        this.navLogo = this.createLocator("mat-toolbar", "img", this.config.navLinkName);
        this.navAuth = this.createLocator("mat-toolbar", "button", this.config.navProfileMenuName);
        this.heroLogo = this.page.locator(".stage").locator("img");
        this.heroTitle = this.createLocator(undefined, "heading", this.config.heroTitleName);
        this.guestLoginLink = this.createLocator(undefined, "menuitem", this.config.guestLoginLinkName);
        this.footerLogo = this.createLocator("contentinfo", "link", this.config.footerLogoName);
        this.footerAboutLink = this.createLocator(undefined, "link", this.config.footerAboutLinkName);

    }
    createLocator(parentSelector: string | undefined, role: string, name: string) {
    if (parentSelector) {
        return this.page.locator(parentSelector);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.page.getByRole(role as any, { name });
    }

    async goto() {
    await this.page.goto(this.path);
    }
    async isAtHome() {
    expect(this.page.url().endsWith(this.path));
    }
    async hasNavBar() {
    await expect(this.navLogo).toBeVisible();
    await expect(this.navAuth).toBeVisible();
    }
    async hasHeroSection() {
    await expect(this.heroLogo).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
    }
    async hasFooter() {
    await expect(this.footerAboutLink).toBeVisible();
    await expect(this.footerLogo).toBeVisible();
    }
}
```

This TypeScript code defines the class `HomePage`` that represents the portal's home page in the Contoso Real Estate application. The class contains properties for interacting with various elements on the page using the Playwright testing library.

## Create Playwright test for the Home page

1. Create a new test file in the `tests` folder called `portal.spec.ts`.

1. Add the following code to the `portal.spec.ts` file.

    ```typescript
    import { test } from "@playwright/test";
    import { HomePage } from "../models/home-page";
    
    console.log(`Running on base: ${process.env.SERVICE_WEB_URI}`)
    
    test.use({
      baseURL: process.env.SERVICE_WEB_URI,
    });
    
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });
    test.afterEach(async ({ page }) => {});
    
    // ----- E2E Walkthrough ----
    test.describe("As a guest, I visit the Contoso HR Home page", () => {
      test("should validate parts of Home page", async ({ page }) => {
    
        // 1. Set Page Object Model to match context page
        const homePage = new HomePage(page);
    
        // 2. Check that I'm on the right page (path)
        await homePage.isAtHome();
    
        // // 3. Check that page layout is correct
        await homePage.hasNavBar();
        await homePage.hasHeroSection();
        await homePage.hasFooter();
      });
    });
    ```

    The value of `BASE_URL` is set based on the environment. The possible three values are:

    |Environment|Value|
    |--|--|
    |`LOCAL_BASE_URL` - Local development on a local machine where the client application is started with the SWA CLI. The SWA CLI is used to proxy API requests to the server.|`http://localhost:4280`|
    |`CODESPACE_NAME` - The GitHub Codespaces name for the environment. By default the Codespaces is given a name. You can rename your Codespace to be more meaningful to you.|`https://${process.env.CODESPACE_NAME}-${process.env.CODESPACE_PORT}.githubpreview.dev`|
    |`SERVICE_WEB_UI` - Azure Static Web Apps|`http://localhost:7072`|


1. Run the test. 

    ```bash
    npx playwright test
    ```

1. The test should pass with output like the following:

    ```console
     $ npm run test --workspace=testing
    
    > api-test@1.0.0 test
    > npx playwright test
    
    BASE_URL: http://127.0.0.1:4280
    
    Running 2 tests using 1 worker
    BASE_URL: http:///127.0.0.1:4280
      1 passed (1.5s)
    
    To open last HTML report run:
    
      npx playwright show-report
    ```


## More resources

* [Contoso Real Estate](https://github.com/Azure-Samples/contoso-real-estate)
* [Playwright](https://playwright.dev/)
* [End to End Testing w/ Playwright: Mandy Whaley & Arjun Attam - Static Web Apps: Code to Scale (6 of 6)](https://youtu.be/VMl8aV-ddMA)