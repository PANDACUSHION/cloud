const express = require('express');
const {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getUserAppointments,
    getAppointmentById,
} = require('../controllers/appointmentController');

const router = express.Router();

// Route to create a new appointment
router.post('/appointment', createAppointment);

// Route to update an appointment (status or time)
router.put('/appointment', updateAppointment);

// Route to delete an appointment
router.delete('/appointment', deleteAppointment);

// Route to get all appointments for a specific user
router.get('/user/:userId/appointments', getUserAppointments);

// Route to get a specific appointment by ID
router.get('/appointment/:appointmentId', getAppointmentById);

module.exports = router;
