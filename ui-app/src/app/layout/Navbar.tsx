import { MegaMenu } from "primereact/megamenu";
import { InputText } from "primereact/inputtext";

const Navbar = () => {
  const start = (
    <img
      alt="logo"
      src="https://primefaces.org/cdn/primereact/images/logo.png"
      height="40"
      className="mr-2"
    ></img>
  );
  const end = <InputText placeholder="Search" type="text" />;
  
  return (
    <>
      <MegaMenu
        model={[]}
        orientation="horizontal"
        breakpoint="960px"
        start={start}
        end={end}
      />
    </>
  );
};
export default Navbar;
