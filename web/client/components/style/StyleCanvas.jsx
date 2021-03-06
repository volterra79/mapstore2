/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
// const Tuscany = require('./Tuscany').split(" ");
const defaultIcon = require('../map/openlayers/img/marker-icon.png');
const StyleCanvas = React.createClass({
    propTypes: {
        style: React.PropTypes.object,
        shapeStyle: React.PropTypes.object,
        geomType: React.PropTypes.oneOf(['Polygon', 'Polyline', 'Point', 'Marker', undefined]),
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },
    getDefaultProps() {
        return {
          style: {},
          shapeStyle: {},
          geomType: 'Polygon',
          width: 100,
          height: 80
        };
    },
    componentDidMount: function() {
      let context = this.refs.styleCanvas.getContext('2d');
      this.paint(context);
  },

    componentDidUpdate: function() {
      let context = this.refs.styleCanvas.getContext('2d');
      context.clearRect(0, 0, 500, 500);
      this.paint(context);
  },
  render() {
      return <canvas ref="styleCanvas" style={this.props.style} width={this.props.width} height={this.props.height} />;
  },
  paint(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = `rgba(${ this.props.shapeStyle.fill.r }, ${ this.props.shapeStyle.fill.g }, ${ this.props.shapeStyle.fill.b }, ${ this.props.shapeStyle.fill.a })`;
      ctx.strokeStyle = `rgba(${ this.props.shapeStyle.color.r }, ${ this.props.shapeStyle.color.g }, ${ this.props.shapeStyle.color.b }, ${ this.props.shapeStyle.color.a })`;
      ctx.lineWidth = this.props.shapeStyle.width;
      switch (this.props.geomType) {
          case 'Polygon': {
              this.paintPolygon(ctx);
              break;
          }
          case 'Polyline': {
              this.paintPolyline(ctx);
              break;
          }
          case 'Point': {
              this.paintPoint(ctx);
              break;
          }
          case 'Marker': {
              this.paintMarker(ctx);
              break;
          }
          default: {
              return;
          }
      }
      ctx.restore();
  },
  paintPolygon(ctx) {
      ctx.transform(1, 0, 0, 1, -27.5, 0);
      ctx.moveTo(55, 8);
      ctx.lineTo(100, 8);
      ctx.lineTo(117.5, 40);
      ctx.lineTo(100, 72);
      ctx.lineTo(55, 72);
      ctx.lineTo(37.5, 40);
      ctx.closePath();
     // ctx.moveTo(117.5, 40);
     // ctx.arc(77.5, 40, 40, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
  },
  paintPolyline(ctx) {
      ctx.transform(1, 0, 0, 1, 0, 0);
      ctx.moveTo(10, 20);
      ctx.bezierCurveTo(40, 40, 70, 0, 90, 20);
      ctx.stroke();
  },
  paintPoint(ctx) {
      // ctx.moveTo(50, 40);
      ctx.arc(50, 48.5, this.props.shapeStyle.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
  },
  paintMarker(ctx) {
      // ctx.moveTo(50, 40);
      let icon = new Image();
      icon.src = defaultIcon;
      try {
          ctx.drawImage(icon, 42.5, 24);
      }catch (e) {
          return;
      }
  }
});

module.exports = StyleCanvas;
