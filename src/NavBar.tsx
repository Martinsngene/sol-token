import Logo from "./Logo";
import Button from "./components/Button";
import { navLinks } from "./components/constants";

const NavBar = () => {
  return (
    <nav className="nav">
      <Logo />
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
      <Button>Connect Wallet</Button>
    </nav>
  );
};

export default NavBar;
