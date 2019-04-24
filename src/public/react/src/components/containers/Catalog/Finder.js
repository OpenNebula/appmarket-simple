import React, { Component } from 'react';
import {
  Row,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  Button,
  Collapse,
  Card
} from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { filterTitle, selectTags, displayFilters } from '../../../actions';
import { SEARCH, TAGS } from '../../../constants';

class Finder extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeTags = this.changeTags.bind(this);
    this.clearTags = this.clearTags.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  toggle() {
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

  clearTags() {
    const { dispatch } = this.props;
    dispatch(selectTags([]));
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
      displayFilters: showFilters
    } = this.props;
    const idFilters = 'filters';
    const renderTags = tags.map(e => (
      <option key={e} value={e} className={classnames('text-capitalize')}>
        {e}
      </option>
    ));
    return (
      <div className={classnames('finder', 'w-100')}>
        <Row id={idFilters} className={classnames('no-gutters')}>
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
            toggle={this.toggle}
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
  displayFilters: PropTypes.bool
};

Finder.defaultProps = {
  title: '',
  tags: [],
  selectedTags: [],
  dispatch: () => null,
  redirect: () => null,
  location: '',
  displayFilters: false
};
function mapStateToProps({ catalog }) {
  return {
    title: catalog.title,
    selectedTags: catalog.selectedTags,
    tags: catalog.tags,
    displayFilters: catalog.displayFilters
  };
}

export default connect(mapStateToProps)(Finder);
