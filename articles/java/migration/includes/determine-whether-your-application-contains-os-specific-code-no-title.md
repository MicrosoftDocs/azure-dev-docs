---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

If your application contains any code with dependencies on the host OS, then you'll need to refactor it to remove those dependencies. For example, you may need to replace any use of `/` or `\` in file system paths with [`File.Separator`](https://docs.oracle.com/javase/8/docs/api/java/io/File.html#separator) or [`Paths.get`](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Paths.html#get-java.lang.String-java.lang.String...-).
