---
title: Getting starting with messaging, events, and IoT for Python apps on Azure
description: Index of Python-specific articles in Azure documentation for learning more about messaging, events, and IoT.
ms.date: 03/08/2024
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Messaging, Events, and IoT for Python apps on Azure

The following articles help you get started with messaging, event ingestion and processing, and Internet of Things (IoT) services in Azure.

## Messaging

Messaging services on Azure provide the interconnectivity between components and applications that are written in different languages and hosted in the same cloud, multiple clouds, or on-premises.

- **Notifications**
  - [How to use Notification Hubs from Python](/azure/notification-hubs/notification-hubs-python-push-notification-tutorial)

- **Queues**
  - [Quickstart: Azure Queue Storage client library for Python](/azure/storage/queues/storage-quickstart-queues-python)
  - [Quickstart: Send messages to and receive messages from Azure Service Bus queues (Python)](/azure/service-bus-messaging/service-bus-python-how-to-use-queues)
  - [Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic (Python)](/azure/service-bus-messaging/service-bus-python-how-to-use-topics-subscriptions)

- **Real-time web functionality (SignalR)**
  - [Quickstart: Create a serverless app with Azure Functions and Azure SignalR Service in Python](/azure/azure-signalr/signalr-quickstart-azure-functions-python)

- **Azure Web PubSub**
  - [How to create a `WebPubSubServiceClient` with Python and Azure Identity](/azure/azure-web-pubsub/howto-create-serviceclient-with-python-and-azure-identity)

## Events

Event Hubs is a big data streaming platform and event ingestion service. Event Grid is a scalable, serverless event broker that you can use to integrate applications using events.

- **Event Hubs**
  - [Quickstart: Send events to or receive events from event hubs by using Python](/azure/event-hubs/event-hubs-python-get-started-send)
  - [Quickstart: Capture Event Hubs data in Azure Storage and read it by using Python (azure-eventhub)](/azure/event-hubs/event-hubs-capture-python)

- **Event Grid**
  - [Quickstart: Route custom events to web endpoint with Azure CLI and Event Grid](/azure/event-grid/custom-event-quickstart)
  - [Azure Event Grid Client Library Python Samples](/samples/azure/azure-sdk-for-python/eventgrid-samples/)

## Internet of Things (IoT)

Internet of Things or IoT refers to a collection of managed and platform services across edge and cloud that connect, monitor, and control IoT assets. IoT also includes security and operating systems for devices and data and analytics that help you build, deploy, and manage IoT applications.

- **IoT Hub**
  - [Quickstart: Send telemetry from an IoT Plug and Play device to Azure IoT Hub](/azure/iot-develop/quickstart-send-telemetry-iot-hub?pivots=programming-language-python)
  - [Send cloud-to-device messages with IoT Hub](/azure/iot-hub/iot-hub-python-python-c2d)
  - [Upload files from your device to the cloud with IoT Hub](/azure/iot-hub/iot-hub-python-python-file-upload)
  - [Schedule and broadcast jobs](/azure/iot-hub/iot-hub-python-python-schedule-jobs)
  - [Quickstart: Control a device connected to an IoT hub](/azure/iot-hub/quickstart-control-device?pivots=programming-language-python)

- **Device provisioning**
  - [Quickstart: Provision an X.509 certificate simulated device](/azure/iot-dps/quick-create-simulated-device-x509?pivots=programming-language-python)
  - [Tutorial: Provision devices using symmetric key enrollment groups](/azure/iot-dps/how-to-legacy-device-symm-key?pivots=programming-language-python)
  - [Tutorial: Provision multiple X.509 devices using enrollment groups](/azure/iot-dps/tutorial-custom-hsm-enrollment-group-x509?pivots=programming-language-python)

- **IoT Central/IoT Edge**
  - [Tutorial: Create and connect a client application to your Azure IoT Central application](/azure/iot-central/core/tutorial-connect-device?pivots=programming-language-python)
  - [Tutorial: Develop IoT Edge modules using Visual Studio Code](/azure/iot-edge/tutorial-develop-for-linux?tabs=python&pivots=iotedge-dev-cli)
