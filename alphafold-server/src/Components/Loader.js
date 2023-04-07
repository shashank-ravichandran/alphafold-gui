export const Loader = () => {
  return (
    <div className="loader-bg" style={{ position: "absolute", top: 0 }}>
      <img src={require("../Utils/Loader.gif")} alt="loader gif" />
    </div>
  );
};
