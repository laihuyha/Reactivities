/* eslint-disable react/react-in-jsx-scope */
import { observer } from "mobx-react-lite"
import "./styles/styles.scss"
import "../../app/layout/styles/index.scss"
import { ReactComponent as PrimeReactIcon } from "../../assets/primereact-logo-light.svg"
import { NavLink } from "react-router-dom"
import { useStore } from "../../app/stores/store"

const HomePage = () => {
  const { userStore } = useStore()
  const { isLogin } = userStore
  return (
    <>
      <div className="flex justify-content-center align-items-center flex-column border-round home">
        <PrimeReactIcon />
        <span className="text-7xl text-white">Reactivities</span>
        <h2 className="title">Home Page</h2>
        {isLogin ? (
          <NavLink to="/activities" className="btn-grad">
            Goto Activities
          </NavLink>
        ) : (
          <div className="flex flex-row justify-content-center align-items-center">
            <NavLink to="/login" className="btn-grad">
              Login
            </NavLink>
            <span>or</span>
            <NavLink to="/register" className="btn-grad">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </>
  )
}

export default observer(HomePage)
