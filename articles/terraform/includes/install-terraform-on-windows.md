---
title: include file
description: include file
ms.topic: how-to
ms.date: 08/01/2021
ms.custom: devx-track-terraform
ms.author: jduffney
---

1. [Download Terraform](https://www.terraform.io/downloads.html). This article was tested using Terraform version 1.0.3.

1. From the download, extract the executable to a directory of your choosing (for example, `c:\terraform`).

1. [Update your system's global path](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows) to the executable.

1. Open a terminal window.

1. Verify the global path configuration with the `terraform` command.

    ```powershell
    terraform -version
    ```
