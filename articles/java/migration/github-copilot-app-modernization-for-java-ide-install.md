To install GitHub Copilot modernization inside your IDE, first ensure you have a GitHub account with [GitHub Copilot](https://github.com/features/copilot) enabled. You need a Free Tier, Pro, Pro+, Business, or Enterprise plan.

## [Visual Studio Code](#tab/vscode)

- Install the latest version of [Visual Studio Code](https://code.visualstudio.com/). Must be version 1.101 or later.
- Install [GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within Visual Studio Code.
- Install [GitHub Copilot modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure). Restart Visual Studio Code after installation.
- Install [Java JDK](/java/openjdk/download) for both the source and target JDK versions.
- Install [Maven](https://maven.apache.org/download.cgi) or [Gradle](https://gradle.org/install/) to build Java projects.
- Use a Git-managed Java project with Maven or Gradle.
- For Maven-based projects: make sure you can access the public Maven Central repository.
- In the Visual Studio Code settings, make sure `chat.extensionTools.enabled` is set to `true`. Your organization might control this setting.

Sign in to use Copilot and then install the required extension:

1. In Visual Studio Code, open the **Extensions** view from the Activity Bar.
2. Search for **GitHub Copilot modernization** in the marketplace.
3. Select **GitHub Copilot modernization**.
4. On the extension page, select **Install**.
5. Restart Visual Studio Code.

After installation completes, you should see a confirmation notification in Visual Studio Code.

For more information, see [Install a VS Code extension](https://code.visualstudio.com/docs/getstarted/extensions#_install-a-vs-code-extension).

## [IntelliJ IDEA](#tab/intellij)

- Install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download). Must be version 2023.3 or later.
- Install [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot). Must be version 1.5.59 or later. For more instructions, see [Set up GitHub Copilot in IntelliJ IDEA](https://docs.github.com/en/copilot/get-started/quickstart). Be sure to sign in to your GitHub account within IntelliJ IDEA.
- Install [GitHub Copilot modernization](https://plugins.jetbrains.com/plugin/28791-github-copilot-app-modernization). Restart IntelliJ IDEA after installation. If you do not have GitHub Copilot installed, you can install GitHub Copilot modernization directly.
- For more efficient use of GitHub Copilot modernization: in IntelliJ IDEA settings, open **Tools** > **GitHub Copilot**, then select **Auto-approve** and **Trust MCP Tool Annotations**. For more information, see [Configure settings for GitHub Copilot modernization to optimize the experience for IntelliJ](configure-settings-intellij.md).
- Install [Java JDK](/java/openjdk/download) for both the source and target JDK versions.
- Install [Maven](https://maven.apache.org/download.cgi) or [Gradle](https://gradle.org/install/) to build Java projects.
- Use a Git-managed Java project with Maven or Gradle.
- For Maven-based projects: make sure you can access the public Maven Central repository.

> [!INCLUDE [IntelliJ note](../includes/github-copilot-modernization-intellij-note.md)]
> [!TIP]
> To get the best experience in IntelliJ, we recommend configuring a few key settings. For more information, see [Configure settings for GitHub Copilot modernization to optimize the experience for IntelliJ](configure-settings-intellij.md).



> [!NOTE]
> [!INCLUDE [Azure account note](../includes/github-copilot-modernization-azure-note.md)]
>
> [!INCLUDE [Gradle Kotlin note](../includes/github-copilot-modernization-gradle-kotlin-note.md)]


