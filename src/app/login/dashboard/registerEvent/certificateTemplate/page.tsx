"use client";
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

  useEffect(() => {
    const fetchCertificate = async (eventId: string) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/${eventId}`);
        if (response.status === 200) {
          setCertificateFilePath(response.data.certificateFilePath);
          const img = new Image();
          img.src = `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.data.certificateFilePath}`;
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission based on the current step
    if (step === 1) {
      setStep(2);
    } else {
      // Final submission logic
      console.log('Submitting:', participantList);
    }
  };

  return (
    <div className="min-h-screen">
      <UserHeader />
      <div className="min-h-screen flex pt-4 justify-center">
        <div className="w-full max-w-4xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between mb-6">
              {step === 1 && (
                <CertificatePreview image={image} certificateFilePath={certificateFilePath} />
              )}
              {step === 2 && (
                <AddParticipants onParticipantListChange={handleParticipantListChange} />
              )}
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="text-gray-500"
                onClick={() => step === 2 && setStep(1)}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                {step === 1 ? 'Next' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
