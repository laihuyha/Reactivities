import { ProgressSpinner } from "primereact/progressspinner";
// interface Props {
//   inverted?: boolean;
//   content?: string;
// }
const LoadingComponent = () => {
  return (
    <div className="loading-container">
      <ProgressSpinner />
    </div>
  );
};

export default LoadingComponent;
