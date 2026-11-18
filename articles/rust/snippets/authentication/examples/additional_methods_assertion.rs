use azure_core::credentials::TokenCredential;
use azure_core::http::ClientMethodOptions;
use azure_identity::{ClientAssertion, ClientAssertionCredential, ManagedIdentityCredential};
use azure_security_keyvault_secrets::SecretClient;
use std::sync::Arc;

#[derive(Debug)]
struct AccessTokenAssertion {
    credential: Arc<dyn TokenCredential>,
}

#[cfg_attr(target_arch = "wasm32", async_trait::async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait::async_trait)]
impl ClientAssertion for AccessTokenAssertion {
    async fn secret(&self, _: Option<ClientMethodOptions<'_>>) -> azure_core::Result<String> {
        Ok(self
            .credential
            .get_token(&[&"api://AzureADTokenExchange/.default"], None)
            .await?
            .token
            .secret()
            .to_string())
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let assertion = AccessTokenAssertion {
        credential: ManagedIdentityCredential::new(None)?,
    };

    let credential = ClientAssertionCredential::new(
        String::from("tenant ID"),
        String::from("client ID"),
        assertion,
        None,
    )?;

    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // Use the client to interact with Azure Key Vault
    // let secret = client.get("secret-name", None).await?;

    Ok(())
}
