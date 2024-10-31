import React, {useState} from 'react';
import ManagerSidebar from "./ManagerSidebar";
import Swal from 'sweetalert2'
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import {makeStyles} from "@mui/styles"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {DotLoader} from 'react-spinners';
import {css} from '@emotion/react';
import TextField from "@mui/material/TextField";
import {Autocomplete} from "@mui/lab";
import inputsRef from "react-big-calendar/dist/react-big-calendar";

const useStyles = makeStyles((theme) => ({
    form: {
        marginTop: theme.spacing(1),
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const hours = () => {
    let options = []
    let currentTime = new Date();
    currentTime.setHours(8, 0, 0, 0);
    let endTime = new Date();
    endTime.setHours(22, 0, 0, 0);

    while (currentTime <= endTime) {

        let formattedHour = currentTime.getHours().toString().padStart(2, '0');
        let formattedMinute = currentTime.getMinutes().toString().padStart(2, '0');
        let formattedTime = `${formattedHour}:${formattedMinute}`;

        options.push({label: formattedTime});
        currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    return options;

}
const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const organizations = () => {
    return ['ORG-NF-K', 'ORG-NF-W']
}


async function generateScheduleRequest() {

    const token = 'Bearer ' + localStorage.getItem('token')

    const url = 'http://192.168.1.50:8080/api/v1/schedule';

    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
    })
}


export default function ManagerScheduleGenerator() {

    const dotStyle = css`
        display: flex;
        margin: 0 auto;
        border-color: red;`;

    const dateParser = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const asdfasdf = () => {
        const values = inputsRef.current.map((inputSet) => ({
            from: inputSet.from.value,
            to: inputSet.to.value,
            minEmployees: inputSet.minEmployees.value,
            maxEmployees: inputSet.maxEmployees.value,
        }));
        console.log(values);
    };


    const classes = useStyles();
    const [fromDate, setFromDate] = useState(null)
    const [loading, setLoading] = useState(false);
    const [periods, setPeriods] = useState([1]);

    const handleAddPeriods = () => {
        setPeriods([...periods, periods.length + 1]);
    };

    const handleRemovePeriods = () => {
        if (periods.length > 1) {
            setPeriods(periods.slice(0, -1));
        }
    };


    const handleSubmit = async e => {
        e.preventDefault();

        const from = dateParser(fromDate)

        setLoading(true)
        const response = await generateScheduleRequest(from);

        if (response.ok) {
            setLoading(false)
            let result = response.json()
            result.then((data) => {
                let errorMsg = ``
                for (let i = 0; i < data.length; i++) {
                    errorMsg = errorMsg + `\nErrors for day: ${data[i].day}\n` + data[i].errorMessage
                }
                Swal.fire("Success", errorMsg, "success").then(() => {
                    window.location.href = "/manager-dashboard/schedule";
                })
            })

        } else {
            setLoading(false)
            await Swal.fire("Failed", "Errors", "error");
        }
    }


    const handleFromDateChange = (date) => {
        setFromDate(date);
    };

    const formStyle = {
        borderRadius: '25px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -80%)',
        width: 800,
        backgroundColor: '#FFF',
        marginLeft: '5vh',
        padding: '2vh',
        alignContent: 'center',
        p: 4,
    };

    return (
        <div className='grid-container'>
            <ManagerSidebar/>
            <div style={formStyle}>
                <DotLoader loading={loading} css={dotStyle} size={60} color="#36D7B7"/>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Typography component="h1" variant="h4" style={{padding: '3vh'}}>
                        Generate schedule
                    </Typography>
                    <br></br>
                    <Typography component="h5" variant="h5">
                        Select date:
                    </Typography>
                    <DatePicker
                        showIcon
                        selected={fromDate}
                        onChange={handleFromDateChange}
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        showYearDropdown
                        showMonthYearDropdown/>
                    <Autocomplete
                        disablePortal
                        id="combo-box-org"
                        options={organizations()}
                        sx={{width: 200}}
                        renderInput={(params) => <TextField {...params} label="Select organization"/>}
                    />
                    <Typography component="h5" variant="h6">
                        Fill schedule periods:
                    </Typography>
                    <div>
                        {periods.map((period, index) => (
                            <div key={index} id={`periods-${index}`}>
                                <Autocomplete
                                    disablePortal
                                    id={`combo-box-from-${index}`}
                                    options={hours()}
                                    sx={{width: 200}}
                                    renderInput={(params) => <TextField {...params} label="From"/>}
                                />
                                <Autocomplete
                                    disablePortal
                                    id={`combo-box-to-${index}`}
                                    options={hours()}
                                    sx={{width: 200}}
                                    renderInput={(params) => <TextField {...params} label="To"/>}
                                />
                                <Autocomplete
                                    id={`controllable-states-min-employees-${index}`}
                                    options={options}
                                    sx={{width: 200}}
                                    renderInput={(params) => <TextField {...params} label="Minimum Employees"/>}
                                />
                                <Autocomplete
                                    id={`controllable-states-max-employees-${index}`}
                                    options={options}
                                    sx={{width: 200}}
                                    renderInput={(params) => <TextField {...params} label="Maximum employees"/>}
                                />
                                <hr></hr>
                            </div>
                        ))}
                        <Button onClick={handleAddPeriods} variant="contained" color="primary">
                            Add Periods
                        </Button>
                        <Button onClick={handleRemovePeriods} variant="contained" color="secondary">
                            Remove Periods
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={asdfasdf}
                        className={classes.submit}>Generate</Button>
                </form>
            </div>
        </div>
    );
}