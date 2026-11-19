use azure_identity::DeveloperToolsCredential;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let credential = DeveloperToolsCredential::new(None)?;
    Ok(())
}
