---
author: yevster
ms.author: yebronsh
ms.date: 1/20/2020
---

### Inventory secrets

#### Passwords and secure strings

Check all properties and configuration files on the production server(s) for any secret strings and passwords. Be sure to check *server.xml* and *context.xml* in $CATALINA_BASE/conf. You may also find configuration files containing passwords or credentials inside your application. These may include *META-INF/context.xml*, and, for Spring Boot applications, *application.properties* or *application.yml* files.

#### Certificates

Document all the certificates used for public SSL endpoints. You can view all certificates on the production server(s) by running the following command:

```bash
keytool -list -v -keystore <path to keystore>
```
