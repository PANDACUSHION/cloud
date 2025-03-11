const express = require('express');

const { authenticate , authorizeAdmin } = require('../middlewares/auth');
const {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getUserAppointments,
    getAppointmentById,
    getAppointments
} = require('../controllers/appointmentController');

const router = express.Router();

// Route to create a new appointment
router.post('/appointment',authenticate,createAppointment);

// Route to update an appointment (status or time)
router.put('/appointment/:appointmentId',authenticate,authorizeAdmin, updateAppointment);

//get all appointments
router.get('/appointment',authenticate,authorizeAdmin, getAppointments);
// Route to delete an appointment
router.delete('/appointment',authenticate,authorizeAdmin, deleteAppointment);

// Route to get all appointments for a specific user
router.get('/user/:userId/appointments',authenticate,authorizeAdmin, getUserAppointments);

// Route to get a specific appointment by ID
router.get('/appointment/:appointmentId',authenticate,getAppointmentById);

module.exports = router;
