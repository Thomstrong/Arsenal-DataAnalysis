import React, { Component } from 'react';
import { Chart, Coord, Geom, Shape } from 'bizcharts';
import DataSet from '@antv/data-set';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import classNames from 'classnames';
import autoHeight from '../autoHeight';
import styles from './index.less';

/* eslint no-underscore-dangle: 0 */
/* eslint no-param-reassign: 0 */

// const imgUrl = 'https://zos.alipayobjects.com/rmsportal/EEFqYWuloqIHRnh.jpg';
// import imgUrl from './WechatIMG6.jpeg';
// const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/20180602_FIFA_Friendly_Match_Austria_vs._Germany_Mesut_%C3%96zil_850_0704.jpg/440px-20180602_FIFA_Friendly_Match_Austria_vs._Germany_Mesut_%C3%96zil_850_0704.jpg';

@autoHeight()
class TagCloud extends Component {
  state = {
    dv: null,
  };

  componentDidMount() {
    requestAnimationFrame(() => {
      this.initTagCloud();
      this.renderChart();
    });
    window.addEventListener('resize', this.resize, { passive: true });
  }

  componentDidUpdate(preProps) {
    const { data } = this.props;
    if (JSON.stringify(preProps.data) !== JSON.stringify(data)) {
      this.renderChart(this.props);
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
    window.cancelAnimationFrame(this.requestRef);
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.requestRef = requestAnimationFrame(() => {
      this.renderChart();
    });
  };

  saveRootRef = node => {
    this.root = node;
  };

  initTagCloud = () => {
    function getTextAttrs(cfg) {
      return Object.assign({}, cfg.style, {
        fillOpacity: cfg.opacity,
        fontSize: cfg.origin._origin.size,
        rotate: cfg.origin._origin.rotate,
        text: cfg.origin._origin.text,
        textAlign: 'center',
        fontFamily: cfg.origin._origin.font,
        fill: cfg.color,
        textBaseline: 'Rectangular',
      });
    }

    // 给point注册一个词云的shape
    Shape.registerShape('point', 'cloud', {
      drawShape(cfg, container) {
        const attrs = getTextAttrs(cfg);
        return container.addShape('text', {
          attrs: Object.assign(attrs, {
            x: cfg.x,
            y: cfg.y,
          }),
        });
      },
    });
  };

  @Bind()
  @Debounce(500)
  renderChart(nextProps) {
    // const colors = ['#1890FF', '#41D9C7', '#2FC25B', '#FACC14', '#9AE65C'];
    const { data, height, imgUrl, repeat } = nextProps || this.props;

    if (data.length < 1 || !this.root) {
      return;
    }

    const h = height;
    const w = this.root.offsetWidth;

    const onload = () => {
      const dv = new DataSet.View().source(!!repeat ? data.concat(data.map(data => {
        return {
          ...data,
          value: 1,
        };
      })).concat(data.map(data => {
        return {
          ...data,
          value: 2,
        };
      })) : data);
      const range = dv.range('value');
      const [min, max] = range;
      const mid = (max + min) / 2;
      dv.transform({
        type: 'tag-cloud',
        fields: ['name', 'value'],
        imageMask: this.imageMask,
        font: 'Verdana',
        size: [w, h], // 宽高设置最好根据 imageMask 做调整
        padding: 0,
        timeInterval: 1000, // max execute time
        rotate() {
          return 0;
        },
        fontSize(d) {
          if (data.length > 120) {
            return d.value < mid && d.value > 5 ? Math.pow(d.value * 1.2 - min / (max - min), 1 / 4) * 5 :
              Math.pow(d.value * 1.2 - min / (max - min), 1 / 4) * 6 + 6;
          }
          return Math.pow(d.value * 1.2 - min / (max - min), 1 / 4) * 6 + 6;
        },
      });

      if (this.isUnmount) {
        return;
      }

      this.setState({
        dv,
        w,
        h,
      });
    };

    if (!this.imageMask) {
      this.imageMask = new Image();
      this.imageMask.crossOrigin = '';
      this.imageMask.src = imgUrl;
      this.imageMask.onload = onload;
    } else {
      onload();
    }
  }

  render() {
    const { className, height, radio } = this.props;
    const { dv, w, h } = this.state;

    const cloudStyle = {
      width: radio ? height * radio : '100%',
      maxWidth: '100%',
      height,
      margin: '0 auto'
    };
    return (
      <div
        className={classNames(styles.tagCloud, className)}
        style={cloudStyle}
        ref={this.saveRootRef}
      >
        {dv && (
          <Chart
            width={w}
            height={h}
            data={dv}
            padding={0}
            scale={{
              x: { nice: false },
              y: { nice: false },
            }}
          >
            <Coord reflect="y"/>
            <Geom
              type="point"
              position="x*y"
              color="text"
              shape="cloud"
            />
          </Chart>
        )}
      </div>
    );
  }
}

export default TagCloud;
