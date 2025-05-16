import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Container } from "react-bootstrap";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import back from "../../assets/Icons/back.png";
import DeliveryProcessListTable from "./DeliveryProcessListTable";

const DeliveryProcess = () => {
  return (
    <div
      className=" h-full  w-full "
      style={{
        background: "linear-gradient(to top, #f19090 0%, #897edd 100%)",
      }}
    >
      <div className="w-full  h-full  ">
        <div className="bg-[#fff] p-4 md:p-3 h-full  w-full shadow-lg ">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="w-1">
              <Image src={back} alt="back" rounded className="w-4" />
            </Link>
            <h2 className="flex-grow text-center text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
              Delivery Status
            </h2>
          </div>

          {/* Delivery Status Table  */}
          <div className="App ">
            <div className="card ">
              <DeliveryProcessListTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProcess;
