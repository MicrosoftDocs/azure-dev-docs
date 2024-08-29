---
author: KarlErickson
ms.author: karler
ms.date: 09/09/2024
---

### Inventory configuration sources and secrets

#### Inventory passwords and secure strings

Check all properties and configuration files and all environment variables on the production deployments for any secret strings and passwords. In a Spring Cloud application, you can typically find such strings in the *application.properties* or *application.yml* file in individual services or in the Spring Cloud Config repository.

[!INCLUDE [inventory-certificates-h4](inventory-certificates-h4.md)]

#### Determine whether Spring Cloud Vault is used

If you use Spring Cloud Vault to store and access secrets, identify the backing secret store (for example, HashiCorp Vault or CredHub). Then identify all the secrets used by the application code.

#### Locate the configuration server source

If your application uses a [Spring Cloud Config server](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_spring_cloud_config_server), identify where the configuration is stored. You typically find this setting in the *bootstrap.yml* or *bootstrap.properties* file, or sometimes in the *application.yml* or *application.properties* file. The setting looks like the following example:

```properties
spring.cloud.config.server.git.uri: file://${user.home}/spring-cloud-config-repo
```

While git is most commonly used as Spring Cloud Config's backing datastore, as shown earlier, one of the other possible backends may be in use. Consult the [Spring Cloud Config documentation](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_environment_repository) for information on other backends, such as [Relational Database (JDBC)](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_jdbc_backend), [SVN](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_version_control_backend_filesystem_use), and [the local file system](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_file_system_backend).

