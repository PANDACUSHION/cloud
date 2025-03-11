const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new appointment
const createAppointment = async (req, res) => {
    try {
        let { userId, description, appointmentTime, appointmentType, appointmentWith } = req.body;

        // Ensure all required fields are provided
        if (!userId || !description || !appointmentTime || !appointmentWith) {
            return res.status(400).json({ error: "All fields are required: userId, description, appointmentTime, appointmentWith." });
        }

        // Convert appointmentTime to a valid Date format
        const parsedTime = new Date(appointmentTime);
        if (isNaN(parsedTime.getTime())) {
            return res.status(400).json({ error: "Invalid appointmentTime format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)." });
        }

        // Default appointmentType if not provided
        appointmentType = appointmentType || "GENERAL";

        // Create the appointment
        const appointment = await prisma.appointment.create({
            data: {
                userId,
                description,
                appointment_time: parsedTime,
                appointment_type: appointmentType,
                appointment_status: 'PENDING',
                appointment_with: appointmentWith,
            },
        });

        return res.status(201).json({ message: "Appointment created successfully.", appointment });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return res.status(500).json({ error: "Something went wrong while creating the appointment." });
    }
};
const updateAppointment = async (req, res) => {
    const { userId, status, appointmentTime } = req.body;
    const { appointmentId } = req.params; // Access appointmentId from URL parameters
    console.log(req.body);
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
    const { appointmentId } = req.body; // We are not checking for userId in the body since it's available in req.user after authentication

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

        // Check if the logged-in user is an admin or the owner of the appointment
        if (req.user.role !== 'admin' && appointment.userId !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own appointments or be an admin.' });
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

const getAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany(); // Fetch all appointments
        if (appointments.length === 0) {
            return res.status(204).json({ error: 'No appointments found.' });
        }
        console.log(appointments);
        return res.status(200).json(appointments); // Return the list of appointments
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while fetching the appointments.' });
    }
}

module.exports = {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getUserAppointments,
    getAppointmentById,
    getAppointments,
};
