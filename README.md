# X-NFT Collection

This project is an NFT collection by Abdullah Ozer. It uses Hardhat for deployment and `dotenv` for managing environment variables.

## Prerequisites

Ensure you have the following installed:

- Node.js
- yarn

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/abdullahozer11/x-nft.git
    cd x-nft-collection
    ```

2. Install the dependencies:

    ```bash
    yarn install
    ```

3. Create a `.env` file in the root directory of the project and add the following environment variables:

    ```plaintext
    PRIVATE_KEY=your_private_key
    NETWORK=your_network_name
    ```

    Replace `your_private_key`, and `your_network_name` with your actual Infura API key, your wallet's private key, and the network name (e.g., `rinkeby`).

# Testing

To run tests use:

```bash
  yarn test
```
