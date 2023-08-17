import { observer } from "mobx-react-lite";
import { ReactComponent as NotFoundIMG } from "../../assets/asset-404.svg";
import "./styles.scss";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div className="h-screen flex flex-column justify-content-center align-items-center">
        <div className="flex flex-column justify-content-center text-center align-content-center h-full exception-content">
          <NotFoundIMG />
          <span className="text-5xl font-semibold">Not Found!</span>
          <span className="m-3">Looks like you are lost.</span>
          <NavLink to="/activities" className="btn-grad">
            Go back Activities
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default observer(NotFound);
