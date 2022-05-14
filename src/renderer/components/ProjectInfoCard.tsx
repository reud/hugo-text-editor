import { ProjectInfoCardProps } from '@src/structure';
import { Link } from 'react-router-dom';
import React from 'react';


export const ProjectInfoCard: React.FC<ProjectInfoCardProps> = (props) => {
  const linkClassNameBase = 'list-group-item list-group-item-action ';
  const pathes = props.projectPath.split('/');
  const label = pathes[pathes.length - 1];
  return (
    <Link to="/" state={props as ProjectInfoCardProps} className={linkClassNameBase + (!props.isExist ? 'disabled-link' : '')}>
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1" >{ label + (!props.isExist ?  '(does not exist)' : '') }</h5>
      </div>
      <small className="text-muted" >{props.projectPath}</small>
    </Link>
  )
}