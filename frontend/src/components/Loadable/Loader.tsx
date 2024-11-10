import { LoadingOutlined } from "@ant-design/icons";

const Loader: React.FC = () => (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 2000,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <LoadingOutlined
      style={{
        fontSize: 100,
        color: "#180731",
      }}
      spin
    />
  </div>
);

export default Loader;
