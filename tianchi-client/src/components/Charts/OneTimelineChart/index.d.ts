import React from 'react';
export interface IOneTimelineChartProps {
  data: Array<{
    x: number;
    y: number;
  }>;
  showPredict: boolean;
  titleMap: { y: string;};
  padding?: [number, number, number, number];
  height?: number;
  style?: React.CSSProperties;
}

export default class OneTimelineChart extends React.Component<IOneTimelineChartProps, any> {}
