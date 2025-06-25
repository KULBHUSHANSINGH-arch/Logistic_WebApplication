import { useState, useEffect } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import "../../styles/dashboard/dashboardSidebar.css";

// Icons imports

import Wattagebulb from '../../assets/sidebar_logo/bulb.png'
import changelist from '../../assets/logo/document.png'
import SalesOrder from '../../assets/sidebar_logo/list.png'
import SalesAddOrder from '../../assets/sidebar_logo/task.png'
import newdashboard from '../../assets/logo/dashboard.png'
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventIcon from '@mui/icons-material/Event';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import BarChartIcon from '@mui/icons-material/BarChart';
import {filterLinks} from '../../utils/accessLink';
import { useSelector } from "react-redux";

import gross from '../../assets/logo/gross.png';


function Sidebar({ toggleSidebar, isCollapsed }) {
  const {user}=useSelector(state=>state.user)
  const [openParent, setOpenParent] = useState(null);
  const [childMaxHeight, setChildMaxHeight] = useState(0);
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [personId, setPersonId] = useState('');
 

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const userDepartment = localStorage.getItem("department");
    const designation = localStorage.getItem('designation')

    setDesignation(designation);
    setPersonId(currentUser);
    setDepartment(userDepartment);

    // console.log('Current User', currentUser);
    // console.log('Current Department', userDepartment);
  }, []);

const allLinks = [
    {
      name: "dashboard",
      to: "/dashboard",
      children: [],
      icon: <img src={newdashboard} style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "Sales Order",
      to: "/sales-order",
      children: [],
      icon: <img src={SalesOrder} style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "Sales Report",
      to: "/sales-report",
      children: [],
      icon: <BarChartIcon style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "Vehicle Report",
      to: "/vehicle-report",
      children: [],
      icon: <AssessmentIcon style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "Party",
      to: "/partylist",
      children: [],
      icon: <img src={SalesAddOrder} style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "Delivery/Billing Address",
      to: "/delivery-address",
      children: [],
      icon: <img src={changelist} style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "Receive Amount",
      to: "/receiveAmountList",
      children: [],
      icon: <img src={gross} style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "Transporter Report",
      to: "/transporter-report",
      children: [],
      icon: <BarChartIcon style={{ width: '30px', height: '30px' }} />
    },
    {
      name: "Transporter",
      to: "/transporterlist",
      children: [],
      icon: <img src={SalesOrder} style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "watage",
      to: "/watage",
      children: [],
      icon: <img src={Wattagebulb} style={{ width: '20px', height: '20px' }} />,
    }, 
    {
      name: "Panel Price List",
      to: "/panelpricelist",
      children: [],
      icon: <PriceCheckIcon style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "Meeting/Travelling",
      to: "/meeting-travelling",
      children: [],
      icon: <EventIcon style={{ width: '30px', height: '30px' }} />,
    },
    {
      name: "Lead",
      to: "/lead",
      children: [],
      icon: <EventIcon style={{ width: '30px', height: '30px' }} />,
    },
  ];
  const links = filterLinks(allLinks, user?.designation, user?.department);

  const toggleParent = (index) => {
    setOpenParent(openParent === index ? null : index);
  };

  useEffect(() => {
    if (openParent !== null) {
      const childLinks = links[openParent].children;
      const childLinkHeight = 42;
      setChildMaxHeight(childLinks?.length * childLinkHeight);
    } else {
      setChildMaxHeight(0);
    }
  }, [openParent, links]);

  return (
    <aside className={`dashboard-sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <ul className="sidebar-links-wrapper">
        {links.map((link, index) => (
          <li key={index} className={`sidebar-link-item`}>
            {link?.children?.length === 0 ? (
              <NavLink to={link.to} className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                <p className="flex gap-2 items-center"> {link.icon} <span>{link.name}</span></p>
              </NavLink>
            ) : (
              <>
                <button
                  className={`parent-link`}
                  onClick={() => toggleParent(index)}
                  aria-expanded={openParent === index ? "true" : "false"}
                >
                  <p className="flex gap-2 items-center"> {link.icon} <span>{link.name}</span></p>
                  {openParent === index ? <TiArrowSortedUp className="text-xl" /> : <TiArrowSortedDown className="text-xl" />}
                </button>
                <ul className={`child-links ${openParent === index ? 'smooth' : ''}`} style={{ maxHeight: openParent === index ? `${childMaxHeight}px` : '0' }}>
                  {link?.children?.map((child, childIndex) => (
                    <li key={childIndex}>
                      <NavLink to={child.to} className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                        <p className="flex gap-2 items-center">{child.icon} <span>{child.name}</span></p>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;