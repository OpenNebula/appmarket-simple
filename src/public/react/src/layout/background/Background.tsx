import background from "@/assets/background.png";

function Background() {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom",
        position: "fixed",
      }}
    ></div>
  );
}

export default Background;
