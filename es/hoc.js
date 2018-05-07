import _Object$keys from "@babel/runtime/core-js/object/keys";
import _Object$getPrototypeOf from "@babel/runtime/core-js/object/get-prototype-of";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import debounce from 'lodash.debounce';
import matchMediaQuery from 'matchmediaquery';
import PropTypes from 'prop-types';
import Cookies from 'isomorphic-cookie';
import React from 'react';
import { MediaQueryWrapper } from './components';
import { getMedia } from './media';
import { breakPoints as defaultBreakPoints } from './defaults';
export var hoc = function hoc(WrappedComponent) {
  var _class, _temp;

  return _temp = _class = function (_React$Component) {
    _inherits(ReactResponsiveNextHoc, _React$Component);

    _createClass(ReactResponsiveNextHoc, null, [{
      key: "getBrowserWidth",
      value: function getBrowserWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      }
    }, {
      key: "getBrowserHeight",
      value: function getBrowserHeight() {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      }
    }, {
      key: "onResize",
      value: function onResize() {
        console.log('onResize');
        ReactResponsiveNextHoc.updateDeviceTypeByViewportSize();
      }
    }, {
      key: "updateDeviceTypeByViewportSize",
      value: function updateDeviceTypeByViewportSize() {
        console.log('getCurrentMedia');
        var detectedMedia = null;
        ReactResponsiveNextHoc.mediaQueriesMatchers.forEach(function (mediaItem) {
          console.log('mediaQueryItem', mediaItem.type, mediaItem.matcher.matches);

          if (mediaItem.matcher.matches) {
            if (!detectedMedia || detectedMedia && detectedMedia.defaultWidth < mediaItem.defaultWidth) {
              detectedMedia = mediaItem;
            }
          }
        });
        console.log('updateDeviceTypeByViewportSize', detectedMedia);
        Cookies.save('detectedMediaWidth', detectedMedia.defaultWidth, {
          secure: false
        });
        Cookies.save('detectedMediaType', detectedMedia.type, {
          secure: false
        });
      }
    }, {
      key: "onMediaQueryMatch",
      value: function onMediaQueryMatch(a1, a2) {
        console.log('onMediaQueryMatch', a1, a2);
      }
    }, {
      key: "getDefaultMediaWidthByType",
      value: function getDefaultMediaWidthByType(mediaType) {
        var media = getMedia(defaultBreakPoints);

        if (media[mediaType]) {
          return media[mediaType].defaultWidth;
        }

        return media.desktop.defaultWidth;
      }
    }, {
      key: "getInitialProps",
      value: function () {
        var _getInitialProps = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var args,
              newProps,
              device,
              detectedMediaType,
              detectedMediaWidth,
              checkEnvironment,
              newArgs,
              _args = arguments;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  args = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                  newProps = {
                    env: {}
                  };

                  if (args && args.req) {
                    device = eval('require(\'device\')');
                    detectedMediaType = Cookies.load('detectedMediaType', args.req);
                    detectedMediaWidth = Cookies.load('detectedMediaWidth', args.req);
                    console.log('cookie detectedMediaWidth', detectedMediaWidth);

                    checkEnvironment = function checkEnvironment() {
                      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                          _ref$headers = _ref.headers,
                          headers = _ref$headers === void 0 ? {} : _ref$headers;

                      var ua = headers['user-agent'] || headers['User-Agent'] || '';
                      var detectedDevice = device(ua);
                      return {
                        userAgentMediaType: detectedDevice.type,
                        detectedMediaType: detectedMediaType || detectedDevice.type,
                        detectedMediaWidth: detectedMediaWidth || ReactResponsiveNextHoc.getDefaultMediaWidthByType(detectedDevice.type),
                        detectedMediaModel: detectedDevice.model || null
                      };
                    };

                    newProps.env = checkEnvironment(args.req);
                  } else {
                    newProps.env = {
                      userAgentMediaType: null,
                      detectedMediaType: null,
                      detectedMediaWidth: 0,
                      detectedMediaModel: null
                    };
                  }

                  newArgs = _extends({}, args, newProps);

                  if (!WrappedComponent.getInitialProps) {
                    _context.next = 12;
                    break;
                  }

                  _context.t0 = _extends;
                  _context.t1 = {};
                  _context.t2 = newProps;
                  _context.next = 10;
                  return WrappedComponent.getInitialProps(newArgs);

                case 10:
                  _context.t3 = _context.sent;
                  newProps = (0, _context.t0)(_context.t1, _context.t2, _context.t3);

                case 12:
                  MediaQueryWrapper.fakeWidth = newProps.env.detectedMediaWidth;
                  return _context.abrupt("return", newProps);

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function getInitialProps() {
          return _getInitialProps.apply(this, arguments);
        };
      }()
    }]);

    function ReactResponsiveNextHoc(props) {
      var _this;

      _classCallCheck(this, ReactResponsiveNextHoc);

      _this = _possibleConstructorReturn(this, (ReactResponsiveNextHoc.__proto__ || _Object$getPrototypeOf(ReactResponsiveNextHoc)).call(this, props));
      ReactResponsiveNextHoc.mediaQueriesMatchers = [];
      var breakPoints = _this.props.breakPoints;
      var windowWidth = process.browser ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth : 1;
      var media = getMedia(breakPoints);

      _Object$keys(media).forEach(function (type) {
        var _media$type = media[type],
            mediaQuery = _media$type.mediaQuery,
            defaultWidth = _media$type.defaultWidth;
        var matcher = matchMediaQuery(mediaQuery, {
          width: windowWidth
        });
        ReactResponsiveNextHoc.mediaQueriesMatchers.push({
          type: type,
          matcher: matcher,
          defaultWidth: defaultWidth
        });
      });

      _this.state = {
        env: {}
      };
      return _this;
    }

    _createClass(ReactResponsiveNextHoc, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        ReactResponsiveNextHoc.onResize();
        this.onResizeHandler = debounce(ReactResponsiveNextHoc.onResize, 200);
        window.addEventListener('resize', this.onResizeHandler, false);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.onResizeHandler) {
          window.removeEventListener('resize', this.onResizeHandler, false);
        }
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement("div", null, React.createElement(WrappedComponent, _extends({}, this.state, this.props)), ";");
      }
    }]);

    return ReactResponsiveNextHoc;
  }(React.Component), _class.propTypes = {
    breakPoints: PropTypes.shape({
      tablet: PropTypes.number,
      desktop: PropTypes.number
    })
  }, _class.defaultProps = {
    breakPoints: defaultBreakPoints
  }, _temp;
};
//# sourceMappingURL=hoc.js.map