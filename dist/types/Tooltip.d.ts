/// <reference types="react" />
import * as React from 'react';
export declare type Props = {
    readonly for: React.RefObject<SVGElement>;
};
export declare type TooltipHidden = {
    readonly type: 'TooltipHidden';
};
export declare type TooltipVisible = {
    readonly type: 'TooltipVisible';
    readonly svgSvgElement: SVGSVGElement;
    readonly x: number;
    readonly y: number;
};
export declare type State = TooltipHidden | TooltipVisible;
export declare class TooltipComponent extends React.Component<Props, State> {
    readonly state: Readonly<State>;
    componentDidMount(): void;
    render(): React.ReactPortal | JSX.Element;
    componentWillUnmount(): void;
    private readonly updateTooltipListener;
    private readonly hideTooltipListener;
}
export default TooltipComponent;
