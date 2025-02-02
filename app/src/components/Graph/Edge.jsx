import React from "react";

const Edge = ({ from, to, isHighlighted, isCurrent, color, weight }) => (
    <g>
        <line
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={isHighlighted ? '#4CAF50' : isCurrent ? '#FF5722' : color || '#ddd'}
            strokeWidth={isCurrent ? 3 : 2}
        />
        <text
            x={(from.x + to.x) / 2}
            y={(from.y + to.y) / 2}
            textAnchor="middle"
            fill={isHighlighted ? '#4CAF50' : '#666'}
            style={{ pointerEvents: 'none' }}
        >
            {weight}
        </text>
    </g>
);

export default Edge;