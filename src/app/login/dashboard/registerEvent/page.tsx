"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';

const EventRegistration = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        eventTitle: '',
        department: '',
        eventOrganizer: '',
        numOfParticipants: '',
        eventDate: '',
        eventDescription: '',
        participantList: null as File | null,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormData((prevState) => ({ ...prevState, participantList: files[0] }));
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission logic
        console.log('Form submitted:', formData);
    };

    const handleCancel = () => {
        router.back(); 
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="flex justify-between items-center p-4 bg-white shadow">
                <div className="text-lg font-bold">Event Registration</div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <div className="text-sm font-medium">Jane Doe</div>
                        <div className="text-xs text-gray-500">jane.doe@email.com</div>
                    </div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
            </header>
            <main className="p-4">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Event Title*</label>
                            <input
                                className="w-full px-3 py-2 border rounded"
                                type="text"
                                name="eventTitle"
                                value={formData.eventTitle}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Department</label>
                            <select
                                className="w-full px-3 py-2 border rounded"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="">Choose your department</option>
                                <option value="dept1">Department 1</option>
                                <option value="dept2">Department 2</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Event Organizer*</label>
                            <input
                                className="w-full px-3 py-2 border rounded"
                                type="text"
                                name="eventOrganizer"
                                value={formData.eventOrganizer}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">No. of Participants*</label>
                            <input
                                className="w-full px-3 py-2 border rounded"
                                type="number"
                                name="numOfParticipants"
                                value={formData.numOfParticipants}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Event Date*</label>
                            <input
                                className="w-full px-3 py-2 border rounded"
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">List of Participants*</label>
                            <input
                                className="w-full px-3 py-2 border rounded"
                                type="file"
                                name="participantList"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm mb-1">Event Description*</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded"
                            name="eventDescription"
                            value={formData.eventDescription}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button className="px-4 py-2 bg-gray-300 rounded" type="button" onClick={handleCancel}>Cancel</button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Next</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EventRegistration;
