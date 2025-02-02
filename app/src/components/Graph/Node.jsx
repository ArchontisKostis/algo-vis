import React from "react";

const Node = ({ id, x, y, isHighlighted, isCurrent }) => {
        const strokeColor = isHighlighted ? '#4CAF50' : isCurrent ? '#FF5722' : '#2196F3';
        const fillColor = isHighlighted ? 'rgb(159,209,163)' : isCurrent ? 'rgb(255,163,132)' : '#fff';

        return (
            <g transform={`translate(${x},${y})`}>
                    <circle r="20" fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                    <text textAnchor="middle" dy=".3em" style={{ userSelect: 'none', fontWeight: 'bold' }}>
                            {id}
                    </text>
            </g>
        );
};

export default Node;