---
title: Azure Communication Services Tools 
description: Send emails and SMS messages without needing to remember complex command syntax, making communication automation more accessible and efficient.
keywords: azure mcp server, azmcp, communication services
author: diberry
ms.author: diberry
ms.date: 10/27/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 

# Azure Communication Services tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure Communication Services using natural language prompts. Learn how to send emails and SMS messages without needing to remember complex command syntax, making communication automation more accessible and efficient.

[Azure Communication Services](/azure/communication-services/) is a set of rich communication APIs that enable developers to build intelligent communication solutions. These solutions include voice and video calling, chat, SMS, and telephony capabilities in applications.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Email: Send email

<!-- communication email send -->

Send an email message using Azure Communication Services.

Example prompts include:

- **Simple email**: "Send email to 'user@example.com' with subject 'Welcome' and message 'Hello there!' from 'noreply@mydomain.com' using endpoint 'https://myservice.communication.azure.com'"
- **Email with sender name**: "Send email from 'Support Team <support@mydomain.com>' to 'customer@example.com' with subject 'Thank you' and message 'Thanks for your purchase' using endpoint 'https://myservice.communication.azure.com'"
- **HTML email**: "Send HTML email to 'subscriber@example.com' with subject 'Newsletter' and HTML message '&lt;h1&gt;Latest News&lt;/h1&gt;&lt;p&gt;Check out our updates!&lt;/p&gt;' from 'newsletter@mydomain.com' using endpoint 'https://myservice.communication.azure.com'"



| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The Communication Services URI endpoint (for example, `https://myservice.communication.azure.com`). Used for credential authentication. |
| **From** |  Required | The email address to send from (must be from a verified domain). |
| **Sender name** |  Optional | The display name of the sender. |
| **To** |  Required | The recipient email addresses to send the email to. |
| **Cc** |  Optional | CC recipient email addresses. |
| **Bcc** |  Optional | BCC recipient email addresses. |
| **Subject** |  Required | The email subject. |
| **Message** |  Required | The email message content to send to the recipients. |
| **Is html** |  Optional | Flag indicating whether the message content is HTML. |
| **Reply to** |  Optional | Reply-to email addresses. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [communication email send](../includes/tools/annotations/azure-communication-services-email-send-annotations.md)]

## SMS: Send SMS message

<!-- communication sms send -->

Sends SMS messages to one or more recipients using Azure Communication Services.

Example prompts include:

- **Simple SMS**: "Send an SMS message to '+12345550123' saying 'Hello' from '+12345550456' using endpoint 'https://myservice.communication.azure.com'"
- **Specify sender and recipient**: "Send SMS to '+12345550789' from '+12345550456' with message 'Test message' using endpoint 'https://myservice.communication.azure.com'"
- **Multiple recipients**: "Send SMS to multiple recipients: '+12345550123', '+12345550789' with message 'Group announcement' from '+12345550456' using endpoint 'https://myservice.communication.azure.com'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The Communication Services URI endpoint (for example, `https://myservice.communication.azure.com`). Used for credential authentication. |
| **From** |  Required | The SMS-enabled phone number associated with your Communication Services resource (in E.164 format, for example, `+14255550123`). Can also be a short code or alphanumeric sender ID. |
| **To** |  Required | The recipient phone numbers in `E.164` international standard format (for example, `+14255550123`). Multiple numbers can be provided. |
| **Message** |  Required | The SMS message content to send to the recipients. |
| **Enable delivery report** |  Optional | Whether to enable delivery reporting for the SMS message. When enabled, events are emitted when delivery is successful. |
| **Tag** |  Optional | Optional custom tag to apply to the SMS message for tracking purposes. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [communication sms send](../includes/tools/annotations/azure-communication-services-sms-send-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Communication Services](/azure/communication-services/)