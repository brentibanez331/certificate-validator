"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import UserHeader from '@/components/ui/UserHeader';

const parseCSV = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const text = results.data
          .slice(1) // Skip the header
          .map((row: any) => row[1]) // Only get the name column
          .join('\n');
        resolve(text);
      },
      error: (error) => reject(error),
    });
  });
};

const parseXLSX = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      const text = rows
        .slice(1) // Skip the header
        .map((row) => row[1]) // Only get the name column
        .join('\n');
      resolve(text);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const handleParticipantChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const { id, files } = e.target;
  if (files && files[0]) {
    const file = files[0];
    if (!file.type.includes('csv') && !file.type.includes('sheet') && !file.type.includes('excel')) {
      alert('Please upload a valid CSV or XLSX file.');
      return;
    }

    try {
      let text: string = '';
      if (file.type.includes('csv')) {
        text = await parseCSV(file);
      } else if (file.type.includes('sheet') || file.type.includes('excel')) {
        text = await parseXLSX(file);
      }

      if (id === 'participantFile') {
        // Update the textarea with the parsed text
        const textarea = document.getElementById('participantList') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = text;
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
    }
  }
};

const CertificateTemplate = () => {
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [participantList, setParticipantList] = useState<string>('');

  const handleCertificateUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificatePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParticipantListChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setParticipantList(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen">
      <UserHeader/>
      <div className="min-h-screen flex pt-4 justify-center ">
        <div className="w-full max-w-4xl p-6 ">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-6">
            <div className="w-1/2 p-2">
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                {certificatePreview ? (
                  <img src={certificatePreview} alt="Certificate Preview" className="object-cover h-full w-full" />
                ) : (
                  <span className="text-gray-500">preview of the certificate</span>
                )}
              </div>
              <input
                type="file"
                className="mt-4"
                accept=".csv, .xlsx"
                onChange={handleCertificateUpload}
              />
            </div>
            <div className="w-1/2 p-2">
              <label htmlFor="participantList" className="block text-sm mb-2">
                list of participants*
              </label>
              <textarea
                id="participantList"
                className="w-full h-64 p-2 border border-gray-300 rounded"
                placeholder="paste participants list here"
                value={participantList}
                onChange={handleParticipantListChange}
              />
              <div className="mt-4 flex flex-col items-center justify-center border-2 border-dashed p-4">
                <label htmlFor="participantFile" className="block text-m mb-2 cursor-pointer">
                  upload participants list
                  <input
                    id="participantFile"
                    type="file"
                    accept=".csv, .xlsx"
                    className="hidden"
                    onChange={handleParticipantChange}
                  />
                </label>
              </div>
              <a href="#" className="text-sm mt-2 block underline text-gray-500">
                participants list template
              </a>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button type="button" className="text-gray-500">
              cancel
            </button>
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
              next
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
