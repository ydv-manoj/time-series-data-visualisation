"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Data, Layout, Config } from 'plotly.js';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface DynamicPlotProps {
  data: { timePoints: number[], amplitudes: number[] };
  timePosition: number;
}

export type Granularity = '10s' | '1s' | '100ms' | '10ms' | '1ms';

export default function DynamicPlot({ data, timePosition }:DynamicPlotProps){
  const [granularity, setGranularity] = React.useState<Granularity>('10s');

  const handleGranularityChange = (value: Granularity) => {
    setGranularity(value);
  };

  const granularityInSeconds: { [key in Granularity]: number } = {
    "10s": 10,
    "1s": 1,
    "100ms": 0.1,
    "10ms": 0.01,
    "1ms": 0.001,
  };

  const getVisibleRange = (): [number, number] => {
    const duration = 10; 
    const start = Math.max(0, timePosition - granularityInSeconds[granularity]);
    const end = Math.min(duration, timePosition + granularityInSeconds[granularity]);
    return [start, end];
  };

  const visibleRange = getVisibleRange();

  const filteredData = data.timePoints.map((timePoint, index) => ({
    time: timePoint,
    amplitude: data.amplitudes[index],
  })).filter(point => point.time >= visibleRange[0] && point.time <= visibleRange[1]);

  const plotData: Data[] = [{
    x: filteredData.map(d => d.time),
    y: filteredData.map(d => d.amplitude),
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    line: { color: 'hsl(var(--chart-1))' },
    fillcolor: 'rgba(var(--chart-1-rgb), 0.2)',
    name: 'Signal Amplitude'
  }];

  const layout: Partial<Layout> = {
    autosize: true,
    margin: { l: 50, r: 30, t: 20, b: 40 },
    xaxis: {
      title: 'Time (s)',
      range: visibleRange,
      tickformat: '.3f'
    },
    yaxis: {
      title: 'Amplitude',
      tickfont: { size: 10 },
      autorange: true,
    },
    showlegend: false,
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)'
  };

  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Signal Amplitude</CardTitle>
          <CardDescription>
            Showing signal amplitude over time
          </CardDescription>
        </div>
        <Select
          value={granularity}
          onValueChange={handleGranularityChange}
        >
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select granularity">
            <SelectValue placeholder="Select Granularity" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="10s" className="rounded-lg">10 seconds</SelectItem>
            <SelectItem value="1s" className="rounded-lg">1 second</SelectItem>
            <SelectItem value="100ms" className="rounded-lg">100 milliseconds</SelectItem>
            <SelectItem value="10ms" className="rounded-lg">10 milliseconds</SelectItem>
            <SelectItem value="1ms" className="rounded-lg">1 millisecond</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[450px] w-full">
          <Plot
            data={plotData}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

