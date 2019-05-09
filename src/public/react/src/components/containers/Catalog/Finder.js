import React, { Component } from 'react';
import {
  Row,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  Button,
  Collapse,
  Card,
  Col
} from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  filterTitle,
  selectTags,
  displayFilters,
  selectHypervisors
} from '../../../actions';
import { SEARCH, TAGS, HYPERVISOR, stopPropagation } from '../../../constants';

class Finder extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeTags = this.changeTags.bind(this);
    this.changeHypervisors = this.changeHypervisors.bind(this);
    this.clearTags = this.clearTags.bind(this);
    this.clearHypervisors = this.clearHypervisors.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  toggle(e) {
    const { dispatch, displayFilters: showFilters } = this.props;
    dispatch(displayFilters(!showFilters));
  }

  changeTitle(e) {
    const { dispatch } = this.props;
    const title = e.target.value;
    dispatch(filterTitle(title));
    this.redirect();
  }

  changeTags(e) {
    const { dispatch } = this.props;
    if (e && e.target && e.target.options) {
      const options = e.target.options;
      const optionsSelected = [...options]
        .filter(option => option.selected)
        .map(option => option.value);
      dispatch(selectTags(optionsSelected));
      this.redirect();
    }
  }

  changeHypervisors(e) {
    const { dispatch } = this.props;
    if (e && e.target && e.target.options) {
      const options = e.target.options;
      const optionsSelected = [...options]
        .filter(option => option.selected)
        .map(option => option.value);
      dispatch(selectHypervisors(optionsSelected));
      this.redirect();
    }
  }

  clearTags() {
    const { dispatch } = this.props;
    dispatch(selectTags([]));
    this.redirect();
  }

  clearHypervisors() {
    const { dispatch } = this.props;
    dispatch(selectHypervisors([]));
    this.redirect();
  }

  redirect() {
    const { redirect, location } = this.props;
    if (location !== '/') {
      redirect('/');
    }
  }

  render() {
    const {
      title,
      tags,
      selectedTags,
      displayFilters: showFilters,
      hypervisors,
      selectedHypervisors
    } = this.props;
    const renderTags = tags.map(e => (
      <option key={e} value={e} className={classnames('text-capitalize')}>
        {e}
      </option>
    ));
    const renderHypervisors = hypervisors.map(e => (
      <option key={e} value={e} className={classnames('text-capitalize')}>
        {e}
      </option>
    ));
    return (
      <div className={classnames('finder', 'w-100')} onClick={stopPropagation}>
        <Row className={classnames('no-gutters')}>
          <InputGroup className={classnames('col-12')}>
            <Input
              className={classnames('h-auto')}
              placeholder={SEARCH}
              onChange={this.changeTitle}
              value={title}
            />
            <InputGroupAddon addonType="append">
              <Button outline color="secondary" onClick={this.toggle}>
                <i className={classnames('fas', 'fa-filter')} />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <Collapse
            className={classnames(
              'finder-filters',
              'col-12',
              'position-relative'
            )}
            isOpen={showFilters}
          >
            <Card
              body
              className={classnames(
                'mt-2',
                'p-2',
                'position-absolute',
                'w-100'
              )}
            >
              <Row className={classnames('no-gutters')}>
                <Col>
                  <Row className={classnames('no-gutters')}>
                    <Label
                      className={classnames(
                        'col-12',
                        'col-sm-4',
                        'p-0',
                        'p-sm-2'
                      )}
                    >
                      <b>{`${TAGS}`}</b>
                    </Label>
                    <InputGroup
                      className={classnames('col-12', 'col-sm-8', 'p-0')}
                    >
                      <Input
                        type="select"
                        value={selectedTags}
                        onChange={this.changeTags}
                        multiple
                      >
                        {renderTags}
                      </Input>
                      <InputGroupAddon addonType="append">
                        <Button color="danger" onClick={this.clearTags}>
                          <i className={classnames('fas', 'fa-eraser')} />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Row>
                  <Row className={classnames('mt-2', 'no-gutters')}>
                    <Label
                      className={classnames(
                        'col-12',
                        'col-sm-4',
                        'p-0',
                        'p-sm-2'
                      )}
                    >
                      <b>{`${HYPERVISOR}`}</b>
                    </Label>
                    <InputGroup
                      className={classnames('col-12', 'col-sm-8', 'p-0')}
                    >
                      <Input
                        type="select"
                        value={selectedHypervisors}
                        onChange={this.changeHypervisors}
                        multiple
                      >
                        {renderHypervisors}
                      </Input>
                      <InputGroupAddon addonType="append">
                        <Button color="danger" onClick={this.clearHypervisors}>
                          <i className={classnames('fas', 'fa-eraser')} />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Collapse>
        </Row>
      </div>
    );
  }
}
Finder.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  dispatch: PropTypes.func,
  redirect: PropTypes.func,
  location: PropTypes.string,
  displayFilters: PropTypes.bool,
  hypervisors: PropTypes.arrayOf(PropTypes.string),
  selectedHypervisors: PropTypes.arrayOf(PropTypes.string)
};

Finder.defaultProps = {
  title: '',
  tags: [],
  selectedTags: [],
  dispatch: () => null,
  redirect: () => null,
  location: '',
  displayFilters: false,
  hypervisors: [],
  selectedHypervisors: []
};
function mapStateToProps({ catalog }) {
  return {
    title: catalog.title,
    selectedTags: catalog.selectedTags,
    tags: catalog.tags,
    displayFilters: catalog.displayFilters,
    hypervisors: catalog.hypervisors,
    selectedHypervisors: catalog.selectedHypervisors
  };
}

export default connect(mapStateToProps)(Finder);
