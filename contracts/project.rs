use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug)]
pub struct Project {
    pub owner: Pubkey,
    pub name: String,
    pub project_type: String,
    pub description: String,
    // ... additional fields ...
}

impl Default for Project {
    fn default() -> Self {
        Self {
            owner: Pubkey::default(),
            name: String::default(),
            project_type: String::default(),
            description: String::default(),
            // ... set additional fields to default values ...
        }
    }
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let account = next_account_info(accounts_iter)?;

    msg!("Raw account data: {:?}", &account.data.borrow());

    let mut project_data = Project::try_from_slice(&account.data.borrow())?;

    let instruction = ProjectInstruction::try_from_slice(instruction_data)?;

    match instruction {
        ProjectInstruction::CreateProject {
            name,
            project_type,
            description,
        } => {
            if project_data == Project::default() {
                project_data.name = name;
                project_data.project_type = project_type;
                project_data.description = description;
                // ... set additional fields ...

                msg!(
                    "Project successfully created with name: {}",
                    project_data.name
                );
            } else {
                msg!("Project already exists with name: {}", project_data.name);
            }
        }
        ProjectInstruction::UpdateProject {
            name,
            project_type,
            description,
        } => {
            if project_data != Project::default() {
                project_data.name = name;
                project_data.project_type = project_type;
                project_data.description = description;
                // ... update additional fields ...

                msg!(
                    "Project successfully updated with name: {}",
                    project_data.name
                );
            } else {
                msg!("Project does not exist. Cannot update.");
                return Err(ProgramError::UninitializedAccount);
            }
        }
        ProjectInstruction::FetchAllProjects => {
            for account in accounts.iter() {
                let project_data = Project::try_from_slice(&account.data.borrow())?;
                if project_data != Project::default() {
                    msg!("Project found: {:#?}", project_data);
                }
            }
        }
    }

    project_data.serialize(&mut &mut account.data.borrow_mut()[..])?;
    Ok(())
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug)]
pub enum ProjectInstruction {
    CreateProject {
        name: String,
        project_type: String,
        description: String,
        // ... additional fields ...
    },
    UpdateProject {
        name: String,
        project_type: String,
        description: String,
        // ... additional fields ...
    },
    FetchAllProjects,
}
