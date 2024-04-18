import React from 'react';
import { TopPanel } from "../../top_panel";
import { Routes, Route } from "react-router-dom";
import { Home } from '../../../pages/home';
import { About } from '../../../pages/about';
import { NoPage } from '../../../pages/NoPage';
import { useGlobalUserContext } from '../../../context-providers/global-user-context';
import { Users } from '../../../pages/users';
import { Photos } from '../../../pages/photos';


const LayoutDefault = () => {
  const { user } = useGlobalUserContext();

  return (
    <>
      <TopPanel />
      <Routes>
        {user ? <Route path="/users" element={<Users />} /> : null}
        <Route path="/" element={<Home />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  )
};

export default LayoutDefault;
