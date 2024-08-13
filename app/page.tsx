"use client";

import DataPlot from '@/components/DataPlot';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import React, { useRef, useState } from 'react';

export interface FileData {
  timePoints: number[];
  amplitudes: number[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [timePosition, setTimePosition] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size === 0) {
        setError("Error: The selected file is empty.");
        setFile(null);
      } else if (!selectedFile.name.endsWith('.csv')) {
        setError("Error: Please select a valid CSV file.");
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleTimePositionChange = (value: number[]) => {
    setTimePosition(value[0]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Time Series Data Visualization Application</h1>

      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <Button onClick={handleBrowseClick}>Browse CSV</Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      
      {file && (
        <>
          <div className="mb-4">
            <Slider
              min={0}
              max={10}
              step={0.1}
              value={[timePosition]}
              onValueChange={handleTimePositionChange}
            />
            <p className='pt-2'>Time Position: {timePosition.toFixed(1)} s</p>
          </div>
          
          <div className="mt-4">
            <DataPlot
              file={file}
              timePosition={timePosition}
            />
          </div>
        </>
      )}
    </div>
  );
}