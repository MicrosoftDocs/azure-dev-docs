---
author: sptramer
ms.author: sttramer
manager: carmonm
ms.date: 09/05/2018 
ms.topic: include
ms.prod: azure
ms.technology: azure-cli
---
The [Azure SDK for Go](https://github.com/Azure/azure-sdk-for-go) is compatible with Go versions 1.8 and higher. For environments using
[Azure Stack Profiles](/azure/azure-stack/user/azure-stack-version-profiles-go), Go version 1.9 is the minimum requirement.
If you need to install Go, follow [the Go installation instructions](https://golang.org/doc/install).

You can download the Azure SDK for Go and its dependencies via `go get`.

```bash
go get -u -d github.com/Azure/azure-sdk-for-go/...
```

> [!WARNING]
> Make sure that you capitalize `Azure` in the URL. Doing otherwise can cause case-related import problems
> when working with the SDK. You also need to capitalize `Azure` in your import statements.
