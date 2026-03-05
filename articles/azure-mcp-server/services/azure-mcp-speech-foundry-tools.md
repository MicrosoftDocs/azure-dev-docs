---
title: Use Azure MCP Server with Azure Speech in Foundry Tools
description: Learn how to use Azure Model Context Protocol (MCP) Server to interact with Azure Speech in Foundry Tools using natural language commands through AI assistants.
author: diberry
ms.author: diberry
ms.date:03/04/2026
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

- Transcribe speech from audio files.
- Synthesize speech from text input.

## Prerequisites

To use the Azure MCP Server with Azure Speech in Foundry, you need:

- **Azure subscription**: An active Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- [**Foundry resource**](/azure/ai-services/multi-service-resource?pivots=azcli): You must have an existing Azure AI Services endpoint to process speech and text.
- **Azure permissions**: Appropriate roles to perform the operations you want:
  - Cognitive Services User - Required for using speech recognition and text-to-speech capabilities.

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure Speech in Foundry

Azure MCP Server provides the following tools for Azure Speech in Foundry operations:

| Tool | Description |
| --- | --- |
| `speech stt recognize` | Recognize speech from audio files and convert it to text. |
| `speech tts synthesize` | Generate audio files from text using neural text-to-speech. |

For detailed information about each tool, including parameters and examples, see [Azure Speech in Foundry tools for Azure MCP Server](../tools/speech.md).

## Get started

Ready to use Azure MCP Server with your Azure Speech resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. For setup and authentication instructions, see the links in the [Where can you use Azure MCP Server?](#where-can-you-use-azure-mcp-server) section above.

2. **Start exploring**: Ask your AI assistant questions about your speech apps or request operations. Try prompts like:
- "Recognize speech from the audio file 'meeting-recording.mp3'."
- "Convert 'meeting-recording.wav' audio to text and save it as 'transcript.txt'."
- "Get transcription results from the audio recording in the project folder."

3. **Learn more**: Review the [Azure Speech tools reference](../tools/ai-services-speech.md) for all available capabilities and detailed parameter information.


## Best practices

- **Use supported audio formats**: Ensure you use WAV, MP3, or other supported formats for speech recognition.
- **Specify language for accuracy**: Always specify the language parameter to improve recognition accuracy.
- **Choose voice selection wisely**: Select appropriate voice options to match the desired tone for synthesized speech.

## Related content

- [Azure MCP Server documentation](/azure/developer/azure-mcp-server)
- [Azure MCP Speech tools reference](../tools/ai-services-speech.md)
- [Azure Speech documentation](/azure/ai-services/speech-service/overview)
- [Speech-to-text overview](/azure/ai-services/speech-service/index-speech-to-text)
- [Text-to-speech overview](/azure/ai-services/speech-service/index-text-to-speech)
