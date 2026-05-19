---
ms.author: karler
ms.date: 03/31/2026
title: Java Sample and Snippet Guidelines
description: "Guidelines for reviewing and creating Java code samples in Azure documentation."
applyTo: "articles/java/**/*.md"
---

# Java sample and snippet guidelines

Use these guidelines when reviewing or creating Java code samples, sample repo READMEs, and documentation articles. These guidelines are designed to be portable across contexts — the same guidance applies whether you're creating a Java sample, writing the sample's README, or authoring the Learn documentation that references it.

## Audience and context

These guidelines apply differently depending on the output context:

- **Sample repo README**: The audience is experienced Java developers who prefer minimal ceremony. A README should provide concise, complete setup instructions without exploratory discussion. Readers may discover the repo independently and follow the README instead of the corresponding documentation article.
- **Documentation article (Learn)**: The audience is the same experienced developers, but the article provides more context, explanation, and exploration of the code. The article may walk through key code highlights, explain architectural decisions, and offer variations.
- **PR review**: When reviewing others' Java contributions, provide rationales with suggestions. Distinguish between blocking issues (bugs, credential leaks) and best-practice suggestions.

When generating a Java version of an existing sample in another language, these guidelines steer all three outputs: the Java code itself, the sample repo README, and the documentation article.

## Shell and command conventions

- Java on Azure content assumes readers are using Bash. Use `bash` as the fenced code block language label for shell commands. This implicitly supports other Bash-compatible shells (zsh, Git Bash on Windows, etc.).
- Exception: when a code block contains any Azure CLI commands (`az ...`), use `azurecli` as the language label instead. This is an org-wide guideline for proper syntax highlighting of Azure CLI, even if the same block also contains non-CLI Bash lines.
- Avoid PowerShell-specific syntax in command snippets. If a command must differ across shells, provide only the Bash version.

## Project naming conventions

- Use `com.example.<subject>` for `groupId` and package names in documentation samples. The `com.example` domain is [IANA-reserved](https://www.rfc-editor.org/rfc/rfc2606) specifically for examples, so it signals "sample code" unambiguously. The `<subject>` groups related samples (for example, all Azure AI Search samples could share `com.example.search`).
- Align the Java package name to the `groupId`. For example, if `groupId` is `com.example.search`, source files should be under `src/main/java/com/example/search/` with `package com.example.search;`.
- The `artifactId` should describe the sample concisely — for example, `vector-search-quickstart`, `rag-chatbot`, `ai-search-tutorial`. Using the article type (quickstart, tutorial, etc.) is fine when it applies, but isn't mandatory.
- Don't use Azure SDK namespaces like `com.azure.*` for sample project coordinates. Reserve `com.azure` for actual SDK packages — using it in samples could mislead readers into thinking the sample is an official package.

## Dependencies and build configuration

- Use the latest non-beta versions for all dependencies in `pom.xml`. Beta SDK dependencies may be rejected or removed by content owners and can break without notice.
- Don't use beta Azure SDK dependencies in shipped samples. If a feature requires a beta SDK, note the beta status prominently and plan to update when GA is available.
- Keep `pom.xml` dependencies minimal. Don't add libraries that aren't used in the sample. Every additional dependency increases maintenance burden and potential version conflicts.
- Prefer built-in JDK functionality over third-party libraries when the built-in approach is reasonable. For example, prefer `java.net.http.HttpClient` over Apache HttpClient, and prefer `SearchDocument` (dynamic map) over typed POJOs with Jackson annotations when full type safety isn't needed. When required functionality isn't built into the JDK or available through existing Azure SDK dependencies, use the most common third-party library for the task (for example, Jackson for JSON parsing). Always use the latest stable version for security and compatibility.
- Use the Azure SDK BOM (`azure-sdk-bom`) for Azure dependency version management rather than specifying individual versions.
- For Spring Cloud Azure projects, use the Spring Cloud Azure BOM (`spring-cloud-azure-dependencies`).
- For single-entry-point samples, configuring `mainClass` in `exec-maven-plugin` is acceptable — it simplifies run commands to just `mvn exec:java`. For multi-entry-point samples, omit the plugin configuration and specify the entry point on each command: `mvn exec:java "-Dexec.mainClass=..."`. Don't configure a "default" entry point in multi-entry-point samples — it privileges one scenario over others.
- Don't use interactive menus or prompts for scenario selection within a sample. Use separate entry points or command-line arguments — interactive menus add complexity, can't be scripted, and make article instructions harder to write.
- Include `slf4j-nop` as a dependency to suppress SLF4J logging noise in console output. This keeps the actual program output clean and allows article output snippets to accurately reflect what the user sees.
- Use standard Maven project layout (`src/main/java` for sources, `src/main/resources` for resources). Don't override `<sourceDirectory>` in the POM to use non-standard paths — it confuses IDE auto-detection and breaks developer expectations.
- Add brief comments in `pom.xml` describing the purpose of each dependency, especially for dependencies whose purpose isn't obvious from the artifact name. For example, `<!-- Suppress noisy SDK logging -->` on `slf4j-nop` is helpful.

## Repository hygiene

- Never commit Java build artifacts. Include a `.gitignore` with at least the following Java-specific entries:

  ```gitignore
  target/
  *.class
  *.jar
  .idea/
  *.iml
  ```

  Non-Java content owners using AI to generate Java samples may not be familiar with Java build output conventions.

- Java source files and shell scripts should use LF line endings. Include a `.gitattributes` file in the sample root with `*.java text eol=lf` and `*.sh text eol=lf` to prevent CRLF issues when contributors use Windows.

## Configuration and secrets

- Use `application.properties` for non-sensitive configuration (endpoints, index names, resource names).
- Use environment variables for sensitive configuration (connection strings, keys, secrets).
- Use `export` for all environment variables that Java code reads via `System.getenv`. The inline Bash pattern (`VAR=x command`) is valid but fragile across platforms, unfamiliar to many readers, and may not work reliably on all shells (particularly zsh on macOS). Using `export` also ensures variables persist across multiple shell windows and subsequent commands.
- Use `System.getenv` to read environment variables. Don't use `.env` files with third-party libraries like `dotenv-java` — it adds an unnecessary dependency and introduces a non-standard configuration pattern for Azure documentation.
- When a multi-language sample uses `azd up` (Azure Developer CLI) to provision resources and generate a `.env` file, the Java setup instructions should direct the reader to source the `.env` file into the shell environment rather than reading it in Java code. Use `set -a && source .env && set +a` — the `set -a` ensures variables are exported to child processes (including the Maven JVM), so `System.getenv` works without any code changes or additional dependencies. This approach is more robust than `export $(grep -v '^#' .env | xargs)`, which breaks on values with spaces, special characters, or empty values. In a **README**, this is typically a single step; in a **documentation article**, briefly explain what `set -a` does for readers unfamiliar with the idiom.
- Don't hardcode service endpoints or resource names in Java source code. Always externalize them to `application.properties` or environment variables so readers can substitute their own values.
- In `application.properties` files committed to repos, always use placeholder notation: `azure.search.endpoint=https://<your-search-service-name>.search.windows.net`. Never commit real Azure endpoints or credentials.

## Code style and formatting

- Use 4-space indentation for block nesting. For continuation lines (long method chains, wrapped parameter lists), 8-space (double) indentation is acceptable and is standard Java convention — it visually distinguishes continuations from new nested blocks.
- Aim to keep lines short enough that the code block doesn't show a horizontal scrollbar. Around 80 characters is a good target, but it's a soft guideline. If one or two lines slightly exceed 80 characters, that's fine — avoid awkward splits where a long line breaks just before 80 characters leaving a very short continuation. Either keep it on one slightly longer line, or split earlier so both lines are balanced.
- Target Java 21+ syntax conventions for new content: prefer text blocks (triple-quote `"""` for multi-line strings), `var` for local type inference when the type is obvious, records for simple data carriers, and pattern matching. Actively use these features — targeting Java 21 but writing Java 8-style code misses the pedagogical opportunity to demonstrate modern Java. Older content targeting earlier Java versions is acceptable on a case-by-case basis — if a PR updates an article that targets a pre-21 version, flag it as a suggestion to consider updating to Java 21+, but don't block the PR on it.
- Follow standard Java naming conventions: `camelCase` for variables and methods, `PascalCase` for classes and interfaces.
- Use descriptive, self-documenting names for methods and variables. Avoid abbreviations or cryptic naming.
- Place `main` methods at the bottom of class definitions — they are typically thin wrappers and serve infrastructural rather than pedagogical purposes.
- Add `System.exit(0)` at the end of `main` to avoid thread persistence warnings.
- Avoid Unicode emoji in console output. Some terminals, CI environments, and log viewers don't render them correctly. Use plain text labels or simple ASCII formatting instead.

## Code comments

- Prefer self-documenting method and variable names over comments. Add code comments only for non-obvious logic, disambiguation, or security-relevant patterns.
- Note security-relevant patterns in code comments so readers understand why the code exists — for example, why a field name is validated before interpolation into a query.
- Javadoc comments on public methods and decorative section separators (such as `// ── Section ───`) are author's discretion. Don't flag them in reviews unless they are misleading, incorrect, or stale.
- Don't add comments that merely restate the code (such as `// Create a Cosmos client` above `createCosmosClient()`).

## Error handling

- Let exceptions propagate naturally in sample code. An uncaught exception with a stack trace on the command line is more informative for the reader than a caught-and-logged exception, and avoids the visual noise of production-style try/catch blocks.
- Use `try-with-resources` for `Closeable` resources (SDK clients, streams, connections). This is idiomatic Java, costs no extra lines, and prevents resource leaks.
- If you do catch exceptions, never swallow them silently (`catch (Exception e) {}`). But in most sample code, catching is unnecessary — the target audience is experienced Java developers who will add their own error handling in production.
- For sensitive operations (credential handling, irreversible actions like data deletion), a brief code comment noting potential failure modes is appropriate. Full try/catch blocks are not.

## Security and input validation

- When building queries from user input or environment variables, validate or parameterize inputs. Never interpolate raw strings into SQL or query expressions.
- Note security-relevant patterns in code comments so readers understand the rationale — for example, why a field name is validated before being interpolated into a Cosmos DB SQL query. This is especially important because readers may copy code patterns without understanding the security implications.
- Don't implement custom cryptographic operations or roll-your-own security measures in samples. For authentication and authorization, use established SDK patterns like `DefaultAzureCredential`.

## Azure SDK patterns

- Use the builder pattern for creating Azure SDK clients: `new <ServiceName>ClientBuilder()...buildClient()`.
- Close or manage lifecycle of async clients appropriately.
- Prefer synchronous clients in samples unless the article specifically covers async patterns or reactive programming.

## Output formatting

- Prefer `System.out.printf()` with `%n` for line terminators when formatting output with embedded variables. `System.out.println()` with simple trailing concatenation (such as `"Connected to: " + name`) is acceptable when there's a single variable at the end — don't enforce `printf` everywhere.
- When displaying document fields that might be null, use a fallback to avoid printing the literal string "null" in console output: `document.get("Field") != null ? document.get("Field") : "N/A"`. Article output snippets should show clean, reader-friendly results.
- Consider printing a diagnostic echo at startup showing the configured endpoint and resource names. This helps readers verify their configuration is correct and makes article output snippets more informative.
- Isolate large data (embedding vectors, bulk document arrays, test datasets) into dedicated classes or `static final` constants. This keeps `main()` methods and pedagogical code readable.

## Imports

- Show required imports in the first code block of a sample. Don't force readers to guess the import statements.
- For inline snippets (not full samples), imports can be omitted if the fully qualified class name is used or the context is clear.

## Project setup for copy-paste-run

This pattern is primarily used in documentation articles where the reader creates project files step by step.

- Provide instructions where the user creates the folder structure, adds the `pom.xml` file with full provided contents, and adds individual code files.
- Don't use the `mvn archetype:generate` command, which produces a simple project that requires editing and confuses the setup narrative.
- After adding the `pom.xml` and before any source files exist, direct the user to run `mvn dependency:resolve` to verify that dependencies are available. This validates the POM without attempting to compile nonexistent source.
- After adding a new class file with its own `main` method, direct the user to run: `mvn compile exec:java "-Dexec.mainClass=<full.class.Name>"` (for example, `com.example.search.CreateIndex`). Quote the full `-D` argument rather than just the value — `"-Dexec.mainClass=..."` is more reliable across shells (bash, zsh, PowerShell) than `-Dexec.mainClass="..."`.

## Project setup for clone-and-explore

This pattern applies to both sample repo READMEs and documentation articles, with differences in detail level.

- Direct the user to clone the sample repo and navigate to the project folder.
- After the user configures `application.properties` (or environment variables, or sources the `.env` file), direct them to run `mvn compile` as a setup verification step. This catches configuration errors (typos in endpoints, missing properties) early, before the reader invests time in individual scenarios.
- **In a README**: keep the run commands concise — `mvn exec:java "-Dexec.mainClass=..."` is sufficient after the upfront `mvn compile`, since the audience is expected to understand that recompilation is needed if they modify the code.
- **In a documentation article**: use `mvn compile exec:java "-Dexec.mainClass=..."` for each run command. Including `compile` costs essentially nothing (Maven's incremental compilation skips unchanged sources) and ensures that readers who experiment by modifying the code get a fresh build when they copy-paste the run command.
- For experienced Java developers, consider listing dependencies as a concise bulleted list (name + version) rather than showing the full `pom.xml` XML. The full POM is appropriate when build properties or plugin configuration need explanation.
- Don't use `mvn clean dependency:copy-dependencies` for setup. The `dependency:copy-dependencies` goal copies JARs to `target/dependency/`, which isn't used by `exec:java` and is an unusual Maven idiom. Use `mvn compile` instead — it's a better smoke test that validates both dependencies and source.

## Sample structure and architecture

### Aligning to multi-language coverage

- When creating Java coverage for an article that already has samples in other languages, structurally align to the existing coverage: same files, same class names, same variable names, same method decomposition — but following Java conventions and making practical exceptions for idiomatic Java and language-specific structural requirements.

### New Java samples (no existing parallel coverage)

- Avoid monolithic classes and methods. Strive for a reasonable balance of DRY encapsulation and snippet readability.
- Encapsulate the key features for pedagogical illustration in well-named, self-documenting methods with well-named, self-documenting variables. These methods should focus on the pedagogy and be suitable for displaying in their entirety as documentation snippets.
- Encapsulate basic infrastructural parts of the sample (parts that don't need to appear in the article) in separate methods and, where appropriate, separate classes.
- For samples that cover multiple parallel feature usage scenarios, use separate classes with their own `main` method entry points, each referenced via `mvn compile exec:java`. These separate classes can share a single utility class for infrastructure concerns such as reading environment variables.

### Clone-and-explore pattern

- When articles instruct readers to clone a sample repo and then discuss highlights, structure the sample so that pedagogically important code is in self-contained, well-named methods that can be shown as complete snippets in the article. Infrastructure and boilerplate should be in separate methods or classes that the article doesn't need to display.

## README and documentation conventions

- Every fenced code block in a README or documentation article should be copy-paste-able as-is for at least one complete scenario, or require only minimal modification such as replacing placeholders. Don't combine multiple alternative commands in a single code block — separate them into distinct blocks with explanatory text.
- In READMEs, prerequisite links are optional but helpful. In documentation articles, prerequisite items should always link to the relevant setup instructions.

## PR review guidance

When reviewing Java samples in pull requests, provide rationales with suggestions so the PR author can make informed decisions. These guidelines are suggestions, not blockers — the PR author or content owner has final say.

- **Distinguish between blocking issues and suggestions.** Blocking: real bugs, credential leaks, broken code. Suggestion: style improvements, dependency preferences, structural patterns.
- **Provide context for suggestions.** For example: "Consider using `System.getenv` instead of `dotenv-java` — it avoids a third-party dependency and follows the Azure documentation convention for Java samples."
- **Respect existing sample alignment.** If the PR creates a Java version of an existing sample in another language, the structural alignment to that sample takes priority over these guidelines. Only flag divergences that would cause functional issues or significantly harm readability.
- **For unfamiliar PRs** (where you don't know if the sample is generated from an existing one or is new), note that your suggestions are based on Java documentation best practices and that the author should consider them in context.
