---
author: yevster
ms.author: yebronsh
ms.date: 4/15/2020
---

### Configure persistent storage

If any part of your application reads or writes to the local file system, you will need to [configure persistent storage](/azure/spring-cloud/spring-cloud-howto-persistent-storage) to substitute for the local file system.

Any temporary files should be written to `/tmp` directory. For OS independence, this directory can be obtained by `System.getProperty("java.io.tmpdir")` or by using [`java.nio.Files::createTempFile`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/Files.html#createTempFile(java.lang.String,java.lang.String,java.nio.file.attribute.FileAttribute...)) to create temporary files.