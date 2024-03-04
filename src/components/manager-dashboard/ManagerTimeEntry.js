import React, {useEffect, useState} from 'react';
import ManagerSidebar from "./ManagerSidebar";

import Typography from "@material-ui/core/Typography";
import DatePicker from "react-datepicker";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
    form: {
        marginTop: theme.spacing(1),
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Add a subtle box shadow for depth
        borderRadius: '8px', // Optional: Add rounded corners for a softer look
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));
const ManagerTimeEntry = () => {

        const classes = useStyles();
        const [employees, setEmployees] = useState([]);
        const [selectedEmployee, setSelectedEmployee] = useState('');
        const [forDay, setForDay] = useState(null)
        const [fromTime, setFromTime] = useState(null)
        const [toTime, setToTime] = useState(null)

        const formStyle = {
            borderRadius: '25px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: '#FFF',
            marginLeft: '5vh',
            padding: '2vh',
            alignContent: 'center',
            p: 4,
        };
        const getEmployeesRequest = async () => {
            const token = 'Bearer ' + localStorage.getItem('token')

            const url = 'http://192.168.1.50:8080/api/v1/employees';

            return await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });
        }

        const postTimeEntryRequest = async () => {
            const token = 'Bearer ' + localStorage.getItem('token')

            const url = 'http://192.168.1.50:8080/api/v1/timeEntries';

            const requestBody = {
                "day": dateParser(forDay),
                "start": fromTime,
                "stop": toTime,
                "employeeCode": selectedEmployee
            }

            return await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(requestBody),
            })

        }

        const handleSubmit = async e => {
            e.preventDefault()

            const response = await postTimeEntryRequest();

            if (response.ok) {
                await swal("Success", "Time entry added.", "success", {
                    buttons: false,
                    timer: 2000,
                })
            } else {
                swal("Failed", "Error", "error");
            }

        }

        useEffect(() => {
            async function fillSelect() {
                const response = await getEmployeesRequest();

                if (response.ok) {
                    let result = response.json()
                    result.then((data) => {
                        setEmployees(data)
                    })
                }
            }

            fillSelect()
        }, []);

        const handleEmployeeChange = (event) => {
            setSelectedEmployee(event.target.value);
        };

        const handleForDayChange = (date) => {
            setForDay(date);
        };

        const dateParser = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        }

        return (
            <div className='grid-container'>
                <ManagerSidebar/>
                <div style={formStyle}>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Typography component="h1" variant="h4" style={{padding: '3vh'}}>
                            Add time entries
                        </Typography>
                        <Typography component="h5" variant="h6">
                            Select employee:
                        </Typography>
                        <select
                            id="employeeSelect"
                            value={selectedEmployee}
                            onChange={handleEmployeeChange}>
                            <option value="">Select an employee</option>
                            {employees.map((employee) => (
                                <option key={employee.employeeCode} value={employee.employeeCode}>
                                    {employee.firstName} {employee.lastName}
                                </option>
                            ))}
                        </select>
                        <Typography component="h5" variant="h6">
                            For day:
                        </Typography>
                        <DatePicker
                            showIcon
                            selected={forDay}
                            onChange={handleForDayChange}
                            dateFormat="yyyy-MM-dd"
                            isClearable // Add a clear button
                            showYearDropdown // Show a dropdown to select the year
                        />
                        <Typography component="h1" variant="h6">
                            From:
                        </Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            id="fromTime"
                            name="fromTime"
                            label="fromTime"
                            type="text"
                            onChange={e => setFromTime(e.target.value)}
                        />
                        <Typography component="h1" variant="h5">
                            To:
                        </Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            id="toTime"
                            name="toTime"
                            label="toTime"
                            type="text"
                            onChange={e => setToTime(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}>Submit</Button>
                    </form>
                </div>
            </div>
        );
    }
;

export default ManagerTimeEntry;