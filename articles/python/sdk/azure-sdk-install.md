---
title: How to install Azure SDK library packages for Python
description: How to install, uninstall, and verify Azure SDK or Python libraries using pip and conda. Includes details on installing specific versions and preview packages.
ms.date: 05/24/2021
ms.topic: conceptual
ms.custom: devx-track-python
adobe-target: true
---

# How to install Azure library packages for Python

The Azure SDK for Python is composed solely of many individual libraries that can be installed in standard Python or Conda environments.

Libraries for standard Python environments are listed in the [package index](azure-sdk-library-package-index.md).

Packages for Conda environments are listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have names that begin with `azure-`.

With these Azure libraries you can provision and manage resources on Azure services (using the management libraries, whose names begin with `azure-mgmt`) and connect with those resources from app code (using the client libraries, whose names begin with just `azure-`).

## Install the latest version of a library

# [pip](#tab/pip)

```cmd
pip install <library>
```

`pip install` retrieves the latest version of a library in your current Python environment.

On Linux systems, you must install a library for each user separately. Installing libraries for all users with `sudo pip install` isn't supported.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

Be sure you've added the Microsoft channel to your Conda configuration (you need to do this only once):

```cmd
conda config --add channels "Microsoft"
```

Then install the desired package:

```cmd
conda install <package>
```

`conda install` retrieves the latest version of a package in your current Python environment.

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have named that begin with `azure-`.

Packages for Conda are grouped by services. For example, `azure-storage` includes libraries for working with blobs, file shares, queues, and any other Azure Storage service. The single `azure-mgmt` package contains the management libraries for all services.

---

## Install specific library versions

# [pip](#tab/pip)

Be sure you've added the Microsoft channel to your Conda configuration (you need to do this only once):

```cmd
conda config --add channels "Microsoft"
```

```cmd
pip install <library>==<version>
```

Specify the desired version on the command line with `pip install`.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

```cmd
conda install <package>==<version>
```

Specify the desired version on the command line with `conda install --revision`.

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have named that begin with `azure-`.

---

## Install preview packages

# [pip](#tab/pip)

```cmd
pip install --pre <library>
```

To install the latest preview of a library, include the `--pre` flag on the command line.

Microsoft periodically releases preview library packages that support upcoming features, with the caveat that the library is subject to change and must not be used in production projects.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

Preview packages for Conda are not available at this time.

---

## Verify a library installation

# [pip](#tab/pip)

```cmd
pip show <library>
```

If the library is installed, `pip show` displays version and other summary information, otherwise the command displays nothing.

You can also use `pip freeze` or `pip list` to see all the libraries that are installed in your current Python environment.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

```cmd
conda list <package>
```

If the package is installed, `conda list` displays version and other summary information, otherwise the command displays nothing.

You can also use `conda list` to see all the packages that are installed in your current conda environment.

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have named that begin with `azure-`.

---

## Uninstall a library

# [pip](#tab/pip)

```cmd
pip uninstall library.
```

To uninstall a library, use `pip uninstall`.

You can use any package name listed in the [package index](azure-sdk-library-package-index.md).

# [conda](#tab/conda)

```cmd
conda remove <package>
```

To uninstall a package, use `conda remove <package>`.

You can use any package name listed in the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). Azure packages have named that begin with `azure-`.

---
