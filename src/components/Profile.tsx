import Button from "./Button";
import Dropdown from "./Dropdown";
import Input from "./Input";
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
}: // walletConnectionHelper,
ProfilePropsI) => {
  return (
    <div className="w-[80%] mx-auto mt-16 h-full">
      <header className="w-[80%] h-full flex items-center justify-between ">
        <h1 className="text-[2rem] leading-[3rem] font-bold mb-4">
          Create Your Tokens In A Few Steps
        </h1>
        <Dropdown />
      </header>
      {walletConnected && walletConnected ? (
        <ul className="text-[1.2rem] h-[55vh] flex flex-col justify-between">
          <li>
            Airdrop 1 SOL into your wallet
            <br />
            <Button
              className="button"
              disabled={loading}
              onClick={airDropHelper}
            >
              AirDrop SOL
            </Button>
          </li>
          <li>
            Create your own token
            <Input />
            <Button
              className="button"
              disabled={loading}
              onClick={initialMintHelper}
            >
              Initial Mint
            </Button>
          </li>
          <li>
            Mint More tokens:
            <Input />
            <Button
              className="button"
              disabled={loading || supplyCapped}
              onClick={mintAgainHelper}
            >
              Mint Again
            </Button>
          </li>
          <li>
            Transfer Tokens To Friends:
            <Input />
            <Button
              className="button"
              disabled={loading || supplyCapped}
              onClick={transferTokenHelper}
            >
              Transfer Tokens
            </Button>
          </li>
        </ul>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Profile;
