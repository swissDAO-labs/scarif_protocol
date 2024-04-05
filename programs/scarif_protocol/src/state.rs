use anchor_lang::prelude::*;

// Setup State
#[account]
pub struct Protocol {
    pub locked: bool,
}

impl Space for Protocol {
    const INIT_SPACE: usize = 8 + 1;
}

#[account]
pub struct Admin {
    pub publickey: Pubkey,
    pub username: String,
    pub initialized: i64,
}

impl Space for Admin {
    const INIT_SPACE: usize = 8 + 32 + 4 + 8;
}

#[account]
pub struct Collection {
    pub authority: Pubkey,
    pub minted_nfts: Vec<Nft>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Nft {
    pub mint: Pubkey,
    pub owner: Pubkey,
}
