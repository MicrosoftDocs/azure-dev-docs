---
 author: tomarchermsft
 ms.service: ansible
 ms.topic: include
 ms.date: 04/09/2020
 ms.author: tarcher
---

- **Configure Azure collection**: Run the following command from a terminal window to install the Azure collection. If the Azure collection is already installed, the `--force` flag will update it to the most recent version.

    ```bash
    ansible-galaxy collection install azure.azcollection --force
    ```
