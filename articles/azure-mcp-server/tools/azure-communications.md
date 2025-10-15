---
title: Azure Communications Services Tools 
description: Learn how to use the Azure MCP Server with Azure Communications Services.
keywords: azure mcp server, azmcp, communications services
author: diberry
ms.author: diberry
ms.date: 10/15/2025
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

## Email: Send email

<!-- azmcp communication email send -->\

Send an email message using Azure Communication Services.

Example prompts include:

- **Simple email**: "Send email to user@example.com with subject 'Welcome' and message 'Hello there!' from noreply@mydomain.com"
- **Email with sender name**: "Send email from 'Support Team <support@mydomain.com>' to customer@example.com with subject 'Thank you' and message 'Thanks for your purchase'"
- **Email with CC and BCC**: "Send email to client@example.com with CC to manager@company.com and BCC to audit@company.com, subject 'Project Update' and message 'Project completed'"
- **HTML email**: "Send HTML email to subscriber@example.com with subject 'Newsletter' and HTML message '<h1>Latest News</h1><p>Check out our updates!</p>'"
- **Email with reply-to**: "Send email to contact@example.com with reply-to feedback@mydomain.com, subject 'Survey' and message 'Please provide your feedback'"
- **Multiple recipients**: "Send email to team@company.com, lead@company.com with subject 'Meeting Reminder' and message 'Don't forget about tomorrow's meeting'"
- **Marketing email**: "Send email from 'Marketing <marketing@mydomain.com>' to customers@example.com with subject 'Special Offer' and HTML message containing promotional content"
- **Notification email**: "Send email using endpoint myservice.communication.azure.com to admin@company.com with subject 'System Alert' and message 'Server maintenance scheduled'"
- **Follow-up email**: "Send email to prospect@example.com with reply-to sales@mydomain.com, subject 'Follow up on your inquiry' and personalized message"
- **Automated email**: "Send transactional email from system@mydomain.com to user@example.com with subject 'Password Reset' and HTML message with reset link"



| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The Communication Services URI endpoint (for example, `https://myservice.communication.azure.com`). Required for credential authentication. |
| **From** |  Required | The email address to send from (must be from a verified domain). |
| **Sender name** |  Optional | The display name of the sender. |
| **To** |  Required | The recipient email addresses to send the email to. |
| **Cc** |  Optional | CC recipient email addresses. |
| **Bcc** |  Optional | BCC recipient email addresses. |
| **Subject** |  Required | The email subject. |
| **Message** |  Required | The email message content to send to the recipients. |
| **Is html** |  Optional | Flag indicating whether the message content is HTML. |
| **Reply to** |  Optional | Reply-to email addresses. |


## SMS: Send SMS message

<!-- `azmcp communication sms send` -->

Sends SMS messages to one or more recipients using Azure Communication Services.

Example prompts include:

- **Simple SMS**: "Send an SMS message to +1234567890 saying 'Hello' using my communication service"
- **Specify sender and recipient**: "Send SMS to +1234567890 from +1234567891 with message 'Test message' using endpoint myservice.communication.azure.com"
- **Multiple recipients**: "Send SMS to multiple recipients: +1234567890, +1234567891 with message 'Group announcement'"
- **With delivery reporting**: "Send SMS with delivery reporting enabled to +1234567890 saying 'Important update'"
- **Custom tracking tag**: "Send SMS message with custom tracking tag 'campaign1' to +1234567890 from +1234567891"
- **Broadcast message**: "Send broadcast SMS to +1234567890 and +1234567891 saying 'Urgent notification' with delivery tracking"
- **Using communication service**: "Send SMS from my communication service endpoint myservice.communication.azure.com to +1234567890 saying 'Welcome message'"
- **Delivery receipt tracking**: "Send an SMS with delivery receipt tracking enabled to +1234567890 with message 'Appointment reminder'"
- **Marketing campaign**: "Send SMS from +1234567891 to +1234567890 with message 'Special offer today!' and tag 'promo-oct2025'"
- **Emergency notification**: "Send urgent SMS to multiple numbers +1234567890, +1234567891, +1234567892 saying 'System maintenance alert' with delivery reports enabled"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The Communication Services URI endpoint (for example, `https://myservice.communication.azure.com`). Required for credential authentication. |
| **From** |  Required | The SMS-enabled phone number associated with your Communication Services resource (in E.164 format, for example, `+14255550123`). Can also be a short code or alphanumeric sender ID. |
| **To** |  Required | The recipient phone numbers in `E.164` international standard format (for example, `+14255550123`). Multiple numbers can be provided. |
| **Message** |  Required | The SMS message content to send to the recipients. |
| **Enable delivery report** |  Optional | Whether to enable delivery reporting for the SMS message. When enabled, events are emitted when delivery is successful. |
| **Tag** |  Optional | Optional custom tag to apply to the SMS message for tracking purposes. |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Communications Services](/azure/communication-services/)