import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { PRINCIPAL_MENU } from '../../../constants';

export default () => (
  <Nav navbar>
    {PRINCIPAL_MENU.map(e => {
      const { title, url, target } = e;
      return (
        <NavItem key={title + url}>
          <NavLink
            href={url}
            target={target}
            className={classnames('text-right', 'w-100')}
          >
            <b className={classnames('p-2')}>{title}</b>
          </NavLink>
        </NavItem>
      );
    })}
  </Nav>
);
