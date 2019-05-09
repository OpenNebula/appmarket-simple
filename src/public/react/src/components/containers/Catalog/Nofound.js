import React from 'react';
import { Alert } from 'reactstrap';
import classnames from 'classnames';
import { NOT_FOUND_RECORDS } from '../../../constants';

export default () => (
  <Alert color="danger" className={classnames('text-center', 'mt-5')}>
    <b>{NOT_FOUND_RECORDS}</b>
  </Alert>
);
