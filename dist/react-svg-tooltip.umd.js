(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom'], factory) :
	(factory((global.reactSvgTooltip = {}),global.React,global.ReactDOM));
}(this, (function (exports,React,ReactDOM) { 'use strict';

/**
 * Returns the *x* and *y* coordinates of the mouse relative to the svg root container element.
 * The coordinates are returned as an array of two-elements \[*x*, *y*].
 * Inspired by https://raw.githubusercontent.com/d3/d3-selection/master/src/point.js
 * @param svg the root svg container element
 * @param event the mouse event
 */
var svgPoint = function (svg, event) {
    if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        point = point.matrixTransform(svg.getScreenCTM().inverse());
        return [point.x, point.y];
    }
    var rect = svg.getBoundingClientRect();
    return [event.clientX - rect.left - svg.clientLeft, event.clientY - rect.top - svg.clientTop];
};

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TooltipComponent = /** @class */ (function (_super) {
    __extends(TooltipComponent, _super);
    function TooltipComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { type: 'TooltipHidden' };
        _this.updateTooltipListener = function (evt) {
            var mouseTrigger = _this.props.for.current;
            if (mouseTrigger) {
                if (mouseTrigger.ownerSVGElement) {
                    var mousePosition = svgPoint(mouseTrigger.ownerSVGElement, evt);
                    _this.setState({
                        type: 'TooltipVisible',
                        svgSvgElement: mouseTrigger.ownerSVGElement,
                        x: mousePosition[0],
                        y: mousePosition[1]
                    });
                }
            }
        };
        _this.hideTooltipListener = function () { return _this.setState({ type: 'TooltipHidden' }); };
        return _this;
    }
    TooltipComponent.prototype.componentDidMount = function () {
        var mouseTrigger = this.props.for.current;
        if (mouseTrigger) {
            mouseTrigger.addEventListener("mouseover", this.updateTooltipListener);
            mouseTrigger.addEventListener("mousemove", this.updateTooltipListener);
            mouseTrigger.addEventListener("mouseleave", this.hideTooltipListener);
        }
    };
    TooltipComponent.prototype.render = function () {
        if (this.state.type === 'TooltipHidden') {
            return React.createElement("g", null);
        }
        else {
            var x_1 = this.state.x;
            var y_1 = this.state.y;
            var tooltip = (React.createElement("g", { className: "Tooltip", pointerEvents: "none" // tooltip should never grab mouse > prevent flickering
             }, React.Children.map(this.props.children, function (child) {
                return React.cloneElement(child, {
                    x: x_1,
                    y: y_1,
                });
            })));
            return ReactDOM.createPortal(tooltip, this.state.svgSvgElement);
        }
    };
    TooltipComponent.prototype.componentWillUnmount = function () {
        var mouseTrigger = this.props.for.current;
        if (mouseTrigger) {
            mouseTrigger.removeEventListener("mouseover", this.updateTooltipListener);
            mouseTrigger.removeEventListener("mousemove", this.updateTooltipListener);
            mouseTrigger.removeEventListener("mouseleave", this.hideTooltipListener);
        }
    };
    return TooltipComponent;
}(React.Component));

exports.Tooltip = TooltipComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=react-svg-tooltip.umd.js.map
