import { ProfilePropsI } from "./interface";

const Profile = ({
  walletConnected,
  provider,
  loading,
  supplyCapped,
  airDropHelper,
  initialMintHelper,
  mintAgainHelper,
  transferTokenHelper,
  walletConnectionHelper,
}: ProfilePropsI) => {
  return (
    <>
      <h1>Create your own token using JavaScript</h1>
      {walletConnected && walletConnected ? (
        <>
          <p>
            <strong>Public Key:</strong> {provider!.publicKey.toString()}
          </p>
          <p>
            Airdrop 1 SOL into your wallet
            <button disabled={loading} onClick={airDropHelper}>
              AirDrop SOL{" "}
            </button>
          </p>

          <ul>
            <li>
              Create your own token
              <button disabled={loading} onClick={initialMintHelper}>
                Initial Mint{" "}
              </button>
            </li>
            <li>
              Mint More 100 tokens:{" "}
              <button
                disabled={loading || supplyCapped}
                onClick={mintAgainHelper}
              >
                Mint Again
              </button>
            </li>
            <li>
              Transfer Tokens To Friends:{" "}
              <button
                disabled={loading || supplyCapped}
                onClick={transferTokenHelper}
              >
                Transfer 10 tokens
              </button>
            </li>
          </ul>
        </>
      ) : (
        <p></p>
      )}

      <button onClick={walletConnectionHelper} disabled={loading}>
        {!walletConnected ? "Connect Wallet" : "Disconnect Wallet"}
      </button>
    </>
  );
};

export default Profile;
