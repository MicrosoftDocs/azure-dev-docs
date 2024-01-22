---
ms.custom: devx-track-js, contoso-real-estate
ms.topic: include
ms.date: 01/22/2023
---

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