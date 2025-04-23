# Predefined formulas

Predefined formulas capture industry best practices for using Azure services.
Currently, **GitHub Copilot App Modernization for Java (Preview)** offers **predefined formulas** that cover common migration scenarios.

These formulas address topics such as:

- Secret management
- Message queue integration
- Monitoring
- Identity management
- And more

> 🔄 *This list will grow based on customer feedback and evolving cloud needs.*

## Formula list

- **Spring AMQP for RabbitMQ to Azure Service Bus**

  Convert the application from using Spring AMQP to connect to RabbitMQ to utilizing the managed service Azure Service Bus. The message queue interaction logic will be adapted to the Azure Service Bus equivalent, and the secure authentication mechanism will be enabled by default.

- **Managed Identities for Database migration to Azure**

  The Azure database offerings—Azure SQL Server, Azure Database for MySQL, and Azure Database for PostgreSQL—support secure Managed Identity-based login. When migrating an application from a local database to a managed Azure cloud database, this approach will help you prepare your codebase for Managed Identity authentication to the database.

- **AWS S3 to Azure Storage Blob**

  When migrating your service from AWS to Azure, the usage of S3 can be transitioned to Azure Storage Blob. This approach helps you convert the code logic that interacts with AWS S3 into code logic that operates with Azure Storage Blob, while maintaining the same semantics.

- **Logging to local file**

  Azure hosting services integrate with Azure Monitor by default, collecting logs output to the console and enabling you to query and monitor them. At the same time, logging to files in a cloud environment is generally not recommended, as it requires additional log rotation and transfer. This approach helps you convert file-based logging in your application to console-based logging, making it ready for integration with Azure Monitor.

- **Local file I/O to Azure Storage File share mounts**

  Azure hosting services offer flexibility in provisioning, scaling, failover, and more. At the same time, the file system for a given application runtime is transient. If your application reads from or writes to a local file, this approach helps you identify such cases and convert them into unified mount path access. By doing so, you can mount an Azure Storage File share to the specified path, enabling your application to share and persist data across different replicas without concerns about relocation, failover, or similar issues.

- **Java Mail to Azure Communication Service**

  Migrating applications with SMTP dependencies can be challenging, as not all Azure environments support outgoing requests on port 25. This approach helps convert an application that sends mail over SMTP to use Azure Communication Services, which is fully compatible with Azure hosting environments.

- **Hardcoded secret to Azure Key Vault**

  Leaving secrets and sensitive data in the codebase is generally considered poor practice. This approach helps you identify suspicious secret texts and convert them into logic that retrieves the data from Azure Key Vault.

- **User authentication to Microsoft Entra ID authentication**

  Java applications often use LDAP-based authentication solutions that are not easily migrated to Azure. This approach helps you transition your local user authentication mechanism to one that uses Microsoft Entra ID for authentication.

## Next step

Migrate to **Azure SQL Database** using **Managed Identities** instead of passwords.
