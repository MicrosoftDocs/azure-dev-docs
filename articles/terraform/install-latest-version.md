---
title: Install latest version of Terraform in Azure Cloud Shell
description: In this article, you learn how to install latest version of Terraform in Azure Cloud Shell
keywords: terraform azure cli bash install curl
ms.topic: how-to
ms.date: 05/02/2021
ms.custom: devx-track-terraform
# Customer intent: As someone new to Terraform and Azure, I want install latest version of Terraform in Azure Cloud Shell.
---

# Install latest version of Terraform in Azure Cloud Shell

Cloud Shell automatically updates to the latest version of Terraform within a couple of weeks of its release. However, if you need the most recent version sooner, this article shows you how to download and install the current version of Terraform.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## Download and install latest version of Terraform

1. Browse to the [Azure portal](https://portal.azure.com).

1. Open Cloud Shell.

1. Determine the version of Terraform being used in Cloud Shell.

    ```bash
    terraform version
    ```

1. If the Terraform version installed in Cloud Shell isn't the latest version, you'll see information similar to the following:

    :::image type="content" source="media/install-configure/terraform-version-not-current-bash.png" alt-text="Message displayed in Bash terminal when installed Terraform version is not the current version.":::

1. If you're fine working with the indicated version, skip to the next section. Otherwise, continue with the following steps.

1. Browse to the [Terraform downloads page](https://www.terraform.io/downloads.html).

1. Scroll down to the **Linux** download links.

1. Move your mouse over the **64-bit** link. This is the link for the latest 64-bit Linux AMD version, which is appropriate for Cloud Shell.

    :::image type="content" source="media/install-configure/latest-terraform-version-for-linux-64-bit-amd.png" alt-text="Link to latest 64-bit Linux AMD version of Terraform.":::

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

    :::image type="content" source="media/install-configure/terraform-version-is-latest-version-bash.png" alt-text="Output in Bash when the current version of Terraform is current.":::
