## Add support for dev containers

You can also make your template compatible with development containers and Codespaces. A dev container allows you to use a container as a full-featured development environment. It can be used to run an application, to separate tools, libraries, or runtimes needed for working with a codebase, and to aid in continuous integration and testing. Dev containers can be run locally or remotely, in a private or public cloud. (Source: [https://containers.dev/](https://containers.dev/))

To add support for dev containers:

1. Create a .devcontainer folder at the root of your project.

1. Create a `devcontainer.json` file inside of the `.devcontainer` folder with the desired configurations. The `azd` starter template provides a [sample `devcontainer.json`](https://github.com/Azure-Samples/azd-starter-bicep/blob/main/.devcontainer/devcontainer.json) file that you can copy into your project and modify as needed.

Read more about [working with dev containers](https://code.visualstudio.com/docs/devcontainers/containers) on the Visual Studio Code documentation.