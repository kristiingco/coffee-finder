import Image from "next/image";
const Banner = ({ buttonText, onClickHandler }) => {
  return (
    <div className="flex flex-col w-full p-5 justify-center items-center md:flex-row">
      <div className="flex flex-col align-center m-5">
        <h1 className="font-bold text-4xl">
          <span>Coffee Finder</span>
        </h1>
        <p className="text-center">Find coffee stores near you.</p>
        <button
          className="bg-cool-purple text-white m-4 p-3 rounded-md"
          onClick={onClickHandler}
        >
          {buttonText}
        </button>
      </div>

      <Image
        src="/static/hot_beverage.svg"
        alt="hero image"
        width={300}
        height={300}
      />
    </div>
  );
};

export default Banner;
