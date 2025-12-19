---
title: Configure a proxy server for the Azure Developer CLI
description: Learn how to configure the Azure Developer CLI (azd) and its dependent tools to work behind a corporate proxy server or firewall.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/19/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Configure a proxy server for the Azure Developer CLI

If your organization requires the use of a proxy server to access internet resources, you must configure the Azure Developer CLI (`azd`) and its related tools to route traffic through that proxy. This article explains how to set up proxy configurations for `azd` and the external tools it orchestrates.

## Configure `azd` proxy settings

`azd` is a Go-based application that respects the standard `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` environment variables. Set the following environment variable to use local proxy server:

### Windows (PowerShell)

```powershell
$env:HTTP_PROXY = "http://proxy.example.com:8080"
$env:HTTPS_PROXY = "http://proxy.example.com:8080"
$env:NO_PROXY = "localhost,127.0.0.1,.azurewebsites.net"
```

### Linux / macOS (Bash)

```bash
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="http://proxy.example.com:8080"
export NO_PROXY="localhost,127.0.0.1,.azurewebsites.net"
```

## Handle custom certificates (SSL interception)

Many corporate proxies use SSL interception, which requires your machine to trust the proxy's custom root certificate authority (CA). If `azd` encounters an untrusted certificate, you may see errors like:

`x509: certificate signed by unknown authority`

Because `azd` is written in Go, it uses the operating system's certificate trust store by default. You do not need to configure a specific certificate path for `azd` itself, but you must ensure the proxy's CA certificate is installed in your OS trust store.

### [Windows](#tab/windows)

1. Obtain the proxy's root CA certificate file (`.crt` or `.cer`).
2. Double-click the file and select **Install Certificate**.
3. Choose **Local Machine** and place the certificate in the **Trusted Root Certification Authorities** store.

### [macOS](#tab/macos)

1. Open **Keychain Access**.
2. Drag the certificate file into the **System** keychain.
3. Double-click the certificate, expand **Trust**, and set **When using this certificate** to **Always Trust**.

### [Linux](#tab/linux)

The process varies by distribution. For Ubuntu/Debian:

1. Copy the certificate to `/usr/local/share/ca-certificates/`.
2. Run `sudo update-ca-certificates`.

---

## Configure dependent tools

`azd` orchestrates other tools during the `provision` and `deploy` phases. While `azd` passes its environment variables to child processes, some tools require specific configurations or do not use the OS certificate store.

### Docker

If you use `azd` with Dev Containers or to build container images, Docker must be configured separately.

* **Docker Desktop**: Go to **Settings > Resources > Proxies** and enter your proxy URL.
* **Docker Daemon (Linux)**: Configure the `~/.docker/config.json` or systemd service file. See [Docker Proxy Configuration](https://docs.docker.com/network/proxy/).

### Git

`azd` uses Git for template retrieval and version control.

```bash
git config --global http.proxy http://proxy.example.com:8080
```

### Azure CLI (`az`)

If you use the Azure CLI for authentication (`azd auth login`), it generally respects the system environment variables. However, if you have certificate issues, you may need to point it to your custom certificate bundle:

```bash
export REQUESTS_CA_BUNDLE="/path/to/your/certificate.pem"
```

### Language Runtimes

When `azd` restores dependencies (e.g., `npm install`, `pip install`, `dotnet restore`), the language runtimes may need their own proxy or certificate configuration.

**Node.js**:

```bash
npm config set proxy http://proxy.example.com:8080
npm config set https-proxy http://proxy.example.com:8080
# For certificates:
export NODE_EXTRA_CA_CERTS="/path/to/cert.pem"
```

**Python**:

```bash
pip config set global.proxy http://proxy.example.com:8080
pip config set global.cert /path/to/cert.pem
```

## Troubleshooting

### "Connection refused"

* Verify the proxy URL and port are correct.
* Ensure you are not blocking `localhost` traffic. Add `localhost` and `127.0.0.1` to your `NO_PROXY` variable.

### "x509: certificate signed by unknown authority"

* This confirms `azd` is reaching the proxy but rejects the certificate.
* Verify the certificate is installed in the **OS trust store** (not just the browser).
* Restart your terminal after installing certificates.

### "407 Proxy Authentication Required"

* `azd` supports basic authentication in the proxy URL: `http://username:password@proxy.example.com:8080`.
* **Warning**: This exposes your password in plain text in environment variables. Use with caution.
