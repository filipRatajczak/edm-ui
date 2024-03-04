import React from 'react'
import {BsBriefcaseFill, BsCalendar3, BsGrid1X2Fill} from 'react-icons/bs'
import {MdAutoDelete} from "react-icons/md";
import Typography from "@material-ui/core/Typography";

function EmployeeSidebar() {

    const iconColor = `rgb(158, 158, 164)`;

    return (
        <aside id="sidebar">
            <div className='sidebar-title'>
                <div className='sidebar-brand'
                     style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <BsBriefcaseFill className='icon_header' style={{color: iconColor}}/>
                    <Typography component="h1" textAlign="center" variant="h5" style={{color: iconColor}}>
                        EDM Employee
                    </Typography>
                </div>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <a href="/employee-dashboard/home">
                        <BsGrid1X2Fill className='icon'/> Home
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="/employee-dashboard/schedule">
                        <BsCalendar3 className='icon'/> View schedule
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="/employee-dashboard/delete-disposition">
                        <MdAutoDelete className='icon'/> Delete disposition
                    </a>
                </li>
            </ul>
        </aside>
    )
}

export default EmployeeSidebar