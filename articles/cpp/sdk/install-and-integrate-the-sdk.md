---
title: Install and Integrate the Azure SDK for C++
description: "Learn how to install packages from the Azure SDK for C++ with vcpkg and integrate them into your project with CMake."
author: ronniegeraghty
ms.author: rgeraghty
ms.service: AzureSDKForCpp
ms.topic: install-set-up-deploy #Don't change
ms.date: 11/14/2024
ms.custom: devx-track-cpp

#customer intent: As a developer, I want to seamlessly integrate Azure SDK for C++ libraries into my projects so that I can leverage Azure services efficiently and effectively.

---

# Install & Integrate libraries from the Azure SDK for C++

This guide provides developers with the necessary steps to install libraries from the Azure SDK for C++ using vcpkg and integrate them into their projects with CMake. By following the instructions, you can set up your development environment and begin using Azure services in your C++ applications. Whether you're new to Azure or looking to streamline your integration process, this documentation helps you get started quickly and efficiently.

## Prerequisites

- Any Text Editor
- A terminal
- A C++ compiler
- [git](https://git-scm.com/downloads)
- [CMake](https://cmake.org/download/)
- [An Azure subscription](https://azure.microsoft.com/free/)
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)

## Verify git and CMake installation

To ensure a smooth integration process, it's important to verify that git, and CMake are correctly installed on your system.

1. To verify git is installed properly, run the following command in your terminal:

```shell
git --version
```

2. You should get an output denoting the currently installed version for git, like this:

```shell
git version <version>
```

3. To verify CMake is installed properly, run the following command in your terminal:

```shell
cmake --version
```

4. You should get an output denoting the currently installed version of CMake, like this:

```shell
cmake version <version>
```

## Install vcpkg

To manage and install the Azure SDK for C++ libraries, use vcpkg. vcpkg is a cross-platform package manager that simplifies the process of handling dependencies.

### [Windows - PowerShell](#tab/win-powershell)

1. To install vcpkg, first clone the vcpkg repo. The recommended approach is to clone vcpkg to a central location on your development environment and not in your C++ project directory. In this example, vcpkg is cloned to the home dir.

```ps
cd ~
git clone https://github.com/microsoft/vcpkg.git
```

2. Once the vcpkg repo is cloned, traverse into the new directory and run the `bootstrap-vcpkg.bat` script.

```ps
cd .\vcpkg\
.\bootstrap-vcpkg.bat
```

3. After bootstrapping vcpkg, add it to your path so you can access the vcpkg executable from your project directory. Remember to replace the `<path\to\vcpkg>` in the command example with the path to the vcpkg directory you cloned earlier.

```ps
$env:Path = "$env:Path;<path\to\vcpkg>"
```

4. To verify the vcpkg directory was added to your path, traverse back to your project directory and run the following command:

```ps
vcpkg --version
```

1. You should get the following output:

```ps
vcpkg package management program version <version>
```

### [MacOS/Linux - Bash](#tab/mac-linux-bash)

1. To install vcpkg, first clone the vcpkg repo. The recommended approach is to clone vcpkg to a central location on your development environment and not in your C++ project directory. In this example, vcpkg is cloned to the home dir.

```bash
cd ~
git clone https://github.com/microsoft/vcpkg.git
```

2. Once the vcpkg repo is cloned, traverse into the new directory and run the `bootstrap-vcpkg.sh` script.

```bash
cd vcpkg
./bootstrap-vcpkg.sh
```

3. After bootstrapping vcpkg, add it to your path so you can access the vcpkg executable from your project directory. Remember to replace the `<path\to\vcpkg>` in the command example with the path to the vcpkg directory you cloned earlier.

```bash
export PATH=$PATH:/path/to/vcpkg
```

4. To verify the vcpkg directory was added to your path, traverse back to your project directory and run the following command:

```bash
vcpkg --version
```

1. You should get the following output:

```bash
vcpkg package management program version <version>
```

## Install the libraries

This section guides you through the process of installing the necessary libraries from the Azure SDK for C++ using vcpkg. This section shows how to use vcpkg in manifest mode which creates a couple vcpkg project files to help managed the dependencies of the project even when shared with other collaborators.

1. From the root directory of your project, run the following command to start a new vcpkg project in manifest mode:

```shell
vcpkg new --application
```

2. There should now be a `vcpkg.json` file and a `vcpkg-configuration.json` file in your project directory.
3. Now we can add the Azure Key Vault and Identity libraries from the Azure SDK for C++ to our project by running the following command:

```shell
vcpkg add port azure-identity-cpp azure-security-keyvault-secrets-cpp
```

4. The `vcpkg.json` file should now have the following contents:

```json
{
  "dependencies": [
    "azure-identity-cpp",
    "azure-security-keyvault-secrets-cpp"
  ]
}
```

## Create an Azure Key Vault resource

This section discusses how to use the Azure CLI to create an Azure Key Vault resource. This Key Vault resource securely stores and manages sensitive information, such as secrets and keys.

1. Use the Azure CLI to login by entering following command in your terminal:

```shell
az login
```

2. Use the pop-up windows to log in to Azure.
3. After using the pop-up browser window to log in, select the Azure subscription you'd like to use in the terminal.
4. Then use the following command to create your Key Vault resource, and remember to replace `<your-resource-group-name>` and `<your-key-vault-name>` with your own, unique names:

```shell
az keyvault create --resource-group <your-resource-group-name> --name <your-key-vault-name>
```

5. In the output, you should see a list of properties with a `vaultUri` property. Set that to an environment variable to be used in our program with the following command:

### [Windows - PowerShell](#tab/win-powershell)

```ps
$env:AZURE_KEYVAULT_URL = "https://<your-key-vault-name>.vault.azure.net/"
```

### [MacOS/Linux - Bash](#tab/mac-linux-bash)

```bash
export AZURE_KEYVAULT_URL="https://<your-key-vault-name>.vault.azure.net/"
```

1. Finally, make sure your Azure account has the proper permissions to work with Key Vault Secrets. You can give yourself the proper permissions by assigning yourself the "Key Vault Secrets Officer" role on the Access Control (IAM) page of your Key Vault resource in the Azure portal.

## Set up your project

This section describes the process of creating the necessary folders and files to set up your Azure C++ project.

1. In the root of your project directory, create a `CMakeLists.txt` file. This file is used to configure our CMake project. Add the following code to the `CMakeLists.txt` file:

```cmake
# Specify the minimum version of CMake required to build this project
cmake_minimum_required(VERSION 3.30.0)

# Set the path to the vcpkg toolchain file
# Remember to replace the path below with the path where you cloned vcpkg
set(CMAKE_TOOLCHAIN_FILE "/path/to/vcpkg-root/scripts/buildsystems/vcpkg.cmake")

# Define the project name, version, and the languages used
project(azure_sample VERSION 0.1.0 LANGUAGES C CXX)

# Find and include the azure-identity-cpp package
find_package(azure-identity-cpp CONFIG REQUIRED)

# Find and include the azure-security-keyvault-secrets-cpp package
find_package(azure-security-keyvault-secrets-cpp CONFIG REQUIRED)

# Add an executable target named 'azure_sample' built from the main.cpp source file
add_executable(azure_sample main.cpp)

# Link the azure-identity and azure-security-keyvault-secrets libraries to the azure_sample target
target_link_libraries(azure_sample PRIVATE
    Azure::azure-identity
    Azure::azure-security-keyvault-secrets
)
```

2. In the root of your project directory, create a `main.cpp` file. Add the following code to the `main.cpp` file:

```cpp
#include <azure/identity.hpp>
#include <azure/keyvault/secrets.hpp>
#include <iostream>

using namespace Azure::Security::KeyVault::Secrets;

int main()
{
    try
    {
        // Set Key Vault URL string
        auto const keyVaultUrl = std::getenv("AZURE_KEYVAULT_URL");

        // Create Default Azure Credential to Authenticate.
        // It will pick up on our AzureCLI login
        auto credential = std::make_shared<Azure::Identity::DefaultAzureCredential>();

        // Create Key Vault Secret Client
        SecretClient secretClient(keyVaultUrl, credential);

        // Create a Secret
        std::string secretName("MySampleSecret");
        std::string secretValue("My super secret value");
        secretClient.SetSecret(secretName, secretValue);

        // Get the Secret
        KeyVaultSecret secret = secretClient.GetSecret(secretName).Value;
        std::string valueString = secret.Value.HasValue() ? secret.Value.Value() : "NONE RETURNED";
        std::cout << "Secret is returned with name " << secret.Name << " and value " << valueString << std::endl;
    }
    catch (Azure::Core::Credentials::AuthenticationException const &e)
    {
        std::cout << "Authentication Exception happened:" << std::endl
                  << e.what() << std::endl;
        return 1;
    }
    catch (Azure::Core::RequestFailedException const &e)
    {
        std::cout << "Key Vault Secret Client Exception happened:" << std::endl
                  << e.Message << std::endl;
        return 1;
    }

    return 0;
}
```

3. Create a `build` directory for the build artifacts.

## Build and run

This section discusses how to configure and build your project using CMake commands, and then run the program to ensure everything is set up correctly. The commands in this section should be run from the root of your project where the `build` directory, `CMakeLists.txt`, and `main.cpp` files are located.

1. Configure CMake with the following command:

```shell
cmake -B ./build
```

2. Build the project with the following command:

```shell
cmake --build ./build
```

3. Run the program with the following command:

### [Windows - PowerShell](#tab/win-powershell)

```ps
.\build\Debug\azure_sample.exe
```

### [MacOS/Linux - Bash](#tab/mac-linux-bash)

```bash
./build/azure_sample
```

4. The program should have the following output:

```shell
Secret is returned with name MySampleSecret and value My super secret value
```

## Troubleshooting, validation, and/or FAQ

### Resource group not found

When using the AzureCLI to create a Key Vault instance, if you receive the following error, the resource group you're trying to add the Key Vault instance to doesn't exist.

```err
(ResourceGroupNotFound) Resource group '<your-resource-group-name>' could not be found.
Code: ResourceGroupNotFound
Message: Resource group '<your-resource-group-name>' could not be found.
```

To create the resource group, you can use the following command:

```shell
az group create --name <your-resource-group-name> --location <your-resource-group-location>
```

For more information, check out the [AzureCLI docs on Managing Azure Resource Groups](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-cli).

### CMake configure or build can't find azure packages

When running the CMake configure or build commands, if you receive the following error or something similar, the `CMakeLists.txt` file isn't running the `vcpkg.cmake` module before the CMake project is established or at all.

```shell
CMake Error at CMakeLists.txt:12 (find_package):
  Could not find a package configuration file provided by
  "azure-identity-cpp" with any of the following names:

    azure-identity-cppConfig.cmake
    azure-identity-cpp-config.cmake

  Add the installation prefix of "azure-identity-cpp" to CMAKE_PREFIX_PATH or
  set "azure-identity-cpp_DIR" to a directory containing one of the above
  files.  If "azure-identity-cpp" provides a separate development package or
  SDK, be sure it has been installed.
```

Verify that in the `CMakeLists.txt` file that the `set(CMAKE_TOOLCHAIN_FILE "/path/to/vcpkg-root/scripts/buildsystems/vcpkg.cmake")` line is above the `project(azure_sample VERSION 0.1.0 LANGUAGES C CXX)`.

Then also verify that the `/path/to/vcpkg-root/` in the `set(CMAKE_TOOLCHAIN_FILE "/path/to/vcpkg-root/scripts/buildsystems/vcpkg.cmake")` line is updated to the location where vcpkg was installed.

### Syntax error in cmake code

When running the CMake configuration or build commands, if you receive the following error, the `CMakeLists.txt` file may contain paths using `\`. This issue can be common when using Window's paths.

```shell
Syntax error in cmake code at

    C:/Users/username/Desktop/CppProject/CMakeLists.txt:6

  when parsing string

    C:\Users\username\vcpkg\scripts\buildsystems\vcpkg.cmake

  Invalid character escape '\U'.
```

Even though Windows uses `\` in file paths, CMake only uses `/` in file paths. The issue can be resolved by replacing all `\` with `/` in paths used in the `CMakeLists.txt` file.

If your error persists after making the change, refer to the [CMake errors persist after making change](#cmake-errors-persist-after-making-change) section to learn how to resolve them.

### CMake errors persist after making change

When running the CMake configure command, if you continue to receive the same error after making changes to fix it, try clearing the CMake cache. The CMake cache can be cleared by deleting the content of the `build` directory then rerunning the CMake configure command.

### CMake 3.30 or higher required

When running the CMake configure command, if you receive an error like the following, you may need to update your version of CMake.

```shell
CMake Error at CMakeLists.txt:2 (cmake_minimum_required):
  CMake 3.30.0 or higher is required.  You are running version 3.25.0
```

To resolve this error, update your installation of CMake to the version stated in the error message.

### Caller is not authorized to perform action on resource

When running the C++ sample program, if you receive an error like the following, you don't have the proper permissions to work with secrets on the specified Key Vault resource.

```shell
Key Vault Secret Client Exception happened:
Caller is not authorized to perform action on resource.
If role assignments, deny assignments or role definitions were changed recently, please observe propagation time.
Caller: <redacted-application-information>
Action: 'Microsoft.KeyVault/vaults/secrets/setSecret/action'
Resource: <redacted-resource-information>
Assignment: (not found)
DenyAssignmentId: null
DecisionReason: null 
Vault: <your-key-vault-name>;location=<your-key-vault-location>
```

The proper permissions can be given to your account either using the Azure portal or the Azure CLI.

To update your permissions using the Azure portal, navigate to the Access Control (IAM) page of your Key Vault resource. Select the "Add" dropdown and select Add role assignment. On the Role page, select the Key Vault Secrets Officer role and select Next at the bottom of the page. On the Members page, leave the "Assign access to" option on "User, group, or service principal" and select on the "Select members" link. In the pop-up on right, search for and select your ID, then select "Select" at the bottom of the pop-up. The ID you selected should now show in the table of the "Members" section. Select the "Review + assign" button at the bottom. Then select the "Review + assign" button again.

To update your permissions using the Azure CLI, enter the following command, replacing `<upn>` with your user principal name, `<subscription-id>` with your subscription ID, `<resource-group-name>` with your resource group name, and `<your-unique-keyvault-name>` with your Key Vault instance name:

```shell
az role assignment create --role "Key Vault Secrets Officer" --assignee "<upn>" --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.KeyVault/vaults/<your-unique-keyvault-name>"
```

### VS Code include errors

If you see error lines under your include statements for libraries from the Azure SDK for C++ (shown below) when using VS Code, the editor doesn't know where to find the include directory containing header files for the libraries.

![VSCode Include Error Image](media/vscode-include-error.png)

vcpkg places the include headers in the `build/vcpkg_installed/<vcpkg-platform-triplet>/include` when in manifest mode. *Replace `<vcpkg-platform-triplet>` with the vcpkg triplet for your platform.*

To add the include directory to your VS Code settings, hover over the include statement with the error line. Then select the "Quick Fix..." link at the bottom of the pop-up. In the Quick Fix options, select the `Add to "includePath": ${workspaceFolder}/build/vcpkg_installed/<vcpkg-platform-triplet>/include` option. The C/C++ Extension Configuration tab should open up and under the "Include path" section you should see the path to the include directory listed.

### Linux bootstrap-vcpkg could not find dependencies

When running the `bootstrap-vcpkg.sh` script on Linux, if you receive an error like the following, you don't have the necessary tools installed to run the script.

```shell
Could not find zip. Please install it (and other dependencies) with:
On Debian and Ubuntu derivatives:
  sudo apt-get install curl zip unzip tar
On recent Red Hat and Fedora derivatives:
  sudo dnf install curl zip unzip tar
On older Red Hat and Fedora derivatives:
  sudo yum install curl zip unzip tar
On SUSE Linux and derivatives:
  sudo zypper install curl zip unzip tar
On Arch Linux and derivatives:
  sudo pacman -Syu base-devel git curl zip unzip tar cmake ninja
On Alpine:
  apk add build-base cmake ninja zip unzip curl git
  (and export VCPKG_FORCE_SYSTEM_BINARIES=1)
```

To install the tools, use the provided command in the error message for your linux distribution. For example, on Ubuntu it would be the following command:

```shell
sudo apt-get install curl zip unzip tar
```

Then rerun the `bootstrap-vcpkg.sh` script.

### Linux could not find toolchain file

When running the CMake configure command, if you receive an error like the following, the path to the `vcpkg.cmake` modules wasn't properly set.

```shell
CMake Error at /usr/share/cmake-3.28/Modules/CMakeDetermineSystem.cmake:176 (message):
  Could not find toolchain file:
  /path/to/vcpkg-root/scripts/buildsystems/vcpkg.cmake
Call Stack (most recent call first):
  CMakeLists.txt:9 (project)
```

In the `CMakeLists.txt` file update the `set(CMAKE_TOOLCHAIN_FILE "/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake")` statement with the correct path to where vcpkg was installed.

### Linux vcpkg install failed

When running the CMake configure command, if you receive an error like the following, system dependencies for the packages need to be installed.

```shell
CMake Error at /path/to/vcpkg/scripts/buildsystems/vcpkg.cmake:904 (message):
  vcpkg install failed.  See logs for more information:
```

To find the needed system packages, search the output of the CMake config commands for lines starting with `Could not find <system-package>`, replacing `<system-package>` with the missing system package. Underneath this line should be a command to install that missing system package. Run that command. Then rerun the CMake configuration command. You may need to repeat this process a few times depending on the number of missing system packages.

## Next step
