---
title: How to install Azure SDK library packages for Python
description: How to install, uninstall, and verify Azure SDK or Python libraries using pip and conda. Includes details on installing specific versions and preview packages.
ms.date: 02/05/2025
ms.topic: install-set-up-deploy
ms.custom: devx-track-python, py-fresh-zinc
adobe-target: true
---

# How to install Azure library packages for Python

The Azure SDK for Python is composed of many individual libraries that can be installed in standard [Python](https://docs.python.org/3/library/venv.html) or [conda](https://docs.conda.io/projects/conda/en/latest/user-guide/concepts/environments.html) environments.

Libraries for standard Python environments are listed in the [package index](azure-sdk-library-package-index.md).

Packages for conda environments are listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have names that begin with `azure-`.

With these Azure libraries, you can create and manage resources on Azure services (using the management libraries, whose package names begin with `azure-mgmt`) and connect with those resources from app code (using the client libraries, whose package names begin with just `azure-`).

## Install the latest version of a package

# [pip](#tab/pip)

```cmd
pip install <package>
```

`pip install` retrieves the latest version of a package in your current Python environment.

On Linux systems, you must install a package for each user separately. Installing packages for all users with `sudo pip install` isn't supported.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md). On the index page, look in the **Name** column for the functionality you need, and then find and select the PyPI link in the **Package** column.

# [conda](#tab/conda)

Be sure you've added the Microsoft channel to your conda configuration (you need to run this command only once):

```cmd
conda config --add channels "Microsoft"
```

Then, install the desired package:

```cmd
conda install <package>
```

`conda install` retrieves the latest version of a package in your current Python environment.

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have names that begin with `azure-`.

Packages for conda are grouped by services. For example, `azure-storage` includes libraries for working with blobs, file shares, queues, and any other Azure Storage service. The single `azure-mgmt` package contains the management libraries for all services.

---

## Install specific package versions

# [pip](#tab/pip)

Specify the desired version on the command line with `pip install`.

```cmd
pip install <package>==<version>
```

You can find version numbers in the [package index](azure-sdk-library-package-index.md). On the index page, look in the **Name** column for the functionality you need, and then find and select the PyPI link in the **Package** column. For example, to install a version of the `azure-storage-blob` package you can use: `pip install azure-storage-blob==12.19.0`.

# [conda](#tab/conda)

Be sure you've added the Microsoft channel to your conda configuration (you need to run this command only once):

```cmd
conda config --add channels "Microsoft"
```

Then, install the desired package and version:

```cmd
conda install <package>==<version>
```

You can find version numbers on the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have names that begin with `azure-`. Find the library/package you want, drill into it, and look for the version number in the "Files" tab. For example, to install a version of `azure-storage` you can use: `conda install azure-storage=2023.09.01`. Or, you can specify the desired version on the command line with `conda install --revision`.

---

## Install preview packages

# [pip](#tab/pip)

To install the latest preview of a package, include the `--pre` flag on the command line.

```cmd
pip install --pre <package>
```

Microsoft periodically releases preview packages that support upcoming features. Preview packages come with the caveat that the package is subject to change and must not be used in production projects.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

Preview packages for conda aren't available at this time.

---

## Verify a package installation

# [pip](#tab/pip)

To verify a package installation:

```cmd
pip show <package>
```

If the package is installed, `pip show` displays version and other summary information, otherwise the command displays nothing.

You can also use `pip freeze` or `pip list` to see all the packages that are installed in your current Python environment.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

To verify a package installation:

```cmd
conda list <package>
```

If the package is installed, `conda list` displays version and other summary information, otherwise the command displays nothing.

You can also use `conda list` to see all the packages that are installed in your current conda environment.

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have names that begin with `azure-`.

---

## Uninstall a package

# [pip](#tab/pip)

To uninstall a package:

```cmd
pip uninstall <package>
```

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

To uninstall a package:

```cmd
conda remove <package>
```

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have names that begin with `azure-`.

---
