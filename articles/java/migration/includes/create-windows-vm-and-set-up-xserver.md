---
author: KarlErickson
ms.author: haiche
ms.date: 04/27/2023
---

1. Use the following steps to create a Windows 10 VM from the Azure portal.

   1. Open the resource group `abc1110rg` from the Azure portal.
   1. Select **Create** to create the resource.
   1. Select **Compute**, search for *windows 10*, and then select **Microsoft Windows 10**.
   1. Select your desired plan, and then select **Create**.
   1. Use the following values to configure the VM:
      - **Virtual machine name**: *myWindowsVM*
      - **Image**: *Windows 10 Pro*
      - **Username**: *azureuser*
      - **Password**: *Secret123456*
   1. Select the checkbox under **Licensing**.
   1. Select **Review + create** and then **Create**.

   It takes a few minutes to create the VM and supporting resources.

   After the deployment is completed, install the X-server and use it to configure WLS on the Oracle Linux machines using a graphical interface.

1. Use the following steps to install and launch X-server.

   1. Use Remote Desktop to connect to `myWindowsVM`. For a detailed guide, see [How to connect using Remote Desktop and sign on to an Azure virtual machine running Windows](/azure/virtual-machines/windows/connect-rdp). You must execute the remaining steps in this section on `myWindowsVM`.
   1. Download and install the [VcXsrv Windows X Server](https://sourceforge.net/projects/vcxsrv/).
   1. Disable the firewall. To allow communication from the Linux VMs, use the following steps to turn off Windows Defender Firewall.
      1. Search for and open **Windows Defender Firewall**.
      1. Find **Turn Windows Defender Firewall on or off**, then select **Turn off** on the **Private network settings**. You can leave the **Public network settings** alone.
      1. Select **OK**.
      1. Close the **Windows Defender Firewall** settings panel.
   1. Select **X-launch** from the desktop.
   1. For display settings, use multiple windows, set display number to `-1`, and then select **Next**.
   1. For **Select how to start clients**, select  **Start no client**, and then select **Next**.
   1. For extra settings, select **Clipboard and Primary Selection**, **Native opengl**, and **Disable access control**.
   1. Select **Next** and finish.

   A **Windows Security Alert** may pop up, saying `Allow VcXsrv windows X-server to communicate on these networks`. Select **Allow access**.
