import React, { Component } from 'react';
import {
  Row,
  Input,
  Label,
  Col,
  InputGroup,
  InputGroupAddon,
  Button,
  Collapse
} from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SEARCH, TAGS } from '../../../constants';

class Finder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      collapse: !this.state.collapse
    });
  }

  render() {
    const {
      value,
      changeTitle,
      tags,
      changeTags,
      clearTags,
      selectedTags,
      clearTitle
    } = this.props;
    const renderTags = tags.map(e => (
      <option key={e} value={e}>
        {e}
      </option>
    ));
    return (
      <Row className={classnames('finder', 'card', 'mx-0')}>
        <Col className={classnames('card-body', 'py-0')}>
          <Row>
            <InputGroup className={classnames('col-12', 'p-0', 'mb-2')}>
              <Input
                className={classnames('h-auto')}
                placeholder={SEARCH}
                onChange={changeTitle}
                value={value}
              />
              <InputGroupAddon addonType="append">
                <Button color="danger" onClick={clearTitle}>
                  <i className={classnames('fas', 'fa-eraser')} />
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <Col xs="12" className={classnames('p-0', 'text-right')}>
              <Button
                className={classnames('font-weight-bold')}
                onClick={this.toggle}
                size="sm"
                color="link"
              >
                <i className={classnames('fas', 'fa-filter')} />
              </Button>
            </Col>
            <Collapse
              isOpen={this.state.collapse}
              className={classnames('col-12')}
            >
              <Row className={classnames('pt-2')}>
                <Label
                  className={classnames('col-12', 'col-sm-2', 'p-0', 'p-sm-2')}
                >
                  <b>{`${TAGS}:`}</b>
                </Label>
                <InputGroup
                  className={classnames('col-12', 'col-sm-10', 'p-0')}
                >
                  <Input
                    type="select"
                    value={selectedTags}
                    onChange={changeTags}
                    multiple
                  >
                    {renderTags}
                  </Input>
                  <InputGroupAddon addonType="append">
                    <Button color="danger" onClick={clearTags}>
                      <i className={classnames('fas', 'fa-eraser')} />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Row>
            </Collapse>
          </Row>
        </Col>
      </Row>
    );
  }
}
Finder.propTypes = {
  value: PropTypes.string,
  changeTitle: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.string),
  changeTags: PropTypes.func,
  clearTags: PropTypes.func,
  clearTitle: PropTypes.func,
  selectedTags: PropTypes.arrayOf(PropTypes.string)
};

Finder.defaultProps = {
  value: '',
  changeTitle: () => null,
  tags: [],
  changeTags: () => null,
  clearTags: () => null,
  clearTitle: () => null,
  selectedTags: []
};

export default Finder;
