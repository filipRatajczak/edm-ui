import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Signin from './components/Login';
import EmployeeHome from "./components/employee-dashboard/EmployeeHome";
import EmployeeSchedule from "./components/employee-dashboard/EmployeeSchedule";
import ManagerHome from "./components/manager-dashboard/ManagerHome";
import ManagerSchedule from "./components/manager-dashboard/ManagerSchedule";
import ManagerSettings from "./components/manager-dashboard/ManagerCreateEmployee";
import ManagerTimeEntry from "./components/manager-dashboard/ManagerTimeEntry";
import ManagerScheduleGenerator from "./components/manager-dashboard/ManagerScheduleGenerator";
import ManagerDeleteDisposition from "./components/manager-dashboard/ManagerDeleteDisposition";
import EmployeeDeleteDisposition from "./components/employee-dashboard/EmployeeDeleteDisposition";

function App() {

    return (
        <div className="wrapper">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Signin/>}/>
                    <Route path="/employee-dashboard/home" element={<EmployeeHome/>}/>
                    <Route path="/employee-dashboard/schedule" element={<EmployeeSchedule/>}/>
                    <Route path="/employee-dashboard/delete-disposition" element={<EmployeeDeleteDisposition/>}/>
                    <Route path="/manager-dashboard/home" element={<ManagerHome/>}/>
                    <Route path="/manager-dashboard/schedule" element={<ManagerSchedule/>}/>
                    <Route path="/manager-dashboard/create-employee" element={<ManagerSettings/>}/>
                    <Route path="/manager-dashboard/time-entries" element={<ManagerTimeEntry/>}/>
                    <Route path="/manager-dashboard/schedule-generator" element={<ManagerScheduleGenerator/>}/>
                    <Route path="/manager-dashboard/delete-disposition" element={<ManagerDeleteDisposition/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;