"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiConfig from '../../../../components/backend/apiConfig';
import UserHeader from '../../../../components/ui/UserHeader';

const EventRegistration = () => {
    const router = useRouter();
    const [step, setStep] = useState(1); // Step 1: Event info, Step 2: Upload list of participants
    const [eventData, setEventData] = useState({
        eventName: '',
        venue: '',
        startDateTime: '',
        endDateTime: '',
        eventDescription: '',
        organizationId: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setEventData((prevState) => ({
                ...prevState,
                organizationId: user.organizationId,
            }));
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEventData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiConfig.apiBaseUrl}/api/event`, eventData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 201)  {
                setSuccessMessage('Event created successfully!');
                setErrorMessage('');
            } else {
                setErrorMessage('Signup failed');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response);
            } else {
                console.error('Error', error);
                setErrorMessage('An error occured during event register');
            }
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="min-h-screen">
            <UserHeader/>
            <main className="p-4">
                {step == 1 && (
                    <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-white p-6 rounded shadow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1" htmlFor="eventName">Event Name</label>
                                <input
                                    className="w-full px-3 py-2 border rounded"
                                    id="eventName"
                                    name="eventName"
                                    type="text"
                                    placeholder="Enter event name"
                                    value={eventData.eventName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1" htmlFor="venue">Event Venue</label>
                                <input
                                    className="w-full px-3 py-2 border rounded"
                                    id="venue"
                                    name="venue"
                                    type="text"
                                    placeholder="Enter event venue"
                                    value={eventData.venue}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1" htmlFor="startDateTime">Start of Event Date</label>
                                <input
                                    className="w-full px-3 py-2 border rounded"
                                    id="startDateTime"
                                    type="date"
                                    name="startDateTime"
                                    value={eventData.startDateTime}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1" htmlFor="endDateTime">End of Event Date</label>
                                <input
                                    className="w-full px-3 py-2 border rounded"
                                    id="endDateTime"
                                    type="date"
                                    name="endDateTime"
                                    value={eventData.endDateTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm mb-1" htmlFor="eventDescription">Event Description*</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded"
                                id="eventDescription"
                                name="eventDescription"
                                placeholder="Enter event description"
                                value={eventData.eventDescription}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button className="px-4 py-2 bg-gray-300 rounded" type="button" onClick={handleCancel}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Next</button>
                        </div>
                    </form>
                )}
                {step == 2 &&(
                    <form onSubmit={handleSubmit}>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button className="px-4 py-2 bg-gray-300 rounded" type="button" onClick={() => setStep(1)}>Back</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Register Event</button>
                        </div>
                    </form>
                )}
                {successMessage && (
                <div className="mt-4 text-green-500">
                    {successMessage}
                </div>
                )}
                {errorMessage && (
                    <div className="mt-4 text-red-500">
                        {errorMessage}
                    </div>
                )}
            </main>
        </div>
    );
};

export default EventRegistration;
