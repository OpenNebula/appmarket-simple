import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import {
  addDataString,
  FOOTER_TEXT,
  LOGO_GREY,
  LOGO_GREY_URL,
  LINK1,
  LINK2,
  LINK3
} from '../../../constants';

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <section className={classnames('footer')}>
      <div className={classnames('logos-place')}>
        <Container>
          <Row className={classnames('align-items-center', 'py-3')}>
            <Col xs="12" className={classnames('text-center')}>
              Made with ❤️ by
              <a
                href={LOGO_GREY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={classnames('opennebula-link')}
              >
                OpenNebula
              </a>
            </Col>
          </Row>
        </Container>
      </div>
      <div className={classnames('legal-place')}>
        <Container>
          <Row>
            <Col
              className={classnames('text-center', 'p-3')}
              dangerouslySetInnerHTML={{
                __html: addDataString(
                  addDataString(
                    addDataString(
                      addDataString(FOOTER_TEXT, year, '%YEAR%'),
                      LINK1,
                      '%LINK1%'
                    ),
                    LINK2,
                    '%LINK2%'
                  ),
                  LINK3,
                  '%LINK3%'
                )
              }}
            />
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Footer;
