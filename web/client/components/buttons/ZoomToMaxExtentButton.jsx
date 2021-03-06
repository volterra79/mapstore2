/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var BootstrapReact = require('react-bootstrap');
var Button = BootstrapReact.Button;
var Glyphicon = BootstrapReact.Glyphicon;
var ImageButton = require('./ImageButton');

const mapUtils = require('../../utils/MapUtils');
const configUtils = require('../../utils/ConfigUtils');


/**
 * A button to zoom to max. extent of the map or zoom level one.
 * Component's properies:
 *  - id: {string}            custom identifier for this component
 *  - style: {object}         a css-like hash to define the style on the component
 *  - glyphicon: {string}     bootstrap glyphicon name
 *  - text: {string|element}  text content for the button
 *  - btnSize: {string}       bootstrap button size ('large', 'small', 'xsmall')
 */
var ZoomToMaxExtentButton = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        style: React.PropTypes.object,
        image: React.PropTypes.string,
        glyphicon: React.PropTypes.string,
        text: React.PropTypes.string,
        btnSize: React.PropTypes.oneOf(['large', 'medium', 'small', 'xsmall']),
        mapConfig: React.PropTypes.object,
        mapInitialConfig: React.PropTypes.object,
        changeMapView: React.PropTypes.func,
        btnType: React.PropTypes.oneOf(['normal', 'image']),
        helpEnabled: React.PropTypes.bool,
        helpText: React.PropTypes.string,
        className: React.PropTypes.string,
        useInitialExtent: React.PropTypes.bool
    },
    getDefaultProps() {
        return {
            id: "mapstore-zoomtomaxextent",
            style: undefined,
            glyphicon: "resize-full",
            text: undefined,
            btnSize: 'xsmall',
            btnType: 'normal',
            className: undefined,
            useInitialExtent: false
        };
    },
    render() {
        if (this.props.btnType === 'normal') {
            return (
                <Button
                    id={this.props.id}
                    bsStyle="default"
                    bsSize={this.props.btnSize}
                    onClick={() => this.props.useInitialExtent ? this.zoomToInitialExtent() : this.zoomToMaxExtent()}
                    className={this.props.className}
                    >
                    {this.props.glyphicon ? <Glyphicon glyph={this.props.glyphicon}/> : null}
                    {this.props.glyphicon && this.props.text ? "\u00A0" : null}
                    {this.props.text}
                </Button>
            );
        }
        return (
            <ImageButton
                id={this.props.id}
                image={this.props.image}
                onClick={() => this.props.useInitialExtent ? this.zoomToInitialExtent() : this.zoomToMaxExtent()}
                style={this.props.style}
                className={this.props.className}/>
        );
    },
    zoomToMaxExtent() {
        var mapConfig = this.props.mapConfig;
        var maxExtent = mapConfig.maxExtent;
        var mapSize = this.props.mapConfig.size;
        var newZoom = 1;
        var newCenter = this.props.mapConfig.center;
        var proj = this.props.mapConfig.projection || "EPSG:3857";

        if (maxExtent &&
            Object.prototype.toString.call(maxExtent) === '[object Array]') {
            // zoom by the max. extent defined in the map's config
            newZoom = mapUtils.getZoomForExtent(maxExtent, mapSize, 0, 21);

            // center by the max. extent defined in the map's config
            newCenter = mapUtils.getCenterForExtent(maxExtent, proj);

            // do not reproject for 0/0
            if (newCenter.x !== 0 || newCenter.y !== 0) {
                // reprojects the center object
                newCenter = configUtils.getCenter(newCenter, "EPSG:4326");
            }

        }

        // we compute the new bbox
        let bbox = mapUtils.getBbox(newCenter, newZoom, mapSize);

        // adapt the map view by calling the corresponding action
        this.props.changeMapView(newCenter, newZoom, bbox, this.props.mapConfig.size, null, this.props.mapConfig.projection);
    },
    zoomToInitialExtent() {
        // zooming to the initial extent based on initial map configuration
        var mapConfig = this.props.mapInitialConfig;
        let bbox = mapUtils.getBbox(mapConfig.center, mapConfig.zoom, this.props.mapConfig.size);
        this.props.changeMapView(mapConfig.center, mapConfig.zoom, bbox, this.props.mapConfig.size, null, mapConfig.projection);
    }
});

module.exports = ZoomToMaxExtentButton;
