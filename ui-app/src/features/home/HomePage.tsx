import { observer } from "mobx-react-lite";
import "./styles/styles.scss";
import "../../app/layout/styles/index.scss";
import { ReactComponent as PrimeReactIcon } from "../../assets/primereact-logo-light.svg";
import { NavLink } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="flex justify-content-center align-items-center flex-column home">
        <PrimeReactIcon />
        <span className="text-7xl text-white">Reactivities</span>
        <h2 className="title">Home Page</h2>
        <NavLink to="/activities" className="btn-grad">
          Goto Activities
        </NavLink>
      </div>
    </>
  );
};

export default observer(HomePage);
