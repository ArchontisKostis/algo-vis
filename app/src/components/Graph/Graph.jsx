import React from 'react';
import Edge from "./Edge.jsx";
import Node from "./Node.jsx";

const Graph = ({ nodes, edges, highlightedEdges, currentEdge }) => {
    const getNodePosition = (id) => nodes.find(node => node.id === id);

    const getViewBox = () => {
        if (nodes.length === 0) return "0 0 900 200";

        const xs = nodes.map(node => node.x);
        const ys = nodes.map(node => node.y);
        const padding = 80;

        const minX = Math.min(...xs) - padding;
        const minY = Math.min(...ys) - padding;
        const width = Math.max(...xs) - minX + padding;
        const height = Math.max(...ys) - minY + padding;

        return `${minX} ${minY} ${width} ${height}`;
    };

    const highlightedNodeIds = new Set(highlightedEdges.flatMap(edge => [edge.from, edge.to]));
    const currentNodeIds = currentEdge ? [currentEdge.from, currentEdge.to] : [];

    return (
        <div className="graph-container">
            <svg
                viewBox={getViewBox()}
                preserveAspectRatio="xMidYMid meet"
                width="90%"
                height="90%"
            >
                {edges.map(edge => (
                    <Edge
                        key={edge.id}
                        from={getNodePosition(edge.from)}
                        to={getNodePosition(edge.to)}
                        isHighlighted={highlightedEdges.some(e => e.id === edge.id)}
                        isCurrent={currentEdge?.id === edge.id}
                        color={edge.color}
                        weight={edge.weight}
                    />
                ))}

                {nodes.map(node => (
                    <Node
                        key={node.id}
                        id={node.id}
                        x={node.x}
                        y={node.y}
                        isHighlighted={highlightedNodeIds.has(node.id)}
                        isCurrent={currentNodeIds.includes(node.id)}
                    />
                ))}
            </svg>
        </div>
    );
};

export default Graph;
