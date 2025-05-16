
import React, { useState, useEffect } from 'react';
import PanelListTable from './PanelPriceTable';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Container } from 'react-bootstrap';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import back from '../../assets/Icons/back.png';
import { Image } from 'react-bootstrap';





const PanelPriceList = () => {
    const { user } = useSelector((state) => state.user);

    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-4 overflow-y-auto" style={{ background: 'linear-gradient(to top, #f19090 0%, #897edd 100%)' }} >
        <div className="w-full h-full overflow-auto">
          <Container className="bg-[#fff] p-4 md:p-3 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {/* {user.department === "Sales" && user.designation === "Accountant" ? (
                <Link to="" className="w-1">
                  <Image src={back} alt="back" rounded className="w-4" />
                </Link>
              ) : (
                <Link to="" className="w-1">
                  <Image src={back} alt="back" rounded className="w-4" />
                </Link>
              )} */}
              <h2 className="flex-grow text-center text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
                Panel Price List
              </h2>
            </div>
  
            {/* Teansporter List Table */}
            <div className="App">
              <div className="card">
                <PanelListTable />
              </div>
            </div>
          </Container>
        </div>
      </div>
  
    );
  }

export default PanelPriceList;