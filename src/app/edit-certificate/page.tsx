"use client"
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserHeader from '@/components/ui/UserHeader';
import AddParticipants from '@/components/ui/addParticipants';
import CertificatePreview from '@/components/ui/certificateTemplate';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FiItalic, FiBold, FiUnderline, FiAlignLeft, FiAlignRight, FiAlignCenter } from "react-icons/fi";
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IoMdRefresh } from "react-icons/io";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Papa from 'papaparse';
import LoadingDots from '@/components/ui/loading-dots';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';


type TextStyleKey = 'bold' | 'italic' | 'underline';

const CertificateTemplate = () => {
  const [certificateFilePath, setCertificateFilePath] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [participantList, setParticipantList] = useState<string>('');
  const [qrPosition, setQrPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [qrSize, setQrSize] = useState<{ width: number; height: number }>({ width: 50, height: 50 });
  const [qrImageSrc, setQrImageSrc] = useState<string>('/storage/qr_code_PNG6.png'); // Add your QR code image URL here
  const [eventName, setEventName] = useState<string>(''); // State to store eventName
  const [scale, setScale] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(20);
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<string[]>([]);
  const { toast } = useToast()
  const router = useRouter();

  const [textStyle, setTextStyle] = useState<{ [key in TextStyleKey]: boolean }>({
    bold: false,
    italic: false,
    underline: false
  });

  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  const [textareaValue, setTextareaValue] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null); 

  const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
    setTextAlign(align);
  };

  const [textPosition, setTextPosition] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

  const handleTextStyleChange = (style: TextStyleKey) => {
    setTextStyle(prev => ({ ...prev, [style]: !prev[style] }));
  };

  const handleRefresh = () => {
    // Reset QR position and text position
    setQrPosition({ x: 50, y: 50 });
    setTextPosition({ x: 100, y: 100 });
    // Add any additional logic needed to refresh or reset text positions
  };


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
    console.log("Updating participant list:", list);
    setParticipantList(list);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const urlParams = new URLSearchParams(window.location.search);
      const eventId = urlParams.get('eventId');

      console.log(`FontFamily ${fontFamily}`)

      if (eventId) {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/${eventId}`, {
          QrXPosition: qrPosition.x * scale,
          QrYPosition: qrPosition.y * scale,
          QrSize: qrSize.width / 25,
          TextXPosition: textPosition.x * scale,
          TextYPosition: textPosition.y * scale,
          FontSize: Math.floor(fontSize * scale),
          Alignment: textAlign,
          IsBold: textStyle.bold,
          IsItalic: textStyle.italic,
          IsUnderlined: textStyle.underline,
          FontFamily: fontFamily
        });

        if (response.status === 200) {
          handleGeneration(e);
        } else {
          console.error('Failed to update QR position');
          setIsLoading(false)
        }
      } else {
        console.error('Event ID not found in URL');
        setIsLoading(false)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response);

      } else {
        console.error('Error', error);
      }
      setIsLoading(false)
    }
  };

  const handleGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const eventId = urlParams.get('eventId');

      const expirationDate = new Date(); // Set desired expiration
      if (eventId) {


        const participantNames = textareaValue
          .split('\n')
          .map(name => name.trim())
          .filter(name => name.length > 0);
        console.log(parseInt(eventId))
        console.log(participantNames)

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate`, {
          eventId: parseInt(eventId),
          // eventName: eventName, // Use the fetched event name
          participantNames: participantNames,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 201) {
          console.log('Participants successfully submitted');
          toast({
            title: "Successfully Generated!",
            className: "bg-green-500 text-white"
          })
          router.push("/manage-event")
          

          // Handle successful submission (e.g., show a success message or navigate to another page)
        } else {
          console.error('Failed to submit participants');
          toast({
            title: "Failed to submit participants, please check input",
            className: "bg-red-500 text-white"
          })
        }

      } else {
        toast({
          title: "Event not found",
          className: "bg-red-500 text-white"
        })
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response);
        toast({
          title: `${error.response}`,
          className: "bg-red-500 text-white"
        })
      } else {
        toast({
          title: `${error}`,
          className: "bg-red-500 text-white"
        })
        console.error('Error', error);
      }
    }
    setIsLoading(false)
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const parseCSV = (text: string) => {
    const normalizedText = text.replace(/\r\n/g, '\n');

    const lines = normalizedText.split('\n');
    const result: string[] = [];
    const headers = lines[0].split(','); // Assuming the first row is headers
    console.log(lines)
    console.log(headers)
    // Find the index of the 'Name' column
    const nameIndex = headers.indexOf('Name');

    if (nameIndex === -1) {
      console.error('Name column not found in CSV');
      return;
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(',');
      if (line.length > nameIndex) {
        result.push(line[nameIndex].trim());
      }
    }
    console.log(result)
    setCsvData(result);
    setTextareaValue(result.join('\n'));
  };

  return (
    <div className="min-h-screen  mx-20">
      <UserHeader />
      <div className="min-h-screen flex justify-center" >
        <div className="w-full mx-20">

          {/* <form onSubmit={(e) => {
            e.preventDefault();
            handleNextStep();
          }}> */}
          {/* Text Controls */}
          <div className="flex justify-between items-center">
            <div className='flex items-center'>
              <div className='flex space-x-4'>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Font..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* <SelectLabel>Select a Font...</SelectLabel> */}
                      <SelectItem value="Arial" className='arial-regular'>Arial</SelectItem>
                      <SelectItem value="Poppins" className='poppins-regular'>Poppins</SelectItem>
                      <SelectItem value="Times New Roman" className='times-new-roman-regular'>Times New Roman</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className='flex'>
                  <Button variant="outline" type="button" onClick={() => setFontSize(prev => Math.max(5, prev - 1))}>-</Button>
                  <Input className='w-12 text-center'
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }} />
                  <Button variant="outline" type="button" onClick={() => setFontSize(prev => prev + 1)}>+</Button>
                </div>

              </div>

              <Separator orientation="vertical" className='h-5 mx-4' />

              <ToggleGroup type="multiple">
                <ToggleGroupItem
                  value="bold"
                  aria-label="Toggle bold"
                  onClick={() => handleTextStyleChange('bold')}
                  className={textStyle.bold ? 'active' : ''}
                >
                  <FiBold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="italic"
                  aria-label="Toggle italic"
                  onClick={() => handleTextStyleChange('italic')}
                  className={textStyle.italic ? 'active' : ''}
                >
                  <FiItalic className="h-4 w-4" />
                </ToggleGroupItem>
                {/* <ToggleGroupItem
                    value="underline"
                    aria-label="Toggle underline"
                    onClick={() => handleTextStyleChange('underline')}
                    className={textStyle.underline ? 'active' : ''}
                  >
                    <FiUnderline className="h-4 w-4" />
                  </ToggleGroupItem> */}
              </ToggleGroup>
              <Separator orientation="vertical" className='h-5 mx-4' />

              <ToggleGroup type="single" value={textAlign} onValueChange={handleTextAlignChange}>
                <ToggleGroupItem value="left" aria-label="Toggle left" onClick={() => handleTextAlignChange('left')}>
                  <FiAlignLeft className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Toggle center" onClick={() => handleTextAlignChange('center')}>
                  <FiAlignCenter className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Toggle right" onClick={() => handleTextAlignChange('right')}>
                  <FiAlignRight className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Button type="button" variant="outline" className='group' onClick={handleRefresh}><IoMdRefresh className='size-5 group-hover:animate-spin' /></Button>
          </div>

          <Separator className="my-3" />
          <div className="flex justify-between">
            <CertificatePreview
              image={image}
              certificateFilePath={certificateFilePath}
              qrPosition={qrPosition}
              setQrPosition={setQrPosition}
              qrSize={qrSize}
              setQrSize={setQrSize}
              qrImageSrc={qrImageSrc}
              setScale={setScale}
              textStyle={textStyle} // Add this line
              setTextStyle={handleTextStyleChange}
              fontSize={fontSize}
              textPosition={textPosition} // Pass text position
              setTextPosition={setTextPosition}
              textAlign={textAlign}
              setTextAlign={setTextAlign}
              fontFamily={fontFamily}
            />

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className='flex w-1/4'>
              <div className="space-y-1 w-full flex flex-col">
                <div className='my-3 flex flex-col space-y-1'>
                  <Label htmlFor="participantList" className='text-lg'>Participants</Label>
                  <Label className='text-neutral-500'>Enter manually or upload a .csv file</Label>
                </div>
                <div className='flex flex-col space-y-4'>
                  <Textarea
                    rows={12}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    placeholder="Enter participant names, one per line"
                  />
                  <div className='space-y-1'>
                    <Label>Upload CSV</Label>
                    <Input type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef}/>
                  </div>

                  <Button type="submit" className='w-full'>
                    {isLoading ? <LoadingDots /> : 'Generate'}
                  </Button>
                </div>


                <div className="flex justify-between mt-4">
                  {/* <button type="button" className="text-gray-500" onClick={() => setStep(1)}>
                    Back
                  </button> */}

                </div>
              </div>

            </form>
          </div>

          {/* <div className="flex justify-between mt-4">
              <button type="button" className="text-gray-500">
                Cancel
              </button>
              <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
                Next
              </button>
            </div> */}
          {/* </form> */}


        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
