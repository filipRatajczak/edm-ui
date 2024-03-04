import React, {useEffect, useState} from 'react';
import ManagerSidebar from "./EmployeeSidebar";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
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

const EmployeeDeleteDisposition = () => {

    const classes = useStyles();
    const [disposition, setDisposition] = useState([]);
    const [selectedDisposition, setSelectedDisposition] = useState('');


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
    const getDispositionRequest = async () => {
        const token = 'Bearer ' + localStorage.getItem('token')

        const from = new Date();
        from.setMonth(from.getMonth());
        const fromDate = from.toISOString().split('T')[0];

        const to = new Date();
        to.setMonth(to.getMonth() + 2);
        const toDate = to.toISOString().split('T')[0];

        const url = 'http://192.168.1.50:8080/api/v1/dispositions/' +
            localStorage.getItem('employeeCode') +
            `?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`;

        return await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });
    }

    const deleteTimeEntryRequest = async () => {
        const token = 'Bearer ' + localStorage.getItem('token')

        const url = 'http://192.168.1.50:8080/api/v1/dispositions/' + selectedDisposition;

        return await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            }
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const response = await deleteTimeEntryRequest();

        if (response.ok) {
            await swal("Success", "Disposition deleted.", "success", {
                buttons: false,
                timer: 2000,
            })
        } else {
            swal("Failed", "Error", "error");
        }

    }

    useEffect(() => {
        async function fillSelect() {
            const response = await getDispositionRequest();

            if (response.ok) {
                let result = response.json()
                result.then((data) => {
                    setDisposition(data)
                })
            }
        }

        fillSelect()
    }, []);

    const handleDispositionChange = (event) => {
        setSelectedDisposition(event.target.value);
    };

    return (
        <div className='grid-container'>
            <ManagerSidebar/>
            <div style={formStyle}>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Typography component="h1" variant="h4" style={{padding: '3vh'}}>
                        Delete disposition
                    </Typography>
                    <Typography component="h5" variant="h6">
                        Select disposition:
                    </Typography>
                    <select
                        id="employeeSelect"
                        value={selectedDisposition}
                        onChange={handleDispositionChange}>
                        <option value="">Select a disposition</option>
                        {disposition.map((disposition) => (
                            <option key={disposition.id} value={disposition.id}>
                                Day: {disposition.day} | From: {disposition.start} To: {disposition.stop}
                            </option>
                        ))}
                    </select>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}>Submit</Button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeDeleteDisposition;