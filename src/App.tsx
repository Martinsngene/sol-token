import {
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useState } from "react";

// import to fix polyfill issue with buffer with webpack
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Profile from "./components/Profile";

function App() {
  // create types
  type DisplayEncoding = "utf8" | "hex";

  type PhantomEvent = "disconnect" | "connect" | "accountChanged";
  type PhantomRequestMethod =
    | "connect"
    | "disconnect"
    | "signTransaction"
    | "signAllTransactions"
    | "signMessage";

  interface ConnectOpts {
    onlyIfTrusted: boolean;
  }

  // create a provider interface (hint: think of this as an object) to store the Phantom Provider
  interface PhantomProvider {
    publicKey: PublicKey;
    isConnected: boolean | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (
      transactions: Transaction[]
    ) => Promise<Transaction[]>;
    signMessage: (
      message: Uint8Array | string,
      display?: DisplayEncoding
    ) => Promise<any>;
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, handler: (args: any) => void) => void;
    request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
  }
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<any>();
  const [isTokenCreated, setIsTokenCreated] = useState(false);
  const [createdTokenPublicKey, setCreatedTokenPublicKey] = useState<any>(null);
  const [mintingWalletSecretKey, setMintingWalletSecretKey] =
    useState<any>(null);

  // Dark Mode
  const [darkMode] = useState(false);

  const [supplyCapped, setSupplyCapped] = useState(false);

  const getProvider = (): PhantomProvider | undefined => {
    // I removed the "async" keyword from this func.
    if ("solana" in window) {
      const provider = window.solana as any;
      if (provider.isPhantom) {
        console.log("available");
        return provider as PhantomProvider;
      }
    } else {
      window.open("https://www.phantom.app/", "_blank");
    }
  };

  const walletConnectionHelper = async () => {
    if (walletConnected) {
      //Disconnect Wallet
      setProvider(undefined);
      setWalletConnected(false);
    } else {
      const userWallet = await getProvider();
      if (userWallet) {
        await userWallet.connect();
        userWallet.on("connect", async () => {
          setProvider(userWallet);
          setWalletConnected(true);
        });
      }
    }
  };

  const airDropHelper = async () => {
    try {
      setLoading(true);
      const connection = new Connection("http://127.0.0.1:8899", "confirmed");
      const airdropSignature = await connection.requestAirdrop(
        provider!.publicKey,
        LAMPORTS_PER_SOL
      );

      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });
      console.log(
        `1 SOL airdropped to your wallet ${provider!.publicKey.toString()} successfully`,
        latestBlockHash
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const initialMintHelper = async () => {
    try {
      setLoading(true);
      const connection = new Connection("http://127.0.0.1:8899", "confirmed");

      const mintRequester = await provider!.publicKey;
      const mintingFromWallet = await Keypair.generate();
      setMintingWalletSecretKey(JSON.stringify(mintingFromWallet.secretKey));

      const airdropSignature = await connection.requestAirdrop(
        mintingFromWallet.publicKey,
        LAMPORTS_PER_SOL
      );

      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });

      const creatorToken = await Token.createMint(
        connection,
        mintingFromWallet,
        mintingFromWallet.publicKey,
        null,
        6,
        TOKEN_PROGRAM_ID
      );
      const fromTokenAccount =
        await creatorToken.getOrCreateAssociatedAccountInfo(
          mintingFromWallet.publicKey
        );
      await creatorToken.mintTo(
        fromTokenAccount.address,
        mintingFromWallet.publicKey,
        [],
        1000000
      );

      const toTokenAccount =
        await creatorToken.getOrCreateAssociatedAccountInfo(mintRequester);
      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          mintingFromWallet.publicKey,
          [],
          1000000
        )
      );
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [mintingFromWallet],
        { commitment: "confirmed" }
      );

      console.log("SIGNATURE:", signature);

      setCreatedTokenPublicKey(creatorToken.publicKey.toString());
      setIsTokenCreated(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const mintAgainHelper = async () => {
    try {
      setLoading(true);
      const connection = new Connection("http://127.0.0.1:8899", "confirmed");
      const createMintingWallet = await Keypair.fromSecretKey(
        Uint8Array.from(Object.values(JSON.parse(mintingWalletSecretKey)))
      );
      const mintRequester = await provider!.publicKey;

      const airdropSignature = await connection.requestAirdrop(
        createMintingWallet.publicKey,
        LAMPORTS_PER_SOL
      );

      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });

      const creatorToken = new Token(
        connection,
        new PublicKey(createdTokenPublicKey),
        TOKEN_PROGRAM_ID,
        createMintingWallet
      );
      const fromTokenAccount =
        await creatorToken.getOrCreateAssociatedAccountInfo(
          createMintingWallet.publicKey
        );
      const toTokenAccount =
        await creatorToken.getOrCreateAssociatedAccountInfo(mintRequester);
      await creatorToken.mintTo(
        fromTokenAccount.address,
        createMintingWallet.publicKey,
        [],
        100000000
      );

      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          createMintingWallet.publicKey,
          [],
          100000000
        )
      );
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [createMintingWallet],
        { commitment: "confirmed" }
      );

      console.log("SIGNATURE:", signature);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const transferTokenHelper = async () => {
    try {
      setLoading(true);

      const connection = new Connection("http://127.0.0.1:8899", "confirmed");

      const createMintingWallet = Keypair.fromSecretKey(
        Uint8Array.from(Object.values(JSON.parse(mintingWalletSecretKey)))
      );
      const receiverWallet = new PublicKey(
        "5eaFQvgJgvW4rDjcAaKwdBb6ZAJ6avWimftFyjnQB3Aj"
      );

      const airdropSignature = await connection.requestAirdrop(
        createMintingWallet.publicKey,
        LAMPORTS_PER_SOL
      );

      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });
      console.log(
        `1 SOL airdropped to your wallet ${provider!.publicKey.toString()} successfully`,
        latestBlockHash
      );

      const creatorToken = new Token(
        connection,
        createdTokenPublicKey,
        TOKEN_PROGRAM_ID,
        createMintingWallet
      );
      const fromTokenAccount =
        await creatorToken.getOrCreateAssociatedAccountInfo(
          provider!.publicKey
        );
      const toTokenAccount =
        await creatorToken.getOrCreateAssociatedAccountInfo(receiverWallet);

      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          provider!.publicKey,
          [],
          10000000
        )
      );
      transaction.feePayer = provider!.publicKey;
      let blockhashObj = await connection.getLatestBlockhash();
      console.log("blockhashObj", blockhashObj);
      transaction.recentBlockhash = blockhashObj.blockhash;

      if (transaction) {
        console.log("Txn created successfully");
      }

      let signed = await provider!.signTransaction(transaction);
      let signature = await connection.sendRawTransaction(signed.serialize());

      await connection.confirmTransaction({
        blockhash: blockhashObj.blockhash,
        lastValidBlockHeight: blockhashObj.lastValidBlockHeight,
        signature: signature,
      });

      console.log("SIGNATURE: ", signature);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  console.log(provider);

  return (
    <div
      className={
        darkMode
          ? "font-mono text-white bg-[#231F1F]"
          : "font-mono text-[#231F1F] bg-white"
      }
    >
      {/* Navbar */}
      <NavBar
        walletConnectHelper={walletConnectionHelper}
        isConnected={walletConnected}
        provider={provider}
      />
      {/* Profile */}
      {walletConnected ? (
        <Profile
          walletConnected={walletConnected}
          provider={provider}
          loading={loading}
        />
      ) : (
        // Home Page
        <>
          <Home darkMode={darkMode} />
        </>
      )}
    </div>
  );
}

export default App;
