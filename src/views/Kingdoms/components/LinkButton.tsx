import React from 'react';
import './LinkButton.css';

interface LinkButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  title?: string
  id?: string
}

const LinkButton: React.FC<LinkButtonProps> = ({ onClick, children, title = '', id = 'link-button-id' }) => (
  <button title={title} type="button" className="link-button" onClick={onClick} id={id}>
    {children}
  </button>
)

export default LinkButton;
