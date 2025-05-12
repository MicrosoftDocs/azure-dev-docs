---
title: Azure Service Bus Tools 
description: Learn how to use the Azure MCP Server with Azure Service Bus.
keywords: azure mcp server, azmcp, service bus, queue, topic
author: diberry
ms.author: diberry
ms.date: 5/12/2025
ms.topic: reference
ms.custom: build-2025
--- 
# Service Bus tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Service Bus resources, including queues and topics.

[Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) is a fully managed enterprise message broker with message queues and publish-subscribe topics. Service Bus is used to decouple applications and services from each other.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Use existing MCP server for Service Bus

### List namespaces

The Azure MCP Server can list all Service Bus namespaces in a subscription. This provides an overview of your messaging infrastructure.

**Example prompts** include:

- **List namespaces**: "Show me all Service Bus namespaces in my subscription."
- **View namespaces**: "What Service Bus namespaces do I have?"
- **Find namespaces**: "List my messaging namespaces"
- **Query namespaces**: "Show all Service Bus resources"
- **Check namespaces**: "Get all message brokers in subscription abc123"

### List queues

The Azure MCP Server can list all queues in a Service Bus namespace. This helps you manage your message queuing infrastructure.

**Example prompts** include:

- **List queues**: "Show me all queues in my 'app-messaging' Service Bus namespace."
- **View queues**: "What queues do I have in Service Bus namespace 'order-processing'?"
- **Find queues**: "List all queues in my namespace 'notification-bus'"
- **Query queues**: "Show available queues in my Service Bus"
- **Check queues**: "Get all message queues in my 'core-messaging' namespace"

### List topics

The Azure MCP Server can list all topics in a Service Bus namespace. This helps you manage your publish-subscribe messaging infrastructure.

**Example prompts** include:

- **List topics**: "Show me all topics in my 'app-messaging' Service Bus namespace."
- **View topics**: "What topics do I have in Service Bus namespace 'event-bus'?"
- **Find topics**: "List all topics in my namespace 'broadcast-messaging'"
- **Query topics**: "Show available topics in my Service Bus"
- **Check topics**: "Get all messaging topics in my 'pub-sub' namespace"

### Send message to queue

The Azure MCP Server can send a message to a Service Bus queue. This allows you to publish messages programmatically.

**Example prompts** include:

- **Send message**: "Send a message with content 'New order created' to the 'orders' queue in my 'app-messaging' namespace."
- **Publish message**: "Add a message to queue 'notifications' with content 'System maintenance scheduled'"
- **Queue message**: "Send 'User profile updated' to the 'profile-events' queue"
- **Add message**: "Submit a message to my order processing queue"
- **Push message**: "Send a test message to the integration queue in my service bus"


### Send message to topic

The Azure MCP Server can send a message to a Service Bus topic. This allows you to publish messages to multiple subscribers.

**Example prompts** include:

- **Send topic message**: "Publish a message with content 'Price update' to the 'product-events' topic in my 'retail-messaging' namespace."
- **Broadcast message**: "Send a message to topic 'system-updates' with content 'New version deployed'"
- **Topic message**: "Send 'Weather alert' to the 'notifications' topic"
- **Publish event**: "Send an event message to my customer notifications topic"
- **Add topic message**: "Broadcast a test message to the events topic in my service bus"

## Develop new MCP server for Service Bus

### List namespaces

The Azure MCP Server can list all Service Bus namespaces in a subscription.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus namespace list | List Service Bus namespaces in a subscription.|

```console
azmcp servicebus namespace list \
    --subscription <SUBSCRIPTION_ID>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription to list Service Bus namespaces from.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all Service Bus namespaces in the specified subscription.

```console
azmcp servicebus namespace list \
    --subscription "my-subscription-id"
```

### List queues

The Azure MCP Server can list all queues in a Service Bus namespace.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus queue list | List queues in a Service Bus namespace.|

```console
azmcp servicebus queue list \
    --subscription <SUBSCRIPTION_ID> \
    --namespace-name <NAMESPACE_NAME> \
    --resource-group <RESOURCE_GROUP>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace-name`: The name of the Service Bus namespace.<br>
`--resource-group`: The name of the resource group containing the namespace.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all queues in the specified Service Bus namespace.

```console
azmcp servicebus queue list \
    --subscription "my-subscription-id" \
    --namespace-name "app-messaging" \
    --resource-group "messaging-rg"
```


### List topics

The Azure MCP Server can list all topics in a Service Bus namespace.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus topic list | List topics in a Service Bus namespace.|

```console
azmcp servicebus topic list \
    --subscription <SUBSCRIPTION_ID> \
    --namespace-name <NAMESPACE_NAME> \
    --resource-group <RESOURCE_GROUP>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace-name`: The name of the Service Bus namespace.<br>
`--resource-group`: The name of the resource group containing the namespace.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all topics in the specified Service Bus namespace.

```console
azmcp servicebus topic list \
    --subscription "my-subscription-id" \
    --namespace-name "app-messaging" \
    --resource-group "messaging-rg"
```

### Send message to queue

The Azure MCP Server can send a message to a Service Bus queue.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus queue message send | Send a message to a Service Bus queue.|

```console
azmcp servicebus queue message send \
    --subscription <SUBSCRIPTION_ID> \
    --namespace-name <NAMESPACE_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --queue-name <QUEUE_NAME> \
    --content <MESSAGE_CONTENT> \
    [--properties <MESSAGE_PROPERTIES>]
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace-name`: The name of the Service Bus namespace.<br>
`--resource-group`: The name of the resource group containing the namespace.<br>
`--queue-name`: The name of the queue to send the message to.<br>
`--content`: The content of the message to send.

##### Optional parameters

`--properties`: Additional properties for the message in JSON format.

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Send a simple message to a Service Bus queue.

```console
azmcp servicebus queue message send \
    --subscription "my-subscription-id" \
    --namespace-name "app-messaging" \
    --resource-group "messaging-rg" \
    --queue-name "orders" \
    --content "New order created: ORDER-12345"
```

Send a message with additional properties to a Service Bus queue.

```console
azmcp servicebus queue message send \
    --subscription "my-subscription-id" \
    --namespace-name "app-messaging" \
    --resource-group "messaging-rg" \
    --queue-name "notifications" \
    --content "System maintenance scheduled" \
    --properties '{"Priority":"High", "MaintenanceType":"Scheduled", "ScheduledTime":"2025-06-01T02:00:00Z"}'
```


### Send message to topic

The Azure MCP Server can send a message to a Service Bus topic.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus topic message send | Send a message to a Service Bus topic.|

```console
azmcp servicebus topic message send \
    --subscription <SUBSCRIPTION_ID> \
    --namespace-name <NAMESPACE_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --topic-name <TOPIC_NAME> \
    --content <MESSAGE_CONTENT> \
    [--properties <MESSAGE_PROPERTIES>]
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace-name`: The name of the Service Bus namespace.<br>
`--resource-group`: The name of the resource group containing the namespace.<br>
`--topic-name`: The name of the topic to send the message to.<br>
`--content`: The content of the message to send.

##### Optional parameters

`--properties`: Additional properties for the message in JSON format.

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Send a simple message to a Service Bus topic.

```console
azmcp servicebus topic message send \
    --subscription "my-subscription-id" \
    --namespace-name "retail-messaging" \
    --resource-group "messaging-rg" \
    --topic-name "product-events" \
    --content "Price update: Product SKU-78901 now $49.99"
```

Send a message with additional properties to a Service Bus topic.

```console
azmcp servicebus topic message send \
    --subscription "my-subscription-id" \
    --namespace-name "app-messaging" \
    --resource-group "messaging-rg" \
    --topic-name "system-updates" \
    --content "New version deployed: v2.3.0" \
    --properties '{"Importance":"High", "Component":"API", "AffectedServices":["UserService","PaymentService"]}'
```
