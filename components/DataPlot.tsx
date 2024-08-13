"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { FileData } from '@/app/page';
import Skeleton from '@/app/Skeleton';

const DynamicPlot = dynamic(() => import('./DynamicPlot'), { ssr: false });

interface DataPlotProps {
  file: File | null;
  timePosition: number;
}

function DataPlot({ file, timePosition }: DataPlotProps) {
  const [data, setData] = useState<FileData>({ timePoints: [], amplitudes: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const CHUNK_SIZE = 1000000;
  const DECIMATION_FACTOR = 1000;
  const SAMPLE_RATE = 4000000;

  const processChunk = useCallback((chunk: string): number[] => {
    return chunk.split('\n')
      .map(line => parseFloat(line.trim()))
      .filter((val, index) => !isNaN(val) && index % DECIMATION_FACTOR === 0);
  }, [DECIMATION_FACTOR]);

  useEffect(() => {
    if (!file) return;

    const readFileInChunks = async () => {
      if (file.size === 0) {
        setError("Error: The file is empty.");
        return;
      }

      setIsLoading(true);
      setError(null);

      const reader = new FileReader();
      let offset = 0;
      let processedData: number[] = [];

      const readChunk = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsText(slice);
      };

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const chunk = e.target?.result as string;
        const newData = processChunk(chunk);

        if (newData.length === 0 && processedData.length === 0) {
          setError("Error: The file does not contain valid numerical data.");
          setIsLoading(false);
          return;
        }

        processedData = processedData.concat(newData);

        offset += CHUNK_SIZE;

        if (offset < file.size) {
          readChunk();
        } else {
          const effectiveSampleRate = SAMPLE_RATE / DECIMATION_FACTOR;
          const timePoints = new Array(processedData.length).fill(0).map((_, index) => index / effectiveSampleRate);
          setData({ timePoints, amplitudes: processedData });
          setIsLoading(false);
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setError("Error: Failed to read the file.");
        setIsLoading(false);
      };

      readChunk();
    };

    readFileInChunks();
  }, [file, processChunk]);

  if (isLoading) return <Skeleton width="100%" height="450px"/>;
  if (error) return <div>{error}</div>;
  if (data.amplitudes.length === 0) return <div>No valid data found in the file</div>;

  return <DynamicPlot data={data} timePosition={timePosition} />;
}

export default DataPlot;