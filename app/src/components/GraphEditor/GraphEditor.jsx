import './GraphEditor.css';
import { useState, useEffect } from 'react';

const GraphEditor = ({ nodes, edges, onNodesChange, onEdgesChange }) => {
    const [newEdge, setNewEdge] = useState({ from: null, to: null, weight: 1 });
    const [isCreatingEdge, setIsCreatingEdge] = useState(false);
    const [viewport, setViewport] = useState({ x: 0, y: 0, width: 500, height: 400 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [draggingNode, setDraggingNode] = useState(null);

    useEffect(() => {
        if (nodes.length === 0) {
            setViewport({ x: 0, y: 0, width: 500, height: 400 });
            return;
        }

        const padding = 100;
        const xs = nodes.map(node => node.x);
        const ys = nodes.map(node => node.y);

        const minX = Math.min(...xs) - padding;
        const minY = Math.min(...ys) - padding;
        const maxX = Math.max(...xs) + padding;
        const maxY = Math.max(...ys) + padding;

        setViewport({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        });
    }, [nodes]);

    const handleCanvasClick = (e) => {
        if (draggingNode) return; // Ignore clicks while dragging

        const svg = e.target.closest('svg');
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());

        const clickedNode = nodes.find(node =>
            Math.hypot(node.x - x, node.y - y) < 20
        );

        if (clickedNode) {
            if (isCreatingEdge) {
                if (!newEdge.from) {
                    setNewEdge(prev => ({ ...prev, from: clickedNode.id }));
                } else if (clickedNode.id !== newEdge.from) {
                    setNewEdge(prev => ({ ...prev, to: clickedNode.id }));
                }
            }
        } else {
            const newNode = {
                id: nodes.length + 1,
                x: x,
                y: y
            };
            onNodesChange([...nodes, newNode]);
        }
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        if (draggingNode) return;

        const svg = e.target.closest('svg');
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());

        const clickedEdge = edges.find(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return false;

            const edgeMiddle = {
                x: (fromNode.x + toNode.x) / 2,
                y: (fromNode.y + toNode.y) / 2,
            };
            return Math.hypot(edgeMiddle.x - x, edgeMiddle.y - y) < 15;
        });

        if (clickedEdge) {
            onEdgesChange(edges.filter(edge => edge.id !== clickedEdge.id));
            return;
        }

        const clickedNode = nodes.find(node => Math.hypot(node.x - x, node.y - y) < 20);
        if (clickedNode) {
            onNodesChange(nodes.filter(node => node.id !== clickedNode.id));
            onEdgesChange(edges.filter(edge => edge.from !== clickedNode.id && edge.to !== clickedNode.id));
        }
    };

    const handleMouseMove = (e) => {
        const svg = e.target.closest('svg');
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());
        setMousePos({ x, y });

        if (draggingNode) {
            const updatedNodes = nodes.map(node =>
                node.id === draggingNode.id
                    ? { ...node, x, y }
                    : node
            );
            onNodesChange(updatedNodes);
        }
    };

    const handleMouseDown = (node) => {
        setDraggingNode(node);
    };

    const handleMouseUp = () => {
        setDraggingNode(null);
    };

    const addEdge = () => {
        if (newEdge.from === null || newEdge.to === null) return;

        const edgeExists = edges.some(edge =>
            (edge.from === newEdge.from && edge.to === newEdge.to) ||
            (edge.from === newEdge.to && edge.to === newEdge.from)
        );

        if (!edgeExists) {
            const newEdges = [...edges, {
                id: edges.length,
                from: newEdge.from,
                to: newEdge.to,
                weight: newEdge.weight
            }];
            onEdgesChange(newEdges);
        }

        setNewEdge({ from: null, to: null, weight: 1 });
        setIsCreatingEdge(false);
    };

    const saveGraphToFile = () => {
        const graphData = { nodes, edges };
        const jsonData = JSON.stringify(graphData, null, 2);

        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'graph.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const loadGraphFromFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const loadedData = JSON.parse(reader.result);
            onNodesChange(loadedData.nodes);
            onEdgesChange(loadedData.edges);
        };
        reader.readAsText(file);
    };

    return (
        <div className="editor-container">
            <div className="editor-controls">
                <button
                    onClick={() => setIsCreatingEdge(!isCreatingEdge)}
                    className={isCreatingEdge ? 'active' : ''}
                >
                    {isCreatingEdge ? 'Cancel Edge' : 'Add Edge'}
                </button>

                {isCreatingEdge && (
                    <div className="edge-creation">
                        <input
                            type="number"
                            min="1"
                            value={newEdge.weight}
                            onChange={(e) => setNewEdge(prev => ({
                                ...prev,
                                weight: Math.max(1, parseInt(e.target.value) || 1),
                            }))}
                            placeholder="Weight"
                        />
                        <button
                            onClick={addEdge}
                            disabled={!newEdge.from || !newEdge.to}
                        >
                            Confirm
                        </button>
                        <div className="instructions">
                            {!newEdge.from
                                ? "Select first node"
                                : !newEdge.to
                                    ? "Select second node"
                                    : "Click confirm to add edge"}
                        </div>
                    </div>
                )}

                <button onClick={saveGraphToFile}>Save Graph</button>

                <div className="mb-3">
                    <label htmlFor="load-graph-input">Load Graph</label>
                    <input
                        type="file"
                        className="form-control"
                        accept=".json"
                        onChange={loadGraphFromFile}
                        id="load-graph-input"
                    />
                </div>


                <div className="alert alert-info alert-dismissible fade show" role="alert">
                    <h6 className="alert-heading">
                        <i className="bi bi-info-circle"> </i>How to use
                    </h6>
                    <hr />
                    <ul style={{
                        padding: "0 1em",
                        margin: 0,
                        textAlign: 'left'
                    }}>
                        <li>Click anywhere to create a node.</li>
                        <li>Right-click a node to delete it.</li>
                        <li>Click and drag a node to move it.</li>
                        <li>Click "Add Edge" to connect two nodes.</li>
                    </ul>

                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>

            <svg
                className="editor-canvas"
                viewBox={`${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`}
                preserveAspectRatio="xMidYMid meet"
                onClick={handleCanvasClick}
                onContextMenu={handleRightClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: isCreatingEdge ? 'crosshair' : 'default' }}
            >
                {edges.map(edge => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    return (
                        <g key={edge.id}>
                            <line
                                x1={fromNode?.x}
                                y1={fromNode?.y}
                                x2={toNode?.x}
                                y2={toNode?.y}
                                stroke="#666"
                                strokeWidth="2"
                            />
                            <text
                                x={(fromNode?.x + toNode?.x) / 2}
                                y={(fromNode?.y + toNode?.y) / 2}
                                textAnchor="middle"
                                fill="#333"
                                className="edge-weight"
                            >
                                {edge.weight}
                            </text>
                        </g>
                    );
                })}

                {isCreatingEdge && newEdge.from !== null && (
                    <line
                        x1={nodes.find(n => n.id === newEdge.from)?.x}
                        y1={nodes.find(n => n.id === newEdge.from)?.y}
                        x2={mousePos.x}
                        y2={mousePos.y}
                        stroke="#FF5722"
                        strokeWidth="2"
                        strokeDasharray="4"
                    />
                )}

                {nodes.map(node => (
                    <g
                        key={node.id}
                        transform={`translate(${node.x},${node.y})`}
                        className="interactive-node"
                        onMouseDown={() => handleMouseDown(node)}
                    >
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

export default GraphEditor;
