"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import UserHeader from '@/components/ui/UserHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { CiCalendar } from "react-icons/ci";
import { Calendar } from "@/components/ui/calendar"
import { PiCertificate } from "react-icons/pi";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, startOfDay, endOfDay } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { toZonedTime, format as formatZoned } from 'date-fns-tz';
import LoadingDots from '@/components/ui/loading-dots';

const EventRegistration = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [startDate, setStartDate] = React.useState<Date>();
    const [endDate, setEndDate] = React.useState<Date>();
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
    const [isLoading, setIsLoading] = useState(false);

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

        // Set default dates to current date in Philippine timezone
        const philippinesTimeZone = 'Asia/Manila';
        const now = new Date();
        setStartDate(toZonedTime(now, philippinesTimeZone));
        setEndDate(toZonedTime(now, philippinesTimeZone));
        setEventData((prevState) => ({
            ...prevState,
            startDateTime: formatZoned(now, 'yyyy-MM-dd', { timeZone: philippinesTimeZone }),
            endDateTime: formatZoned(now, 'yyyy-MM-dd', { timeZone: philippinesTimeZone }),
        }));
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEventData((prevState) => {
            const newEventData = {
                ...prevState,
                [name]: name === 'organizationId' ? parseInt(value, 10) : value
            };

            console.log("Before")
            console.log(newEventData.endDateTime)
            console.log(newEventData.startDateTime)

            // Validate date times to ensure endDateTime is always after startDateTime
            if (name === 'startDateTime') {
                const startDateTime = new Date(newEventData.startDateTime);
                const endDateTime = new Date(newEventData.endDateTime);

                if (endDateTime <= startDateTime) {
                    newEventData.endDateTime = newEventData.startDateTime;
                    setEndDate(startDateTime); // Update endDate state
                }
            } else if (name === 'endDateTime') {
                const startDateTime = new Date(newEventData.startDateTime);
                const endDateTime = new Date(newEventData.endDateTime);

                if (endDateTime <= startDateTime) {
                    newEventData.endDateTime = newEventData.startDateTime;
                    setEndDate(startDateTime); // Update endDate state
                }
            }
            console.log("AFTER")
            console.log(newEventData.endDateTime)
            console.log(newEventData.startDateTime)


            return newEventData;
        });
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
        setIsLoading(true)

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
            console.log(response);
            if (response.status === 201) {
                toast({
                    title: "Event created successfully!",
                    className: "bg-green-500 text-white"
                });
                const eventId = response.data.id;
                router.push(`/edit-certificate?eventId=${eventId}`);
            } else {
                toast({
                    title: "Event creation failed!",
                    description: "Please check all information",
                    className: "bg-green-500 text-white"
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 400 && error.response.data.errors) {
                    const validationErrors = error.response.data.errors;
                    Object.keys(validationErrors).forEach((field) => {
                        validationErrors[field].forEach((errorMessage: string) => {
                            toast({
                                title: `Oops! Missing data`,
                                description: errorMessage,
                                className: "bg-red-500 text-white"
                            });
                        });
                    });
                } else {
                    toast({
                        title: "Failed to create event",
                        description: error.response?.data.message || "An unknown error occurred",
                        className: "bg-red-500 text-white"
                    });
                }
            } else {
                toast({
                    title: "Failed to create event!",
                    description: "An unexpected error occurred.",
                    className: "bg-red-500 text-white"
                });
            }
        }
        setIsLoading(false)
    };


    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="min-h-screen mx-20">
            <UserHeader />
            <main className="flex justify-center p-4">
                <div className='flex w-full max-w-6xl'>
                    <form onSubmit={handleSubmit} className="bg-white p-6 space-y-4">
                        <div>
                            <Label className="block text-sm mb-1" htmlFor="eventName">Event Name</Label>
                            <Input

                                className="w-full px-3 py-2 border rounded"
                                id="eventName"
                                name="eventName"
                                type="text"
                                // placeholder="Enter event name"
                                value={eventData.eventName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label className="block text-sm mb-1" htmlFor="venue">Event Venue</Label>
                            <Input

                                className="w-full px-3 py-2 border rounded"
                                id="venue"
                                name="venue"
                                type="text"
                                // placeholder="Enter event venue"
                                value={eventData.venue}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className='space-y-1'>
                                <Label htmlFor="startDateTime">Start of Event</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !startDate && "text-muted-foreground"
                                        )}>
                                            <CiCalendar className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                setStartDate(date);
                                                if (date) {
                                                    setEventData(prev => ({ ...prev, startDateTime: format(date, "yyyy-MM-dd") }));
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {/* <Input
                                className="w-full px-3 py-2 border rounded"
                                id="startDateTime"
                                type="date"
                                name="startDateTime"
                                value={eventData.startDateTime}
                                onChange={handleChange}
                            /> */}
                            </div>
                            <div className='space-y-1'>
                                <Label htmlFor="endDateTime">End of Event</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !endDate && "text-muted-foreground"
                                        )}>
                                            <CiCalendar className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) => {
                                                setEndDate(date);
                                                if (date) {
                                                    setEventData(prev => ({ ...prev, endDateTime: format(date, "yyyy-MM-dd") }));
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {/* <Input
                                className="w-full px-3 py-2 border rounded"
                                id="endDateTime"
                                type="date"
                                name="endDateTime"
                                value={eventData.endDateTime}
                                onChange={handleChange}
                            /> */}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="block text-sm mb-1" htmlFor="eventDescription">Event Description*</Label>
                            <Textarea
                                className="w-full"
                                id="eventDescription"
                                name="eventDescription"
                                placeholder="Enter event description"
                                value={eventData.eventDescription}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="block text-m mb-2" htmlFor="certificateFile">Upload Certificate Design</Label>
                            <Input id="certificateFile" type="file" accept="image/*" onChange={handleCertificateChange} />
                            {/* <input
                            id="certificateFile"
                            type="file"
                            accept="image/*"
                            className="visible"
                            onChange={handleCertificateChange}
                        /> */}
                            {/* {certificateFile && (
                            <div className="mt-4">
                                <img src={URL.createObjectURL(certificateFile)} alt="Certificate Preview" className="w-full max-w-sm" />
                            </div>
                        )} */}
                        </div>
                        <div className="flex justify-between mt-4">
                            {/* <Button
                                type="button"
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button> */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                            >
                                {isLoading ? <LoadingDots /> : 'Register Event'}
                            </Button>

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
                    <div className="w-2/3 bg-white p-6">
                        <Label className="block font-bold mb-4 text-center">Certificate Preview</Label>
                        <div className="h-[450px] border-gray-300 flex items-center justify-center">
                            {certificateFile ? (
                                <img
                                    src={URL.createObjectURL(certificateFile)}
                                    alt="Certificate Preview"
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <PiCertificate className="mx-auto h-12 w-12 mb-2" />
                                    <p>No certificate uploaded yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default EventRegistration;
