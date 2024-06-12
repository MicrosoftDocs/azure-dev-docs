---
title: Install and configure Visual Studio Code for Go development
description: This article helps you install and configure Visual Studio Code for Go development.
ms.date: 6/11/2024
ms.topic: quickstart
ms.custom: devx-track-go
---

# Install and configure Visual Studio Code for Go development

In this quickstart, you will install the Go compiler and tools, install Visual Studio Code to write Go code, and install the Go for Visual Studio Code extension which provides support while writing Go. Once configured, you'll create an application, run it, and use the debugging tool to pause execution and observe the value of variables.

## 1. Install Go

Install Go from the official page. This installs the compiler, the Standard Library, and many tools to perform various common tasks during Go development. To install Go, follow these steps:

1. In a web browser, go to [go.dev/doc/install](https://go.dev/doc/install).
1. Download the version for your operating system.
1. Once downloaded, run the installer.
1. Open a command prompt, then run `go version` to confirm Go was installed.

## 2. Install Visual Studio Code

Next, install Visual Studio Code, which provides basic code editing functionality. Follow these steps to install Visual Studio Code:

1. Open a web browser and go to [code.visualstudio.com](https://code.visualstudio.com/).
1. Download the version for your operating system. Visual Studio Code supports Windows, Linux, and macOS.
1. Once downloaded, run the installer.

## 3. Install the Go extension

Install and configure the [Go for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=golang.Go) extension. Visual Studio Code and the Go extension provide IntelliSense, code navigation, and advanced debugging.

| Instructions    | Screenshot |
|:----------------|-----------:|
| In Visual Studio Code, bring up the Extensions view by clicking on the Extensions icon in the Activity Bar. Or use keyboard shortcut (Ctrl+Shift+X). | :::image type="content" source="./media/configure-visual-studio-code/search-extensions-240px.png" alt-text="A screenshot showing how search for the Go extension." lightbox="./media/configure-visual-studio-code/search-extensions.png"::: |
| Search for the Go extension, then select install. | :::image type="content" source="./media/configure-visual-studio-code/install-go-extension-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/configure-visual-studio-code/install-go-extension.png"::: |

## 4. Update the Go tools

| Instructions    | Screenshot |
|:----------------|-----------:|
| In Visual Studio Code, open **Command Palette**'s **Help** > **Show All Commands**. Or use the keyboard shortcut (Ctrl+Shift+P) | :::image type="content" source="./media/configure-visual-studio-code/search-extensions-240px.png" alt-text="A screenshot showing how search the Command Palette." lightbox="./media/configure-visual-studio-code/search-extensions.png"::: |
| Search for `Go: Install/Update tools` then run the command from the pallet | :::image type="content" source="./media/configure-visual-studio-code/install-go-tools-240px.png" alt-text="A screenshot showing how to run the Go: install/update tool from the command pallet." lightbox="./media/configure-visual-studio-code/install-go-tools.png"::: |
| When prompted, select all the available Go tools then select OK.  | :::image type="content" source="./media/configure-visual-studio-code/select-all-go-tools-240px.png" alt-text="A screenshot showing how to update all the available Go tools." lightbox="./media/configure-visual-studio-code/select-all-go-tools.png"::: |
| Wait for the Go tools to finish updating.  | :::image type="content" source="./media/configure-visual-studio-code/go-tools-install-240x.png" alt-text="A screenshot showing all the Go tools that were updated." lightbox="./media/configure-visual-studio-code/go-tools-install.png"::: |

## 5. Write a sample Go program

In this step, you write and run a sample Go program to make sure everything is working correctly.

| Instructions    | Screenshot |
|:----------------|-----------:|
| In Visual Studio Code, open the root directory of your Go application. To open the folder, select the Explorer icon in the Activity Bar then select **Open Folder**. | :::image type="content" source="./media/configure-visual-studio-code/open-folder-240px.png" alt-text="A screenshot showing how to create a new folder." lightbox="./media/configure-visual-studio-code/open-folder.png"::: |
| Select **New Folder** in the Explorer panel, then Create the root director for your sample Go application named `sample-app` | :::image type="content" source="./media/configure-visual-studio-code/create-folder-240px.png" alt-text="A screenshot showing how to create a folder in Visual Studio Code." lightbox="./media/configure-visual-studio-code/create-folder.png"::: |
| Select **New File** in the Explorer panel, then name the file `main.go` | :::image type="content" source="./media/configure-visual-studio-code/create-file-240px.png" alt-text="A screenshot showing how to create a file in Visual Studio Code." lightbox="./media/configure-visual-studio-code/create-file.png"::: |
| Open a terminal, **Terminal > New Terminal**, then run the command `go mod init sample-app` to initialize your sample Go app.   | :::image type="content" source="./media/configure-visual-studio-code/run-go-mod-240px.png" alt-text="A screenshot running the go mod init command." lightbox="./media/configure-visual-studio-code/run-go-mod.png"::: |
| Copy the following code into the `main.go` file.   | :::image type="content" source="./media/configure-visual-studio-code/visual-studio-code-240px.png" alt-text="A screenshot displaying a sample Go program." lightbox="./media/configure-visual-studio-code/visual-studio-code.png"::: |

Sample code:

```go
package main

import "fmt"

func main() {
    name := "Go Developers"
    fmt.Println("Azure for", name)
}
```

## 6. Run the debugger

Finally, create a break point and use the debugger tool to step through code line by line and view the values stored in variables while the application is paused.

| Instructions    | Screenshot |
|:----------------|-----------:|
| Create a break point on line 7 by clicking to the left of the numbered line. Optionally, place your cursor on line 7 and hit F9. | :::image type="content" source="./media/configure-visual-studio-code/create-breakpoint-240px.png" alt-text="A screenshot showing how to set a breakpoint." lightbox="./media/configure-visual-studio-code/create-breakpoint.png"::: |
| Open the Debug view by selecting the debug icon in the Activity Bar on the left side of Visual Studio Code. Optionally, use the keyboard shortcut (Ctrl+Shift+D). | :::image type="content" source="./media/configure-visual-studio-code/run-debugger-240px.png" alt-text="A screenshot showing how to navigate to the debug panel." lightbox="./media/configure-visual-studio-code/run-debugger.png"::: |
| Select *Run and Debug*, or select F5 to run the debugger. Then Hover over the variable `name` on line 7 to see its value. Exit the debugger by clicking **Continue** on the debugger bar or hit F5. | :::image type="content" source="./media/configure-visual-studio-code/debug-variable-240px.png" alt-text="A screenshot showing running the debugger in VS Code." lightbox="./media/configure-visual-studio-code/debug-variable.png"::: |

## Next steps

> [!div class="nextstepaction"]
> [Go in Visual Studio Code](https://code.visualstudio.com/docs/languages/go)
> [!div class="nextstepaction"]
> [Key Azure Services for Go Developers](key-azure-services-for-go.md)
> [!div class="nextstepaction"]
> [Authenticate with the Azure SDK for Go](azure-sdk-authentication.md)
