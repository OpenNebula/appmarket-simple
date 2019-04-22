import React, { Component } from 'react';
import {
  Col,
  Card,
  CardText,
  CardBody,
  Button,
  CardTitle,
  CardFooter,
  Badge,
  Row
} from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  ImagesPropTypes,
  MORE_INFO,
  ImagesDefaultProp,
  DOMAIN,
  substr,
  PUBLISHER,
  HYPERVISOR,
  ARCH,
  FORMAT
} from '../../../constants';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
    this.errorImage = this.errorImage.bind(this);
  }

  errorImage(e) {
    e.target.onerror = null;
    this.setState({ error: true });
  }

  render() {
    const { data, select } = this.props;
    const { error } = this.state;
    const {
      name,
      tags,
      logo,
      publisher,
      hypervisor,
      'os-arch': arch,
      format
    } = data;
    const pathLogo = `${DOMAIN}/logos/${logo}`;
    const rendertags = tags.length ? (
      <div className={classnames('tags')}>
        {tags.map(tag => (
          <Badge color="dark" key={tag}>
            {tag}
          </Badge>
        ))}
      </div>
    ) : null;
    return (
      <Col xs="12" sm="6" lg="3" key={data}>
        <Card className={classnames('image')}>
          <div className={classnames('image-place', 'card-img-top')}>
            {error ? (
              <i className={classnames('fas', 'fa-hdd')} />
            ) : (
              <img src={pathLogo} alt={name} onError={this.errorImage} />
            )}
          </div>
          <CardBody>
            <CardTitle className={classnames('overflow-hidden')}>
              {substr(name, 23)}
            </CardTitle>
            <Button
              className={classnames('info-btn', 'w-100')}
              onClick={() => select(data)}
              color="success"
            >
              {MORE_INFO}
            </Button>
            {rendertags}
          </CardBody>
          <CardFooter className={classnames('text-right')}>
            <Row>
              <Col>
                <small>
                  <b>{PUBLISHER}</b>
                  {publisher}
                </small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small>
                  <b>{HYPERVISOR}</b>
                  {hypervisor}
                </small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small>
                  <b>{ARCH}</b>
                  {arch}
                </small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small>
                  <b>{FORMAT}</b>
                  {format}
                </small>
              </Col>
            </Row>
          </CardFooter>
        </Card>
      </Col>
    );
  }
}

Image.propTypes = {
  data: ImagesPropTypes,
  select: PropTypes.func
};
Image.defaultProps = {
  data: ImagesDefaultProp,
  select: () => null
};

export default Image;
