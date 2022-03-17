import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaNews } from '../target/types/solana_news';
import * as assert from "assert";
import { AccountMeta } from '@solana/web3.js'

const data = [["1", "Solana is less decentralized", "https://medium.com/the-blog-chain/is-solana-better-than-ethereum-in-2022-96f616c92ca5", "", ""],
["2", "Solana is very fast and highly scalable", "https://medium.com/the-blog-chain/is-solana-better-than-ethereum-in-2022-96f616c92ca5", "", ""],
["3", "Solana has great community", "https://medium.com/the-blog-chain/is-solana-better-than-ethereum-in-2022-96f616c92ca5", "", ""],
["4", "Transactions on Solana are very cheap", "https://101blockchains.com/solana-vs-polygon-vs-ethereum/", "", ""],
["5", "Solana is up 12,000% ", "https://www.cnbc.com/2021/11/05/what-to-know-before-investing-in-ethereum-competitor-solana-sol.html", "", ""],
["6", "Solana is a risky bet", "https://www.cnbc.com/2021/11/05/what-to-know-before-investing-in-ethereum-competitor-solana-sol.html", "", ""],
["7", "In Canada: ETH has tax benefits while SOL don't", "https://ca.finance.yahoo.com/news/solana-vs-ethereum-better-183800707.html", "", ""],
["8", "Inconsistent transparency reports", "https://forkast.news/what-is-solana-ecosystem-behind-sols-rise/", "", ""],
["", "You can carry out almost 3000 transactions each second on the platform while it features the ability to handle between 50,000 and 65,000 transactions every second.", "https://101blockchains.com/solana-vs-polygon-vs-ethereum/", "2", "SUPPORT"],
["", "Solana can achieve more transactions per unit of time and has significantly lower fees", "https://www.cnbc.com/2021/11/05/what-to-know-before-investing-in-ethereum-competitor-solana-sol.html", "2", "SUPPORT"],
["", "Ethereum is fundamentally limited in its capacity for global-scale applications due to the small number of transactions per second it can support", "https://www.cnbc.com/2021/11/05/what-to-know-before-investing-in-ethereum-competitor-solana-sol.html", "2", "SUPPORT"],
["", "Solana also has “significantly lower fees,”", "https://www.cnbc.com/2021/11/05/what-to-know-before-investing-in-ethereum-competitor-solana-sol.html", "4", "SUPPORT"],
["", "the risks are that [Solana] is competing with other technologically slick blockchains and blockchains with very large communities and established user bases", "https://www.cnbc.com/2021/11/05/what-to-know-before-investing-in-ethereum-competitor-solana-sol.html", "6", "AGAINST"],
["", "surge in transaction volume and bot activity sparked outages on Solana's network for more than 17 hours", "https://www.forbes.com/sites/jonathanponciano/2021/09/17/solanas-market-value-plunges-20-billion-after-outage-is-this-good-for-ethereum/?sh=1d490fac2e4e", "1", "AGAINST"],
["", "surge in transaction volume and bot activity sparked outages on Solana's network for more than 17 hours", "https://www.forbes.com/sites/jonathanponciano/2021/09/17/solanas-market-value-plunges-20-billion-after-outage-is-this-good-for-ethereum/?sh=1d490fac2e4e", "6", "AGAINST"],
["", "\"I don't think [Ethereum] can be displaced, but it's very clear Solana is going to coexist with it,\" Samani", "https://www.forbes.com/sites/jonathanponciano/2021/09/17/solanas-market-value-plunges-20-billion-after-outage-is-this-good-for-ethereum/?sh=1d490fac2e4e", "3", "SUPPORT"],
["", "In February 2021, Solana was ranked only 42nd, and as of November 2021, Solana is ranked 4th", "https://pixelplex.io/blog/solana-vs-ethereum/", "5", "SUPPORT"],
["", "Ethereum transaction speed, which is 14.7 tps, it becomes obvious that this blockchain needs some serious improvements", "https://pixelplex.io/blog/solana-vs-ethereum/", "2", "SUPPORT"],
["", "As for Solana, the network claims to be able to process 65,000 tps.", "https://pixelplex.io/blog/solana-vs-ethereum/", "2", "SUPPORT"],
["", "Solana’s average cost per transaction is $0.00025.", "https://pixelplex.io/blog/solana-vs-ethereum/", "4", "SUPPORT"],
["", "“Basically, the speed of light is how fast we can make this network go,” says Yakovenko.", "https://techcrunch.com/2021/05/14/solana-a-blockchain-platform-followed-by-top-crypto-investors-says-its-a-lot-faster-than-ethereum/", "2", "SUPPORT"],
["", "Today, SOL is much faster and cheaper than ETH is", "https://ca.finance.yahoo.com/news/solana-vs-ethereum-better-183800707.html", "2", "SUPPORT"],
["", "Today, SOL is much faster and cheaper than ETH is", "https://ca.finance.yahoo.com/news/solana-vs-ethereum-better-183800707.html", "4", "SUPPORT"],
["", "Ethereum is much more widely used than Solana.", "https://ca.finance.yahoo.com/news/solana-vs-ethereum-better-183800707.html", "3", "AGAINST"],
["", "By holding your ETH in a TFSA, you avoid all possible capital gains taxes", "https://ca.finance.yahoo.com/news/solana-vs-ethereum-better-183800707.html", "7", "SUPPORT"],
["", "Ethereum blockchain will undergo a series of upgrades that will take it to 100,000 TPS", "https://ca.finance.yahoo.com/news/solana-vs-ethereum-better-183800707.html", "2", "AGAINST"],
["", "The Solana network processes up to 60,000 transactions per second, surpassing that of Bitcoin, Visa, XRP and Ethereum combined.", "https://finance.yahoo.com/news/solana-one-ethereum-major-rivals-044511895.html", "2", "SUPPORT"],
["", "one of Ethereum’s major challenges is its high gas fees. Users pay up to $50 to process a transaction on the Ethereum network. Earlier this week, Bitfinex paid $23.7 million just to move $100,000 USDT on the Ethereum network. With Solana, the fees are significantly lower, usually around $0.00025 per transaction", "https://finance.yahoo.com/news/solana-one-ethereum-major-rivals-044511895.html", "4", "SUPPORT"],
["", "Solana’s price could top the $1,000 mark over the coming months. If the adoption and growth continue, SOL could reach ETH’s price of roughly $3,500 in the next few years", "https://finance.yahoo.com/news/solana-one-ethereum-major-rivals-044511895.html", "5", "SUPPORT"],
["", "Scalability is a major issue for Ethereum. The inherent Proof-of-Work mechanism became dated as the demand for ecosystem usage grew, and it can now only handle 13 transactions per second", "https://economictimes.indiatimes.com/markets/cryptocurrency/top-ethereum-killers-that-investors-need-to-look-out-for-in-2022/articleshow/89182313.cms?from=mdr", "2", "SUPPORT"],
["", "Solana has a blazing fast block time of 400ms as compared to Ethereum’s 10-second and Bitcoin’s 10-minute limit", "https://economictimes.indiatimes.com/markets/cryptocurrency/top-ethereum-killers-that-investors-need-to-look-out-for-in-2022/articleshow/89182313.cms?from=mdr", "2", "SUPPORT"],
["", "Solana has 70% fewer, at 1,447 nodes. Although this means the network is faster than Ethereum because fewer verifications and confirmations have to be conducted, it also means the network is less decentralized.", "https://www.makeuseof.com/reasons-solana-isnt-really-decentralized/#:~:text=Solana%20has%2070%25%20fewer%2C%20at,the%20network%20is%20less%20decentralized.&text=Furthermore%2C%20Solana%20doesn't%20have%20a%20slashing%20mechanism%20implemented.", "1", "SUPPORT"],
["", "just the top 10 Solana addresses hold 16% of the circulating supply (314.9 million SOL). To illustrate the disparity, as of December 2021, there are just over 2.3 million active Solana addresses.", "https://www.makeuseof.com/reasons-solana-isnt-really-decentralized/#:~:text=Solana%20has%2070%25%20fewer%2C%20at,the%20network%20is%20less%20decentralized.&text=Furthermore%2C%20Solana%20doesn't%20have%20a%20slashing%20mechanism%20implemented.", "1", "SUPPORT"],
["", "Once the network was jammed, legitimate transactions became impossible and Solana’s 1000+ validators chose to “restart” the network.", "https://www.cryptovantage.com/news/what-are-the-top-3-things-people-get-wrong-about-solana/", "1", "SUPPORT"],
["", "According to Messari, 48% of Solana’s core token is given to the insiders. That’s the team, company, and VC purchased tokens. 13% of what remains is allocated to the foundation or to community controlled grant-pools. About two-thirds of what remains is reserved for ‘community allocations’ and only a fraction of the pie is for public sale.", "https://www.cryptovantage.com/news/what-are-the-top-3-things-people-get-wrong-about-solana/", "1", "SUPPORT"],
["", "\"There is no strict minimum amount of SOL required to run a validator on Solana. However in order to participate in consensus, a vote account is required which has a rent-exempt reserve of 0.02685864 SOL. Voting also requires sending a vote transaction for each block the validator agrees with, which can cost up to 1.1 SOL per day.", "https://docs.solana.com/running-validator/validator-reqs", "1", "SUPPORT"],
["", "Solana's price rise has been astounding. Someone who has participated in the Solana ICO (initial coin offering — a way to crowdfund a project by selling project tokens) was able to buy SOL for $0.22. The price per SOL is now $208 — a 95,000 percent increase.", "https://in.mashable.com/tech/24644/solana-what-you-need-to-know-about-the-skyrocketing-cryptocurrency", "5", "SUPPORT"],
["", "This drove more developers to Solana’s lightning-fast layer-1 solution, thanks to its average transaction cost of $0.00025 and 429-millisecond block finality.", "https://forkast.news/what-is-solana-ecosystem-behind-sols-rise/", "2", "SUPPORT"],
["", "This drove more developers to Solana’s lightning-fast layer-1 solution, thanks to its average transaction cost of $0.00025 and 429-millisecond block finality.", "https://forkast.news/what-is-solana-ecosystem-behind-sols-rise/", "4", "SUPPORT"],
["", "The company’s current roadmap envisions 1 million TPS and 150ms block times for the future. ", "https://forkast.news/what-is-solana-ecosystem-behind-sols-rise/", "2", "SUPPORT"],
["", "Compared to the Ethereum network’s 241,275 validators, the Solana ecosystem is only secured by 1060 validators, at press time.", "https://forkast.news/what-is-solana-ecosystem-behind-sols-rise/", "1", "SUPPORT"],
["", "\"The Solana Foundation had been issuing monthly transparency reports to shed light on the previous month’s token activity as well as the next month’s expected activity, and other updates related to SOL. This transparency report hasn’t been disseminated since December 2020, which may be a sign of concern for investors. The Solana Foundation hasn’t made a public statement about the reason for the discontinued reports. https://solana.com/tokens", "https://forkast.news/what-is-solana-ecosystem-behind-sols-rise/", "8", "SUPPORT"],
["", "The result is an ultrafast blockchain capable of processing more than 50,000 transactions per second, with the ability to scale as usage of the protocol grows without relying on Layer-2 systems or sharding.", "https://www.gemini.com/cryptopedia/solana-blockchain", "2", "SUPPORT"],
["", "In terms of today’s transaction speeds, 65,000 transactions per second is around 10,000 times faster than Bitcoin, 4,000 times faster than Ethereum, and 35 times faster than Ripple — even around 2.5 times faster than Visa.", "https://www.gemini.com/cryptopedia/solana-blockchain", "2", "SUPPORT"],
["", "Issuances are anticipated to be sent to validators, with 95% of issued tokens toward validator rewards and 5% reserved for operating expenses.", "https://blockworks.co/what-is-solana-everything-you-need-to-know-about-the-ethereum-rival/", "1", "SUPPORT"],
["", "Justin Bons, the founder and chief investment officer of the crypto fund manager Cyber Capital, made a series of tweets calling out Solana and what he believed to be a “long series of lies, fraud & deception” by SOL.", "https://blockworks.co/what-is-solana-everything-you-need-to-know-about-the-ethereum-rival/", "8", "SUPPORT"],
["", "“The Solana Foundation agreed to lend the market maker ◎11,365,067 tokens for a 6 month period. The problem: we did not disclose this information to the public, as well as the size and nature of the loan, during the CoinList auction and subsequent Binance listing,” said Yakovenko in his Medium post. ", "https://blockworks.co/what-is-solana-everything-you-need-to-know-about-the-ethereum-rival/", "8", "SUPPORT"],
["", "just 19 nodes hold over a third of the cumulative stake and therefore validate over a third of transactions. On top of that, over 37% of staked SOL was held by validators run on Amazon Web Services as of Sept. 2021.", "https://blockworks.co/what-is-solana-everything-you-need-to-know-about-the-ethereum-rival/", "1", "SUPPORT"],
["", "To cast votes validators must spend SOL and one day's worth of voting costs 1.1 SOL", "https://blockworks.co/what-is-solana-everything-you-need-to-know-about-the-ethereum-rival/", "1", "SUPPORT"],
["", "\"It’s important to note that Solana is a newer blockchain and that most blockchains, including Bitcoin and Ethereum, have experienced brief moments of downtime.\" As Solana co-founder Yakovenko said to his community on Reddit, “If it takes 2 years to build, it will take 2 years to stabilize.\”", "https://blockworks.co/what-is-solana-everything-you-need-to-know-about-the-ethereum-rival/", "6", "SUPPORT"],
["", "Solana, Morgan Stanley says, “is designed to allow faster, cheaper smart contract transactions” than Ethereum offers", "https://fortune.com/2022/02/18/ethereum-smart-contracts-proof-of-stake-binance-solana-cardano-morgan-stanley/", "2", "SUPPORT"],
["", "The issue is that it costs more to run a node on Solana's network than similar smart contract crypto ecosystems, which means there are less nodes and the system is not as decentralized as some would like. But Solana is working on solutions, so this is an area to watch.", "https://www.fool.com/the-ascent/cryptocurrency/articles/4-cryptos-that-could-surpass-solana-in-2022/", "1", "SUPPORT"],
["", "it is worth noting that hashrate on Proof-of-Work chains is much more liquid than the SOL tokens delegated to Solana validators for staking. For example, if an attack occured on Ethereum, miners could easily remove their hash power from the offending pools preventing further damage. Unfortunately, those delegating their SOL tokens to Solana staking pools often cannot withdraw them without a significant time delay. ", "https://cryptobriefing.com/how-decentralized-is-solana/", "1", "SUPPORT"],
["", "The project is focused on providing a highly scalable, secure, and maximally decentralized platform that can support potentially thousands of nodes without sacrificing throughput", "https://decrypt.co/resources/what-is-solana-a-scalable-decentralized-network-for-dapps", "1", "AGAINST"],
["", "Solana’s investor community is still in its nascent stage. And with a shorter track record than Ethereum, investors may not be easily convinced to buy SOL over Ether.", "https://www.analyticsinsight.net/is-solana-a-good-investment-in-2022-explore-its-5-pros-and-cons/", "3", "AGAINST"],
["", "The ETH network has over 200,000 validators, but the Solana network only has 1,000 validators to date. The more the number of validators, the more secure the network.", "https://www.analyticsinsight.net/is-solana-a-good-investment-in-2022-explore-its-5-pros-and-cons/", "1", "SUPPORT"],
["", "He summed things up nicely, stating that “there are many use cases for this blockchain,” which has both a “big community” and “influential investors.”", "https://www.forbes.com/sites/cbovaird/2021/09/09/why-solana-prices-have-skyrocketed-more-than-13000-year-to-date/?sh=5907070c46fd", "3", "SUPPORT"],
["", "“Solana has done a very good job of building a community,” Veradittakit said. “And it starts off with some high quality hackathons, it starts off with being able to help these projects and incentivize these projects to build on top of them.”", "https://www.bloomberg.com/news/articles/2021-11-04/solana-price-rise-should-you-buy-the-blockchain-s-crypto-token-sol", "3", "SUPPORT"],
["", "The coin has now lost 66% of its value since its all time high of $260 last November. SOL is in 9th place in the league of largest cryptocurrencies with its market capitalisation of $28.56bn.", "https://capital.com/solana-sol-price-prediction-is-it-a-solid-investment", "6", "SUPPORT"],
["", "“Depending on the bug or exploit, it is possible for a nefarious actor to take some or all of the funds stored in Hedgehog’s smart contracts,” notes a disclaimer on Hedgehog’s website.", "https://www.coindesk.com/markets/2021/09/28/solana-based-prediction-market-uses-defi-yields-to-finance-no-loss-betting/", "6", "SUPPORT"],
["", "“It will outperform both Bitcoin and Ethereum again next year due to its superior high transaction speed — processing over 2,500 transactions per second vs 15 for Ethereum — at a lower cost without compromising on decentralisation,” mentions Green.", "https://www.fortuneindia.com/investing/the-best-crypto-bets-in-2022/106669", "6", "AGAINST"],
["", "You’ll pay a 0% tax on ETHH held in a TFSA. That’s one very real advantage Ether still has over Solana, which doesn’t have any ETFs that are available in Canada.", "https://www.fool.ca/2022/02/17/sol-is-it-really-the-ethereum-killer/", "7", "SUPPORT"]];

let data_parent = {};

describe('solana-news', () => {

    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());

    const program = anchor.workspace.SolanaNews as Program<SolanaNews>;


    it('post a new annotation with parent', async () => {
        const topic = anchor.web3.Keypair.generate();
        // Call the "Add Topic" instruction.
        await program.rpc.addTopic('Solana is better than Etherium', 'solana', {
            accounts: {
                topic: topic.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [topic],
        });

        const topicAccount = await program.account.topic.fetch(topic.publicKey);

        console.log(topicAccount);

        for (var annotation_data of data) {
            console.log(annotation_data);
            const annotation = anchor.web3.Keypair.generate();
            let rAccounts: AccountMeta[] = [];
            if (annotation_data[3] != "") {
                
        rAccounts.push({
            isSigner: false,
            isWritable: true,
            pubkey: data_parent[annotation_data[3]]
        });

    }
    else {
        data_parent[annotation_data[0]] = annotation.publicKey;
    }
        await program.rpc.addAnnotation(annotation_data[1],
            annotation_data[2],
            annotation_data[4] == "SUPPORT" ? 1 : annotation_data[4] == "AGAINST" ? 2 : 0,
            {
                accounts: {
                    annotation: annotation.publicKey,
                    author: program.provider.wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    parentTopic: topic.publicKey
                },
                signers: [annotation],
                remainingAccounts: rAccounts
            });
        const annotationAccount = await program.account.annotation.fetch(annotation.publicKey);
        console.log(annotationAccount);


        }
        // Call the "Add Topic" instruction.
        

        
        assert.ok(topic.publicKey);

    });


});
