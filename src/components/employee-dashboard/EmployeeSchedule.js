import React, {useCallback, useEffect, useMemo, useState} from 'react';
import EmployeeSidebar from "./EmployeeSidebar";
import {Calendar, momentLocalizer, Views} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Modal} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import swal from "sweetalert";
import CustomToolbar from "../CustomToolbar";
import moment from "moment";

const EmployeeSchedule = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [stopTime, setStopTime] = useState('');
    const [events, setEvents] = useState([]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const addDispositionRequest = async (bodyContent) => {

        const token = 'Bearer ' + localStorage.getItem('token')

        return fetch('http://192.168.1.50:8080/api/v1/dispositions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(bodyContent),
        }).then(data => {
            return data.json();
        })
    }

    const getDispositionsRequest = async () => {

        const token = 'Bearer ' + localStorage.getItem('token')

        const from = new Date();
        from.setMonth(from.getMonth() - 2);
        const fromDate = from.toISOString().split('T')[0];

        const to = new Date();
        to.setMonth(to.getMonth() + 2);
        const toDate = to.toISOString().split('T')[0];

        const url = 'http://192.168.1.50:8080/api/v1/dispositions/' +
            localStorage.getItem('employeeCode') +
            `?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`;

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        }).then(data => {
            return data.json();
        })
    }

    const getSchedulesRequest = async () => {
        const token = 'Bearer ' + localStorage.getItem('token');

        const from = new Date();
        from.setMonth(from.getMonth() - 2);
        const fromDate = from.toISOString().split('T')[0];

        const to = new Date();
        to.setMonth(to.getMonth() + 2);
        const toDate = to.toISOString().split('T')[0];

        const url = 'http://192.168.1.50:8080/api/v1/schedule' + `?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        return await response.json();
    };

    const addDispositionsToCalendar = async () => {

        const result = await getDispositionsRequest()

        const eventList = []

        for (let i = 0; i < result.length; i++) {
            const currentDisposition = result[i];
            const event = {
                title: currentDisposition.employeeCode + " " + currentDisposition.start + " to " + currentDisposition.stop,
                start: parseDateTimeString(currentDisposition.day, currentDisposition.start),
                end: parseDateTimeString(currentDisposition.day, currentDisposition.stop),
                backgroundColor: 'green'
            };
            eventList.push(event)
        }

        setEvents(prv => [...prv, ...eventList]);
    }

    const addScheduleToCalendar = async () => {

        const result = await getSchedulesRequest()

        const eventList = []
        const filteredSchedules = result.filter(schedule => schedule !== null);


        for (let i = 0; i < filteredSchedules.length; i++) {
            for (let j = 0; j < filteredSchedules[i].dispositionDtos.length; j++) {
                const currentDisposition = filteredSchedules[i].dispositionDtos[j];

                const event = {
                    title: currentDisposition.employeeCode + " " + currentDisposition.start + " to " + currentDisposition.stop,
                    start: parseDateTimeString(currentDisposition.day, currentDisposition.start),
                    end: parseDateTimeString(currentDisposition.day, currentDisposition.stop),
                    backgroundColor: 'red'
                };

                eventList.push(event)
            }
        }
            setEvents(prv => [...prv, ...eventList]);
    }

    function parseDateTimeString(dateString, timeString) {
        const [year, month, day] = dateString.split('-').map(Number);
        const [hours, minutes] = timeString.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    }

    useEffect(() => {
        addDispositionsToCalendar()
        addScheduleToCalendar()
        return () => {};
    },[]);

    const handleSubmitDisposition = async e => {
        e.preventDefault();
        const body = {
            'employeeCode': localStorage.getItem('employeeCode'),
            'day': selectedDate,
            'start': startTime,
            'stop': stopTime
        }

        const result = await addDispositionRequest(body)

        if (result != null) {
            await swal("Success", "Disposition added", "success", {
                buttons: false,
                timer: 2000,
            })
        } else {
            await swal("Error", "Something went wrong", "error")
        }
        window.location.reload(false);
    }

    const handleSelectSlot = useCallback(({start, end}) => {

        const inputDate = start.toLocaleDateString('en-GB')
        const parts = inputDate.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        const formattedDate = `${year}-${month}-${day}`;

        setSelectedDate(formattedDate)
        openModal()
    }, [...events])

    const handleModalClosed = useCallback((event) => closeModal(), [])

    const {defaultDate, scrollToTime} = useMemo(() => ({
        defaultDate: new Date(), scrollToTime: new Date(new Date().getFullYear())
    }), [])

    const localizer = momentLocalizer(moment);

    const modalStyle = {
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

    const EventComponent = ({event}) => (
        <div style={{backgroundColor: event.backgroundColor, textAlign: 'center'}}>
            {event.title}
        </div>
    );

    return (
        <div className='grid-container'>
            <EmployeeSidebar/>
            <div className='disposition'>
                <div className="height600">
                    <Calendar
                        defaultDate={defaultDate}
                        defaultView={Views.MONTH}
                        events={events}
                        components={{toolbar: CustomToolbar, event: EventComponent}}
                        localizer={localizer}
                        onSelectEvent={handleSelectSlot}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        scrollToTime={scrollToTime}
                        style={{height: '100vh', width: '160vh', padding: '5vh'}}
                    />
                </div>
            </div>
            <Modal
                isopen={modalIsOpen}
                contentLabel="Formularz"
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                open={modalIsOpen}
                center>
                <div style={modalStyle}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{float: 'right', cursor: 'pointer'}}
                        onClick={handleModalClosed}>
                        X
                    </Button>
                    <br></br>
                    <form>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            id="selectedDate"
                            name="selectedDate"
                            label="Date"
                            value={selectedDate}
                        />
                        <br></br>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            id="startTime"
                            name="startTime"
                            label="From"
                            onChange={e => setStartTime(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            id="stopTime"
                            name="stopTime"
                            label="To"
                            onChange={e => setStopTime(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{float: 'right', cursor: 'pointer', width: '100%'}}
                            onClick={handleSubmitDisposition}>
                            Submit
                        </Button>
                    </form>
                </div>
            </Modal>
        </div>);
};

export default EmployeeSchedule;