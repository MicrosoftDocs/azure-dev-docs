---
title: Azure AI Speech Tools
description: Learn how to use the Azure MCP Server with Azure AI Speech.
keywords: azure mcp server, azmcp, ai speech services, speech recognition, speech to text, text to speech, cognitive services, azure services
author: diberry
ms.author: diberry
ms.date: 12/05/2025
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
---
# Azure AI Speech tools for the Azure MCP Server

Use the Azure MCP Server to manage Azure AI Speech functionalities such as speech-to-text (STT) and text-to-speech (TTS) with natural language prompts.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Speech-to-Text: Recognize

<!-- speech stt recognize -->


Recognize speech from an audio file using [Azure AI Services Speech](/azure/ai-services/speech-service/speech-to-text). This command takes an audio file and converts it to text using advanced speech recognition capabilities. Supported audio formats include WAV, MP3, OPUS/OGG, FLAC, ALAW, MULAW, MP4, M4A, and AAC. Compressed formats require GStreamer to be installed on the system.

Example prompts include:

- **Basic conversion**: "Convert the audio file ./meeting-recording.wav to text using endpoint https://myservice.cognitiveservices.azure.com/ with Azure Speech Services"
- **With language detection**: "Recognize speech from file ./recording.mp3 using endpoint https://myservice.cognitiveservices.azure.com/ with language detection"
- **With profanity filtering**: "Transcribe speech from file ./interview.wav using endpoint https://myservice.cognitiveservices.azure.com/ with profanity option removed"
- **Specify endpoint**: "Convert speech to text from file ./audio.wav using endpoint https://myservice.cognitiveservices.azure.com/"
- **Spanish language**: "Transcribe the audio file ./session.wav using endpoint https://myservice.cognitiveservices.azure.com/ in es-ES language"
- **Detailed output**: "Convert speech to text from file ./audio.wav using endpoint https://myservice.cognitiveservices.azure.com/ with detailed output format"
- **With phrase hints**: "Recognize speech from file ./notes.wav using endpoint https://myservice.cognitiveservices.azure.com/ with phrase hints 'Azure' for better accuracy"
- **Multiple phrase hints**: "Transcribe file ./meeting.wav using endpoint https://myservice.cognitiveservices.azure.com/ with phrase hints: 'Azure', 'cognitive services', 'machine learning'"
- **Comma-separated hints**: "Convert speech to text from file ./podcast.mp3 using endpoint https://myservice.cognitiveservices.azure.com/ with phrase hints: 'Azure, cognitive services, API'"
- **Raw profanity output**: "Transcribe audio from file ./audio.wav using endpoint https://myservice.cognitiveservices.azure.com/ with profanity option raw"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The Azure AI Services endpoint URL (for example, `https://your-service.cognitiveservices.azure.com/`). |
| **File** |  Required | Path to the local audio file to recognize. |
| **Language** |  Optional | The language for speech recognition (for example, `en-US`, `es-ES`). Default is `en-US`. |
| **Phrases** |  Optional | Phrase hints to improve recognition accuracy. Can be specified multiple times or as comma-separated values. |
| **Format** |  Optional | Output format: `simple` or `detailed`. |
| **Profanity** |  Optional | Profanity filter: `masked`, `removed`, or `raw`. Default is `masked`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [speech stt recognize](../includes/tools/annotations/azure-ai-services-speech-operation-speech-text-recognize-annotations.md)]

## Text-to-Speech: Synthesize

<!-- speech tts synthesize -->

Convert text to speech using Azure AI Services Speech. This command takes text input and generates an audio file using advanced neural text-to-speech capabilities.

Example prompts include:

- **Basic synthesis**: "Convert the text 'Hello, welcome to Azure AI Services' to speech using endpoint https://myservice.cognitiveservices.azure.com/ and save to output.wav"
- **With custom voice**: "Synthesize 'Thank you for using our service' to audio file greeting.mp3 using my custom voice my-custom-voice under service 'https://myservice.cognitiveservices.azure.com/' and endpoint "guid-endpoint.
- **Different language**: "Generate Spanish speech for 'Bienvenido a Azure' and save to welcome-es.wav using my speech endpoint https://myresource.cognitiveservices.azure.com/ in es-ES language"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The Azure AI Services endpoint URL (for example, `https://your-service.cognitiveservices.azure.com/`). |
| **Text** |  Required | The text to convert to speech. |
| **Output file path** |  Required | Path where the synthesized audio file will be saved. |
| **Language** |  Optional | The language for speech recognition (for example, `en-US`, `es-ES`). Default is `en-US`. |
| **Voice** |  Optional | The voice to use for speech synthesis (for example, `en-US-JennyNeural`). If not specified, the default voice for the language will be used. |
| **Format** |  Optional | Output format: `Riff24Khz16BitMonoPcm`, `Audio16Khz32KBitRateMonoMp3`, `Audio24Khz96KBitRateMonoMp3`, `Ogg16Khz16BitMonoOpus`, `Raw16Khz16BitMonoPcm`. Default is `Riff24Khz16BitMonoPcm`. |
| **Endpoint ID** |  Optional | The endpoint ID of a custom voice model for speech synthesis. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [speech stt recognize](../includes/tools/annotations/azure-ai-services-speech-operation-text-speech-synthesize-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure AI Services tools](/azure/ai-services)