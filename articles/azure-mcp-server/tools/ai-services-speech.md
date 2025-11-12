---
title: Azure AI Speech Tools
description: Learn how to use the Azure MCP Server with Azure AI Speech.
keywords: azure mcp server, azmcp, ai speech services, speech recognition, speech to text, cognitive services, azure services
author: diberry
ms.author: diberry
ms.date: 10/27/2025
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
---
# Azure AI Speech tools for the Azure MCP Server

Use the Azure MCP Server to manage Azure AI Speech functionalities such as speech-to-text (SST) with natural language prompts. You don't need to remember specific command syntax.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Speech-to-Text: Recognize

<!-- speech stt recognize -->


Recognize speech from an audio file using [Azure AI Services Speech](/azure/ai-services/speech-service/speech-to-text). This command takes an audio file and converts it to text using advanced speech recognition capabilities. Supported audio formats include WAV, MP3, OPUS/OGG, FLAC, ALAW, MULAW, MP4, M4A, and AAC. Compressed formats require GStreamer to be installed on the system.

Example prompts include:

- **Basic conversion**: "Convert this audio file to text using Azure Speech Services"
- **With language detection**: "Recognize speech from my audio file with language detection"
- **With profanity filtering**: "Transcribe speech from audio file with profanity filtering"
- **Specify endpoint**: "Convert speech to text from audio file using my cognitive services endpoint"
- **Spanish language**: "Transcribe the audio file in Spanish language"
- **Detailed output**: "Convert speech to text with detailed output format from audio file"
- **With phrase hints**: "Recognize speech with phrase hints for better accuracy"
- **Multiple phrase hints**: "Transcribe audio using multiple phrase hints: 'Azure', 'cognitive services', 'machine learning'"
- **Comma-separated hints**: "Convert speech to text with comma-separated phrase hints: 'Azure, cognitive services, API'"
- **Raw profanity output**: "Transcribe audio with raw profanity output from file"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The Azure AI Services endpoint URL (for example, `https://your-service.cognitiveservices.azure.com/`). |
| **File** |  Required | Path to the local audio file to recognize. |
| **Language** |  Optional | The language for speech recognition (for example, `en-US`, `es-ES`). Default is `en-US`. |
| **Phrases** |  Optional | Phrase hints to improve recognition accuracy. Can be specified multiple times or as comma-separated values. |
| **Format** |  Optional | Output format: `simple` or `detailed`. Default is `simple`. |
| **Profanity** |  Optional | Profanity filter: `masked`, `removed`, or `raw`. Default is `masked`. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [speech stt recognize](../includes/tools/annotations/azure-ai-services-speech-operation-speech-text-recognize-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure AI Services tools](/azure/ai-services)