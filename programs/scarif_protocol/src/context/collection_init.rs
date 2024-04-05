use anchor_lang::prelude::*;
use std::mem::size_of;

use crate::{
    state::Collection,
    state::Nft
};
const MAX_NFTS: usize = 30; // Define the maximum number of scoreboards the program can hold
#[derive(Accounts)]
pub struct CollectionInit<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 32 + (8 + size_of::<Nft>() * MAX_NFTS),
        seeds = [b"collection", signer.key().as_ref()],
        bump
    )]
    pub collection: Account<'info, Collection>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info>CollectionInit<'info> {
    // Initializes the tipboard
    pub fn initialize_collection(
        &mut self,
    ) -> Result<()> {
        let collection = &mut self.collection;
        let signer = &self.signer;

        collection.authority = signer.key(); // Set the authority to the signer

        collection.minted_nfts = Vec::new(); // Initialize the tip vector

        Ok(())
    }
}