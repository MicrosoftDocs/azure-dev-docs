

**Q: What’s the product scope of the Java Migration Copilot?**  
**A:** We recognize the migration process is always complex and intertwined, with different layers of app ecosystems. At this time, we are limiting the migration scope to **Java backend apps**.

---

**Q: Can I use the Java Migration Copilot to upgrade my Java version?**  
**A:** There is a separate [GitHub Copilot assistant for Java upgrade](https://devblogs.microsoft.com/java/technical-preview-github-copilot-upgrade-assistant-for-java), and you can use it together with the Java Migration Copilot.

---

**Q: Will the migration copilot be open sourced in the future?**  
**A:** We currently have **no plans to open source** the Java Migration Copilot.

---

**Q: What GitHub Copilot license plan do I need to use the Java Migration Copilot?**  
**A:** Any plan will work, including the **free plan**.

---

**Q: In addition to Java, I also need to migrate apps written in other languages. Is there a plan for the migration copilot to go beyond Java or consolidate with the .NET experience?**  
**A:** Currently, the Java Migration Copilot is focused on assisting with **Java applications**. However, we are actively collecting requirements and feedback from customers regarding the need to support other languages and potentially consolidate with the **.NET experience**.

---

**Q: What are the token size limits of the top models?**  
**A:** Please refer to the [GitHub Copilot official documentation](https://docs.github.com/copilot) for detailed model specifications.

---

**Q: Why does the GitHub Copilot Agent stop after listing a plan without making any code changes?**  
**A:** Sometimes, Copilot requires explicit confirmation before proceeding. You can simply type `yes` or `continue` in the chat to allow the agent to move forward with the code modifications.

---

**Q: Why does GitHub Copilot Agent frequently prompt me to click "Continue"?**  
**A:** To ensure safer operations, the GitHub Copilot Agent repeatedly asks for user confirmation. As a workaround, you can click the dropdown arrow next to the "Continue" button and select **"Always allow"**, or update your VS Code setting `chat.tools.autoApprove` to `true` to automatically approve all tools.

---

**Q: How can I view more details about the code changes made by the agent?**  
**A:** The agent always includes explanations for its code changes in the chat window. However, these details may be collapsed in the UI. You can expand the response in the chat to see the full rationale and step-by-step reasoning.

---

**Q: Why is the code regeneration process unstable?**  
**A:** Java Migration Copilot is powered by AI, so occasional errors may occur. Always review the output carefully before use. You can also retry the regeneration process to see alternative code suggestions.

---

**Q: Where are formulas stored on the local machine and how can they be shared?**  
**A:**  
- Predefined formulas are located at:  
  `%USERPROFILE%\.vscode\extensions\microsoft.migrate-java-to-azure-0.1.0\rag`  
- Custom formulas are stored at:  
  `%USERPROFILE%\.azure\migrate-copilot\custom-rule`

---

**Q: How do I switch LLM models?**  
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


**Q: Does the tool store my source code?**  
**A:** No. The tool uses GitHub Copilot in the same way you use it to modify code, which does **not retain** code snippets beyond the immediate session.  
We do **not collect, transmit, or store** your custom formulas either.  

**Telemetry metrics** are collected and analyzed to track feature usage and effectiveness.  

Please review the [Microsoft Privacy Statement](https://privacy.microsoft.com) if needed.
