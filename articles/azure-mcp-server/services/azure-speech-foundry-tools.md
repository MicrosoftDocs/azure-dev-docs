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

## Overview

Azure Speech in Foundry Tools provides advanced text-to-speech and speech recognition functionality. This service enables applications to understand spoken language and convert text into natural-sounding audio.

With Azure MCP Server integration, you can use natural language to:

- Recognize speech from audio files.
- Synthesize speech from text input.
- Specify language and voices for synthesis.
- Output audio in various formats.
- Use phrase hints to improve accuracy.

## Prerequisites

Before using Azure MCP Server with Azure Speech in Foundry Tools, ensure you have:

- **Azure MCP Server installed and running** - Follow the [Azure MCP Server setup guide](https://github.com/microsoft/azure-mcp-server)
- **AI assistant configured** - GitHub Copilot, Claude Desktop, or another MCP-compatible client
- **Azure credentials** - Authentication configured for your Azure subscription
- **Existing Azure Speech resource** - Needed to authenticate requests and utilize speech capabilities.

## Available MCP tools

Azure MCP Server provides the following tools for Azure Speech in Foundry Tools:

- **speech stt recognize** - Convert an audio file into text using speech recognition.
- **speech tts synthesize** - Generate audio from text input using neural speech synthesis.

For detailed parameter information and usage examples, see the [Azure AI Speech tools reference](../tools/ai-services-speech.md).

## Common scenarios

### Scenario 1: Convert meeting notes into a text file.

Use the service to transcribe audio recordings of meetings efficiently.

**Example commands you can ask your AI assistant:**

- "Recognize speech from the audio file 'meeting-recording.mp3'."
- "Convert 'meeting-recording.wav' audio to text and save it as 'transcript.txt'."
- "Get transcription results from the audio recording in the project folder."

**Expected outcome:**  
The assistant provides the transcribed text in a text file.

### Scenario 2: Create an audio message from a script.

Use synthesized speech to generate audio for a presentation.

**Example commands you can ask your AI assistant:**

- "Synthesize speech from the text 'Welcome to our presentation on Azure services'."
- "Convert the script in 'script.txt' into an audio file named 'presentation.mp3'."
- "Generate an audio message and save it as 'greeting.wav'."

**Expected outcome:**  
The assistant returns the audio file in the specified format with natural-sounding speech.

### Scenario 3: Transcribe and synthesize for an interactive demo.

Chain several commands to showcase speech capabilities interactively.

**Example commands you can ask your AI assistant:**

- "Recognize speech from 'audio-demo.wav' to get the transcript."
- "Synthesize the response 'Thank you for your feedback' into an audio file."
- "Recognize 'user-query.mp3', then synthesize a response in 'response.mp3'."

**Expected outcome:**  
The assistant provides both the text transcript and synthesized response audio files.


## AI-specific use cases

Azure Speech in Foundry Tools includes AI capabilities that integrate seamlessly with Azure MCP Server:

### Use advanced voice options for speech synthesis.

Customize speech output using different voices and languages.

**Example interactions:**

- "Synthesize the text 'Hello, welcome to our event' using a female voice."
- "Convert 'script.txt' using a specific voice ID and language 'en-GB'."
- "Generate dynamic audio responses in multiple languages for the demo."


## Authentication and permissions

To use Azure Speech in Foundry Tools through Azure MCP Server, ensure your Azure identity has appropriate permissions:

**Required Azure RBAC roles:**

- **Cognitive Services Speech Contributor** - Allows managing and using speech resources effectively.
- **Cognitive Services Speech User** - Provides access to use speech service capabilities.

**Additional authentication notes:**

Use managed identities or DefaultAzureCredential to authenticate requests to the Azure AI Services endpoint.

## Troubleshooting

### Common issues

**Audio formats not supported.**

The service might fail to process audio files in unsupported formats.

**Resolution:** Convert audio to a supported format like WAV, MP3, or FLAC before processing.

**Insufficient permissions.**

Errors might occur if the user lacks the required roles to access the service.

**Resolution:** Verify that you have been assigned the correct RBAC roles in Azure.


## Best practices

- **Use standardized audio formats**: Stick to standard audio formats such as WAV or MP3 for best compatibility.
- **Leverage phrase hints**: Use phrase hints in the recognition process to improve accuracy for specific terms.
- **Configure custom voice models**: Create and use custom voice endpoints for enhanced speech synthesis.
- **Monitor usage and performance**: Regularly check service performance and usage metrics for optimization.
- **Implement authentication securely**: Use managed identities to authenticate with the service.

## Related content

- [Azure MCP Server documentation](https://github.com/microsoft/azure-mcp-server)
- [Azure AI Speech tools reference](../tools/ai-services-speech.md)
- [Azure AI Speech documentation](/azure/ai-services/speech-service/overview)
- [Speech-to-text overview](/azure/ai-services/speech-service/speech-to-text)
- [Text-to-speech overview](/azure/ai-services/speech-service/text-to-speech)
