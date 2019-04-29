import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  InputGroup,
  Input,
  InputGroupAddon,
  Container
} from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';
import Loading from '../Catalog/Loading';
import Files from './Files';
import { selectImage, displayFilters } from '../../../actions';
import {
  ImagesPropTypes,
  fetchData,
  ImagesDefaultProp,
  addDataString,
  IMAGE_URL,
  MatchProps,
  MatchDefaultProps,
  DOMAIN,
  PUBLISHER,
  HYPERVISOR,
  ARCH,
  FORMAT,
  FILES,
  INFO,
  TEMPLATE,
  CREATED,
  ID,
  VERSION,
  OPENNEBULA_VERSION,
  OS,
  removeEndPoints,
  NOT_AVAILABLE
} from '../../../constants';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: '1',
      errorImg: false
    };
    this.toggle = this.toggle.bind(this);
    this.errorImage = this.errorImage.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.parseMarkdown = this.parseMarkdown.bind(this);
    this.copy = this.copy.bind(this);
  }

  componentDidMount() {
    const { image, match, dispatch } = this.props;
    if (image === null && match && match.params && match.params.id) {
      fetchData(addDataString(IMAGE_URL, match.params.id), {
        method: 'GET',
        json: true
      }).then(res => {
        if (res) {
          dispatch(selectImage(res));
        }
      });
    }
  }

  errorImage() {
    this.setState({ errorImg: true });
  }

  toggle(tab) {
    if (this.state.active !== tab) {
      this.setState({
        active: tab
      });
    }
  }

  parseMarkdown(text) {
    let r = text;
    if (text && text.length) {
      try {
        r = JSON.stringify(JSON.parse(text), null, 2);
      } catch (error) {}
    }
    return r;
  }

  copy(value) {
    if (value && value.length) {
      const el = document.createElement('textarea');
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }

  renderTabs(tabs) {
    const navs = [];
    const panes = [];
    const { active } = this.state;
    tabs.map(tab => {
      const { id, title, content, condition = false } = tab;
      if (id && title && content && condition) {
        const idString = id.toString();
        navs.push(
          <NavItem key={idString}>
            <NavLink
              className={classnames({
                active: active === idString
              })}
              onClick={() => {
                this.toggle(idString);
              }}
            >
              <b>{title}</b>
            </NavLink>
          </NavItem>
        );
        panes.push(
          <TabPane
            tabId={idString}
            key={idString}
            className={classnames('pt-2')}
          >
            <Row>
              <Col sm="12">{content}</Col>
            </Row>
          </TabPane>
        );
      }
    });
    return (
      <Col>
        <Nav
          pills
          className={classnames(
            'justify-content-center',
            'justify-content-sm-start'
          )}
        >
          {navs}
        </Nav>
        <TabContent className={classnames('mt-2')} activeTab={active}>
          {panes}
        </TabContent>
      </Col>
    );
  }

  render() {
    const { image, dispatch } = this.props;
    let render = null;
    if (image === null) {
      render = <Loading />;
    } else {
      const { errorImg } = this.state;
      const {
        name,
        tags,
        description,
        logo,
        publisher,
        hypervisor,
        'os-arch': arch,
        'os-id': osId,
        'os-release': osRelease,
        format,
        files,
        opennebula_template: opennebulaTemplate,
        opennebula_version: opennebulaVersion,
        version,
        creation_time: creationTime,
        _id: id
      } = image;

      const Tabs = [
        {
          id: 1,
          title: INFO,
          content: (
            <div>
              <div className={classnames('p-3', 'description')}>
                <ReactMarkdown source={description} />
              </div>
              <hr />
              <div>
                <Row className={classnames('mb-3')}>
                  <Col>
                    <b
                      className={classnames('color-primary', 'text-uppercase')}
                    >
                      {removeEndPoints(ID)}
                    </b>
                    <div>{id && id.$oid}</div>
                  </Col>
                </Row>
                <Row className={classnames('mb-3')}>
                  <Col>
                    <b
                      className={classnames('color-primary', 'text-uppercase')}
                    >
                      {removeEndPoints(OPENNEBULA_VERSION)}
                    </b>
                    <div>{opennebulaVersion}</div>
                  </Col>
                </Row>
              </div>
            </div>
          ),
          condition: description && description.length
        },
        {
          id: 2,
          title: FILES,
          content: <Files data={files} id={id} />,
          condition: files && files.length
        },
        {
          id: 3,
          title: TEMPLATE,
          content: (
            <InputGroup>
              <Input
                type="textarea"
                defaultValue={this.parseMarkdown(opennebulaTemplate)}
                className={classnames('template')}
                readOnly
              />
              <InputGroupAddon addonType="append">
                <Button
                  color="success"
                  onClick={() => this.copy(opennebulaTemplate)}
                >
                  <i className={classnames('fas', 'fa-copy')} />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          ),
          condition: opennebulaTemplate && opennebulaTemplate.length
        }
      ];

      const rendertags = tags.length ? (
        <div className={classnames('my-2', 'text-center', 'tags')}>
          {tags.map(tag => (
            <Badge color="dark" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      ) : null;
      const pathLogo = `${DOMAIN}/logos/${logo}`;

      render = (
        <Card body className={classnames('mt-4')}>
          <Row>
            <Col className={classnames('d-block', 'd-sm-none')}>
              <h3 className={classnames('text-center', 'mb-3')}>{name}</h3>
            </Col>
            <Col xs="12" sm="3" className={classnames('border-right-limit')}>
              <div className={classnames('image-place')}>
                {errorImg ? (
                  <i className={classnames('fas', 'fa-hdd')} />
                ) : (
                  <img src={pathLogo} alt={name} onError={this.errorImage} />
                )}
              </div>
              {rendertags}
              <Row>
                <Col xs="12">
                  <Row className={classnames('mb-3')}>
                    <Col>
                      <b
                        className={classnames(
                          'color-primary',
                          'text-uppercase'
                        )}
                      >
                        {removeEndPoints(PUBLISHER)}
                      </b>
                      <div>{publisher}</div>
                    </Col>
                  </Row>
                  <Row className={classnames('mb-3')}>
                    <Col>
                      <b
                        className={classnames(
                          'color-primary',
                          'text-uppercase'
                        )}
                      >
                        {removeEndPoints(HYPERVISOR)}
                      </b>
                      <div>{hypervisor}</div>
                    </Col>
                  </Row>
                  <Row className={classnames('mb-3')}>
                    <Col>
                      <b
                        className={classnames(
                          'color-primary',
                          'text-uppercase'
                        )}
                      >
                        {removeEndPoints(ARCH)}
                      </b>
                      <div>{arch}</div>
                    </Col>
                  </Row>
                  <Row className={classnames('mb-3')}>
                    <Col>
                      <b
                        className={classnames(
                          'color-primary',
                          'text-uppercase'
                        )}
                      >
                        {FORMAT}
                      </b>
                      <div>{removeEndPoints(format)}</div>
                    </Col>
                  </Row>
                  <Row className={classnames('mb-3')}>
                    <Col>
                      <b
                        className={classnames(
                          'color-primary',
                          'text-uppercase'
                        )}
                      >
                        {removeEndPoints(CREATED)}
                      </b>
                      <div>
                        {creationTime
                          ? moment
                              .unix(creationTime)
                              .format('YYYY-MM-DD HH:mm:ss')
                          : NOT_AVAILABLE}
                      </div>
                    </Col>
                  </Row>
                  <Row className={classnames('mb-3')}>
                    <Col>
                      <b
                        className={classnames(
                          'color-primary',
                          'text-uppercase'
                        )}
                      >
                        {removeEndPoints(VERSION)}
                      </b>
                      <div>{version}</div>
                    </Col>
                  </Row>
                  <Row className={classnames('mb-3')}>
                    <Col>
                      <b
                        className={classnames(
                          'color-primary',
                          'text-uppercase'
                        )}
                      >
                        {removeEndPoints(OS)}
                      </b>
                      <div>{`${osId} ${osRelease || ''}`}</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xs="12" sm="9">
              <Row>
                <Col className={classnames('d-none', 'd-sm-block')}>
                  <h3 className={classnames('text-center', 'mb-3')}>{name}</h3>
                </Col>
              </Row>
              <Row>{this.renderTabs(Tabs)}</Row>
            </Col>
          </Row>
        </Card>
      );
    }
    return (
      <div
        className={classnames('bg-color', 'flex-grow-1', 'd-flex')}
        onClick={() => dispatch(displayFilters(false))}
      >
        <Container className={classnames('product', 'pt-4', 'mb-4')}>
          {render}
        </Container>
      </div>
    );
  }
}

Product.propTypes = {
  dispatch: PropTypes.func,
  image: ImagesPropTypes,
  match: MatchProps
};

Product.defaultProps = {
  dispatch: () => null,
  image: ImagesDefaultProp,
  match: MatchDefaultProps
};

function mapStateToProps({ catalog }) {
  return {
    image: catalog.image
  };
}
export default connect(mapStateToProps)(Product);
