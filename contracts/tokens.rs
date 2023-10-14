// Import necessary Solana libraries and data structures
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
};
use borsh::BorshSerialize;
use borsh::BorshDeserialize;
use std::convert::TryFrom; // Import for TryFrom
use std::io::Write;

// Define your NFT struct
#[derive(Debug)]
pub struct NFT {
    pub owner: Pubkey,         // Owner of the NFT
    pub token_id: u64,         // Unique token ID
    pub metadata_uri: String,  // URI to NFT's metadata (e.g., image or JSON description)
    pub is_initialized: bool,  // Indicates if the NFT has been initialized
    pub project_name: String,  // Name of the project associated with the NFT
    pub registry_name: String, // Name of the registry associated with the NFT
}

// Implement methods for the NFT struct
impl Sealed for NFT {}
impl BorshSerialize for NFT {
    fn serialize<W: Write>(&self, writer: &mut W) -> std::io::Result<()> {
        self.owner.to_bytes().serialize(writer)?; // Serialize owner (assuming Pubkey implements BorshSerialize)
        self.token_id.serialize(writer)?; // Serialize token_id
        self.metadata_uri.serialize(writer)?; // Serialize metadata_uri
        self.is_initialized.serialize(writer)?; // Serialize is_initialized
        self.project_name.serialize(writer)?; // Serialize project_name
        self.registry_name.serialize(writer)?; // Serialize registry_name
        Ok(())
    }
}

impl BorshDeserialize for NFT {
    fn deserialize(buf: &mut &[u8]) -> std::io::Result<Self> {
        // Deserialize your struct fields here
        // Example: let field1 = u64::deserialize(buf)?;
        // Repeat for all fields
        let owner_bytes = <[u8; 32]>::deserialize(buf)?; // Deserialize owner as bytes
        let owner = Pubkey::from(owner_bytes);
        let token_id = u64::deserialize(buf)?;
        let metadata_uri = String::deserialize(buf)?;
        let is_initialized = bool::deserialize(buf)?;
        let project_name = String::deserialize(buf)?;
        let registry_name = String::deserialize(buf)?;

        Ok(NFT {
            owner,
            token_id,
            metadata_uri,
            is_initialized,
            project_name,
            registry_name,
        })
    }

}


impl IsInitialized for NFT {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

// Entry point for processing instructions
entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Match the first byte of the instruction to determine the action.
    match instruction_data[0] {
        // Initialize NFT
        0 => {
            let accounts_iter = &mut accounts.iter();
            let mint_authority = next_account_info(accounts_iter)?;
            let nft_account = next_account_info(accounts_iter)?;
            let project_name = String::from_utf8(instruction_data[1..33].to_vec())
                .map_err(|_| ProgramError::InvalidInstructionData)?;
            let registry_name = String::from_utf8(instruction_data[33..65].to_vec())
                .map_err(|_| ProgramError::InvalidInstructionData)?;
            let metadata_uri = String::from_utf8(instruction_data[65..97].to_vec())
                .map_err(|_| ProgramError::InvalidInstructionData)?;
            let quantity = u64::from_le_bytes(
                <[u8; 8]>::try_from(&instruction_data[97..105])
                    .map_err(|_| ProgramError::InvalidInstructionData)?,
            ); // Parse quantity

            initialize_nft(
                program_id,
                mint_authority,
                nft_account,
                project_name,
                registry_name,
                metadata_uri,
                quantity,
            )?;
        }
        // Transfer NFT
        1 => {
            let accounts_iter = &mut accounts.iter();
            let sender_account = next_account_info(accounts_iter)?;
            let recipient_account = next_account_info(accounts_iter)?;

            transfer_nft(program_id, sender_account, recipient_account)?;
        }
        // Burn NFT
        2 => {
            let accounts_iter = &mut accounts.iter();
            let owner_account = next_account_info(accounts_iter)?;

            burn_nft(program_id, owner_account)?;
        }
        _ => return Err(ProgramError::InvalidInstructionData),
    }

    Ok(())
}

// Implement the initialization function for NFT
fn initialize_nft(
    program_id: &Pubkey,
    mint_authority: &AccountInfo,
    nft_account: &AccountInfo,
    project_name: String,
    registry_name: String,
    metadata_uri: String,
    quantity: u64,
) -> ProgramResult {
    // Check that the account is owned by the program
    if nft_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize the NFT data from nft_account
    let mut nft_data = NFT::deserialize(&mut &nft_account.data.borrow()[..])?;

    // Check if the NFT has already been initialized
    if nft_data.is_initialized() {
        return Err(ProgramError::Custom(5)); // NFT is already initialized
    }

    // Check that the mint authority matches
    if mint_authority.key != nft_account.key {
        return Err(ProgramError::Custom(1)); // Mint authority doesn't match
    }

    // Initialize the NFT data
    nft_data.owner = *mint_authority.key;
    nft_data.token_id = 0; // You can set the initial token ID as needed
    nft_data.metadata_uri = metadata_uri;
    nft_data.is_initialized = true;
    nft_data.project_name = project_name;
    nft_data.registry_name = registry_name;

    // Serialize and save the NFT data to the account
    nft_data.serialize(&mut &mut nft_account.data.borrow_mut()[..])?;

    // Mint additional NFTs as needed
    if quantity > 1 {
        // You can implement logic to mint additional NFTs here
        // For simplicity, we'll just update the token_id
        for i in 1..quantity {
            nft_data.token_id = i;
            // Serialize and save each additional NFT data to the account
            nft_data.serialize(&mut &mut nft_account.data.borrow_mut()[..])?;
        }
    }

    Ok(())
}


// Implement the transfer function for NFT
fn transfer_nft(
    program_id: &Pubkey,
    sender_account: &AccountInfo,
    recipient_account: &AccountInfo,
) -> ProgramResult {
    // Check that the sender has the authority to transfer the NFT
    if sender_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize the NFT data from sender's account
    let mut sender_data = NFT::deserialize(&mut &sender_account.data.borrow()[..])?;

    // Ensure that the NFT is initialized
    if !sender_data.is_initialized() {
        return Err(ProgramError::Custom(2)); // NFT is not initialized
    }

    // Check that the recipient is not the sender
    if sender_account.key == recipient_account.key {
        return Err(ProgramError::Custom(3)); // Sender and recipient are the same
    }

    // Update the NFT owner to the recipient
    sender_data.owner = *recipient_account.key;

    // Serialize and save the updated NFT data to the sender's account
    sender_data.serialize(&mut &mut sender_account.data.borrow_mut()[..])?;

    Ok(())
}

// Implement the burn function for NFT
fn burn_nft(program_id: &Pubkey, owner_account: &AccountInfo) -> ProgramResult {
    // Check that the owner has the authority to burn the NFT
    if owner_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize the NFT data from the owner's account
    let mut owner_data = NFT::deserialize(&mut &owner_account.data.borrow()[..])?;
    
    // Ensure that the NFT is initialized
    if !owner_data.is_initialized() {
        return Err(ProgramError::Custom(4)); // NFT is not initialized
    }

    // Mark the NFT as uninitialized
    owner_data.is_initialized = false;

    // Serialize and save the updated NFT data to the owner's account
    owner_data.serialize(&mut &mut owner_account.data.borrow_mut()[..])?;

    Ok(())
}
