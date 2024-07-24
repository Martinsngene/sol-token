import Logo from "./Logo";
import Button from "./Button";
import { navLinks } from "./constants";

const NavBar = () => {
  return (
    <nav className="nav max-w-[1440px]">
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
      <Button className="button-3d">Connect Wallet</Button>
    </nav>
  );
};

export default NavBar;
