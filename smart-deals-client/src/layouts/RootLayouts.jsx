import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar/Navbar'

const RootLayouts = () => {
  return (
    <div className='max-w-7xl mx-auto'>
        <Navbar/>
        <Outlet/>
        
    </div>
  )
}

export default RootLayouts