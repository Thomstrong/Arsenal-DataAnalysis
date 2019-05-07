import React from 'react';
export interface ITagCloudProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  height: number;
  style?: React.CSSProperties;
  imgUrl:string;
  repeat:boolean;
}

export default class TagCloud extends React.Component<ITagCloudProps, any> {}
