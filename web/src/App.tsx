import React from 'react';
import './App.scss';
import LayoutDefault from './components/layout_topology/layout_default/layout_default';
import { GlobalUserContext } from './context-providers/global-user-context';
import { GlobalThemeContext } from './context-providers/theme-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';

function App() {
  
  return (
    <div className="App">
      <GlobalUserContext>
        <GlobalThemeContext>
          <LayoutDefault></LayoutDefault>
        </GlobalThemeContext>
      </GlobalUserContext>
      <footer className="mt-auto">
        <div className='footer-wrapper'>
          <FontAwesomeIcon icon={faCopyright} beat size='xs' />
          <div className='branding'>MANGOR 2023</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
