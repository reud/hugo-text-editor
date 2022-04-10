import React from 'react';
import { InfoCardProps, WritingData } from '@src/structure';
import { Link } from 'react-router-dom';
import './infoCard.css';

export const InfoCard: React.FC<InfoCardProps> = (props) => {
  const linkClassNameBase = 'list-group-item list-group-item-action ';
  return (
    <Link to="/edit" state={props as WritingData} className={linkClassNameBase + (props.disabled ? 'disabled-link' : '')}>
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1" >{ props.label + (props.disabled ?  '(ファイルが既に存在しています)' : '') }</h5>
        </div>
        <p className="mb-1">保存先:</p>
        <small className="text-muted" >{props.savePlace}</small>
    </Link>
  )
}