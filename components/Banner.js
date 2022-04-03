const Banner = ({ buttonText, onClickHandler }) => {
  return (
    <div>
      <h1>
        <span>Coffee</span> <span>Finder</span>
      </h1>
      <p>Find coffee shops near you.</p>
      <button onClick={onClickHandler}>{buttonText}</button>
    </div>
  );
};

export default Banner;
