"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserHeader from '@/components/ui/UserHeader';
import AddParticipants from '@/components/ui/addParticipants';
import CertificatePreview from '@/components/ui/certificateTemplate';

const CertificateTemplate = () => {
  const [certificateFilePath, setCertificateFilePath] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [participantList, setParticipantList] = useState<string>('');
  const [step, setStep] = useState(1);
  const [qrPosition, setQrPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [qrSize, setQrSize] = useState<{ width: number; height: number }>({ width: 50, height: 50 });
  const [qrImageSrc, setQrImageSrc] = useState<string>('/storage/qr_code_PNG6.png'); // Add your QR code image URL here
  const [eventName, setEventName] = useState<string>(''); // State to store eventName
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const fetchCertificate = async (eventId: string) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/${eventId}`);
        if (response.status === 200) {
          const { certificateFilePath, eventName } = response.data;
          setCertificateFilePath(certificateFilePath);
          setEventName(eventName); // Set the event name from the response
          const img = new Image();
          img.src = `${process.env.NEXT_PUBLIC_API_BASE_URL}${certificateFilePath}`;
          img.onload = () => setImage(img);
        } else {
          console.error('Failed to fetch certificate');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.response);
        } else {
          console.error('Error', error);
        }
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    if (eventId) {
      fetchCertificate(eventId);
    } else {
      console.error('Event ID not found in URL');
    }
  }, []);

  const handleParticipantListChange = (list: string) => {
    setParticipantList(list);
  };

  const handleNextStep = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const eventId = urlParams.get('eventId');

      if (eventId) {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/${eventId}`, {
          QrXPosition: qrPosition.x * scale,
          QrYPosition: qrPosition.y * scale,
        });

        if (response.status === 200) {
          setStep(2);
        } else {
          console.error('Failed to update QR position');
        }
      } else {
        console.error('Event ID not found in URL');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response);
      } else {
        console.error('Error', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const eventId = urlParams.get('eventId');
      const expirationDate = new Date(); // Set desired expiration
      if (eventId) {
        const participantNames = [];
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate`, {
          
          eventId: parseInt(eventId),
          eventName: eventName, // Use the fetched event name
          participantNames: participantList.split('\n').filter(name => name.trim() !== ''),
        });

        if (response.status === 201) {
          console.log('Participants successfully submitted');
          // Handle successful submission (e.g., show a success message or navigate to another page)
        } else {
          console.error('Failed to submit participants');
        }
      } else {
        console.error('Event ID not found in URL');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response);
      } else {
        console.error('Error', error);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <UserHeader />
      <div className="min-h-screen flex pt-4 justify-center">
        <div className="w-full max-w-4xl p-6">
          {step === 1 && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleNextStep();
            }}>
              <CertificatePreview
                image={image}
                certificateFilePath={certificateFilePath}
                qrPosition={qrPosition}
                setQrPosition={setQrPosition}
                qrSize={qrSize}
                setQrSize={setQrSize}
                qrImageSrc={qrImageSrc}
                setScale={setScale}
              />
              <div className="flex justify-between mt-4">
                <button type="button" className="text-gray-500">
                  Cancel
                </button>
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
                  Next
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <AddParticipants onParticipantListChange={handleParticipantListChange} />
              <div className="flex justify-between mt-4">
                <button type="button" className="text-gray-500" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
