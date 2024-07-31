"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import UserHeader from '@/components/ui/UserHeader';

const EventRegistration = () => {
    const router = useRouter();
    const [eventData, setEventData] = useState({
        eventName: '',
        venue: '',
        startDateTime: '',
        endDateTime: '',
        eventDescription: '',
        organizationId: 0,
        certificateFile: null as File | null,
    });
    const [certificateFile, setCertificateDesign] = useState<File | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log(storedUser);
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
        setEventData((prevState) => ({
            ...prevState,
            [name]: name === 'organizationId' ? parseInt(value, 10) : value
        }));
    };

    const handleCertificateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setCertificateDesign(file); 
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('eventName', eventData.eventName);
        formData.append('venue', eventData.venue);
        formData.append('startDateTime', eventData.startDateTime);
        formData.append('endDateTime', eventData.endDateTime);
        formData.append('eventDescription', eventData.eventDescription);
        formData.append('organizationId', eventData.organizationId.toString());
        if (certificateFile) {
            formData.append('certificateFile', certificateFile);
        }
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                setSuccessMessage('Event created successfully!');
                setErrorMessage('');
                const eventId = response.data.id;
                router.push(`/login/dashboard/registerEvent/certificateTemplate?eventId=${eventId}`);
            } else {
                setErrorMessage('Event creation failed');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response);
            } else {
                console.error('Error', error);
                setErrorMessage('An error occurred during event registration');
            }
        }
    };
    
    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="min-h-screen">
            <UserHeader/>
            <main className="flex flex-col items-center justify-center flex-grow p-4">
                <form onSubmit={handleSubmit} className="bg-white p-6">
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
                    <div className="flex flex-col items-center justify-center border-2 border-dashed p-4">
                        <label className="block text-m mb-2" htmlFor="certificateFile">Upload Certificate Design</label>
                        <input
                            id="certificateFile"
                            type="file"
                            accept="image/*"
                            className="visible"
                            onChange={handleCertificateChange}
                        />
                        {certificateFile && (
                            <div className="mt-4">
                                <img src={URL.createObjectURL(certificateFile)} alt="Certificate Preview" className="w-full max-w-sm" />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Register Event
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                            {errorMessage}
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
};

export default EventRegistration;
