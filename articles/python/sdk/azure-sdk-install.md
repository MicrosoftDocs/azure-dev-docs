---
title: How to install Azure SDK library packages for Python
description: How to install, uninstall, and verify Azure SDK or Python libraries using pip and conda. Includes details on installing specific versions and preview packages.
ms.date: 12/12/2022
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
adobe-target: true
---

# How to install Azure library packages for Python

The Azure SDK for Python is composed solely of many individual libraries that can be installed in standard Python or Conda environments.

Libraries for standard Python environments are listed in the [package index](azure-sdk-library-package-index.md).

Packages for Conda environments are listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have names that begin with `azure-`.

With these Azure libraries, you can create and manage resources on Azure services (using the management libraries, whose package names begin with `azure-mgmt`) and connect with those resources from app code (using the client libraries, whose package names begin with just `azure-`).

## Install the latest version of a library

# [pip](#tab/pip)

```cmd
pip install <library>
```

`pip install` retrieves the latest version of a library in your current Python environment.

On Linux systems, you must install a library for each user separately. Installing libraries for all users with `sudo pip install` isn't supported.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md). Look in the **Name** column for the library you want, and then find the correct PyPI link in the **Package** column.

# [conda](#tab/conda)

Be sure you've added the Microsoft channel to your Conda configuration (you need to run this command only once):

```cmd
conda config --add channels "Microsoft"
```

Then, install the desired package:

```cmd
conda install <package>
```

`conda install` retrieves the latest version of a package in your current Python environment.

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have named that begin with `azure-`.

Packages for Conda are grouped by services. For example, `azure-storage` includes libraries for working with blobs, file shares, queues, and any other Azure Storage service. The single `azure-mgmt` package contains the management libraries for all services.

---

## Install specific library versions

# [pip](#tab/pip)

Specify the desired version on the command line with `pip install`.

```cmd
pip install <library>==<version>
```

You can find the version number in the [package index](azure-sdk-library-package-index.md). Look in the **Name** column for the library you want, and select PyPI link in the **Package** column. For example, to install a version of the `azure-storage-blob` library you can use the: `pip install azure-storage-blob==12.14.1`.

# [conda](#tab/conda)

Be sure you've added the Microsoft channel to your Conda configuration (you need to run this command only once):

```cmd
conda config --add channels "Microsoft"
```

Then, install the desired package and version:

```cmd
conda install <package>==<version>
```

To find a version number, go to the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have named that begin with `azure-`. Find the library you want, drill into it, and look for the version number in the "Files" tab. For example, to install a version of `azure-storage` you can use the: `conda install azure-storage=2022.09.01`. Or, you can specify the desired version on the command line with `conda install --revision`.

---

## Install preview packages

# [pip](#tab/pip)

To install the latest preview of a library, include the `--pre` flag on the command line.

```cmd
pip install --pre <library>
```

Microsoft periodically releases preview library packages that support upcoming features. Preview libraries come with the caveat that the library is subject to change and must not be used in production projects.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

Preview packages for Conda aren't available at this time.

---

## Verify a library installation

# [pip](#tab/pip)

To verify a library installation:

```cmd
pip show <library>
```

If the library is installed, `pip show` displays version and other summary information, otherwise the command displays nothing.

You can also use `pip freeze` or `pip list` to see all the libraries that are installed in your current Python environment.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

To verify a library installation:

```cmd
conda list <package>
```

If the package is installed, `conda list` displays version and other summary information, otherwise the command displays nothing.

You can also use `conda list` to see all the packages that are installed in your current conda environment.

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have named that begin with `azure-`.

---

## Uninstall a library

# [pip](#tab/pip)

To uninstall a library:

```cmd
pip uninstall library.
```

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

To uninstall a package:

```cmd
conda remove <package>
```

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have named that begin with `azure-`.

---
