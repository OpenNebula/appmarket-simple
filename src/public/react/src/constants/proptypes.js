import PropTypes from 'prop-types';

export const ImageFilePropTypes = PropTypes.shape({
  checksum: PropTypes.shape({
    md5: PropTypes.string,
    sha256: PropTypes.string
  }),
  dev_prefix: PropTypes.string,
  driver: PropTypes.string,
  format: PropTypes.string,
  hypervisor: PropTypes.string,
  md5: PropTypes.string,
  name: PropTypes.string,
  'os-arch': PropTypes.string,
  size: PropTypes.number,
  type: PropTypes.string,
  url: PropTypes.string
});

export const ImagesPropTypes = PropTypes.shape({
  creation_time: PropTypes.number,
  description: PropTypes.string,
  files: PropTypes.arrayOf(ImageFilePropTypes),
  format: PropTypes.string,
  hypervisor: PropTypes.string,
  links: PropTypes.shape({
    download: PropTypes.shape({ href: PropTypes.string })
  }),
  logo: PropTypes.string,
  name: PropTypes.string,
  opennebula_template: PropTypes.string,
  opennebula_version: PropTypes.string,
  'os-arch': PropTypes.string,
  'os-id': PropTypes.string,
  'os-release': PropTypes.string,
  publisher: PropTypes.string,
  short_description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  version: PropTypes.string,
  _id: PropTypes.shape({ $oid: PropTypes.string })
});

export const MatchProps = PropTypes.shape({
  path: PropTypes.string,
  url: PropTypes.string,
  isExact: PropTypes.bool,
  params: PropTypes.shape({})
});
