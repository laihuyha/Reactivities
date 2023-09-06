import { observer } from "mobx-react-lite";
import { ReactComponent as NotFoundIMG } from "../../assets/asset-404.svg";
import "./styles.scss";
import { Button } from "primereact/button";

const NotFound = () => {
  return (
    <>
      <div className="flex flex-colum h-screen justify-content-center align-items-center">
        <div className="flex flex-column justify-content-center text-center align-content-center exception-content">
          <NotFoundIMG />
          <span className="text-5xl font-semibold">Not Found!</span>
          <span className="m-3">Looks like you are lost.</span>
          <Button
            className="btn-grad"
            onClick={() => {
              window.history.go(-2);
            }}
          >
            Go back HomePage
          </Button>
        </div>
      </div>
    </>
  );
};

export default observer(NotFound);
