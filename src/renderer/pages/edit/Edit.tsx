import React from 'react';
import { useLocation } from 'react-router-dom';
import { WritingData } from '@src/structure';
import { hot } from 'react-hot-loader';
import { LeftDrawer } from '@renderer/pages/edit/atoms/LeftDrawer';



const Edit: React.FC = () => {
  const location = useLocation();
  const state = location.state as WritingData;

  console.log(state);
  return (
    <div id="edit">
      <LeftDrawer />
    </div>
  )
}

export default hot(module)(Edit);