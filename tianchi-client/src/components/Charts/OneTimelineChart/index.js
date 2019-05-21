import React from 'react';
import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
class OneTimelineChart extends React.Component {
  checkClickPoint = (ev) => {
    let index = -1;
    if (!ev.data) {
      return index;
    }
    for (let i in ev.data) {
      const d = ev.data[i];
      if (d.x <= ev.x + 3 && d.x >= ev.x - 3 && d.y <= ev.y + 20 && d.y >= ev.y - 20) {
        index = i;
        break;
      }
    }

    return index;
  };

  render() {
    const {
      title,
      height = 400,
      padding = [20, 55, 40, 75],
      titleMap = {
        y: '单天消费总额',
      },
      borderWidth = 2.2,
      data: sourceData,
      showPredict: showPredict,
      enableDig,
      startTime,
      endTime,
      onPointClick,
      onBlur,
    } = this.props;
    const data = Array.isArray(sourceData) && sourceData.length ? sourceData : [{ x: 0, y: 0 }];
    const lastTime = data[data.length - 1].x;

    data.sort((a, b) => a.x - b.x);

    let max;
    if (data[0] && data[0].y) {
      max = Math.max(
        [...data].sort((a, b) => b.y - a.y)[0].y,
      );
    }

    const ds = new DataSet({
      state: {
        start: startTime || data[0].x,
        end: endTime || data[data.length - 1].x,
      },
    });

    const dv = ds.createView();
    dv.source(data)
      .transform({
        type: 'filter',
        callback: obj => {
          const date = obj.x;
          return date >= ds.state.start && date <= ds.state.end;
        },
      })
      .transform({
        type: 'map',
        callback(row) {
          const newRow = { ...row };
          newRow[titleMap.y] = row.y;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap.y], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });
    //todo 并不能识别其他格式的时间序列,tickInterval和tickCount不能同时出现
    const timeScale = {
      type: 'time',
      // tickInterval: 24 * 3600 * 1000,
      mask: 'YYYY/MM/DD',
      range: [0.01, 0.99],
    };

    const cols = {
      x: timeScale,
      value: {
        max,
        min: 0,
      },
      y: { tickCount: 5 }
    };

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="x"
        yAxis="y"
        scales={{ x: timeScale }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );

    return (
      <div className={styles.timelineChart} style={{ height: height + 30 }}>
        <div>
          {title && <h4>{title}</h4>}
          <Chart
            height={height} padding={padding} data={dv} scale={cols} forceFit
            onPlotClick={(ev) => {
              if (!enableDig) {
                return;
              }
              if (!ev.shape.name) {
                // click outside
                !!onBlur && onBlur();
                return;
              }
              if (!ev.data && ev.shape.name === 'line') {
                // click line
                return;
              }
              const index = this.checkClickPoint(ev);
              if (index === -1) {
                !!onBlur && onBlur();
              }
            }}
            onLineClick={(ev) => {
              if (!enableDig) {
                return;
              }

              const index = this.checkClickPoint(ev);
              if (index === -1) {
                return;
              }
              const data = ev.data[index];
              const startTime = ev.data[0]._origin.x;
              const endTime = ev.data[ev.data.length - 1]._origin.x;
              !!onPointClick && onPointClick(startTime, endTime, data._origin.x, data.x.toFixed(0), data.y.toFixed(0),);
            }}
          >
            <Axis name="x"/>
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="line" position="x*value" size={borderWidth}
              color={['x', (x) => {
                if (showPredict && x >= lastTime) {
                  return '#ff0000';
                }
                return "#1890ff";
              }]}
              tooltip={['value*x', (value, x) => {
                if (showPredict && x >= lastTime) {
                  return {
                    name: "预测值",
                    value: value + "元"
                  };
                }
                return {
                  name: "单天消费额",
                  value: value + "元"
                };
              }]}
            />
            {showPredict && <Geom
              type="point" position="x*value"
              shape={"circle"}
              active={[false]}
              size={['x', (x) => {
                if (x >= lastTime) {
                  return 5;
                }
                return 0;
              }]}
              color={['x', (x) => {
                return '#ff0000';
              }]}
              tooltip={['value', (value) => {
                return {
                  name: "预测值",
                  value: value + "元"
                };
              }]}
            />}
          </Chart>
          <div style={{ marginRight: -20 }}>
            <SliderGen/>
          </div>
        </div>
      </div>
    );
  }
}

export default OneTimelineChart;
