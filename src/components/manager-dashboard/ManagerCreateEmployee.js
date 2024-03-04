import React, {useState} from 'react';
import ManagerSidebar from "./ManagerSidebar";

import Typography from "@material-ui/core/Typography";
// import DatePicker from "react-datepicker";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'

import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";


const useStyles = makeStyles((theme) => ({
    form: {
        marginTop: theme.spacing(1),
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        display: 'inline-block',
        flexDirection: 'column',
        padding: '5vh'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    div: {
        borderRadius: '25px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        backgroundColor: '#FFF',
        marginLeft: '5vh',
        padding: '2vh',
        alignContent: 'center',
        p: 4,
    },
    formInput: {
        marginLeft: "5vh",
        marginBottom: '2vh',
        marginRight: '5vh'
    }
}));

const ManagerSettings = () => {

    const classes = useStyles();

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [email, setEmail] = useState("")
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("")
    const [employeeCode, setEmployeeCode] = useState("");

    // const formRef = useRef();

    const postEmployeeRequest = async () => {
        const token = 'Bearer ' + localStorage.getItem('token')

        const url = 'http://192.168.1.50:8080/api/v1/employees';

        const requestBody = {
            "firstName": firstName,
            "lastName": lastName,
            "address": address,
            "phoneNumber": phoneNumber,
            "email": email,
            "birthday": dateParser(birthday),
            "password": password,
            "employeeCode": employeeCode
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

        const response = await postEmployeeRequest();

        if (response.ok) {
            await swal("Success", "Employee added.", "success", {
                buttons: false,
                timer: 2000,
            })
        } else {
            swal("Failed", "Error", "error");
        }
        formRef.current.reset();
    }


    const dateParser = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const handleBirthdayChange = (date) => {
        setBirthday(date);
    };

    const Row = ({children}) => {
        return (
            <div style={{
                display: 'flex',
                // marginBottom: '2vh',
                // marginLeft: '5vh',
                width: '100%',
            }}>
                {children}
            </div>
        );
    };

    return (
        <div className='grid-container'>
            <ManagerSidebar/>
            <div className={classes.div}>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Typography component="h1" variant="h4" style={{padding: '3vh', textAlign: 'center'}}>
                        Create employee
                    </Typography>
                    <TextField


                        variant="outlined"
                        margin="normal"
                        required
                        id="employeeCode"
                        name="employeeCode"
                        label="Employee code"
                        onChange={e => setEmployeeCode(e.target.value)}
                    /><br></br>
                    <Row>
                        <TextField

                            variant="outlined"
                            margin="normal"
                            required
                            id="firstName"
                            name="firstName"
                            label="First name"
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <TextField

                            variant="outlined"
                            margin="normal"
                            required
                            id="lastName"
                            name="lastName"
                            label="Last name"
                            onChange={e => setLastName(e.target.value)}
                        />
                    </Row>
                    <br></br>
                    <Row>
                        <TextField

                            variant="outlined"
                            margin="normal"
                            required
                            id="address"
                            name="address"
                            label="Address"
                            onChange={e => setAddress(e.target.value)}
                        />
                        <TextField

                            variant="outlined"
                            margin="normal"
                            required
                            id="phoneNubmer"
                            name="phoneNubmer"
                            label="Phone number"
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </Row>
                    <br></br>
                    <TextField

                        variant="outlined"
                        margin="normal"
                        required
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <br></br>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker

                            label="Birthday"
                            onChange={handleBirthdayChange}
                        />
                    </LocalizationProvider>
                    <br></br>
                    <Row>
                        <TextField

                            variant="outlined"
                            margin="normal"
                            required
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <TextField

                            variant="outlined"
                            margin="normal"
                            required
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Row>
                    <br></br>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}>Create
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ManagerSettings;