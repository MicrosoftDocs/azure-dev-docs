---
title: include file
description: include file
ms.topic: how-to
ms.date: 08/05/2021
ms.custom: devx-track-terraform
ms.author: tarcher
---

Cloud Shell automatically updates to the latest version of Terraform within a couple of weeks of its release. However, if you need the most recent version sooner, the following steps show you how to download and install the current version of Terraform.

1. Determine the version of Terraform being used in Cloud Shell.

    ```bash
    terraform version
    ```

1. If the Terraform version installed in Cloud Shell isn't the latest version, you see a message indicating that the version of Terraform is out of date.

1. If you're fine working with the indicated version, skip to the next section. Otherwise, continue with the following steps.

1. Browse to the [Terraform downloads page](https://www.terraform.io/downloads.html).

1. Scroll down to the **Linux** download links.

1. Move your mouse over the **64-bit** link. This is the link for the latest 64-bit Linux AMD version, which is appropriate for Cloud Shell.

1. Copy the URL.

1. Run `curl`, replacing the placeholder with the URL from the previous step.

    ```bash
    curl -O <terraform_download_url>
    ```

1. Unzip the file.

    ```bash
    unzip <zip_file_downloaded_in_previous_step>
    ```

1. If the directory doesn't exist, create a directory named `bin`.

    ```bash
    mkdir bin
    ```

1. Move the `terraform` file into the `bin` directory.

    ```bash
    mv terraform bin/    
    ```

1. Verify that the downloaded version of Terraform is first in the path.

    ```bash
    terraform version
    ```
