import HandLight from "../assets/hand_light.svg";
import HandDark from "../assets/hand_dark.svg";
import ArrowLight from "../assets/arrow_light.svg";
import ArrowDark from "../assets/arrow_dark.svg";
import Star from "../assets/star.svg";
import Play from "../assets/play.svg";
import Button from "./Button";

// Interface
interface HomePropsI {
  darkMode: boolean;
}

const Home = ({ darkMode }: HomePropsI) => {
  return (
    <main className="flex items-center justify-center">
      <div className=" w-[540px] relative">
        <div className="pb-[6rem]">
          {/* Header Text */}
          <h1 className="text-[4rem] leading-[6rem] font-extrabold pb-4">
            Now <br /> <span className="text-[#55C8ED]">Anyone</span> Can Create
            Tokens.
          </h1>
          {/* Mission Text */}
          <p className="text-[1.5rem]">
            Evolve your blockchain products with <br />
            our token creation infrastructure
          </p>
        </div>
        {/* Star */}
        <img
          className="absolute top-[-1.5rem] left-[12rem]"
          width={74}
          src={Star}
          alt="star"
        />
        {/* Arrow */}
        <img
          className="absolute bottom-[7rem] right-[-2rem]"
          width={200}
          src={darkMode ? ArrowDark : ArrowLight}
          alt="star"
        />
        {/* Buttons */}
        <div className="flex mt-6">
          <Button className="button-3d mr-10">Get Started</Button>
          <Button className="btn-outline">
            <img width={40} src={Play} alt="play" />
            Watch Video
          </Button>
        </div>
      </div>
      {/* Hand */}
      <div>
        <img width={690} src={darkMode ? HandDark : HandLight} alt="hand" />
      </div>
    </main>
  );
};

export default Home;
