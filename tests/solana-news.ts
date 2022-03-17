import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaNews } from '../target/types/solana_news';
import * as assert from "assert";
import { AccountMeta } from '@solana/web3.js'

describe('solana-news', () => {

	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.Provider.env());

	const program = anchor.workspace.SolanaNews as Program<SolanaNews>;


	// it('post a new topic', async () => {
	// 	const topic = anchor.web3.Keypair.generate();
	// 	// Call the "Add Topic" instruction.
	// 	await program.rpc.addTopic('Adding a new Topic to start discussion', 'new topic', {
	// 		accounts: {
	// 			topic: topic.publicKey,
	// 			author: program.provider.wallet.publicKey,
	// 			systemProgram: anchor.web3.SystemProgram.programId,
	// 		},
	// 		signers: [topic],
	// 	});

	// 	// Fetch the account details of the created topic.
	// 	const topicAccount = await program.account.topic.fetch(topic.publicKey);
	// 	console.log(topicAccount);

	// 	assert.equal(topicAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
	// 	assert.equal(topicAccount.topic, 'Adding a new Topic to start discussion');
	// 	assert.equal(topicAccount.tag, 'new topic');
	// 	assert.ok(topicAccount.timestamp);

	// });


	// it('post a new annotation', async () => {
	// 	const topic = anchor.web3.Keypair.generate();
	// 	// Call the "Add Topic" instruction.
	// 	await program.rpc.addTopic('Adding a new Topic for annotation', 'new topic', {
	// 		accounts: {
	// 			topic: topic.publicKey,
	// 			author: program.provider.wallet.publicKey,
	// 			systemProgram: anchor.web3.SystemProgram.programId,
	// 		},
	// 		signers: [topic],
	// 	});
	// 	// Call the "Add Topic" instruction.
	// 	const annotation = anchor.web3.Keypair.generate();
	// 	await program.rpc.addAnnotation('Adding a new Annotation as allegation to new topic', 
	// 		'https://generic-news-url.com/ajknsdandan',
	// 		0,
	// 		{
	// 			accounts: {
	// 				annotation: annotation.publicKey,
	// 				author: program.provider.wallet.publicKey,
	// 				systemProgram: anchor.web3.SystemProgram.programId,
	// 				parentTopic: topic.publicKey
	// 			},
	// 			signers: [annotation],
	// 		});

	// 	// Fetch the account details of the created topic.
	// 	const annotationAccount = await program.account.annotation.fetch(annotation.publicKey);
	// 	console.log(annotationAccount);

	// 	assert.equal(annotationAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
	// 	assert.equal(annotationAccount.annotation, 'Adding a new Annotation as allegation to new topic');
	// 	assert.equal(annotationAccount.uri, 'https://generic-news-url.com/ajknsdandan');
	// 	assert.equal(annotationAccount.parentTopic.toBase58(), topic.publicKey.toBase58());
	// 	assert.equal(annotationAccount.snippetType, 0);
	// 	assert.ok(annotationAccount.timestamp);
	// });


	it('post a new annotation with parent', async () => {
		const topic = anchor.web3.Keypair.generate();
		// Call the "Add Topic" instruction.
		await program.rpc.addTopic('Adding a new Topic to annotate with a parent', 'new topic', {
			accounts: {
				topic: topic.publicKey,
				author: program.provider.wallet.publicKey,
				systemProgram: anchor.web3.SystemProgram.programId,
			},
			signers: [topic],
		});
		// Call the "Add Topic" instruction.
		const annotation = anchor.web3.Keypair.generate();
		await program.rpc.addAnnotation('Adding a new Annotation as allegation to new topic to be tagged as parent', 
			'https://generic-news-url.com/ajknsdandan',
			0,
			{
				accounts: {
					annotation: annotation.publicKey,
					author: program.provider.wallet.publicKey,
					systemProgram: anchor.web3.SystemProgram.programId,
					parentTopic: topic.publicKey
				},
				signers: [annotation],
			});

		console.log(annotation.publicKey);

		const supportAnnotation = anchor.web3.Keypair.generate();

		let rAccounts : AccountMeta[] = [];
		rAccounts.push({
			isSigner: false,
			isWritable: true,
			pubkey: annotation.publicKey
		});
		await program.rpc.addAnnotation('Adding a new Annotation as support to first allegation', 
			'https://generic-support-news-url.com/ajknsdandan',
			1,
			{
				accounts: {
					annotation: supportAnnotation.publicKey,
					author: program.provider.wallet.publicKey,
					systemProgram: anchor.web3.SystemProgram.programId,
					parentTopic: topic.publicKey
				},
				signers: [supportAnnotation],
				remainingAccounts: rAccounts
			});

		// Fetch the account details of the created topic.
		const supportAnnotationAccount = await program.account.annotation.fetch(supportAnnotation.publicKey);
		console.log(supportAnnotationAccount);

		assert.equal(supportAnnotationAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
		assert.equal(supportAnnotationAccount.annotation, 'Adding a new Annotation as support to first allegation');
		assert.equal(supportAnnotationAccount.uri, 'https://generic-support-news-url.com/ajknsdandan');
		assert.equal(supportAnnotationAccount.parent.toBase58(), annotation.publicKey.toBase58());
		assert.equal(supportAnnotationAccount.parentTopic.toBase58(), topic.publicKey.toBase58());
		assert.equal(supportAnnotationAccount.snippetType, 1);
		// assert.ok(supportAnnotationAccount.timestamp);



		const againstAnnotation = anchor.web3.Keypair.generate();

		let arAccounts : AccountMeta[] = [];
		arAccounts.push({
			isSigner: false,
			isWritable: true,
			pubkey: annotation.publicKey
		});
		await program.rpc.addAnnotation('Adding a new Annotation as against to child allegation',
			'https://generic-support-news-url.com/ajknsdandan',
			2,
			{
				accounts: {
					annotation: againstAnnotation.publicKey,
					author: program.provider.wallet.publicKey,
					systemProgram: anchor.web3.SystemProgram.programId,
					parentTopic: topic.publicKey
				},
				signers: [againstAnnotation],
				remainingAccounts: arAccounts
			});
// Fetch the account details of the created topic.
const againstAnnotationAccount = await program.account.annotation.fetch(againstAnnotation.publicKey);
console.log(againstAnnotationAccount);


		// Editing the Annotation
		const changedAgainstAnnotation = anchor.web3.Keypair.generate();

		let carAccounts : AccountMeta[] = [];
		carAccounts.push({
			isSigner: false,
			isWritable: true,
			pubkey: annotation.publicKey
		});
		await program.rpc.editAnnotation('Changing Against Annotation to Allegation',
			'https://generic-support-news-url.com/ajknsdandan',
			0,
			{
				accounts: {
					annotation: changedAgainstAnnotation.publicKey,
					author: program.provider.wallet.publicKey,
					systemProgram: anchor.web3.SystemProgram.programId,
					parentTopic: topic.publicKey,
					oldAnnotation: againstAnnotation.publicKey
				},
				signers: [changedAgainstAnnotation],
				remainingAccounts: carAccounts
			});
// Fetch the account details of the created topic.
const changedAgainstAnnotationAccount = await program.account.annotation.fetch(changedAgainstAnnotation.publicKey);
console.log(changedAgainstAnnotationAccount);


		assert.ok(changedAgainstAnnotationAccount.timestamp);

	});


});
