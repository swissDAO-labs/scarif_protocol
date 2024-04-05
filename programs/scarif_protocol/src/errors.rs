use anchor_lang::error_code;

#[error_code]
pub enum SetupError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
}