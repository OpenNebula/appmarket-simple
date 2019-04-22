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
  InputGroupAddon
} from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';
import Loading from '../Catalog/Loading';
import Files from './Files';
import { selectImage } from '../../../actions';
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
  OS
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
        <Nav pills>{navs}</Nav>
        <TabContent className={classnames('mt-2')} activeTab={active}>
          {panes}
        </TabContent>
      </Col>
    );
  }

  render() {
    const { image } = this.props;
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
              <div className={classnames('pb-2', 'description')}>
                <ReactMarkdown source={description} />
              </div>
              <hr />
              <Row className={classnames('details')}>
                <Col xs="12" sm="6">
                  <Row>
                    <Col>
                      <small>
                        <b className={classnames('color-primary')}>
                          {PUBLISHER}
                        </b>
                        {publisher}
                      </small>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small>
                        <b className={classnames('color-primary')}>{ID}</b>
                        {id && id.$oid}
                      </small>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small>
                        <b className={classnames('color-primary')}>{CREATED}</b>
                        {moment
                          .unix(creationTime)
                          .format('YYYY-MM-DD HH:mm:ss')}
                      </small>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small>
                        <b className={classnames('color-primary')}>{VERSION}</b>
                        {version}
                      </small>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small>
                        <b className={classnames('color-primary')}>
                          {OPENNEBULA_VERSION}
                        </b>
                        {opennebulaVersion}
                      </small>
                    </Col>
                  </Row>
                </Col>
                <Col xs="12" sm="6">
                  <Row>
                    <Col>
                      <small>
                        <b className={classnames('color-primary')}>{FORMAT}</b>
                        {format}
                      </small>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small>
                        <b className={classnames('color-primary')}>{OS}</b>
                        {`${osId} ${osRelease}`}
                      </small>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small>
                        <b className={classnames('color-primary')}>
                          {HYPERVISOR}
                        </b>
                        {hypervisor}
                      </small>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small>
                        <b className={classnames('color-primary')}>{ARCH}</b>
                        {arch}
                      </small>
                    </Col>
                  </Row>
                </Col>
              </Row>
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
                defaultValue={opennebulaTemplate}
                className={classnames('template')}
                disabled
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
        <div className={classnames('tags', 'text-center')}>
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
            <Col xs="12" sm="4">
              <div className={classnames('image-place')}>
                {errorImg ? (
                  <i className={classnames('fas', 'fa-hdd')} />
                ) : (
                  <img src={pathLogo} alt={name} onError={this.errorImage} />
                )}
              </div>
              {rendertags}
            </Col>
            <Col xs="12" sm="8">
              <Row>
                <Col>
                  <h3 className={classnames('text-center', 'mb-3')}>{name}</h3>
                </Col>
              </Row>
              <Row>{this.renderTabs(Tabs)}</Row>
            </Col>
          </Row>
        </Card>
      );
    }
    return <div className={classnames('product', 'flex-grow-1')}>{render}</div>;
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
