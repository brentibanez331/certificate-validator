"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { MdDelete } from "react-icons/md";
import UserHeader from '@/components/ui/UserHeader'
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

interface Event {
  id: number;
  eventName: string;
  venue: string;
  eventDescription: string;
  startDateTime: string;
  endDateTime: string;
  certificates: { id: number }[];
}

const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "eventName",
    header: "Event Name",
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
  {
    accessorKey: "eventDescription",
    header: "Description",
  },
]

export default function UserPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');


  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const handleAddEventClick = () => {
    router.push('/register-event');
  }

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/${eventId}`
      );

      if (response.status === 200 || response.status === 204) { // 204 (No Content) is also common for delete
        // Successful delete
        console.log(`Event with ID ${eventId} deleted successfully.`);

        // Update your events state to reflect the deleted event
        setEvents(events.filter(event => event.id !== eventId));
      } else {
        console.error("Failed to delete event. Status code:", response.status);
        // You might want to display an error message to the user here
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      // Handle the error appropriately (e.g., display an error message)
    }
  };

  const fetchEvents = async () => {
    const organizationId = localStorage.getItem('organizationId');

    if (organizationId) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event?organizationId=${organizationId}&eventName=${searchTerm}`
        );
        if (response.status === 200) {
          setEvents(response.data);
        } else {
          setError("Failed to fetch events.");
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError("An error occurred while fetching events.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Organization ID not found.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch events whenever searchTerm changes
    fetchEvents();
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white mx-20">
      <UserHeader />
      <main className="w-full">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className='space-y-6'>
            <div className='flex justify-between'>
              <Button
                onClick={handleAddEventClick}
              >
                <span className="ml-2">Create Event</span>
              </Button>

              <Input placeholder='Search Event' className='w-[300px]' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></Input>
            </div>

            {events.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[260px]">
                {events.map((event: Event) => (
                  <div onClick={() => router.push(`manage-event?eventId=${event.id}`)}>
                    <Card key={event.id} className="w-full h-full hover:bg-neutral-100 transform transition-transform hover:-translate-y-1 cursor-pointer hover:-translate-x-1 duration-300 relative flex flex-col">
                      <CardHeader className='flex justify-between items-start'>
                        <CardTitle className='text-xl'>{event.eventName}</CardTitle>

                        <CardDescription className='text-md'>
                          {event.eventDescription}
                        </CardDescription>
                        <CardDescription className='text-xs'>
                          {format(new Date(event.startDateTime), 'MMM dd, yyyy')} -{' '}
                          {format(new Date(event.endDateTime), 'MMM dd, yyyy')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='flex flex-col flex-grow justify-between'>
                        <div>
                          <p className='text-xs'>Venue: {event.venue}</p>
                          <p className='text-xs'>
                            No. Of Participants: {event.certificates.length}
                          </p>
                        </div>

                        {/* Add buttons for "Generate Certificate" and "View Participants" */}
                        <div className="mt-4 flex gap-4 items-center justify-between">
                          <Button onClick={() => router.push(`/edit-certificate?eventId=${event.id}`)}>Generate Certificate</Button>
                          <Button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id) }} variant={"ghost"} className='hover:bg-white transition duration-300'><MdDelete className='size-6 text-red-500'></MdDelete></Button>
                          {/* <Button
                            variant="outline"
                            onClick={() => {
                              localStorage.setItem("eventName", event.eventName);
                              router.push(`/event/${event.id}/certificates`);
                            }}
                          >
                            View Participants
                          </Button> */}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                ))}
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}
