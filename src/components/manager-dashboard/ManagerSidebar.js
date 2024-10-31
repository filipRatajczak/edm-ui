import React from 'react'
import {BsBriefcaseFill, BsCalendar3, BsGrid1X2Fill} from 'react-icons/bs'
import Typography from "@mui/material/Typography";
import {FaClock} from "react-icons/fa";
import {GrSchedule} from "react-icons/gr";
import {MdAutoDelete} from "react-icons/md";
import {FaPersonCirclePlus} from "react-icons/fa6";

function ManagerSidebar() {

    const iconColor = `rgb(158, 158, 164)`;

    return (
        <aside id="sidebar">
            <div className='sidebar-title'>
                <div className='sidebar-brand'
                     style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <BsBriefcaseFill className='icon_header' style={{color: iconColor}}/>
                    <Typography component="h1" textAlign="center" variant="h5" style={{color: iconColor}}>
                        EDM Manager
                    </Typography>
                </div>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <a href="/manager-dashboard/home">
                        <BsGrid1X2Fill className='icon'/> Home
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="/manager-dashboard/schedule">
                        <BsCalendar3 className='icon'/> View schedule
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="/manager-dashboard/time-entries">
                        <FaClock className='icon'/> Add time entries
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="/manager-dashboard/schedule-generator">
                        <GrSchedule className='icon'/> Create schedule
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="/manager-dashboard/create-employee">
                        <FaPersonCirclePlus className='icon'/> Create employee
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="/manager-dashboard/delete-disposition">
                        <MdAutoDelete className='icon'/> Delete disposition
                    </a>
                </li>
            </ul>
        </aside>
    )
}

export default ManagerSidebar