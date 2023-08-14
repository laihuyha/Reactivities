import { observer } from "mobx-react-lite";

const HomePage = () => {
  return (
    <>
      <h2 className="title">Home Page</h2>
      <a href="/activities">Goto Activities</a>
    </>
  );
};

export default observer(HomePage);
