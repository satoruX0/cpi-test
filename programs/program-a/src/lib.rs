use anchor_lang::prelude::*;
use program_b::program::ProgramB;
declare_id!("4yaanhPkBkCAwTSvav5NVHUtV66a8eVAn25c6wsWWipp");
#[program]
pub mod program_a {
    use anchor_lang::solana_program::{program::invoke_signed, system_instruction};

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from Program-A: {:?}", ctx.program_id);
        let from_pubkey = ctx.accounts.pda_account.key();
        let to_pubkey = ctx.accounts.signer.key();
        let bump = ctx.bumps.pda_account;
        let lamports = 1_000_000_000;

        let instruction = &system_instruction::transfer(&from_pubkey, &to_pubkey, lamports);
        let account_infos = [
            ctx.accounts.pda_account.to_account_info(),
            ctx.accounts.signer.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            // ctx.accounts.program_b.to_account_info(),
        ];
        let signers_seeds: &[&[&[u8]]] = &[&[b"pda", to_pubkey.as_ref(), &[bump]]];
        invoke_signed(instruction, &account_infos, signers_seeds)?;

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.program_b.to_account_info(),
            program_b::cpi::accounts::Initialize {
                pda_account: ctx.accounts.pda_account.to_account_info(),
            },
            signers_seeds,
        );
        program_b::cpi::initialize(cpi_context);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    ///CHECK:pda
    #[account(
        mut,
        seeds=[b"pda",signer.key().as_ref()],
        bump)]
    pub pda_account: AccountInfo<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub program_b: Program<'info, ProgramB>,
}
