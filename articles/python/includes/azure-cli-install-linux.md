---
ms.custom: devx-track-azurecli, linux-related-content
---
The procedure for installing the Azure CLI on Linux varies depending on the package manager used by your Linux distribution. Follow the instructions for the package manager used by your Linux distribution.

#### [apt (Ubuntu, Debian)](#tab/apt)

##### Option 1: Install with one command

The Azure CLI team maintains a script to run all installation commands in one step. This script is downloaded via `curl` and piped directly to `bash` to install the CLI.

If you wish to inspect the contents of the script yourself before executing, download the script first using curl and inspect it in your favorite text editor.

```Bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

##### Option 2: Step-by-step installation instructions

If you prefer a step-by-step installation process, complete the following steps to install the Azure CLI.

1. Get packages needed for the install process:

    ```bash
    sudo apt-get update
    sudo apt-get install ca-certificates curl apt-transport-https lsb-release gnupg
    ```

2. Download and install the Microsoft signing key:

    ```bash
    curl -sL https://packages.microsoft.com/keys/microsoft.asc |
        gpg --dearmor |
        sudo tee /etc/apt/trusted.gpg.d/microsoft.gpg > /dev/null
    ```

3. <div id="set-release"/>Add the Azure CLI software repository:

    ```bash
    AZ_REPO=$(lsb_release -cs)
    echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" |
        sudo tee /etc/apt/sources.list.d/azure-cli.list
    ```

4. Update repository information and install the `azure-cli` package:

    ```bash
    sudo apt-get update
    sudo apt-get install azure-cli
    ```

#### [dnf (RHEL, Fedora, CentOS)](#tab/dnf)

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and plan accordingly. For more information, see the [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

1. Import the Microsoft repository key.

   ```bash
   sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
   ```

2. Create local `azure-cli` repository information.

   ```bash
   echo -e "[azure-cli]
   name=Azure CLI
   baseurl=https://packages.microsoft.com/yumrepos/azure-cli
   enabled=1
   gpgcheck=1
   gpgkey=https://packages.microsoft.com/keys/microsoft.asc" | sudo tee /etc/yum.repos.d/azure-cli.repo
   ```

3. Install with the `dnf install` command.

   ```bash
   sudo dnf install azure-cli
   ```

#### [zypper (openSUSE, SLES)](#tab/zypper)

1. Install `curl`:

   ```bash
   sudo zypper install -y curl
   ```

2. Import the Microsoft repository key:

   ```bash
   sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
   ```

3. Create local `azure-cli` repository information:

   ```bash
   sudo zypper addrepo --name 'Azure CLI' --check https://packages.microsoft.com/yumrepos/azure-cli azure-cli
   ```

4. Update the `zypper` package index and install:

   ```bash
   sudo zypper install --from azure-cli azure-cli
   ```

   Input 2 to continue install by ignoring some of its dependencies.

---
