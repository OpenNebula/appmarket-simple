import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { MARKETPLACE_TITLE, INDEX_PATH, LOGO } from '../../../constants';
import Menu from './Menu';
import Finder from '../../containers/Catalog/Finder';

const Header = ({ history, location }) => {
  const { push } = history;
  const { pathname } = location;
  return (
    <section className={classnames('header')}>
      <Container className={classnames('my-4')}>
        <Row className={classnames('align-items-center')}>
          <Col xs="12" sm="4">
            <a
              href={`/${INDEX_PATH}/`}
              target="_self"
              className={classnames('mr-auto')}
            >
              <img
                src={LOGO}
                alt={MARKETPLACE_TITLE}
                className={classnames('d-sm-inline')}
              />
              <h3 className={classnames('d-none', 'd-lg-inline')}>
                {MARKETPLACE_TITLE}
              </h3>
            </a>
          </Col>
          <Col
            xs="12"
            sm="4"
            className={classnames(
              'd-flex',
              'justify-content-center',
              'p-3',
              'p-sm-0'
            )}
          >
            <Finder redirect={push} location={pathname} />
          </Col>
          <Col xs="12" sm="4">
            <Menu />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

Header.defaultProps = {
  location: { pathname: '' },
  history: { push: () => null }
};
export default Header;
