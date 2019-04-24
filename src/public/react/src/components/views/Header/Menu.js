import React from 'react';
import { Nav, NavItem, NavLink, Button } from 'reactstrap';
import classnames from 'classnames';
import { PRINCIPAL_MENU, substr } from '../../../constants';

export default () => (
  <Nav className={classnames('justify-content-center')}>
    {PRINCIPAL_MENU.map(e => {
      const { title, url, target } = e;
      return (
        <NavItem key={title + url}>
          <NavLink
            href={url}
            target={target}
            className={classnames('text-right', 'w-100', 'p-0')}
          >
            <Button
              className={classnames('p-0', 'mx-1', 'bg-opennebula')}
              color="primary"
            >
              <b className={classnames('p-2')}>{substr(title, 7, '')}</b>
            </Button>
          </NavLink>
        </NavItem>
      );
    })}
  </Nav>
);
