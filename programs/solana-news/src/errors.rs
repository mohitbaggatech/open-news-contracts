use anchor_lang::prelude::*;


#[error]
pub enum ErrorCode {
    #[msg("The provided annotation should be 250 characters long maximum.")]
    AnnotationTooLong,
    #[msg("The provided content should be 250 characters long maximum.")]
    URITooLong,
    #[msg("The provided content should be 150 characters long maximum.")]
    TopicTooLong,
    #[msg("The provided content should be 50 characters long maximum.")]
    TagTooLong,
    #[msg("Parent Account not found")]
    ParentAccountNotFound,
    #[msg("Parent Account Info not found")]
    ParentAccountInfoNotFound,
    #[msg("Failed to write Parent Account")]
    ParentAccountNotWritable,
    #[msg("Account Data Mismatch")]
    DataTypeMismatch
}
