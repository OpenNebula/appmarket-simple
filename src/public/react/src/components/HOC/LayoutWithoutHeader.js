import React from 'react';
import { Container } from 'reactstrap';

const LayoutWithoutHeader = ComposedComponent => props => (
  <Container>
    <ComposedComponent {...props} />
  </Container>
);

export default LayoutWithoutHeader;
