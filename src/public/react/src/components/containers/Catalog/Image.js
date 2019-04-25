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
    this.removeHypervisorInTitle = this.removeHypervisorInTitle.bind(this);
  }

  errorImage(e) {
    e.target.onerror = null;
    this.setState({ error: true });
  }

  removeHypervisorInTitle(title) {
    const { removeHypervisors } = this.props;
    if (title.length && removeHypervisors.length) {
      const regx = new RegExp(
        `\\s+\\-\\s(${removeHypervisors.join('|')})`,
        'gi'
      );
      return title.replace(regx, '');
    }
    return title;
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
    console.log('-->', hypervisor.toLowerCase());
    const pathLogo = `${DOMAIN}/logos/${logo}`;
    const rendertags = tags.length ? (
      <div
        className={classnames(
          'tags',
          'd-none',
          'd-sm-flex',
          'justify-content-center'
        )}
      >
        {tags.map(tag => (
          <Badge color="dark" key={tag}>
            {tag}
          </Badge>
        ))}
      </div>
    ) : null;
    return (
      <Col xs="12" sm="6" lg="3" key={data}>
        <Card
          className={classnames('image', 'overflow-hidden', 'border-0')}
          onClick={() => select(data)}
        >
          <div
            className={classnames(
              'image-place',
              'card-img-top',
              'd-none',
              'd-sm-inline-block'
            )}
          >
            {error ? (
              <i className={classnames('fas', 'fa-hdd')} />
            ) : (
              <img src={pathLogo} alt={name} onError={this.errorImage} />
            )}
          </div>
          {hypervisor.length ? (
            <div
              className={classnames(
                'hypervisor',
                'position-absolute',
                'font-weight-bold',
                'px-5',
                'py-2',
                'text-center',
                'd-none',
                'd-sm-block',
                'text-uppercase',
                { 'bg-ec2': hypervisor.toLowerCase() === 'ec2' },
                { 'bg-vmware': hypervisor.toLowerCase() === 'vmware' },
                { 'bg-kvm': hypervisor.toLowerCase() === 'kvm' }
              )}
            >
              {hypervisor}
            </div>
          ) : null}
          <CardBody>
            <CardTitle
              className={classnames(
                'overflow-hidden',
                'text-truncate',
                'm-0',
                'mb-sm-2',
                'd-flex',
                'align-items-center',
                'justify-content-center'
              )}
            >
              {this.removeHypervisorInTitle(name)}
            </CardTitle>
            {rendertags}
          </CardBody>
          <CardFooter className={classnames('text-left')}>
            <Row>
              <Col>
                <b>{PUBLISHER}</b>
                {publisher}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>{HYPERVISOR}</b>
                {hypervisor}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>{ARCH}</b>
                {arch}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>{FORMAT}</b>
                {format}
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
  select: PropTypes.func,
  removeHypervisors: PropTypes.arrayOf(PropTypes.string)
};
Image.defaultProps = {
  data: ImagesDefaultProp,
  select: () => null,
  removeHypervisors: []
};

export default Image;
