
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Container } from 'react-bootstrap';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

/***---------- Update New Features -------- *****/
import back from '../../assets/Icons/back.png';
import { Image } from 'react-bootstrap';
import SalesListTable from './SalesListTable';
import { useSelector } from 'react-redux';
import { dev } from "../../utils/ApiUrl";


const SalesList = () => {
  const { user } = useSelector((state) => state.user);
  const [setStatus] = useState(null);

  // checking user status-------------------------------
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${dev}/user/checkActive`, {
          method: "POST",
          body: JSON.stringify({ personId: user?.personId }),
          headers: {
            "content-type": "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data?.status?.toLowerCase() === "inactive") {
          handleClick();
        }

        // setError('');
      } catch (err) {
        setStatus(null);
        console.log("error", err);
        // setError('Employee not found or an error occurred.');
      }
    };
    checkStatus();
  }, []);

  return (
    <div
      className=" flex flex-col"
      style={{ minHeight: `calc(100vh - 48px)` }}
    >
      {/* Header Section */}
      <div className="flex items-center  justify-between  h-16 px-4  ">
        {user.department === "Sales" && user.designation === "Accountant" ? (
          <Link to="/sales-order" className="w-1">
            <Image src={back} alt="back" rounded className="w-4" />
          </Link>
        ) : (
          <Link to="/dashboard" className="w-1">
            <Image src={back} alt="back" rounded className="w-4" />
          </Link>
        )}
        <h2 className="flex-grow text-center text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
          Sales Order List
        </h2>
      </div>

      {/* Main Content Section */}
      <div className="flex-grow px-4">
        <SalesListTable />
      </div>
    </div>

  );
}

export default SalesList;
