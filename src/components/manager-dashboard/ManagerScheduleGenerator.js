import React, {useState} from 'react';
import ManagerSidebar from "./ManagerSidebar";
import swal from "sweetalert";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {DotLoader} from 'react-spinners';
import {css} from '@emotion/react';

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


async function generateScheduleRequest(fromDate, toDate) {

    const token = 'Bearer ' + localStorage.getItem('token')

    const url = 'http://192.168.1.50:8080/api/v1/schedule' + `?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`;

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
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const classes = useStyles();

    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [loading, setLoading] = useState(false); // Set to true initially


    const handleSubmit = async e => {
        e.preventDefault();

        const from = dateParser(fromDate)
        const to = dateParser(toDate)

        setLoading(true)
        const response = await generateScheduleRequest(from, to);

        if (response.ok) {
            setLoading(false)
            let result = response.json()
            result.then((data) => {
                let errorMsg = ``
                for (let i = 0; i < data.length; i++) {
                    errorMsg = errorMsg + `\nErrors for day: ${data[i].day}\n` + data[i].errorMessage
                }
                swal("Success", errorMsg, "success").then((value) => {
                    window.location.href = "/manager-dashboard/schedule";
                })
            })

        } else {
            setLoading(false)
            swal("Failed", "Errors", "error");
        }
    }


    const handleFromDateChange = (date) => {
        setFromDate(date);
    };
    const handleToDateChange = (date) => {
        setToDate(date);
    };


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
                        From:
                    </Typography>
                    <DatePicker
                        showIcon
                        selected={fromDate}
                        onChange={handleFromDateChange}
                        dateFormat="yyyy-MM-dd"
                        isClearable // Add a clear button
                        showYearDropdown // Show a dropdown to select the year
                    />
                    <Typography component="h5" variant="h5">
                        To:
                    </Typography>
                    <DatePicker
                        showIcon
                        selected={toDate}
                        onChange={handleToDateChange}
                        isClearable // Add a clear button
                        showYearDropdown // Show a dropdown to select the year
                        dateFormat="yyyy-MM-dd"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}>Generate</Button>
                </form>
            </div>
        </div>
    );
}