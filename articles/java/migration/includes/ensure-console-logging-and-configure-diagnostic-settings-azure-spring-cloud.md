---
author: yevster
ms.author: yebronsh
ms.date: 4/15/2020
---

### Ensure Console Logging and Configure Diagnostic Settings

All applications in Azure Spring Cloud should log to the console and not to files. Configure your logging accordingly.

Once an application is deployed to Azure Spring Cloud, [add a diagnostic setting](/azure/spring-cloud/diagnostic-services) to make logged events available for consumption, for instance via Azure Monitor Log Analytics.

#### LogStash/ELK Stack
If using LogStash/ELK Stack for log aggregation, configure the diagnostic setting to stream the console output to an [Azure Event Hub](/azure/event-hubs/). Then, use the [LogStash EventHub plugin](https://github.com/logstash-plugins/logstash-input-azure_event_hubs) to ingest logged events into LogStash.

#### Splunk

If using Splunk for log aggregation, configure the diagnostic setting to stream the console output to [Azure Blob Storage](/azure/storage/blobs/). Then, use the [Splunk Add-on for Microsoft Cloud Services](https://docs.splunk.com/Documentation/AddOns/latest/MSCloudServices/Configureinputs5) to ingest logged events into Splunk.