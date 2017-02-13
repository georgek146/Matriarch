# Matriarch

Matriarch is my implementation of a DAO layer on top of an erc-20 compliant token. The contract starts with a centralised curator that can be phased out as confidence in voters increases. The erc-20 token I implement is a [MiniMe Token](https://medium.com/giveth/the-minime-token-open-sourced-by-giveth-2710c0210787#.w7najly69) which allows for easy and efficient DAO splits.


### Prerequisites and Setup

1. First choose how you want to expose the web3 object.
    - [Metamask - chrome extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) (recommended)
    - [Mist - web3 compatible browser](https://github.com/ethereum/mist/releases) (medium)
    - [Geth - locally hosted web3 client](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum) (hard)
2. To submit a proposal you must host the proposal data yourself using an IPFS node. Eventually something like filecoin will be used.
3. Go to the [Matriarch testnet webpage](http://matriarch-testnet.azurewebsites.net/)