import React from 'react';
import { InfoCardProps, WritingData } from '@src/structure';
import { Link } from 'react-router-dom';


export const InfoCard: React.FC<InfoCardProps> = (props) => {
  return (
    <Link to="/edit" state={props as WritingData} className="list-group-item list-group-item-action">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1" >{ props.label }</h5>
        </div>
        <p className="mb-1">保存先:</p>
        <small className="text-muted" >{props.savePlace}</small>
    </Link>
  )
}