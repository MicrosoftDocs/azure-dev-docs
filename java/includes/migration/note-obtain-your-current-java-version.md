---
author: yevster
ms.author: yebronsh
ms.date: 1/22/2020
---

<!-- Included in "### Switch to a supported platform" sections that have different (required) intro paragraphs. For example:

### Switch to a supported platform

App Service offers specific versions of Java SE. To ensure compatibility, migrate your application to one of the supported versions of in its current environment before you proceed with any of the remaining steps. Be sure to fully test the resulting configuration. Use the latest stable release of your Linux distribution in such tests.

-->

> [!NOTE]
> This validation is especially important if your current server is running on an unsupported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current Java version, sign in to your production server and run the following command:

```bash
java -version
```

To obtain the current version used by Azure App Service, download [Zulu 8](https://www.azul.com/downloads/zulu-community/?&version=java-8-lts&os=&os=linux&architecture=x86-64-bit&package=jdk) if you intend to use the Java 8 runtime or [Zulu 11](https://www.azul.com/downloads/zulu-community/?&version=java-11-lts&os=&os=linux&architecture=x86-64-bit&package=jdk) if you intend to use the Java 11 runtime.
