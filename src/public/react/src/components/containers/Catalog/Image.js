import React, { Component } from 'react';
import moment from 'moment';
import { Col, Card, CardBody, CardFooter, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  ImagesPropTypes,
  ImagesDefaultProp,
  DOMAIN,
  TAGS,
  ARCH,
  VERSION,
  CREATED,
  NOT_AVAILABLE
} from '../../../constants';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      showDescription: false
    };
    this.errorImage = this.errorImage.bind(this);
    this.showShortDescription = this.showShortDescription.bind(this);
    this.removeHypervisorInTitle = this.removeHypervisorInTitle.bind(this);
  }

  errorImage(e) {
    e.target.onerror = null;
    this.setState({ error: true });
  }

  showShortDescription(state = false) {
    this.setState({ showDescription: state });
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
    const { error, showDescription } = this.state;
    const {
      name,
      tags,
      logo,
      version,
      hypervisor,
      creation_time: creationTime,
      'os-arch': arch,
      short_description: shortDescription
    } = data;
    const pathLogo = `${DOMAIN}/logos/${logo}`;
    return (
      <Col xs="12" sm="6" lg="3" key={data}>
        <Card
          className={classnames('image', 'overflow-hidden', 'border-0')}
          onClick={() => select(data)}
          onMouseEnter={() => this.showShortDescription(true)}
          onMouseLeave={() => this.showShortDescription()}
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
          <CardBody className={classnames('py-2')}>
            <h6
              className={classnames(
                'card-title',
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
            </h6>
          </CardBody>
          {showDescription ? (
            <CardFooter className={classnames('text-left')}>
              <Row
                className={classnames(
                  'h-100',
                  'align-items-center',
                  'justify-content-center',
                  'overflow-hidden'
                )}
              >
                <Col
                  className={classnames('text-truncate', 'short-description')}
                >
                  {shortDescription}
                </Col>
              </Row>
            </CardFooter>
          ) : (
            <CardFooter className={classnames('text-left')}>
              <Row>
                <Col>
                  <b>{ARCH}</b>
                  {arch}
                </Col>
              </Row>
              <Row>
                <Col>
                  <b>{VERSION}</b>
                  {version}
                </Col>
              </Row>
              <Row>
                <Col>
                  <b>{CREATED}</b>
                  {creationTime
                    ? moment.unix(creationTime).format('YYYY-MM-DD HH:mm:ss')
                    : NOT_AVAILABLE}
                </Col>
              </Row>
              {tags && tags.length >= 1 ? (
                <Row>
                  <Col>
                    <b>{TAGS}</b>
                    {tags.join(', ')}
                  </Col>
                </Row>
              ) : null}
            </CardFooter>
          )}
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
