const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new appointment
const createAppointment = async (req, res) => {
    const { userId, description, appointmentTime, appointmentType, appointmentWith } = req.body;

    try {
        // Create the appointment
        const appointment = await prisma.appointment.create({
            data: {
                userId,
                description,
                appointment_time: appointmentTime,
                appointment_type: appointmentType,
                appointment_status: 'PENDING', // Default status is PENDING
                appointment_with: appointmentWith,
            },
        });

        return res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while creating the appointment.' });
    }
};

// Update an appointment (e.g., change the status or time)
const updateAppointment = async (req, res) => {
    const { appointmentId, userId, status, appointmentTime } = req.body;

    try {
        // Find the appointment
        const appointment = await prisma.appointment.findUnique({
            where: {
                id: appointmentId,
            },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        if (appointment.userId !== userId) {
            return res.status(403).json({ error: 'You can only update your own appointments.' });
        }

        // Update the appointment
        const updatedAppointment = await prisma.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                appointment_status: status || appointment.appointment_status,
                appointment_time: appointmentTime || appointment.appointment_time,
            },
        });

        return res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while updating the appointment.' });
    }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
    const { appointmentId, userId } = req.body;

    try {
        // Find the appointment
        const appointment = await prisma.appointment.findUnique({
            where: {
                id: appointmentId,
            },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        if (appointment.userId !== userId) {
            return res.status(403).json({ error: 'You can only delete your own appointments.' });
        }

        // Delete the appointment
        await prisma.appointment.delete({
            where: {
                id: appointmentId,
            },
        });

        return res.status(200).json({ message: 'Appointment deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while deleting the appointment.' });
    }
};

// Get all appointments for a specific user
const getUserAppointments = async (req, res) => {
    const { userId } = req.params;

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                userId,
            },
            include: {
                user: true, // Include the user who created the appointment
            },
        });

        return res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while fetching appointments.' });
    }
};

// Get a specific appointment by ID
const getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointment = await prisma.appointment.findUnique({
            where: {
                id: appointmentId,
            },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        return res.status(200).json(appointment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while fetching the appointment.' });
    }
};

module.exports = {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getUserAppointments,
    getAppointmentById,
};
