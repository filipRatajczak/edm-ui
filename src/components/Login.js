import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    paper: {
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        margin: 0,
        backgroundColor: "black",
    },
    form: {
        width: '35%',
        marginTop: 0,
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Add a subtle box shadow for depth
        borderRadius: '8px', // Optional: Add rounded corners for a softer look
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex'
    },
    submit: {
        margin: 0,
    },
}));

async function loginRequest(credentials) {
    return fetch('http://192.168.1.50:8080/api/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => {
        return data.json()
    })
}

export default function SignIn() {
    const classes = useStyles();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();


    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginRequest({
            email,
            password
        });

        if (response.token != null) {
            Swal.fire("Success", "Good credentials", "success", {
                buttons: false,
                timer: 2000,
            })
                .then((value) => {
                    localStorage.setItem('token', response['token']);
                    localStorage.setItem('role', response['role']);
                    localStorage.setItem('email', response['email']);
                    localStorage.setItem('employeeCode', response['employeeCode']);
                    if (response.role === 'EMPLOYEE') {
                        window.location.href = "/employee-dashboard/home";
                    } else if (response.role === 'MANAGER') {
                        window.location.href = "/manager-dashboard/home";
                    }
                });
        } else {
            Swal.fire("Failed", "Wrong credentials", "error");

        }
    }

    return (
        <>
            <div className={classes.paper}>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <img src={require(`./EDM_LOGO.PNG`)}
                         alt={"EDM logo"}
                         style={{width: '300px', height: '250px'}}/>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="email"
                        name="email"
                        label="Email Address"
                        onChange={e => setEmail(e.target.value)}
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}>Sign in</Button>
                </form>
            </div>

            <div>
                Scheduling is easy. To receive manager account for testing purposes send me email to filipratajczak1@gmail.com
                Or enjoy with free account
            </div>
        </>
    );
}