import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button
} from 'reactstrap';
import classnames from 'classnames';
import {
  NAME,
  CHECKSUM,
  SIZE,
  DOWNLOAD,
  PATH_APPLIANCE,
  DOMAIN
} from '../../../constants';

class Files extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: '0'
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    if (this.state.active !== tab) {
      this.setState({
        active: tab
      });
    }
  }

  render() {
    const navs = [];
    const panes = [];
    const { active } = this.state;
    const { data, id } = this.props;
    data.map((tab, i) => {
      const { name, checksum, size } = tab;
      if (name && checksum && size) {
        const idString = i.toString();
        const urlDownload =
          id && id.$oid
            ? `${DOMAIN + PATH_APPLIANCE}/${id.$oid}/download/${idString}`
            : '#';
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
              <b className={classnames('text-capitalize', 'tab-download')}>
                {`${name} - ${idString}`}
              </b>
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
              <Col sm="12">
                <div>
                  <div className={classnames('pb-2')}>
                    <a
                      className={classnames(
                        'btn',
                        'btn-success',
                        'w-100',
                        'py-2'
                      )}
                      target="_blank"
                      href={urlDownload}
                    >
                      <b>{DOWNLOAD}</b>
                    </a>
                  </div>
                  <hr />
                  <div className={classnames('details')}>
                    <Row>
                      <Col>
                        <small>
                          <b className={classnames('color-primary')}>{NAME}</b>
                          {name}
                        </small>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <small>
                          <b className={classnames('color-primary')}>
                            {CHECKSUM}
                          </b>
                          {checksum && checksum.md5}
                        </small>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <small>
                          <b className={classnames('color-primary')}>{SIZE}</b>
                          {size}
                        </small>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </TabPane>
        );
      }
    });
    return (
      <Col>
        <Nav tabs horizontal="end">
          {navs}
        </Nav>
        <TabContent className={classnames('mt-2')} activeTab={active}>
          {panes}
        </TabContent>
      </Col>
    );
  }
}

Files.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      checksum: PropTypes.shape({
        md5: PropTypes.string,
        sha256: PropTypes.string
      }),
      size: PropTypes.number
    })
  ),
  id: PropTypes.shape({
    $oid: PropTypes.string
  })
};

Files.defaultProps = {
  data: [],
  id: {}
};

export default Files;
