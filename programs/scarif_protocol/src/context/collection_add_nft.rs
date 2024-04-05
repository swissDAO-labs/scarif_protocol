use anchor_lang::prelude::*;

use crate::{
    state::Collection,
    state::Nft,
};

#[derive(Accounts)]
#[instruction(mint: Pubkey, owner: Pubkey)]
pub struct AddNft<'info> {
    #[account(mut)]
    pub collection: Account<'info, Collection>,
    ///CHECK: Safe because the signer will be dev wallet for now
    #[account(signer)]
    pub signer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info>AddNft<'info> {
    pub fn add_nft(
        &mut self,
        mint: Pubkey,
        owner: Pubkey,
    ) -> Result<()> {
        
        self.collection.minted_nfts.push(Nft {
            mint,
            owner,
        });
    
        Ok(())
    }
}