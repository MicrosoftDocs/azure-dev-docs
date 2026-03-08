---
title: Customization
description: Learn how to customize the GitHub Copilot modernization agent with custom skills to encode organization-specific migration patterns.
author: KarlErickson
ms.author: karler
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 02/26/2026
keywords: custom skills, SKILL.md, organization patterns, customization
---

# Customization

The GitHub Copilot modernization agent supports custom skills that allow you to define organization-specific migration patterns, internal library usage, and coding standards. This enables consistent modernization across your organization while leveraging proprietary knowledge.

## What are custom skills?

Custom skills follow the [agent skills specification](https://agentskills.io/specification) to teach the modernization agent how to perform specific migration tasks using your organization's patterns and libraries. When you create a modernization plan, the agent automatically detects and applies relevant custom skills based on your migration prompt.

Custom skills are useful for:

- **Internal library migrations**: Switching to organization-specific SDKs or frameworks
- **Re-use migration pattern**: Capturing and reusing successful migration patterns

## Custom skill structure

Each custom skill is defined in a `SKILL.md` file with:

1. **YAML front matter**: Metadata for skill detection
2. **Overview**: Description of the migration scenario
3. **Steps**: Detailed instructions for the agent
4. **Sample code**: Concrete examples demonstrating the migration

## Create a custom skill

### Step 1: Create the skill directory

Create a new folder under `.github/skills/` in your repository with a descriptive name:

```bash
mkdir -p .github/skills/my-migration-pattern
```

### Step 2: Write the SKILL.md file

Create `.github/skills/my-migration-pattern/SKILL.md` with the structure shown below.

#### Required front matter fields

```yaml
---
name: my-migration-pattern
description: A concrete description of what this skill helps migrate
---
```

**Important**: The `description` field is critical. The agent uses it to determine when to apply the skill based on the user's migration prompt. Make it specific and accurate.

Good descriptions:
- ✅ "Migrate from RabbitMQ with AMQP to Azure Service Bus for messaging"
- ✅ "Replace direct JDBC calls with Spring Data repositories"

Bad descriptions:
- ❌ "Messaging migration" (too vague)
- ❌ "Update libraries" (not specific)
- ❌ "Improve code" (unclear goal)

### Step 3: Provide examples and migration verification checks

Include code examples and verification checks to guide the agent:

- **Code changes**: code snippets showing the migrated implementation using the new approach
- **Configuration changes**: Updates to properties, XML, or other config files
- **Dependency changes**: Maven/Gradle/NuGet updates required for the migration
- **Verification checks**: Criteria the agent should validate after applying the migration

You may also provide resource files in the skill directory and tell the agent how to use them in the content of SKILL.md file.

## Use custom skills

### Automatic detection

When you create a modernization plan, the agent automatically:

1. Scans `.github/skills/` for custom skills
2. Compares your migration prompt with skill descriptions
3. Incorporates relevant skills into the plan
4. Uses skill to guide code transformations

Example:

```bash
# Agent will automatically detect and use the RabbitMQ skill
modernize plan create "migrate from rabbitmq to azure service bus"
```

### Manual verification

To verify which skills are detected:

1. Create a plan with your prompt
2. Review `.github/modernization/{plan-name}/tasks.json`
3. Look for references to your custom skills
```
    "skills": [
        {
          "name": "your-skill-name",
          "location": "project"
        }
    ]
```

If a skill isn't being detected:

- Refine the skill `description` to better match your prompt
- Make the prompt more specific
- Ensure `SKILL.md` is properly formatted

## Sample repository

For a complete example, see the [NewsFeedSite sample repository](https://github.com/Azure-Samples/NewsFeedSite) which includes:

- Custom skill for RabbitMQ to Azure Service Bus migration
- Demonstrates using internal JDK libraries
- Shows proper skill structure and formatting

Clone and explore:

```bash
git clone https://github.com/Azure-Samples/NewsFeedSite.git
cd NewsFeedSite
ls -la .github/skills/
modernize plan create "migrate from rabbitmq to azure service bus"
```

## Troubleshooting

### Skill not detected

**Problem**: Agent doesn't use your custom skill

**Solutions**:
- Check that the skill name in the YAML front matter doesn't contain spaces; use hyphens instead (for example, `my-custom-skill` not `my custom skill`)
- Verify `description` matches your prompt keywords
- Check YAML front matter syntax
- Ensure `SKILL.md` is in `.github/skills/{skill-name}/`
- Make your migration prompt more specific

## Next steps

- [Quick start: Get started with the modernization agent](modernization-agent-quickstart.md)
- [Batch assessment: Assess multiple applications](modernization-agent-batch-assess.md)
- [Batch upgrade: Upgrade multiple applications](modernization-agent-batch-upgrade.md)
- [CLI reference](modernization-agent-cli-commands.md)
- [Return to overview](modernization-agent-overview.md)
