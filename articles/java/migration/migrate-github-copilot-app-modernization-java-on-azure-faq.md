## FAQ

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