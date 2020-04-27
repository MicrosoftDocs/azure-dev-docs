---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

If any part of your application contains any code that is accommodating the OS the application is running on, then your application needs to be refactored to NOT rely on the underlying OS. For instance, any uses of `/` or `\` in file system paths may need to be replaced with [`File.Separator`](https://docs.oracle.com/javase/8/docs/api/java/io/File.html#separator) or [`Path.get`](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Paths.html#get-java.lang.String-java.lang.String...-).
