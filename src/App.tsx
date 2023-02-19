import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import TestNotes from './TestNotes';
import TestPosition from './TestPosition';
import { map } from 'lodash';
import { Layout, Menu } from 'antd';


const App : React.FC = () => {
  const availablePages: {[key: string] : React.FC<any>} = {
    TestPosition: TestPosition, 
    TestNotes: TestNotes
  }
  const [testPage, setTestPage] = useState('TestPosition')

  return (
    <Layout className="App">
      <Layout.Header>
        <div style={{
          float: 'left',
          width:120,
          height: 31,
          margin: '16px 24px 16px 0'
        }}>
          <img src={logo} height="100%"/>
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
        {testPage === 'TestNotes' && <TestNotes/>}
        {testPage === 'TestPosition' && <TestPosition/>}
      </Layout.Content>
    </Layout>
  );
}

export default App;
