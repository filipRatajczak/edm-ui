import React, {useEffect, useState} from 'react'
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import EmployeeSidebar from "./ManagerSidebar";
import Typography from "@material-ui/core/Typography";

function ManagerHome() {

    const [timeEntries, setTimeEntries] = useState([]);

    const getDispositionRequest = async () => {
        const token = 'Bearer ' + localStorage.getItem('token')

        const from = new Date();
        from.setMonth(from.getMonth()-1);
        const fromDate = from.toISOString().split('T')[0];

        const toDate = new Date().toISOString().split('T')[0];

        const url = 'http://192.168.1.50:8080/api/v1/timeEntries/' +
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

    function calculateHoursDifference(startTime, stopTime) {

        const startDate = new Date(`2000-01-01T${startTime}:00`);
        const stopDate = new Date(`2000-01-01T${stopTime}:00`);

        const timeDifference = stopDate - startDate;
        return timeDifference / (1000 * 60 * 60);
    }

    useEffect(() => {
        async function fillSelect() {
            const response = await getDispositionRequest();

            const chartData = []

            if (response.ok) {
                let result = response.json()

                result.then((data) => {
                    for (let i= 0; i < data.length; i++) {
                        let dataa = {
                            name: data[i].day,
                            time: calculateHoursDifference(data[i].start, data[i].stop)
                        }
                        chartData.push(dataa)
                    }

                    console.log(chartData)
                    setTimeEntries(chartData)
                })
            }
        }

        fillSelect()
    }, []);

    return (
        <div className='grid-container'>
            <EmployeeSidebar/>
            <main className='main-container'>
                <Typography component="h1" variant="h4" style={{padding: '3vh', color: 'black', textAlign: 'center'}}>
                    Hello {localStorage.getItem('employeeCode')}! Below you can find chart with your working hours for last 30 days.
                </Typography>
                <div className='charts' >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            width={500}
                            height={300}
                            data={timeEntries}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Line type="monotone" dataKey="time" stroke="#8884d8" activeDot={{r: 8}}/>

                        </LineChart>
                    </ResponsiveContainer>

                </div>
            </main>
        </div>
    );
}

export default ManagerHome