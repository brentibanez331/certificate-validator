import React, { ChangeEvent, useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

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

const AddParticipants = ({ onParticipantListChange }: { onParticipantListChange: (list: string) => void }) => {
  const [participantList, setParticipantList] = useState<string>('');

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
          setParticipantList(text);
          onParticipantListChange(text);
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  };

  return (
    <div className="w-1/2 p-2">
      <label htmlFor="participantList" className="block text-sm mb-2">
        List of Participants*
      </label>
      <textarea
        id="participantList"
        className="w-full h-64 p-2 border border-gray-300 rounded"
        placeholder="Paste participants list here"
        value={participantList}
        onChange={(e) => setParticipantList(e.target.value)}
      />
      <div className="mt-4 flex flex-col items-center justify-center border-2 border-dashed p-4">
        <label htmlFor="participantFile" className="block text-m mb-2 cursor-pointer">
          Upload Participants List
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
        Participants List Template
      </a>
    </div>
  );
};

export default AddParticipants;
