import React from 'react';

const Graph = ({ nodes, edges, mstEdges, currentEdge }) => {
    const getNodePosition = (id) => nodes.find(node => node.id === id);

    const getViewBox = () => {
        if (nodes.length === 0) return "0 0 800 400";

        const xs = nodes.map(node => node.x);
        const ys = nodes.map(node => node.y);
        const padding = 80;

        const minX = Math.min(...xs) - padding;
        const minY = Math.min(...ys) - padding;
        const width = Math.max(...xs) - minX + padding;
        const height = Math.max(...ys) - minY + padding;

        return `${minX} ${minY} ${width} ${height}`;
    };

    return (
        <div className="graph-container">
            <svg
                viewBox={getViewBox()}
                preserveAspectRatio="xMidYMid meet"
                width="100%"
                height="100%"
            >
                {edges.map(edge => {
                    const from = getNodePosition(edge.from);
                    const to = getNodePosition(edge.to);
                    const isInMST = mstEdges.some(e => e.id === edge.id);
                    const isCurrent = currentEdge?.id === edge.id;

                    return (
                        <g key={edge.id}>
                            <line
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                stroke={isInMST ? '#4CAF50' : isCurrent ? '#FF5722' : '#ddd'}
                                strokeWidth={isCurrent ? 3 : 2}
                            />
                            <text
                                x={(from.x + to.x) / 2}
                                y={(from.y + to.y) / 2}
                                textAnchor="middle"
                                fill={isInMST ? '#4CAF50' : '#666'}
                                style={{ pointerEvents: 'none' }}
                            >
                                {edge.weight}
                            </text>
                        </g>
                    );
                })}

                {nodes.map(node => (
                    <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                        <circle r="20" fill="#fff" stroke="#2196F3" strokeWidth="2" />
                        <text
                            textAnchor="middle"
                            dy=".3em"
                            style={{ userSelect: 'none', fontWeight: 'bold' }}
                        >
                            {node.id}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default Graph;