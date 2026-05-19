---
ms.author: karler
ms.date: 03/31/2026
title: Copilot Instructions for Java on Azure
description: "Central instructions for Copilot tasks for Java on Azure content."
applyTo: "articles/java/**/*.md"
---

# Copilot instructions for all Java language content

Use the following instructions when creating, editing, or reviewing articles that include the Java programming language.

## Product and feature naming

- **GitHub Copilot modernization** is the correct product name (lowercase "modernization"). The old name "GitHub Copilot app modernization" is deprecated. The folder `articles/github-copilot-app-modernization` retains "app" for URL stability, but all content must use the current name.
- **Spring Cloud Azure** is the product name for the Spring integration libraries documented in `articles/java/spring-framework`. Don't confuse with "Spring Cloud" (a third-party product unrelated to Azure).
- **Azure SDK for Java** is the full name on first reference. Subsequent references can use "the SDK" or "the Java SDK" when unambiguous.
- **Microsoft Build of OpenJDK** is the full product name for Microsoft's JDK distribution.

## JDK version guidance

- Target **Java 21** (current LTS) as the recommended baseline for new content.
- Don't introduce Java 8 or Java 11 as prerequisites in new articles unless specifically required by the service or scenario.
- When an article must reference older Java versions, note the relevant end-of-support timelines and recommend upgrading.
- Java 25 is the current latest release. New content should prefer Java 21 LTS but can target Java 25 where appropriate.
- For PRs that update articles targeting pre-Java 21 versions, suggest considering an update to Java 21+ but don't block the PR on it.
- Every article with Java prerequisites must explicitly list the minimum Java version in the **Prerequisites** section (for example, "Java 21 or later"). Don't assume the reader will infer the version from other context.

## Authentication and identity

- Prefer `DefaultAzureCredential` over other credential types unless the article specifically covers an alternative authentication flow.
- Prefer Azure Identity over connection strings, keys, or other non-identity-based authentication.
- Use Azure Key Vault for secrets management rather than hardcoding or environment variables where feasible.

## Spring Boot version guidance

- Target **Spring Boot 3.x** (current latest) for new content. Spring Boot 3.x requires Java 17+, which aligns with the Java 21 baseline.
- Don't introduce Spring Boot 2.7.x in new articles — it reached end of OSS support in November 2023. When an existing article references Spring Boot 2.7.x, note the end-of-support status and suggest upgrading.
- For PRs that update Spring Boot 2.7.x articles, suggest considering an update to Spring Boot 3.x but don't block the PR on it.
- When an article targets a specific Spring Boot version, document the minimum Java version in the **Prerequisites** section:

  | Spring Boot | Minimum Java | Recommended |
  | --- | --- | --- |
  | 3.2.x, 3.1.x, 3.0.x | Java 17 | Java 17 or 21 |
  | 2.7.x (end-of-life) | Java 8 | Java 11 or 17 |

## Spring Cloud Azure conventions

- Spring Cloud Azure packages use the group ID `com.azure.spring`.
- Starter artifact IDs follow the pattern `spring-cloud-azure-starter-<service>`, for example `spring-cloud-azure-starter-storage-blob`.
- Always reference the Spring Cloud Azure BOM (`spring-cloud-azure-dependencies`) for dependency management rather than specifying individual library versions.

## Code samples

- When reviewing or creating Java code samples, also follow guidelines in [java-sample-guidelines.md](java-sample-guidelines.md).

## Metadata

- The `title` metadata value in YAML front matter uses **title capitalization** (capitalize principal words). This is distinct from content headings (H1–H6), which use **sentence capitalization** per Learn style guide.
- Ensure `ms.custom` includes `devx-track-java` for all Java articles.
- AI-related Java articles (content *about* AI) should have `ms.update-cycle: 180-days`, except in `articles/github-copilot-app-modernization/` where this value is inherited from `articles/docfx.json`.

## AI-usage metadata

- `ai-usage: ai-generated` — for articles or code entirely produced by AI.
- `ai-usage: ai-assisted` — for articles or code where AI contributed but a human made key decisions (for example, an AI-generated Java version of a human-written JavaScript sample).
- When reviewing PRs, if new content lacks an `ai-usage` value and appears to contain AI-generated or AI-assisted content, flag its absence so the author can choose the appropriate value.
- An existing `ai-generated` value should not be downgraded to `ai-assisted` unless the article has been substantially rewritten by a human.
