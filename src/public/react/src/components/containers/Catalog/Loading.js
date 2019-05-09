import React from 'react';
import { Row, Col, Alert } from 'reactstrap';
import classnames from 'classnames';
import { LOADING_TEXT } from '../../../constants';

export default () => (
  <Row className={classnames('loading', 'align-items-center')}>
    <Col xs="12">
      <Alert color="light" className={classnames('text-center', 'mt-5')}>
        <i className={classnames('fas', 'fa-spinner', 'fa-spin')} />
        <b>{LOADING_TEXT}</b>
      </Alert>
    </Col>
  </Row>
);
