---
title: Azure Communications Services Tools 
description: Learn how to use the Azure MCP Server with Azure Communications Services.
keywords: azure mcp server, azmcp, communications services
author: diberry
ms.author: diberry
ms.date: 10/08/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 

# Azure Communications Services tools for the Azure MCP Server

The Azure MCP Server enables you to manage Azure resources, including Azure Communications Services, by using natural language prompts. This capability lets you work with communications services without needing to remember complex command syntax.

[Azure Communications Services](/azure/communication-services/) is a set of rich communication APIs that enable developers to build intelligent communication solutions. These solutions can include voice and video calling, chat, SMS, and telephony capabilities into applications.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## SMS: Send SMS message

<!-- `azmcp communication sms send` -->

Sends SMS messages to one or more recipients using Azure Communication Services.

Example prompts include:

- **Simple SMS**: "Send an SMS message to +1234567890 saying 'Hello' using my communication service"
- **Specify sender and recipient**: "Send SMS to +1234567890 from +1234567891 with message 'Test message' using endpoint https://myservice.communication.azure.com"
- **Multiple recipients**: "Send SMS to multiple recipients: +1234567890, +1234567891 with message 'Group announcement'"
- **With delivery reporting**: "Send SMS with delivery reporting enabled to +1234567890 saying 'Important update'"
- **Custom tracking tag**: "Send SMS message with custom tracking tag 'campaign1' to +1234567890 from +1234567891"
- **Broadcast message**: "Send broadcast SMS to +1234567890 and +1234567891 saying 'Urgent notification' with delivery tracking"
- **Using communication service**: "Send SMS from my communication service endpoint https://myservice.communication.azure.com to +1234567890 saying 'Welcome message'"
- **Delivery receipt tracking**: "Send an SMS with delivery receipt tracking enabled to +1234567890 with message 'Appointment reminder'"
- **Marketing campaign**: "Send SMS from +1234567891 to +1234567890 with message 'Special offer today!' and tag 'promo-oct2025'"
- **Emergency notification**: "Send urgent SMS to multiple numbers +1234567890, +1234567891, +1234567892 saying 'System maintenance alert' with delivery reports enabled"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The Communication Services URI endpoint (for example, `https://myservice.communication.azure.com`). Required for credential authentication. |
| **From** |  Required | The SMS-enabled phone number associated with your Communication Services resource (in E.164 format, for example, `+14255550123`). Can also be a short code or alphanumeric sender ID. |
| **To** |  Required | The recipient phone number(s) in E.164 international standard format (for example, `+14255550123`). Multiple numbers can be provided. |
| **Message** |  Required | The SMS message content to send to the recipient(s). |
| **Enable delivery report** |  Optional | Whether to enable delivery reporting for the SMS message. When enabled, events are emitted when delivery is successful. |
| **Tag** |  Optional | Optional custom tag to apply to the SMS message for tracking purposes. |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Communications Services](/azure/communication-services/)