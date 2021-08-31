---
title: "3-Client: Create React app"
description: The React app will be the user interface for this simple app. All of the code is provided for you, as part of the complete sample. 
ms.topic: how-to
ms.date: 08/31/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---

# 3. Create a React app for your web site

The React app will be the user interface for this simple app. All of the code is provided for you:
* Sample [basic app](https://github.com/Azure-Samples/js-e2e-static-web-app-with-cli/tree/1-basic-app-with-api) - on branch named `1-basic-app-with-api`

## Create React app with npm targeting TypeScript

1. Open VS Code in the directory, which will become the root of the project. 
1. In VS Code, open an integrated **bash** terminal. All remaining terminal commands should be run from the same terminal unless otherwise specified. 

1. In the root of the project, create a _create-react-app_ in `/app` directory with the following command:

    ```bash
    npx create-react-app app --template typescript
    ```

1. Install dependencies for the local React app:

    ```bash
    cd app && npm install typescript --save-dev && npm install 
    ```

1. Change `./app/tsconfig.json` to ignore compile errors for any variables without a specified type:

    ```json
    "noImplicitAny": false
    ```

    This specific step is to bypass any issues with create-react-app. In your professional projects, once you are comfortable with your build and deployment of the app, return to this setting and set it to `true`. Resolve any compile-time errors for TypeScript before committing these changes to source control. 

## Build and run local React app

1. Verify local React app builds successfully by running the following command from the `./app` directory:

    ```bash
    npm run build
    ```

    If you run into errors, which may happen depending on the version of various packages and your environment, fix the errors before continuing. It is important to know that your project successfully builds locally before moving deployment to Azure Static web apps.

1. Run the project, which should open the project in a browser to `http://localhost:3000/`:
   
    ```bash 
    npm start
    ```

1. When you see the project successfully loaded in the browser, go back to bash terminal and stop the runtime with <kbd>Ctrl</kbd> + <kbd>c</kbd>.
   
1. In the bash terminal, move back to the root of the project:

    ```bash 
    cd ..
    ```

1. Leave this bash terminal open, you will return to it in a later step. 

## Commit app changes to source control

In the VS Code integrated bash terminal, commit the source control to the remote repo:

```bash
git add . && \
    git commit -m "react app" && \
    git push origin main
```

## Next steps

* [Create Azure Static Web app](create-static-web-app.md)