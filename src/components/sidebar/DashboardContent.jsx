import React from 'react'
import '../../styles/dashboard/dashboard.css'
import { NavLink } from 'react-router-dom'

function DashboardContent() {
  return (
    <div className='dashboard-content flex justify-center bg-slate-100 text-2xl text-red-300 font-serif capitalize items-center'>
   this page under construction 
<NavLink className={' bg-slate-900 px-6 py-2 rounded-sm ml-3 text-xl'} to={'add-vehicle'}>add vehicle</NavLink>
    </div>
  )
}

export default DashboardContent
