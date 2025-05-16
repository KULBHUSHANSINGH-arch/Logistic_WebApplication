import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Container } from "react-bootstrap";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import back from "../../assets/Icons/back.png";
import DeliveryAddressListTabel from "./DeliveryAddressListTabel";

const DeliveryAddressList = () => {
  return (
    <div
      className="min-h-screen  bg-white"
    
    >
      <div className="w-full h-full overflow-auto">
        <Container className="bg-[#fff] p-4 md:p-3 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="w-1">
              <Image src={back} alt="back" rounded className="w-4" />
            </Link>
            <h2 className="flex-grow text-center text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
              Delivery/Billing Address List
            </h2>
          </div>

          {/* Delivery Address List Table */}
          <div className="App">
            <div className="card">
              <DeliveryAddressListTabel />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default DeliveryAddressList;
