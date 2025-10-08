---
title: Azure Confidential Ledger Services Tools
description: Learn how to use the Azure MCP Server with Azure Confidential Ledger Services.
keywords: azure mcp server, azmcp, confidential ledger services
author: diberry
ms.author: diberry
ms.date: 10/08/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 

# Azure Confidential Ledger tools for the Azure MCP Server

The Azure MCP Server enables you to manage Azure resources, including Azure Confidential Ledger Services, by using natural language prompts. This capability lets you work with confidential ledger services without needing to remember complex command syntax.

[Azure Confidential Ledger](/azure/confidential-ledger) is a fully managed, secure, and highly available ledger service that provides a trusted environment for storing sensitive data. It leverages trusted execution environments (TEEs) to ensure data integrity and confidentiality, making it suitable for scenarios that require tamper-proof records, such as financial transactions, supply chain management, and compliance auditing.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Entries: Append an entry to the ledger

<!-- `azmcp confidentialledger entries append` -->

Appends an immutable (tamper-proof) entry to a Confidential Ledger instance and returns the transaction identifier.

Example prompts include:

- **Simple data entry**: "Append an entry to 'audit-ledger' with data {"key": "value"}"
- **Tamper-proof transaction**: "Write a tamper-proof entry to ledger 'financial-ledger' containing {"transaction": "data"}"
- **Collection-specific entry**: "Append {"hello": "from mcp"} to my confidential ledger 'test-ledger' in collection 'user-data'"
- **Immutable audit log**: "Create an immutable ledger entry in 'compliance-ledger' with content {"audit": "log"}"
- **Basic ledger write**: "Write an entry to confidential ledger 'business-ledger' with data {"timestamp": "2025-10-08", "event": "user_login"}"
- **Financial transaction**: "Append a financial transaction to ledger 'bank-ledger' with content {"amount": 1000, "account": "123456", "type": "deposit"}"
- **Supply chain record**: "Write tamper-proof entry to ledger 'supply-chain' with data {"product_id": "ABC123", "location": "warehouse", "status": "shipped"}"
- **Compliance entry**: "Create an audit entry in confidential ledger 'regulatory-ledger' in collection 'gdpr-logs' with content {"user_id": "user123", "action": "data_deletion", "timestamp": "2025-10-08T10:30:00Z"}"
- **Security log**: "Append security event to ledger 'security-ledger' with data {"event_type": "login_attempt", "ip_address": "192.168.1.1", "success": true}"
- **Document hash**: "Write document integrity record to ledger 'document-ledger' in collection 'contracts' with content {"document_id": "contract_001", "hash": "sha256:abc123", "verified": true}"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Ledger** |  Required | The name of the Confidential Ledger instance (for example, `myledger`). |
| **Content** |  Required | The JSON or text payload to append as a tamper-proof ledger entry. |
| **Collection ID** |  Optional | Optional ledger collection identifier. If omitted the default collection is used. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Confidential Ledger](/azure/confidential-ledger)