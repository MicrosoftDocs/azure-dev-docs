---
author: yevster
ms.author: yebronsh
ms.date: 1/22/2020
---

### Migrate scheduled jobs

To execute scheduled jobs on Azure, consider using a [Timer trigger for Azure Functions](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. The function can simply invoke a URL in your application to trigger the job. If such job executions have to be dynamically invoked and/or centrally tracked, consider using [Spring Batch](https://spring.io/projects/spring-batch).

Alternatively, you can create a Logic app with a Recurrence trigger to invoke the URL without writing any code outside your application. For more information, see [Overview - What is Azure Logic Apps?](/azure/logic-apps/logic-apps-overview) and [Create, schedule, and run recurring tasks and workflows with the Recurrence trigger in Azure Logic Apps](/azure/connectors/connectors-native-recurrence).

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.
