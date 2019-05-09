import React from 'react';
import { Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { NOT_FOUND, MESSAGES_NOT_FOUND } from '../../../constants';

export default () => (
  <Row>
    <Col>
      <h1 className={classnames('display-3')}>{NOT_FOUND}</h1>
      <p className={classnames('lead')}>{MESSAGES_NOT_FOUND}</p>
    </Col>
  </Row>
);
