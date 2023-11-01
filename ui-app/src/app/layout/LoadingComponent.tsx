import { ProgressSpinner } from "primereact/progressspinner"

const LoadingComponent = () => {
  return (
    <div className="flex justify-content-center align-content-center flex-column h-screen">
      <ProgressSpinner />
    </div>
  )
}

export default LoadingComponent
