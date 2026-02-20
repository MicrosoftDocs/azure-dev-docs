---
title: Use Azure MCP Server with Azure Speech in Foundry Tools
description: Learn how to use Azure Model Context Protocol (MCP) Server to interact with Azure Speech in Foundry Tools using natural language commands through AI assistants.
author: diberry
ms.author: diberry
ms.date: 02/20/2026
ms.topic: how-to
ms.custom: mcp-integration, devx-track-ai
content_well_notification: 
  - AI-contribution
ai-usage: ai-generated
ms.service: azure-ai-speech
---

# Use Azure MCP Server with Azure Speech in Foundry Tools

Azure Model Context Protocol (MCP) Server enables AI assistants like GitHub Copilot, Claude Desktop, and others to interact with Azure Speech in Foundry Tools through natural language commands. This integration allows you to manage text-to-speech and speech-to-text capabilities without writing code or remembering complex CLI syntax.

[Azure Speech in Foundry Tools](/azure/ai-services/speech-service/overview) provides speech to text, text to speech, and other capabilities through a Microsoft Foundry resource. You can transcribe speech to text with high accuracy, produce natural-sounding text-to-speech voices, translate spoken audio, and conduct live AI voice conversations.

## What is the Azure MCP Server?

[!INCLUDE [mcp-introduction](../includes/mcp-introduction.md)]

For Azure Speech developers, this means you can:

- Recognize speech from audio files.
- Synthesize speech from text input.
- Specify language and voices for synthesis.
- Output audio in various formats.
- Use phrase hints to improve accuracy.

## Prerequisites

To use the Azure MCP Server with Azure Speech, you need:

### Azure requirements

- **Azure subscription**: An active Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Azure Speech resources**: At least one speech resource in your subscription, or permissions to create them.
- **Azure permissions**: Appropriate roles to perform the operations you want. See [Azure Built-in Roles](/azure/role-based-access-control/built-in-roles).

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure Speech in Foundry Tools

The Azure MCP Server provides the following tools for Azure Speech in Foundry Tools:
- **speech stt recognize** - Convert an audio file into text using speech recognition.
- **speech tts synthesize** - Generate audio from text input using neural speech synthesis.

For detailed parameter information and usage examples, see the [Azure AI Speech tools reference](../tools/ai-services-speech.md).


## Get started

Ready to use Azure MCP Server with your Azure Speech resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. For setup and authentication instructions, see the links in the [Where can you use Azure MCP Server?](#where-can-you-use-azure-mcp-server) section above.

2. **Start exploring**: Ask your AI assistant questions about your speech apps or request operations. Try prompts like:
- "Recognize speech from the audio file 'meeting-recording.mp3'."
- "Convert 'meeting-recording.wav' audio to text and save it as 'transcript.txt'."
- "Get transcription results from the audio recording in the project folder."

3. **Learn more**: Review the [Azure Speech tools reference](../tools/ai-services-speech.md) for all available capabilities and detailed parameter information.


## Best practices

- **Use standardized audio formats**: Stick to standard audio formats such as WAV or MP3 for best compatibility.
- **Leverage phrase hints**: Use phrase hints in the recognition process to improve accuracy for specific terms.
- **Monitor usage and performance**: Regularly check service performance and usage metrics for optimization.
- **Implement authentication securely**: Use managed identities to authenticate with the service.

## Related content

- [Azure MCP Server documentation](/azure/developer/azure-mcp-server)
- [Azure MCP Speech tools reference](../tools/ai-services-speech.md)
- [Azure Speech documentation](/azure/ai-services/speech-service/overview)
- [Speech-to-text overview](/azure/ai-services/speech-service/index-speech-to-text)
- [Text-to-speech overview](/azure/ai-services/speech-service/index-text-to-speech)
