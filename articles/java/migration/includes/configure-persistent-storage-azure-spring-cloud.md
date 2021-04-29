---
author: yevster
ms.author: yebronsh
ms.date: 4/15/2020
---

### Configure persistent storage

If any part of your application reads or writes to the local file system, you'll need to configure persistent storage to replace the local file system. For more information, see [Use persistent storage in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-howto-persistent-storage).

You should write any temporary files to the `/tmp` directory. For OS independence, you can get this directory by using `System.getProperty("java.io.tmpdir")`. You can also use [`java.nio.Files::createTempFile`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/Files.html#createTempFile(java.lang.String,java.lang.String,java.nio.file.attribute.FileAttribute...)) to create temporary files.
