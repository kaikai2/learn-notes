import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import TestNotes from './TestNotes';
import TestPosition from './TestPosition';
import { map } from 'lodash';
import { Button, Layout, Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { GiViolin } from 'react-icons/gi';
const App : React.FC = () => {
  const availablePages: {[key: string] : React.FC<any>} = {
    TestPosition: TestPosition, 
    TestNotes: TestNotes
  }
  const [testPage, setTestPage] = useState('TestPosition')
  const [config, setConfig] = useState(false)

  return (
    <Layout className="App">
      <Layout.Header>
        <div style={{
          float: 'left',
          width: 31,
          height: 31,
          margin: '12px 16px 16px 0'
        }}>
          <GiViolin style={{ fontSize: '32px', color: 'white' }}/>
        </div>
        <div style={{
          float: 'right',
          width: 31,
          height: 31,
          margin: '0 0 16px 0'
        }}>
          <Button type="dashed" ghost onClick={() => setConfig(true)} size="large" icon={<SettingOutlined />}>
          </Button>
        </div>
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[testPage]}
            onClick={(e) => setTestPage(e.key)}
            items={map(availablePages, (_, k) => ({
              key: k,
              label: k,
            }))}
          />
          
      </Layout.Header>
      <Layout.Content>
        {testPage === 'TestNotes' && <TestNotes config={config} closeConfig={() => setConfig(false)}/>}
        {testPage === 'TestPosition' && <TestPosition config={config} closeConfig={() => setConfig(false)}/>}
      </Layout.Content>
    </Layout>
  );
}

export default App;
