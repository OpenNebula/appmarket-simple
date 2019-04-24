import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import Loading from './Loading';
import Image from './Image';
import Nofound from './Nofound';
import {
  addImages,
  selectImage,
  addTags,
  displayFilters
} from '../../../actions';
import {
  fetchData,
  IMAGES_URL,
  ImagesPropTypes,
  ImagesDefaultProp
} from '../../../constants';

class Catalog extends Component {
  constructor(props) {
    super(props);
    this.setImage = this.setImage.bind(this);
  }

  componentDidMount() {
    const { dispatch, images } = this.props;
    if (images && images.length <= 0) {
      let createTags = [];
      fetchData(IMAGES_URL, {
        method: 'GET',
        json: true
      }).then(res => {
        if (res && res.appliances) {
          dispatch(addImages(res.appliances));
          res.appliances.map(e => {
            if (
              e.tags &&
              e.tags.constructor &&
              e.tags.constructor.name &&
              e.tags.constructor.name === 'Array'
            ) {
              createTags = createTags.concat(
                e.tags.filter(tag => createTags.indexOf(tag) < 0)
              );
            }
          });
          dispatch(addTags(createTags));
        }
      });
    }
  }

  setImage(image) {
    const { dispatch, history } = this.props;
    dispatch(selectImage(image));
    if (image && image._id && image._id.$oid) {
      history.push(`/${image._id.$oid}`);
      dispatch(displayFilters(false));
    }
  }

  render() {
    const { images, title, selectedTags } = this.props;
    let render = null;
    if (images.length <= 0) {
      render = <Loading />;
    } else {
      let renderImages = images;
      if (title.length) {
        renderImages = images.filter(e => {
          const re = new RegExp(title, 'i');
          return e.name && e.name.match(re);
        });
      }
      if (selectedTags.length) {
        renderImages = renderImages.filter(image => {
          let r = false;
          if (image && image.tags) {
            r = !!selectedTags.find(tag => image.tags.includes(tag));
          }
          return r;
        });
      }
      const imagesRender = renderImages.length ? (
        <Row className={classnames('justify-content-md-start')}>
          {renderImages.map(e => (
            <Image data={e} select={this.setImage} key={e.name} />
          ))}
        </Row>
      ) : (
        <Nofound />
      );
      render = (
        <Row>
          <Col xs="12">
            <Row>
              <Col className={classnames('mb-1')}>{imagesRender}</Col>
            </Row>
          </Col>
        </Row>
      );
    }
    return (
      <section
        className={classnames(
          'catalog',
          'flex-grow-1',
          'bg-opennebula',
          'pt-4'
        )}
      >
        <Container>{render}</Container>
      </section>
    );
  }
}

Catalog.propTypes = {
  dispatch: PropTypes.func,
  images: PropTypes.arrayOf(ImagesPropTypes),
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

Catalog.defaultProps = {
  dispatch: () => null,
  images: [ImagesDefaultProp],
  selectedTags: [],
  title: '',
  history: { push: () => null }
};

function mapStateToProps({ catalog }) {
  return {
    images: catalog.images,
    image: catalog.image,
    selectedTags: catalog.selectedTags,
    title: catalog.title
  };
}
export default connect(mapStateToProps)(Catalog);
