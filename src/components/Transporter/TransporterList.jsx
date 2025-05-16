import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Container } from 'react-bootstrap';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Link } from 'react-router-dom';
import TransporterListTable from './TransporterListTable';

/***---------- Update New Features -------- *****/
import back from '../../assets/Icons/back.png';
import { Image } from 'react-bootstrap';
import { useState,useEffect  } from 'react';


const TransporterList = () => {
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
    <div className="min-h-screen  bg-white" >
      <div className="w-full h-full overflow-auto">
        <Container className="bg-[#fff] p-4 md:p-3 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="w-1">
              <Image src={back} alt="back" rounded className="w-4" />
            </Link>
            <h2 className="flex-grow text-center text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
              Transpotter List
            </h2>
          </div>

          {/* Teansporter List Table */}
          <div className="App">
            <div className="card">
              <TransporterListTable />
            </div>
          </div>
        </Container>
      </div>
    </div>

  );
}

export default TransporterList;
