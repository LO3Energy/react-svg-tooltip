import * as React from 'react';
import * as ReactDOM from 'react-dom';
import svgPoint from './svg-point';

export type Props = {
    readonly for: React.RefObject<SVGElement>
};

export type TooltipHidden = {
    readonly type: 'TooltipHidden'
};

export type TooltipVisible = {
    readonly type: 'TooltipVisible'
    readonly svgSvgElement: SVGSVGElement;
    readonly x: number
    readonly y: number
};

export type State = TooltipHidden | TooltipVisible;

export class TooltipComponent extends React.Component<Props, State> {

    readonly state: Readonly<State> = {type: 'TooltipHidden'};

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
            return <g/>;
        } else {
            const x = this.state.x;
            const y = this.state.y;

            const tooltip =
                (
                    <g
                        className="Tooltip"
                        pointerEvents="none" // tooltip should never grab mouse > prevent flickering
                    >
                        {
                            React.Children.map(this.props.children, child => {
                                return React.cloneElement(child as React.ReactElement<any>, { 
                                    x, 
                                    y,
                                });
                            })
                        }
                    </g>
                );

            return ReactDOM.createPortal(tooltip, this.state.svgSvgElement);
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

    private readonly updateTooltipListener = (evt: MouseEvent) => {
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
    }

    private readonly hideTooltipListener = () => this.setState({type: 'TooltipHidden'});

}

export default TooltipComponent;
