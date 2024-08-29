---
author: KarlErickson
ms.author: karler
ms.date: 8/25/2020
---

Now that you've completed your migration, verify that your application works as you expect. You can then make your application more cloud-native by using the following recommendations.

* Consider enabling your application to work with Spring Cloud Registry. This component enables your application to be dynamically discovered by other deployed Spring applications and clients. For more information, see [Configure settings for the Eureka Server for Spring component in Azure Container Apps](/azure/container-apps/java-eureka-server-usage). Then, modify any application clients to use the Spring Client Load balancer. It allows the client to obtain addresses of all the running instances of the application and find an instance that works if another instance becomes corrupted or unresponsive. For more information, see [Spring Tips: Spring Cloud Load Balancer](https://spring.io/blog/2020/03/25/spring-tips-spring-cloud-loadbalancer) in the Spring Blog.

* Instead of making your application public, consider adding a [Spring Cloud Gateway](https://cloud.spring.io/spring-cloud-gateway/reference/html/) instance. Spring Cloud Gateway provides a single endpoint for all applications deployed in your Azure Container Apps environment. If a Spring Cloud Gateway is already deployed, ensure that routing rule is configured to route traffic to your newly deployed application.

* Consider adding a Spring Cloud Config Server to centrally manage and version-control configuration for all your Spring Cloud applications. First, create a Git repository to house the configuration and configure app instance to use it. For more information, see [Configure settings for the Config Server for Spring component in Azure Container Apps](/azure/container-apps/java-config-server-usage). Then, migrate your configuration using the following steps:

  1. Inside the application's *src/main/resources* directory, create a *bootstrap.yml* file with the following contents:

        ```yml
          spring:
            application:
              name: <your-application-name>
        ```

  1. In the configuration Git repository, create a *\<your-application-name>.yml* file, where `your-application-name` is the same as in the preceding step. Move the settings from *application.yml* file in *src/main/resources* to the new file you created. If the settings were previously in a *.properties* file, converted them to YAML first. You can find online tools or IntelliJ plugins to perform this conversion.

  1. Create an *application.yml* file in the directory above. You can use this file to define settings and resources that are shared among all applications on the Azure Container Apps environment. Such settings typically include data sources, logging settings, Spring Boot Actuator configuration, and others.

  1. Commit and push these changes to the Git repository.

  1. Remove the *application.properties* or *application.yml* file from the application.

* Consider adding Admin for Spring managed component to enable an administrative interface for Spring Boot web applications that expose actuator endpoints. For more information, see [Configure the Spring Boot Admin component in Azure Container Apps](/azure/container-apps/java-admin-for-spring-usage).

* Consider adding a deployment pipeline for automatic, consistent deployments. Instructions are available [Azure Pipelines](/azure/container-apps/azure-pipelines) and for [GitHub Actions](/azure/container-apps/github-actions).

* Consider using container apps revisions, revision labels, and ingress traffic weights to enable blue-green deployment, which allows you to test code changes in production before they're made available to some or all of your end users. For more information, see [Blue-Green Deployment in Azure Container Apps](/azure/container-apps/blue-green-deployment).

* Consider adding service bindings to connect your application to supported Azure databases. These service bindings would eliminate the need for you to provide connection information, including credentials, to your Spring Cloud applications.

* Consider enabling Java development stack to collect JVM core metrics of your applications. For more information, see [Java metrics for Java apps in Azure Container Apps](/azure/container-apps/java-metrics).

* Consider adding Azure Monitor alert rules and action groups to quickly detect and address aberrant conditions. For more information, see [Set up alerts in Azure Container Apps](/azure/container-apps/alerts).

* Consider replicating app across the zones in the region by enabling Azure Container Apps' zone redundancy. Traffic is load balanced and automatically routed to replicas if a zone outage occurs. For more information on redundant settings, see [Reliability in Azure Container Apps](/azure/reliability/reliability-azure-container-apps).

* Consider to [Protect Azure Container Apps with Web Application Firewall on Application Gateway](/azure/container-apps/waf-app-gateway) from common exploits and vulnerabilities.
