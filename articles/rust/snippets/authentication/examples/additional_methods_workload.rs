use azure_identity::WorkloadIdentityCredential;
use azure_security_keyvault_secrets::SecretClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // WorkloadIdentityCredential reads configuration from environment variables
    // set by the AKS workload identity webhook
    let credential = WorkloadIdentityCredential::new(None)?;

    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // Use the client to interact with Azure Key Vault
    // let secret = client.get("secret-name", None).await?;

    Ok(())
}
