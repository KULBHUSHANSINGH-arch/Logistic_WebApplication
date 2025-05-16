import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Container } from 'react-bootstrap';
import PartyListTable from './PartListTable';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import back from '../../assets/Icons/back.png';
// import logo from '../../assets/logo.png';

const PartList = () => {
  return (
    <div className="min-h-screen  bg-white"  >
      <div className="w-full h-full overflow-auto">
        <Container className="bg-[#fff] p-4 md:p-3 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="w-1">
              <Image src={back} alt="back" rounded className="w-4" />
            </Link>
            <h2 className="flex-grow text-center text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
              Party List
            </h2>

          </div>

          {/* Party List Table */}
          <div className="App">
            <div className="card">
              <PartyListTable />
            </div>
          </div>

        </Container>

      </div>
    </div>

  );
};

export default PartList;
