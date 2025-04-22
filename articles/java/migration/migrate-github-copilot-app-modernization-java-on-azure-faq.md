## FAQ


## What’s the product scope of the Java Migration Copilot?
We recognize the migration process is always complex and intertwined, with different layers of app ecosystems. During private preview, we are limiting the migration scope to Java backend apps.

## Can I use the Java Migration Copilot to upgrade my Java version?
There is a separate [GitHub Copilot assistant for Java upgrade](https://devblogs.microsoft.com/java/technical-preview-github-copilot-upgrade-assistant-for-java), and you can use it together with the Java Migration Copilot.

## Will the migration copilot be open sourced in the future?
We currently have **no plans to open source** the Java Migration Copilot.

## What GitHub Copilot license plan do I need to use the Java Migration Copilot?
Any plan will work, including the free plan.

## In addition to Java, I also need to migrate apps written in other languages. Is there a plan for the migration copilot to go beyond Java or consolidate with the .NET experience?
Currently, the Java Migration Copilot is focused on assisting with **Java applications**. However, we are actively collecting requirements and feedback from customers regarding the need to support other languages and potentially **consolidate with the .NET experience**.

**Q: Where are formulas stored on the local machine and how to share them?**  
**A:**  
- Predefined formulas are located at:  
  `%USERPROFILE%\.vscode\extensions\microsoft.migrate-java-to-azure-0.1.0\rag`
- Custom formulas are stored at:  
  `%USERPROFILE%\.azure\migrate-copilot\custom-rule`

---

**Q: How to switch LLM models?**  
**A:** Java Migration Copilot currently supports three models:
- `gpt-4o`
- `claude-3.5-sonnet`
- `gemini-2.0-flash`

To switch models:
1. Press `Ctrl+Shift+P`  
2. Click **Preferences: Open Settings (UI)**  
3. Search for `migrate.java`  
4. Adjust the **Migrate Java: Model Family** setting

---

**Q: What are the token size limits of the top models?**  
**A:** Please refer to the GitHub Copilot official documentation for detailed model specifications.

---

**Q: Why is the code regeneration process unstable?**  
**A:** Java Migration Copilot is powered by AI, so occasional errors may occur. Always review the output carefully before use. You can also retry the regeneration process to see alternative code suggestions.

---

**Q: Does the tool store my source code?**  
**A:** No. The tool uses GitHub Copilot just like how you modify code with GitHub Copilot, which does **not retain** code snippets beyond the immediate session.  
We do not collect, transmit, or store your custom formulas either.  
**Telemetry metrics** are collected and analyzed to track feature usage and effectiveness.  
Please review the [Microsoft Privacy Statement](https://privacy.microsoft.com) if necessary.
