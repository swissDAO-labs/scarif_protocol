use anchor_lang::prelude::*;

mod state;
mod errors;
mod constant;

mod context;
use context::*;


declare_id!("CQEfxUz92WbUBK5XCBrUi6rNizELuY8RqUjbp9XYiMyH");

#[program]
pub mod scarif_protocol {
    use super::*;

    // Protocol Config
    pub fn intialize_protocol_account(ctx: Context<ProtocolSetting>) -> Result<()> {
        ctx.accounts.initialize_protocol()
    }

    pub fn lock_protocol(ctx: Context<ProtocolSetting>) -> Result<()> {
        ctx.accounts.change_locked_setting()
    }

    // Adming Config
    pub fn initialize_admin_account(ctx: Context<AdminInit>, username: String) -> Result<()> {
        ctx.accounts.initialize_admin(username)
    }

    // Collection Config
    pub fn initialize_collection_account(ctx: Context<CollectionInit>) -> Result<()> {
        ctx.accounts.initialize_collection()
    }

    pub fn add_nft(ctx: Context<AddNft>, mint: Pubkey, owner: Pubkey) -> Result<()> {
        ctx.accounts.add_nft(mint, owner)
    }
}