---
description: "Guidelines and best practices for reviewing developer-focused articles, including code sample standards, snippet structure, and developer content requirements."
---

# Developer Content Review Instructions

## What is a developer-focused article?

A developer-focused article is written for readers who understand application design and development. The audience is expected to know how to set up a basic developer environment, install language-specific dependencies, and read, create, and execute code.

## Review Guidelines for Developer-Focused Articles

- Standardize comment syntax and placement for each programming language.
- Clearly flag and explain any deliberate errors in code examples.
- Always use the correct devlang tag for each snippet (for example: JSONL, .NET, Python).
- Begin each snippet section with a bullet list of prerequisites and dependencies, then show code and expected output.
- For partial examples, provide a section that shows how they fit into a full app.
- In each article, include links to best-practice articles on data, prompts, retries, and quotas.
- Client configuration should use exponential backoff, with links to the relevant reference documentation. This allows customers to use the code with different SKUs.
- Embed links in-line for any referenced service, SDK, or cloud concept.
- State SDK support status (supported, roadmap, or not planned) and link to the public roadmap.
- Use a consistent “Beta,” “Preview,” or “GA” badge with a link to the full feature list for any partial-support features.
- Whenever a model or list of models is used, insert a link back to the primary model documentation article.
- Label each example (for example, “Hello World: Simplest” vs. “Real-World: Common Use”) to guide readers by complexity.
- Split guidance into “Development” and “Production” sections or tabs for scannable differentiation.
- Encapsulate logic into small, well-named functions or classes; avoid monolithic scripts.
- Always show all import/using statements at the top of the snippet.
- After each snippet, list links to the referenced classes, methods, and result-object schemas.
- Enforce an 80-character line wrap (or respect the current LPP setting) to eliminate horizontal scrolling.
- Language-based quickstarts must explicitly state the programming language with a link to its source in the prerequisites.
