import { Children, Component, cloneElement, createElement } from 'react';
import { createPortal } from 'react-dom';

/**
 * Returns the *x* and *y* coordinates of the mouse relative to the svg root container element.
 * The coordinates are returned as an array of two-elements \[*x*, *y*].
 * Inspired by https://raw.githubusercontent.com/d3/d3-selection/master/src/point.js
 * @param svg the root svg container element
 * @param event the mouse event
 */
const svgPoint = (svg, event) => {
    if (svg.createSVGPoint) {
        let point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        point = point.matrixTransform(svg.getScreenCTM().inverse());
        return [point.x, point.y];
    }
    const rect = svg.getBoundingClientRect();
    return [event.clientX - rect.left - svg.clientLeft, event.clientY - rect.top - svg.clientTop];
};

class TooltipComponent extends Component {
    constructor() {
        super(...arguments);
        this.state = { type: 'TooltipHidden' };
        this.updateTooltipListener = (evt) => {
            const mouseTrigger = this.props.for.current;
            if (mouseTrigger) {
                if (mouseTrigger.ownerSVGElement) {
                    const mousePosition = svgPoint(mouseTrigger.ownerSVGElement, evt);
                    this.setState({
                        type: 'TooltipVisible',
                        svgSvgElement: mouseTrigger.ownerSVGElement,
                        x: mousePosition[0],
                        y: mousePosition[1]
                    });
                }
            }
        };
        this.hideTooltipListener = () => this.setState({ type: 'TooltipHidden' });
    }
    componentDidMount() {
        const mouseTrigger = this.props.for.current;
        if (mouseTrigger) {
            mouseTrigger.addEventListener(`mouseover`, this.updateTooltipListener);
            mouseTrigger.addEventListener(`mousemove`, this.updateTooltipListener);
            mouseTrigger.addEventListener(`mouseleave`, this.hideTooltipListener);
        }
    }
    render() {
        if (this.state.type === 'TooltipHidden') {
            return createElement("g", null);
        }
        else {
            const x = this.state.x;
            const y = this.state.y;
            const tooltip = (createElement("g", { className: "Tooltip", pointerEvents: "none" // tooltip should never grab mouse > prevent flickering
             }, Children.map(this.props.children, child => {
                return cloneElement(child, {
                    x,
                    y,
                });
            })));
            return createPortal(tooltip, this.state.svgSvgElement);
        }
    }
    componentWillUnmount() {
        const mouseTrigger = this.props.for.current;
        if (mouseTrigger) {
            mouseTrigger.removeEventListener(`mouseover`, this.updateTooltipListener);
            mouseTrigger.removeEventListener(`mousemove`, this.updateTooltipListener);
            mouseTrigger.removeEventListener(`mouseleave`, this.hideTooltipListener);
        }
    }
}

export { TooltipComponent as Tooltip };
//# sourceMappingURL=react-svg-tooltip.es2015.js.map
