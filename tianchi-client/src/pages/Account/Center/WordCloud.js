/**
 * Created by 胡晓慧 on 2019/4/13.
 */
// import $ from "jquery";
import React, { memo } from "react";
import { Chart, Coord, Geom, Tooltip } from "bizcharts";

const WordCloud = memo(
  ({ wordData, scale }) => (
    <React.Fragment>
      <div height={24}>
        <Chart
          height={200}
          width={window.innerWidth}
          data={wordData}
          scale={scale}
          padding={0}
          forceFit
        >
          <Tooltip showTitle={false}/>
          <Coord reflect="y"/>
          <Geom
            type="point"
            position="x*y"
            color="category"
            shape="cloud"
            tooltip="value*category"
          />
        </Chart>
      </div>
    </React.Fragment>
  )
);

export default WordCloud;
