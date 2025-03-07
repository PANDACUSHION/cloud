const express = require('express');

const { authenticate , authorizeAdmin } = require('../middlewares/auth');
const {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getUserAppointments,
    getAppointmentById,
} = require('../controllers/appointmentController');

const router = express.Router();

// Route to create a new appointment
router.post('/appointment',authenticate,authorizeAdmin, createAppointment);

// Route to update an appointment (status or time)
router.put('/appointment',authenticate,authorizeAdmin, updateAppointment);

// Route to delete an appointment
router.delete('/appointment',authenticate,authorizeAdmin, deleteAppointment);

// Route to get all appointments for a specific user
router.get('/user/:userId/appointments',authenticate,authorizeAdmin, getUserAppointments);

// Route to get a specific appointment by ID
router.get('/appointment/:appointmentId',authenticate,authorizeAdmin, getAppointmentById);

module.exports = router;
