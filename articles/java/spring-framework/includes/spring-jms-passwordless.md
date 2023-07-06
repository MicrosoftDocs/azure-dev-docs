#### [Use a Service Bus queue](#tab/use-a-service-bus-queue)

1. Assign the `Azure Service Bus Data Owner` role to the Azure AD account you're currently using.

   Before using Azure Active Directory(Azure AD) to authorize requests to Service Bus resources, you need to use [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) to grant permissions to a [security principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object), which may be a user or an application service principal. See [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal) for more details.

   If you want to run this sample locally with Azure AD authentication, be sure your user account has authenticated via Azure Toolkit for IntelliJ, Visual Studio Code Azure Account plugin, or Azure CLI. Also, be sure the account has been granted sufficient permissions.

2. Configure the Service Bus credentials by adding the following properties to your *application.properties* file.

   ```properties
   spring.jms.servicebus.namespace=<ServiceBusNamespace>
   spring.jms.servicebus.pricing-tier=<ServiceBusPricingTier>
   spring.jms.servicebus.passwordless-enabled=true
   ```

   The following table describes the fields in the configuration:

   | Field                                     | Description                                                                                     |
-------------------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------|
   | `spring.jms.servicebus.namespace`            | Specify the namespace you obtained in your Service Bus service from the Azure portal. |
   | `spring.jms.servicebus.pricing-tier`         | Specify the pricing tier of your service bus. Supported values are *premium*, *standard*, and *basic*. Premium uses Java Message Service (JMS) 2.0, while standard and basic use JMS 1.0 to interact with Azure Service Bus. |
   | `spring.jms.servicebus.passwordless-enabled` | Specify whether to use passwordless. |

3. Add `@EnableJms` to enable support for JMS listener annotated endpoints. Use `JmsTemplate` to send messages and `@JmsListener` to receive messages, as shown in the following example:

   ```java
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.jms.annotation.EnableJms;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.jms.annotation.JmsListener;
   import org.springframework.jms.core.JmsTemplate;

   @SpringBootApplication
   @EnableJms
   public class ServiceBusJMSQueueApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(ServiceBusJMSQueueApplication.class);
       private static final String QUEUE_NAME = "<QueueName>";

       @Autowired
       private JmsTemplate jmsTemplate;

       public static void main(String[] args) {
           SpringApplication.run(ServiceBusJMSQueueApplication.class, args);
       }

       @Override
       public void run(String... args) {
           LOGGER.info("Sending message");
           jmsTemplate.convertAndSend(QUEUE_NAME, "Hello Word");
       }

       @JmsListener(destination = QUEUE_NAME, containerFactory = "jmsListenerContainerFactory")
       public void receiveMessage(String message) {
           LOGGER.info("Message received: {}", message);
       }

   }
   ```

   Replace `<QueueName>` with your own queue name configured in your Service Bus namespace.

   [!INCLUDE [spring-default-azure-credential-overview.md](spring-default-azure-credential-overview.md)]

4. Start the application. You should see `Sending message` and `Hello Word` posted to your application log, as shown in the following example output:

   ```output
   Sending message
   Message received: Hello Word
   ```

#### [Use a Service Bus topic](#tab/use-a-service-bus-topic)

1. Assign the `Azure Service Bus Data Owner` role to the Azure AD account you're currently using.

   Before using Azure Active Directory(Azure AD) to authorize requests to Service Bus resources, you need to use [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) to grant permissions to a [security principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object), which may be a user or an application service principal. See [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal) for more details.

   If you want to run this sample locally with Azure AD authentication, be sure your user account has authenticated via Azure Toolkit for IntelliJ, Visual Studio Code Azure Account plugin, or Azure CLI. Also, be sure the account has been granted sufficient permissions.

2. Configure the Service Bus credentials by adding the following properties to your *application.properties* file.

   ```properties
   spring.jms.servicebus.namespace=<ServiceBusNamespace>
   spring.jms.servicebus.topic-client-id=<ServiceBusSubscriptionID>
   spring.jms.servicebus.pricing-tier=<ServiceBusPricingTier>
   spring.jms.servicebus.passwordless-enabled=true
   ```

   The following table describes the fields in the configuration:

   | Field                                   | Description                                                                                     |
-----------------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------|
   | `spring.jms.servicebus.namespace`            | Specify the namespace you obtained in your Service Bus service from the Azure portal. |
   | `spring.jms.servicebus.pricing-tier`         | Specify the pricing tier of your service bus. Supported values are *premium*, *standard*, and *basic*. Premium uses Java Message Service (JMS) 2.0, while standard and basic use JMS 1.0 to interact with Azure Service Bus. |
   | `spring.jms.servicebus.topic-client-id`      | Specify the JMS client ID, which is your Service Bus Subscription ID in the Azure portal.       |
   | `spring.jms.servicebus.passwordless-enabled` | Specify whether to use passwordless. |

3. Add `@EnableJms` to enable support for JMS listener annotated endpoints. Use `JmsTemplate` to send messages and `@JmsListener` to receive messages, as shown in the following example:

   ```java
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.jms.annotation.EnableJms;
   import org.springframework.jms.annotation.JmsListener;
   import org.springframework.jms.core.JmsTemplate;

   @SpringBootApplication
   @EnableJms
   public class ServiceBusJMSTopicApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(ServiceBusJMSTopicApplication.class);
       private static final String TOPIC_NAME = "<TopicName>";
       private static final String SUBSCRIPTION_NAME = "<SubscriptionName>";

       @Autowired
       private JmsTemplate jmsTemplate;

       public static void main(String[] args) {
           SpringApplication.run(ServiceBusJMSTopicApplication.class, args);
       }

       @Override
       public void run(String... args) {
           LOGGER.info("Sending message");
           jmsTemplate.convertAndSend(TOPIC_NAME, "Hello Word");
       }

       @JmsListener(destination = TOPIC_NAME, containerFactory = "topicJmsListenerContainerFactory",
           subscription = SUBSCRIPTION_NAME)
       public void receiveMessage(String message) {
           LOGGER.info("Message received: {}", message);
       }

   }
   ```

   Replace the `<TopicName>` placeholder with your own topic name configured in your Service Bus namespace. Replace the `<SubscriptionName>` placeholder with your own subscription name for your Service Bus topic.

   [!INCLUDE [spring-default-azure-credential-overview.md](spring-default-azure-credential-overview.md)]

4. Start the application. You should see `Sending message` and `Hello Word` posted to your application log, as shown in the following example output:

   ```output
   Sending message
   Message received: Hello Word
   ```

---
