---
ms.author: tarcher
ms.topic: include
ms.date: 04/22/2023
ms.custom: devx-track-terraform
---

Cloud Shell automatically updates to the latest version of Terraform. However, the updates come within a couple of weeks of release. This article shows you how to download and install the current version of Terraform.

1. Determine the version of Terraform being used in Cloud Shell.

    ```bash
    terraform version
    ```

1. If the Terraform version installed in Cloud Shell isn't the latest version, you see a message indicating that the version of Terraform is out of date.

1. If you're fine working with the indicated version, skip to the next section. Otherwise, continue with the following steps.

1. Browse to the [Terraform downloads page](https://www.terraform.io/downloads.html).

1. Scroll down to the **Linux** download links.

1. Move your mouse over the **64-bit** link. This link is for the latest 64-bit Linux AMD version, which is appropriate for Cloud Shell.

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

1. Close and restart Cloud Shell.

1. Verify that the downloaded version of Terraform is first in the path.

    ```bash
    terraform version
    ```
