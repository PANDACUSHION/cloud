export const createAppointment = async (appointmentData) => {
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            throw new Error('Failed to create appointment');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export default { createAppointment };