---
title: Install Node.js for Azure SDK application development
description: Learn how to install Node.js for common development scenarios with Azure.
ms.topic: how-to
ms.date: 12/04/2020
ms.custom: devx-track-js
---

# Install and manage Node.js for common Azure development scenarios

Your installation of Node.js for Azure development should consider both your local development environment and the hosting environment you plan to deploy to. 
Azure provides hosting for Node.js on both Windows and Linux in the Long Term Support (LTS) version. 

## Download and install Node.js based on your intended use

You can download and install Node.js based on your requirements.
 
* [Node.js Download page](https://nodejs.org/en/download/) 
* [Official Docker image](https://hub.docker.com/_/node/)
* [Package Managers](https://nodejs.org/en/download/package-manager/)
* [Bash](https://github.com/nodesource/distributions/blob/master/README.md#debinstall) 

> [!CAUTION] 
> Do not install Node.js using the apt or apt-get packages because Node.js is locked into Node.js 8+. Instead, the recommended installation is the [Bash script](https://github.com/nodesource/distributions/blob/master/README.md#debinstall). 

## Create a package.json file to define your project

The [package.json](https://docs.npmjs.com/cli/v6/configuring-npm/package-json) file is the top-level file to define your project. It contains all the information someone should need to use your project. 

Create a package.json file with the following bash command:

```bash
npm init -y
```

## Provide versioning in your package.json file

The minimum version you install should be noted in your package.json file. If you are starting a new project, begin with the current LTS version. If you are supporting an older project, verify its minimum requirements. 

The package.json version annotation:

```json
  "engines": {
    "node": ">=10.0.0",
    "npm": ">=6.0.0"
  }
```

If you are using [Node Version Manager](https://github.com/nvm-sh/nvm) (NVM) to manage multiple versions on the same system, refer to that documentation to understand how to install and manage the versions you are interested in using. 

## Install project dependencies locally

All dependencies for a project, including build and runtime, should be listed in the `package.json` file. This keeps the project portable, and easily runnable for everyone. 

Azure SDK libraries, TypeScript, linting (ESLint), and formatting (Prettier),  should all be installed at the package level. 

## Don't check in the dependency lock file

Node.js installs different internal libraries based on the operating system or virtual environment it is installed on. The lock file, created when installing dependencies, may have dependencies specific to that operating system. Do not check-in your lock file to your source repository or use the lock file in a CI/CD pipeline unless you know the lock file will work for all operating systems or the development and production environments are the same. 

## Troubleshooting

1. When troubleshooting Node.js projects, start with installing the project:

    ```bash
    npm install
    ```

    If the installation doesn't succeed, make sure the lock file is not used. Read through the errors to determine the best next step. 

    Common issues are:
    * Dependencies missing from the package.json
    * Lock file includes incorrect operating system dependencies

1. Verify the version of your local Node.js installation:

    ```bash
    node --version
    ```

## Next steps

* [Configure your local development environment](configure-local-development-environment.md) for Azure SDK usage