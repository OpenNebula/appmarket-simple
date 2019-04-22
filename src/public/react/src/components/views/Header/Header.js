import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';
import classnames from 'classnames';
import { MARKETPLACE_TITLE, INDEX_PATH, LOGO } from '../../../constants';
import Menu from './Menu';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false
    };
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }
  toggleNavbar() {
    this.setState({
      collapse: !this.state.collapse
    });
  }
  render() {
    const { collapse } = this.state;
    return (
      <section className={classnames('header')}>
        <Navbar color="faded" light>
          <NavbarBrand
            href={`/${INDEX_PATH}/`}
            target="_self"
            className={classnames('mr-auto')}
          >
            <img
              src={LOGO}
              alt={MARKETPLACE_TITLE}
              className={classnames('d-sm-inline')}
            />
            <h3 className={classnames('d-none', 'd-sm-inline')}>
              {MARKETPLACE_TITLE}
            </h3>
          </NavbarBrand>
          <NavbarToggler
            onClick={this.toggleNavbar}
            className={classnames('mr-2')}
          />
          <Collapse isOpen={collapse} navbar>
            <Menu />
          </Collapse>
        </Navbar>
      </section>
    );
  }
}
export default Header;
