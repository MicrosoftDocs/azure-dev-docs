---
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 10/04/2024
---

In this example, the `containerapp up` command includes the `--query properties.configuration.ingress.fqdn` argument, which returns the fully qualified domain name (FQDN), also known as the app's URL. Use the following steps to check the app's logs to investigate any deployment issue:

1. Access the output application URL from the **Outputs** page of the **Deployment** section.

1. From the navigation pane of the Azure Container Apps instance **Overview** page, select **Logs** to check the app's logs.
