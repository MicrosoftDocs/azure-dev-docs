You'll need `npm` to install the Azure Developer CLI. For detailed steps, see [Install Node.js on Windows Subsystem for Linux](https://docs.microsoft.com/windows/dev-environment/javascript/nodejs-on-wsl). On a high level, run the following commands:

```bash
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install --lts
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```

> [!NOTE]
> May require `sudo` depending on platform and configuration