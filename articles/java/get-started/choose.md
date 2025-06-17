---
title: Choose the Right Azure Services for your Java Applications
description: This article guides you on using Azure services for Java application deployment, emphasizing Azure's support for diverse Java technologies and architectures.
author: KarlErickson
ms.author: karler
ms.reviewer: asirveda
ms.topic: article
ms.date: 09/30/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Choose the right Azure services for your Java applications

This article guides you on using Azure services for Java application deployment, emphasizing Azure's support for diverse Java technologies and architectures. It outlines deployment methods like lift and shift, containerization, and Platform-as-a-Service (PaaS), tailored to various control and simplicity levels.

The article advocates an *A+B mindset*, advising you to choose services based on application needs over a fixed A or B choice. It suggests considering use case, business goals, security, and budget for a flexible approach. The article highlights Microsoft's partnership with Java ecosystem leaders to enhance developer experiences and recommends Azure services for deploying Java applications - whether as source, binaries, or containers. This nuanced approach helps you focus on innovation, supported by Microsoft's commitment to providing Java applications with the most appropriate Azure services for your deployment strategy, maximizing efficiency, scalability, and cost-effectiveness.

## Deploy any Java application with confidence and ease

The Java ecosystem includes diverse technologies such as Java SE, Jakarta EE (successor to Java EE and J2EE), Spring, numerous application servers, and other frameworks. Whatever you're doing with Java - such as building an app, using a framework, and running an application server - Azure supports your workload with an abundance of choice. Similarly, Azure supports any application architecture - from monolithic applications running on VMs or in containers to cloud-native, microservices-based applications running on fully managed services.

Azure offers the following three primary methods for running Java applications in the cloud, tailored to varying levels of control and simplicity:

- The *lift and shift* approach enables minimal-change migration of existing applications directly to Azure Virtual Machines.

- Containerization offers flexibility, with Azure Kubernetes Service (AKS) and Azure Red Hat OpenShift being the main platforms for orchestrating containerized apps.

- Platform-as-a-Service (PaaS) represents the pinnacle of ease and efficiency, delivering optimal developer productivity and operational manageability, often coupled with the most economical total cost of ownership.

No matter the stage of your Java application development, Azure provides a compatible cloud solution to meet your requirements. You can read more about these offerings in [Deploy Java applications with confidence and ease](deploy.md).

### Complete portability for your Java applications: deploy seamlessly anywhere

No matter which Azure service you pick for your Java application, the flexibility of your application is guaranteed. Because you have the Java code and its compiled outputs, you have the freedom to deploy your application anywhere you want - be it on your local development machine, build servers, on-premises environments, or any cloud platform of your choosing. Your application's portability is in your hands.

Of course, when there are so many choices, you face a dilemma.

## Dilemma – use service A or B for Java applications

If you navigate Azure's offerings, you might encounter the dilemma of selecting the most suitable Azure service for running your Java applications. This choice is crucial, as it influences your resource planning, budget, project timelines, and ultimately, your application's time to market. The decision affects not just the initial deployment costs but also the ongoing maintenance expenses.

In the past, organizations often felt compelled to choose between two platforms, technologies, or competing solutions for their software applications. For example, organizations had to decide between WebLogic or WebSphere for Java Enterprise applications, Docker Swarm or Kubernetes for container management, or containers versus virtual machines (VMs) for deployment. This decision-making process is called the *A or B mindset*, and it differs significantly from A/B testing, which is a method for comparing two versions of a webpage or app against each other to determine which one performs better. Instead, the A or B mindset in this context is about choosing one platform or technology over another for application deployment. It comes from traditional on-premises practices, where decisions are often constrained by factors like packaged software delivery models, substantial upfront investments in infrastructure and software licensing, and the lengthy lead times needed to build and deploy any application platform.

Bringing this mindset to Azure can lead to excessive time spent on creating a single platform that tries to accommodate all applications, potentially introducing delays and inefficiencies. However, Azure offers a more advantageous approach, encouraging a shift from this restrictive mindset to one that embraces the best of both worlds, ultimately yielding a better return on investment (ROI).

As you transition to Azure, the cloud environment offers a flexible paradigm where you can provision and deprovision resources according to your needs, eliminating the necessity to choose between one service over another. This flexibility ushers in the A+B approach, a strategy that diverges from the traditional A or B mindset by encouraging a broader, more inclusive way of thinking. Azure facilitates this shift by making it both easy and cost-effective to blend the advantages of multiple services, and adopt an A+B mindset. This approach underscores the principle of selecting services that best align with the specific needs of your application, essentially advocating for choosing the right tool for the job at hand.

The transition to an A+B mindset enables organizations to broaden their decision-making processes and technical strategies, embracing new possibilities and opportunities that this mindset affords. This article delineates the principles of the A+B mindset, enabling you to judiciously select Azure services that resonate most effectively with your application's requirements. Whether it's Azure Container Apps, Azure App Service, Azure Kubernetes Service, or Virtual Machines, the A+B mindset grants you the latitude to assess and choose from an array of Azure Services for hosting your applications. This philosophy is applicable universally, transcending language and framework boundaries. Although Java applications are the focus here, the A+B mindset is equally relevant and beneficial for applications developed in any programming language.

By embracing the A+B mindset, you aren't confined to a single, predetermined service. Instead, you're empowered to combine services in a way that best suits the unique demands of your application. This approach not only enhances flexibility and scalability, but also optimizes cost and operational efficiency. This approach ensures that your technical strategy is as dynamic and adaptable as the cloud environment you're operating in.

## Why it isn't necessary to think of service A or B

Choosing the right cloud service for your applications doesn't have to be a binary decision between service A or service B, thanks to the flexibility and breadth of options the cloud offers, particularly with Azure. The following sections break down why sticking to the traditional "one or the other" choice isn't necessary and how adopting a more fluid approach can benefit your operations.

### From old habits to new flexibility

Traditionally, deploying IT systems involved significant upfront investments in hardware and software, alongside lengthy setup times. This environment made it logical to carefully select one platform and optimize everything around it to save on costs and resources. However, the cloud environment, including Azure, introduces a paradigm shift with its on-demand and elastic nature. You only pay for what you use, and adjusting your resources to meet your needs becomes straightforward, without the burden of initial capital expenditures.

### The shift to cloud

Moving to the cloud, and to Azure in particular, brings a significant change in how infrastructure and platform responsibilities are managed. Much of the heavy lifting, previously shouldered by your organization, now shifts to Microsoft, as seen in the following diagram. This change simplifies operations and reduces the effort needed to manage your applications. You aren't bound by the constraints of managing multiple platforms, freeing you to choose the best tool for each job without worrying about the extra costs and complexities.

The following diagram shows the shared responsibility model between customer and cloud provider:

:::image type="complex" source="media/responsibility.png" alt-text="Diagram with a table that shows the shared responsibility model between customer and cloud provider." lightbox="media/responsibility.png":::

The following table shows which infrastructure and platform responsibilities are managed by Microsoft, by the customer, or are shared:

| Responsibility                        | SaaS      | PaaS      | IaaS      | On-premises |
|---------------------------------------|-----------|-----------|-----------|-------------|
| Information and data                  | Customer  | Customer  | Customer  | Customer    |
| Devices (mobile and PCs)              | Customer  | Customer  | Customer  | Customer    |
| Accounts and identities               | Customer  | Customer  | Customer  | Customer    |
| Identity and directory infrastructure | Shared    | Shared    | Customer  | Customer    |
| Applications                          | Microsoft | Shared    | Customer  | Customer    |
| Network controls                      | Microsoft | Shared    | Customer  | Customer    |
| Operating system                      | Microsoft | Microsoft | Customer  | Customer    |
| Physical hosts                        | Microsoft | Microsoft | Microsoft | Customer    |
| Physical network                      | Microsoft | Microsoft | Microsoft | Customer    |
| Physical datacenter                   | Microsoft | Microsoft | Microsoft | Customer    |
:::image-end:::

### Choosing the best fit for each need

In this new cloud-centric world, the decision-making process becomes more about selecting the right tool for the right job, rather than trying to fit all your needs into one predetermined service. Whether it's choosing between Azure Kubernetes Service and Azure Container Apps for Spring Boot applications, or any other set of services, the focus shifts to what best meets the requirements of each specific application.

### The rise of microservices

The adoption of microservices further supports this flexible approach. By design, [microservices](https://martinfowler.com/articles/microservices.html) encourage the use of the best-suited technology for each service, promoting a technological diversity that naturally aligns with the A+B mindset. This approach is about using the strengths of different services to build a more robust, efficient, and scalable application architecture.

### Benefits of embracing A+B

Adopting an A+B mindset offers several key benefits. It enables greater agility and flexibility, enabling you to choose the most appropriate tools and services for each aspect of your operations. This approach not only leads to better resource and cost efficiency but also shortens the time to market for your products. Ultimately, this approach fosters operational excellence by aligning your technology choices more closely with your business needs and goals.

In summary, the cloud, and Azure in particular, offers a new way of thinking about deploying and managing your applications. By moving away from the restrictive A or B choice and embracing the A+B mindset, you can make decisions that are more aligned with the specific needs of your applications, leading to improved efficiency, agility, and cost savings.

## Practical guidance for transitioning to the A+B mindset

The following list enumerates some key principles that you can use as a guideline for transitioning to the A+B mindset and continuing with it:

- Go from use case to solution, not the other way around. Often, many software teams decide on technology first and then try to force-fit the use cases and design. In many cases, this approach incurs a significant overhead in terms of cost, development time, resources, and operational expenses. Get clarity on your use cases and requirements, both functional and non-functional, before jumping into the solution.

- Understand your business goals, the nature of business and your competition, and how often you need to roll out new features to production. You should always design your solution to meet your business goals and objectives.

- Understand security and compliance requirements. In the age of the cloud, where everything is accessed over the internet, security is crucial and non-negotiable. Also, depending on the industry you serve, your application might need to meet certain compliance requirements. You must design your solution to weather advanced security attacks and to meet your compliance requirements.

- Understand your budget and timelines. Have a clear understanding of your budget for initial development, ongoing operations, and future releases. Additionally, understand your timelines. The cost of delayed projects, both in terms of extra expenses and negative business impact, is often underestimated. Design your solution to meet both your budget and timeline.

- Think cloud-native where applicable. Cloud-native architecture and technologies are an approach to designing, constructing, and operating workloads that are built in the cloud and take full advantage of the cloud computing model. With cloud-native, you can build and deploy applications to production at a faster rate. The cloud also provides capabilities that might not be possible on premises - for example, elasticity, global scale, advanced analytics, AI, and machine learning (ML) capabilities. Design your solution based on cloud-native technologies as much as possible.

- Think DevOps culture. DevOps isn't just tools or processes, it's a software development practice that promotes collaboration between development and operations, resulting in faster and more reliable software delivery. Commonly called a culture, DevOps connects people, processes, and technology to deliver continuous value.

Choose the solution that meets your business and nonfunctional requirements, one that is:

- Fastest to implement.
- Cost-effective in terms of costs involved for skilling up, building, deployment, and operations.
- Easy to operate.
- Fully compatible with automation.
- Supportive of DevOps by design.

These principles help you keep your focus where it should be - on building a solution that meets your business goals rather than force-fitting the solution to a predetermined platform.

### Exceptions

Like anything else, there are exceptions to A+B. The following list isn't exhaustive, but it provides you with directional guidance on some exceptions that you might encounter:

- Enterprise strategy. For example, some enterprises use an enterprise-wide adoption of containers to build and deploy applications because they might have multiple programming languages at play, and they want to build and deploy all applications in a unified manner.

- Too far down the line with execution. You might have chosen a solution before going through the A+B analysis. If you're already deep into execution of your solution, continue with it, but for the next application, use the principles of the A+B mindset to choose the right solution for your use case.

- Large scale data center migrations. To accelerate their journey to the cloud, enterprises commonly use a lift and shift strategy, which involves migrating servers (hosting their applications) in bulk to Azure using tools like Azure Migrate. Some use this approach to migrate data centers to Azure and shut them down in an efficient and cost-effective manner. In this scenario, we recommend using the A+B mindset to modernize applications after migrating to Azure.

### Key considerations

We provided you with the framework for thinking and the principles that you can use to choose the right destinations in Azure for your applications. It isn't one size that fits all. It isn't A or B, but A + B.

The following diagram summarizes the key considerations for choosing an Azure service for any application:

:::image type="complex" source="media/key-considerations.png" alt-text="Diagram that shows a summary of the key considerations for choosing an Azure service for any application." lightbox="media/key-considerations.png":::
The following list describes the key considerations:

- Go from requirements to solution: Understand the requirements before considering the solution.
- It's not A or B: Choose the Azure service that best meets the requirements of your application.
- Look for a win-win: Focus and rely on your strength - which is building business applications. Let Microsoft take care of running the platform and infrastructure for you so that you can be agile and go to market faster than ever.
:::image-end:::

## How to choose the right Azure services for your Java applications

To streamline the selection process amidst the multitude of technology options for Java applications on Azure, we created a simple decision tree to help developers, customers, and systems integrators to their optimal Azure service.

Beyond the practical guidance for considering non-functional requirements, from a technological point of view, the initial question to consider is whether you need control over infrastructure. If you don't, managed services are the best, most advisable route. The nature of the applications - whether they're Spring or App Server-based - further guides the decision: Spring applications align with Azure Container Apps, while Azure App Service suits Tomcat or JBoss EAP applications.

For those requiring infrastructure control, the choice hinges on multi-cloud technology preferences: Azure Virtual Machines offers a simple transition, and for those integrated with Tanzu, the Tanzu on IaaS marketplace offerings are ideal. Customers invested in Kubernetes have the options of Azure Kubernetes Service and Azure Red Hat OpenShift. This decision-making framework is designed to simplify choices by pairing customer requirements with Azure's best suited solutions.

Microsoft collaborates with numerous partners, including partners in the following areas:

- Leading Java ecosystem partners, such as Oracle, Broadcom, Red Hat, IBM, and OpenAI.
- Key database and tooling organizations, such as MySQL, PostgreSQL, MongoDB Labs, DataStax, Redis Labs, Confluent, and Elastic.
- Observability experts, such as New Relic, Dynatrace, AppDynamics, Grafana Labs, and Datadog.
- Development tools, such as IntelliJ, Maven, and Gradle. 

Our combined investment goes into crafting smoother developer experiences, ensuring seamless integrations with essential services such as databases, caches, messaging, and directories, plus providing comprehensive tools for observability. With automation, load balancing, and autoscaling, we aim to take the burden of infrastructure management off your shoulders. This support enables you to concentrate on creating business value through your code, confident in the knowledge that the underlying systems are robust and scalable. For these reasons, we recommend the use of specific Azure services to host and run your Java application types.

### Deploy Java applications as source or binaries

For Java applications on Azure, whether deployed directly from source code or as compiled binaries (JAR, WAR, or EAR files), deployment is streamlined thanks to Azure's comprehensive service offerings designed specifically for these purposes. The inherent portability of Java applications means that Azure can provide a wide array of services to match your unique deployment strategies and operational needs. This flexibility ensures that no matter what the specifics of your Java application, there's an Azure service that fits perfectly with your requirements.

Consider the following three examples, which showcase how Azure caters to different Java application deployment scenarios:

- Spring Applications. For developers working with Spring applications, we recommend using Azure Container Apps, which integrates with popular development tools like IntelliJ, VS Code, Maven, and Gradle, alongside automation tools such as Azure DevOps, GitHub Actions, and Jenkins. Observability tools such as Application Insights, New Relic, Dynatrace, App Dynamics, Grafana, Log Analytics, Elastic, and Splunk are also supported. Security is a top priority, with integrations for Key Vault handling secrets and TLS/SSL certificates, "passwordless" authentication with backing services through managed identities, and Azure role-based access control (RBAC), ensuring a secure, streamlined deployment process for Spring apps in the cloud.

- Java Applications on JBoss EAP. Similarly, for Java applications using JBoss EAP, there's a tailored experience thanks to the collaboration between the Microsoft Azure team and Red Hat JBoss EAP teams. This partnership resulted in enhanced support on Azure App Service, offering a rich set of features designed for JBoss EAP applications. This support enables you to use the combined expertise of Microsoft and Red Hat, ensuring your Java applications run smoothly, securely, and efficiently on Azure.

- Enterprise Java Applications on WebLogic. Traditional enterprise Java applications that run on Oracle WebLogic also have a dedicated path to Azure. The collaboration between Microsoft Azure and the Oracle WebLogic teams paved the way for optimized deployment on Azure Virtual Machines. This partnership extends to integrating with fundamental IaaS features such as virtual machines, storage, networking, and load balancers, providing a solid foundation for enterprise Java applications on Azure. This coordinated effort ensures that applications benefit from both the robustness of WebLogic and the scalability and flexibility of Azure infrastructure.

These scenarios highlight Azure's dedication to offering a flexible, secure, and efficient deployment environment for Java applications, catering to various frameworks and architectures. Azure also provides specialized services for other Java applications, such as those running on Tomcat or WebSphere, ensuring that there's an Azure service suited for every type of Java application.

Developers and operators get smooth and productive cloud deployment experience by using these tailored Azure services, automating and securing their Java applications with ease. However, choosing alternative deployment options might require you to handle the building and maintenance of these essential developer and operator experiences yourself.

The following diagram shows recommended Azure services for every Java application type deployed as source or binaries:

:::image type="complex" source="media/find-match.png" alt-text="Diagram that shows recommended Azure services for every Java application type deployed as source or binaries." lightbox="media/find-match.png":::
The following table helps you find the right Azure service for every Java app type deployed as source or binaries:

|                     | Spring               | Tomcat or MicroProfile | Serverless and event-driven | JBoss EAP              | WebLogic               | WebSphere Traditional  |
|---------------------|----------------------|------------------------|-----------------------------|------------------------|------------------------|------------------------|
| Recommended service | Azure Container Apps | Azure App Service      | Azure Functions             | Azure App Service      | Azure Virtual Machines | Azure Virtual Machines |
| Alternative service | Azure App Service    | Azure Container Apps   | Azure App Service           | Azure Virtual Machines |                        |                        |
:::image-end:::

To learn more about the services referenced in this diagram, use the links in the following table:

| Service                                                 | Quickstart for Java apps – deployed as source or binaries                                                                                                                                      |
|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Azure Container Apps](/azure/container-apps/index)     | [Deploy a Java app](/azure/container-apps/java-get-started) <br/> [Deploy a Quarkus app](/azure/container-apps/tutorial-java-quarkus-connect-managed-identity-postgresql-database)             |
| [App Service](/azure/app-service/index)                 | [Deploy a Java app on Tomcat](/azure/app-service/quickstart-java?pivots=java-maven-tomcat) <br/> [Deploy a Java app on JBoss EAP](/azure/app-service/quickstart-java?pivots=java-maven-jboss)  |
| [Azure Functions](/azure/azure-functions/index)         | [Deploy a Java function app](/azure/azure-functions/create-first-function-cli-java)                                                                                                            |
| [Azure Virtual Machines](/azure/virtual-machines/index) | [Oracle WebLogic Server on Azure Virtual Machines](/azure/virtual-machines/workloads/oracle/oracle-weblogic) <br/> [IBM WebSphere family on Azure Virtual Machines](../ee/websphere-family.md) |

### Deploy Java applications as containers

When it comes to deploying Java applications, containerization represents a cutting-edge approach that enhances automation in container creation, management, and governance across enterprises. The challenge lies in securely and reliably building containers, a crucial step for swiftly delivering high-quality, containerized software applications. This process can begin from scratch or use existing container systems, integrating tools that compile and store code and binaries to streamline container updates and management. Such integration is vital for fitting into Continuous Integration/Continuous Deployment (CI/CD) pipelines, offering a flexible deployment method for Java applications in container form.

Azure services stand out by not only easing the delivery of containerized applications but also providing clear paths for deploying from sources or binaries. This dual approach minimizes the impact on developers and lightens the load for infrastructure or platform operators. Given Java's inherent portability, Azure's broad selection of container services ensures that you find the perfect match for your deployment strategy and needs.

Consider the following two examples, which showcase how Azure caters to containerized Java application deployment scenarios:

- Spring Applications. Azure Container Apps is an excellent choice for containerized Spring applications. It supports multiple deployment types, including source, binaries, or container images. This flexibility enables you to shift between deployment methods easily. You might start with containers but later decide to deploy as sources or binaries. This option is advantageous because it circumvents the need for the ongoing building and maintenance of containers, which can be cumbersome, repetitive, and time intensive.

- Java Applications on Tomcat. Azure App Service is suited for containerizing Java applications designed to run on Tomcat. It accommodates various deployment types, such as binaries or container images. Like Azure Container Apps, this service offers flexibility to alternate between deployment strategies. You can begin with container deployment and maintain the option to later switch to deploying binaries (WARs and JARs). This versatility ensures that you can choose the most efficient deployment method for your specific scenario, streamlining the development and deployment process.

These examples underscore Azure's commitment to providing versatile, efficient, and developer-friendly environments for deploying Java applications, whether through traditional methods or modern containerization.

The following diagram shows the recommended Azure services for every Java application type deployed as containers:

:::image type="complex" source="media/find-match-containers.png" alt-text="Diagram that shows recommended Azure services for every Java application type deployed as containers." lightbox="media/find-match-containers.png":::

The following table helps you find the right Azure service for every Java app type deployed as containers:

|                     | Spring microservice  | Spring monolith           | Tomcat                   | JBoss EAP                | WebLogic                 | WebSphere Liberty        |
|---------------------|----------------------|---------------------------|--------------------------|--------------------------|--------------------------|--------------------------|
| Recommended service | Azure Container Apps | Azure Container Apps      | Azure App Service        | Red Hat OpenShift        | Azure Kubernetes Service | Azure Kubernetes Service |
| Alternative service | AKS                  | Azure App Service<br/>AKS | Azure Kubernetes Service | Azure Kubernetes Service |                          | Red Hat OpenShift        |
:::image-end:::

To learn more about the services referenced in this diagram, use the links in the following table:

| Service                                             | Quickstart for containerized Java apps                                                                                                                                             |
|-----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Azure Container Apps](/azure/container-apps/index) | [Deploy a Java app](/azure/container-apps/java-get-started) <br/> [Deploy a Quarkus app](/azure/container-apps/tutorial-java-quarkus-connect-managed-identity-postgresql-database) |
| [App Service](/azure/app-service/index)             | [Deploy a Java app on Tomcat](/azure/app-service/quickstart-custom-container?tabs=java)                                                                                            |
| [Azure Red Hat OpenShift](/azure/openshift/index)   | [Deploy a Java app on JBoss EAP](/azure/openshift/howto-deploy-java-jboss-enterprise-application-platform-app)                                                                     |
| [Azure Kubernetes Service](/azure/aks/index)        | [Deploy a Java app on WebLogic Server](/azure/aks/howto-deploy-java-wls-app) <br/> [Deploy a Java app on WebSphere Liberty](/azure/aks/howto-deploy-java-liberty-app)              |

## Summary

In navigating the deployment of Java applications, Azure champions a nuanced A+B approach, offering a spectrum of services tailored to meet every application's needs. Microsoft's collaboration with the Java ecosystem leaders resulted in a suite of Azure services, each recommended for specific Java application types - deployed as source, binaries, or containers - streamlining the deployment process and ensuring optimal performance. This focus on matching deployment strategies with the most appropriate Azure services underscores Microsoft's commitment to providing you with the flexibility to choose the right tools for the job. The inherent portability of Java applications is a key advantage, enabling a seamless transition across on-premises systems and different cloud providers to enhance operational efficiency and agility. By advocating for this broader, more inclusive selection process, Microsoft not only simplifies the cloud journey for Java applications, but also maximizes scalability, security, observability, and cost-effectiveness. Ultimately, Microsoft's guidance empowers developers and enterprises to use Azure's ecosystem, ensuring that each Java application thrives in the cloud environment best suited to its needs.

## Next step

[Azure for Java developer documentation](../index.yml)
