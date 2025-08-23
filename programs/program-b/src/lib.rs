use anchor_lang::prelude::*;

declare_id!("AuDZvRv5sCpddhAaUVm4u1byTeQCjyxBRYq5jHa9axuT");

#[program]
pub mod program_b {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from program-B: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    pub pda_account: Signer<'info>,
}
