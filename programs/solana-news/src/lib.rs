use anchor_lang::prelude::*;
use anchor_lang::solana_program::account_info::next_account_info;
use anchor_lang::solana_program::system_program;
// use anchor_lang::solana_program::{
//     borsh::try_from_slice
// };
use borsh::{BorshDeserialize, BorshSerialize};
use std::result::Result;
pub mod errors;

// declare_id!("BZzabrjKSxajzg345WeiKTBzNFsE4wDMeKMeasZo4WAb");
declare_id!("DjEMjxwVGj65CF22aS7davstDVbfNfeTDzAYgSk2XMch");

#[program]
pub mod solana_news {
    use super::*;
    pub fn add_topic(ctx: Context<AddTopic>, topic_str: String, tag: String) -> ProgramResult {
        let topic: &mut Account<Topic> = &mut ctx.accounts.topic;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if topic_str.chars().count() > 150 {
            return Err(errors::ErrorCode::TopicTooLong.into());
        }

        if tag.chars().count() > 50 {
            return Err(errors::ErrorCode::TagTooLong.into());
        }

        topic.author = *author.key;
        topic.timestamp = clock.unix_timestamp;
        topic.allegations = 0;
        topic.support = 0;
        topic.against = 0;
        topic.tag = tag;
        topic.topic = topic_str;
        Ok(())
    }

    pub fn edit_annotation(
        ctx: Context<EditAnnotation>,
        annotation_str: String,
        uri: String,
        snippet_type: u8,
    ) -> ProgramResult {
        let annotation: &mut Account<Annotation> = &mut ctx.accounts.annotation;
        let author: &Signer = &ctx.accounts.author;
        let parent_topic: &mut Account<Topic> = &mut ctx.accounts.parent_topic;
        let old_annotation: &mut Account<Annotation> = &mut ctx.accounts.old_annotation;
        let parent_iter = &mut ctx.remaining_accounts.iter();
        let clock: Clock = Clock::get().unwrap();

        if annotation_str.chars().count() > 500 {
            return Err(errors::ErrorCode::AnnotationTooLong.into());
        }

        if uri.chars().count() > 250 {
            return Err(errors::ErrorCode::URITooLong.into());
        }

        annotation.author = *author.key;
        annotation.timestamp = clock.unix_timestamp;
        annotation.annotation = annotation_str;
        annotation.snippet_type = snippet_type;
        annotation.parent_topic = *parent_topic.to_account_info().key;
        annotation.edited = *old_annotation.to_account_info().key;
        annotation.uri = uri;
        annotation.allegations = 0;
        annotation.support = 0;
        annotation.against = 0;
        annotation.is_edited = 0;

        old_annotation.is_edited = 1;
        old_annotation.edited_on = clock.unix_timestamp;
        old_annotation.edited = *annotation.to_account_info().key;

        // REMOVING STAT FROM TOPIC STATS FOR OLD ANNOTATION

        match old_annotation.snippet_type {
            0 => {
                (*parent_topic).allegations -= 1;
            }
            1 => {
                (*parent_topic).support -= 1;
            }
            2 => {
                (*parent_topic).against -= 1;
            }
            _ => println!("something else"),
        }

        // ADDING NEW STAT TO TOPIC

        match snippet_type {
            0 => {
                (*parent_topic).allegations += 1;
            }
            1 => {
                (*parent_topic).support += 1;
            }
            2 => {
                (*parent_topic).against += 1;
            }
            _ => println!("something else"),
        }

        if parent_iter.len() == 1 {
            let parent_account_info = next_account_info(parent_iter)?;
            msg!("Parent Account Info: {:?}", parent_account_info);

            annotation.parent = *parent_account_info.to_account_info().key;
            let parent_account_result =
                Annotation::try_deserialize(&mut &parent_account_info.data.borrow()[..]);

            match parent_account_result {
                Ok(v) => {
                    let mut parent_account = v;
                    msg!(
                        "Parent Account Before Update Annotation: {}",
                        parent_account.annotation
                    );
                    msg!("Parent Account Before Update URI: {}", parent_account.uri);
                    msg!(
                        "Parent Account Before Update Allegation: {}",
                        parent_account.allegations
                    );
                    msg!(
                        "Parent Account Before Update Support: {}",
                        parent_account.support
                    );
                    msg!(
                        "Parent Account Before Update Against: {}",
                        parent_account.against
                    );
                    match snippet_type {
                        0 => {
                            parent_account.allegations += 1;
                        }
                        1 => {
                            parent_account.support += 1;
                        }
                        2 => {
                            parent_account.against += 1;
                        }
                        _ => println!("something else"),
                    }
                    match old_annotation.snippet_type {
                        0 => {
                            parent_account.allegations -= 1;
                        }
                        1 => {
                            parent_account.support -= 1;
                        }
                        2 => {
                            parent_account.against -= 1;
                        }
                        _ => println!("something else"),
                    }
                    msg!(
                        "Parent Account AFTER Update Allegation: {}",
                        parent_account.allegations
                    );
                    msg!(
                        "Parent Account AFTER Update Support: {}",
                        parent_account.support
                    );
                    msg!(
                        "Parent Account AFTER Update Against: {}",
                        parent_account.against
                    );
                    parent_account
                        .try_serialize(&mut &mut parent_account_info.data.borrow_mut()[..])?;
                }
                Err(err) => {
                    msg!("PROGRAM ERROR : {}", err);
                }
            }
        }

        Ok(())
    }

    pub fn add_annotation(
        ctx: Context<AddAnnotation>,
        annotation_str: String,
        uri: String,
        snippet_type: u8,
    ) -> ProgramResult {
        let annotation: &mut Account<Annotation> = &mut ctx.accounts.annotation;
        let author: &Signer = &ctx.accounts.author;
        let parent_topic: &mut Account<Topic> = &mut ctx.accounts.parent_topic;
        let parent_iter = &mut ctx.remaining_accounts.iter();
        let clock: Clock = Clock::get().unwrap();

        if annotation_str.chars().count() > 500 {
            return Err(errors::ErrorCode::AnnotationTooLong.into());
        }

        if uri.chars().count() > 250 {
            return Err(errors::ErrorCode::URITooLong.into());
        }

        annotation.author = *author.key;
        annotation.timestamp = clock.unix_timestamp;
        annotation.annotation = annotation_str;
        annotation.snippet_type = snippet_type;
        annotation.parent_topic = *parent_topic.to_account_info().key;
        annotation.uri = uri;
        annotation.allegations = 0;
        annotation.support = 0;
        annotation.against = 0;
        annotation.is_edited = 0;

        match snippet_type {
            0 => {
                (*parent_topic).allegations += 1;
            }
            1 => {
                (*parent_topic).support += 1;
            }
            2 => {
                (*parent_topic).against += 1;
            }
            _ => println!("something else"),
        }

        let mut parent_account_info_result = next_account_info(parent_iter).or(Err(errors::ErrorCode::ParentAccountInfoNotFound));
        let mut parent_present = true;

        while parent_present {
        
        // for parent_account_info in parent_iter {
            match parent_account_info_result {
                Ok(pa) => {
                    let parent_account_info = pa;
                    msg!(
                        "Parent Account Key: {:?}",
                        *parent_account_info.to_account_info().key
                    );

                    annotation.parent = *parent_account_info.to_account_info().key;
                    let parent_account_result =
                        Annotation::try_deserialize(&mut &parent_account_info.data.borrow()[..]);

                    match parent_account_result {
                        Ok(v) => {
                            let mut parent_account = v;
                            match snippet_type {
                                0 => {
                                    msg!(
                                        "Parent Account Before Update Allegation: {}",
                                        parent_account.allegations
                                    );
                                    parent_account.allegations += 1;
                                    msg!(
                                        "Parent Account AFTER Update Allegation: {}",
                                        parent_account.allegations
                                    );
                                }
                                1 => {
                                    msg!(
                                        "Parent Account Before Update Support: {}",
                                        parent_account.support
                                    );
                                    parent_account.support += 1;
                                    msg!(
                                        "Parent Account AFTER Update Support: {}",
                                        parent_account.support
                                    );
                                }
                                2 => {
                                    msg!(
                                        "Parent Account Before Update Against: {}",
                                        parent_account.against
                                    );
                                    parent_account.against += 1;
                                    msg!(
                                        "Parent Account AFTER Update Against: {}",
                                        parent_account.against
                                    );
                                }
                                _ => println!("something else"),
                            }
                            parent_account.try_serialize(
                                &mut &mut parent_account_info.data.borrow_mut()[..],
                            )?;

                            parent_account_info_result = next_account_info(parent_iter).or(Err(errors::ErrorCode::ParentAccountInfoNotFound));

                        }
                        Err(err) => {
                            msg!("PROGRAM ERROR : {}", err);
                            return Err(errors::ErrorCode::ParentAccountInfoNotFound.into());
                        }
                    }
                }
                Err(err) => {
                    parent_present = false;
                    msg!("{}", err);
                    // return Err(errors::ErrorCode::ParentAccountInfoNotFound.into());
                }
            }
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddTopic<'info> {
    #[account(init, payer = author, space = Topic::LEN)]
    pub topic: Account<'info, Topic>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct AddAnnotation<'info> {
    #[account(init, payer = author, space = Annotation::LEN)]
    pub annotation: Account<'info, Annotation>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
    #[account(mut)]
    pub parent_topic: Account<'info, Topic>,
}

#[derive(Accounts)]
pub struct EditAnnotation<'info> {
    #[account(init, payer = author, space = Annotation::LEN)]
    pub annotation: Account<'info, Annotation>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
    #[account(mut)]
    pub parent_topic: Account<'info, Topic>,
    #[account(mut)]
    pub old_annotation: Account<'info, Annotation>,
}

#[account]
pub struct Topic {
    pub author: Pubkey,
    pub timestamp: i64,
    pub allegations: u8,
    pub support: u8,
    pub against: u8,
    pub tag: String,
    pub topic: String,
}

// 2. Add some useful constants for sizing propeties.
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
const MAX_TOPIC_LENGTH: usize = 150 * 4; // 150 chars max.
const MAX_TAG_LENGTH: usize = 50 * 4; // 50 chars max.
const TOPIC_STATS: usize = 1;

// 3. Add a constant on the Tweet account that provides its total size.
impl Topic {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + TIMESTAMP_LENGTH // Timestamp.
        + STRING_LENGTH_PREFIX + MAX_TOPIC_LENGTH // Topic.
        + STRING_LENGTH_PREFIX + MAX_TAG_LENGTH // Content.
        + TOPIC_STATS * 3; // Allegations, Support, Against.
}

// enum AnnotationType {
//     Allegation,
//     For,
//     Against
// }

// #[derive(BorshSerialize, BorshDeserialize, Debug)]
#[account]
pub struct Annotation {
    pub author: Pubkey,
    pub parent: Pubkey,
    pub parent_topic: Pubkey,
    pub timestamp: i64,
    pub snippet_type: u8,
    pub allegations: u8,
    pub support: u8,
    pub against: u8,
    pub is_edited: u8,  // Is Edited Bool (0/1)
    pub edited_on: i64, // For Old Annotations that are edited (Hack : TBC)
    pub edited: Pubkey, // For New Annotations - Old Annotation Key for Edit History (Hack : TBC)
    pub uri: String,
    pub annotation: String,
}

// 2. Add some useful constants for sizing propeties.
const ANNOTATION_TYPE: usize = 1;
const MAX_URI_LENGTH: usize = 250 * 4; // 250 chars max.
const MAX_ANNOTATION_LENGTH: usize = 500 * 4; // 250 chars max.

// 3. Add a constant on the Tweet account that provides its total size.
impl Annotation {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + PUBLIC_KEY_LENGTH // PARENT
        + PUBLIC_KEY_LENGTH // TOPIC
        + ANNOTATION_TYPE // SNIPPET TYPE
        + TIMESTAMP_LENGTH // Timestamp.
        + ANNOTATION_TYPE // SNIPPET TYPE
        + ANNOTATION_TYPE * 3 // ALLEGATION, SUPPORT, AGAINST
        + ANNOTATION_TYPE // IS EDITED 
        + TIMESTAMP_LENGTH // EDITED ON
        + PUBLIC_KEY_LENGTH // EDIT HISTORY
        + STRING_LENGTH_PREFIX + MAX_URI_LENGTH // URI
        + STRING_LENGTH_PREFIX + MAX_ANNOTATION_LENGTH; // Annotation

    pub fn from_account_info(a: &AccountInfo) -> Result<Self, ProgramError> {
        if a.data_len() > 100000 {
            Err(errors::ErrorCode::DataTypeMismatch.into())
        } else {
            Ok(Self::try_from_slice(&a.data.borrow_mut())?)
        }
    }
}
