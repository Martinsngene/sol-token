import Logo from "./Logo";
import Button from "./Button";
import { navLinks } from "./constants";

// Interface
interface NavBarPropsI {
  walletConnectHelper: () => void;
  isConnected: boolean;
  provider: any;
}

const NavBar = ({
  walletConnectHelper,
  isConnected,
  provider,
}: NavBarPropsI) => {
  return (
    <nav className="nav max-w-[1440px]">
      <Logo />
      {isConnected ? (
        <div>
          <strong>Public Key:</strong> {provider!.publicKey.toString()}
        </div>
      ) : (
        <ul className="w-[30%] flex items-center justify-between">
          {navLinks.map((link: any, index: number) => {
            return (
              <a
                key={index}
                href={link.link}
                className="text-[1.125rem] font-medium"
              >
                {link.name}
              </a>
            );
          })}
        </ul>
      )}
      <Button className="button-3d" onClick={walletConnectHelper}>
        {isConnected ? "Disconnect" : "Connect"} Wallet
      </Button>
    </nav>
  );
};

export default NavBar;
