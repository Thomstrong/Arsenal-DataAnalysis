import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 I Am Groot 团队出品<br/>
          感谢蚂蚁金服 Ant Design Pro 提供脚手架
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
