---
ms.topic: include
ms.date: 10/09/2023
---

Run the image.

* In the **IMAGES** section of the Docker extension, find the built image.

* Expand the image to find the **latest** tag, right-click and select **Run Interactive**.

* You'll be prompted to select the task appropriate for your scenario, either "Interactive run configuration (MongoDB local)" or "Interactive run configuration (MongoDB Azure)".

With interactive run, you'll see any print statements in the code, which can be useful for debugging. You can also select **Run** which is non-interactive and doesn't keep standard input open.

> [!IMPORTANT]
> This step fails if the default terminal profile is set to (Windows) Command Prompt. To change the default profile, open the VS Code **Command Palette** (**Ctrl+Shift+P**), enter "Terminal: Select Default Profile", and then select a different profile from the dropdown menu; for example *Git Bash* or *PowerShell*.
