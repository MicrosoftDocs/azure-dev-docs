---
author: yevster
ms.author: yebronsh
ms.date: 4/15/2020
---

### Ensure console logging and configure diagnostic settings

Configure your logging so that all output is routed to the console and not to files.

After an application is deployed to Azure Spring Cloud, [add a diagnostic setting](/azure/spring-cloud/diagnostic-services) to make logged events available for consumption, for example via Azure Monitor Log Analytics.

#### LogStash/ELK Stack

If you use LogStash/ELK Stack for log aggregation, configure the diagnostic setting to stream the console output to an [Azure Event Hub](/azure/event-hubs/). Then, use the [LogStash EventHub plugin](https://github.com/logstash-plugins/logstash-input-azure_event_hubs) to ingest logged events into LogStash.

#### Splunk

If you use Splunk for log aggregation, configure the diagnostic setting to stream the console output to [Azure Blob Storage](/azure/storage/blobs/). Then, use the [Splunk Add-on for Microsoft Cloud Services](https://splunkbase.splunk.com/app/3757/) to ingest logged events into Splunk.
