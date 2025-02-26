---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 04/29/2024
---

Enter the following query to create schema for TLOG.

```sql
create table TLOG_msp1_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
create table TLOG_msp2_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
create table TLOG_msp3_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
create table wl_servlet_sessions (wl_id VARCHAR(100) NOT NULL, wl_context_path VARCHAR(100) NOT NULL, wl_is_new CHAR(1), wl_create_time DECIMAL(20), wl_is_valid CHAR(1), wl_session_values VARBINARY(MAX), wl_access_time DECIMAL(20), wl_max_inactive_interval INTEGER, PRIMARY KEY (wl_id, wl_context_path));
```

After a successful run, you should see the message **Query succeeded: Affected rows: 0**.

These database tables are used for storing transaction log (TLOG) and session data for your WLS clusters and app. For more information, see [Using a JDBC TLOG Store](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/store/jdbc.html#GUID-6522B5CF-0775-4EEE-BF23-A5AD2C0F08EF) and [Using a Database for Persistent Storage (JDBC Persistence)](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wbapp/sessions.html#GUID-32648CF4-5189-43BB-B0FE-4A99B4EF9FDA).
      