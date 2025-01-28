import { useState } from 'react';
import Graph from './components/Graph';
import GraphEditor from './components/GraphEditor';
import { UnionFind } from './utils/algorithms';
import { generateNodes, generateEdges } from './utils/graphGenerators';
import './App.css';

export default function App() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [mstEdges, setMstEdges] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [currentEdge, setCurrentEdge] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const generateGraph = () => {
        const newNodes = generateNodes(7);
        const newEdges = generateEdges(newNodes, 8);
        setNodes(newNodes);
        setEdges(newEdges);
        setMstEdges([]);
        setCurrentEdge(null);
    };

    const startKruskal = async () => {
        if (!nodes.length) return;

        setIsRunning(true);
        const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
        const uf = new UnionFind(nodes.length);
        const mst = [];

        for (const edge of sortedEdges) {
            setCurrentEdge(edge); // Highlight the current edge (orange)
            await new Promise(resolve => setTimeout(resolve, 1500)); // Delay for visualization

            if (uf.union(edge.from, edge.to)) {
                // If added to MST, make it green
                mst.push(edge);
                setMstEdges([...mst]);
            } else {
                // If it forms a cycle, make it red temporarily
                edge.color = 'red';
                setEdges([...edges]);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to show rejection
                edge.color = 'gray'; // Reset to default
                setEdges([...edges]);
            }

            setCurrentEdge(null); // Reset current edge highlight
        }

        setIsRunning(false);
    };


    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        setMstEdges([]);
        setCurrentEdge(null);
        if (!isEditing) {
            setNodes([]);
            setEdges([]);
        }
    };

    return (
        <div className="App">
            <div className="controls">
                <button onClick={toggleEditMode} className={isEditing ? 'active' : ''}>
                    {isEditing ? 'Exit Edit Mode' : 'Custom Graph Mode'}
                </button>

                {!isEditing && (
                    <>
                        <button onClick={generateGraph} disabled={isRunning}>
                            Generate Random Graph
                        </button>
                        <button
                            onClick={startKruskal}
                            disabled={isRunning || nodes.length === 0}
                        >
                            {isRunning ? 'Running...' : 'Run Kruskal\'s Algorithm'}
                        </button>
                    </>
                )}
            </div>

            {isEditing ? (
                <GraphEditor
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={setNodes}
                    onEdgesChange={setEdges}
                />
            ) : (
                <Graph
                    nodes={nodes}
                    edges={edges}
                    mstEdges={mstEdges}
                    currentEdge={currentEdge}
                />
            )}

            <div className="legend">
                <div><span style={{backgroundColor: '#FF5722'}}></span> Current Edge</div>
                <div><span style={{backgroundColor: '#4CAF50'}}></span> MST Edge</div>
                <div><span style={{backgroundColor: '#ddd'}}></span> Unprocessed Edge</div>
                <div><span style={{backgroundColor: '#666'}}></span> Excluded Edge (forms cycle)</div>
                {isEditing && (
                    <div className="edit-instructions">
                        Click canvas to add nodes | Click nodes to create edges
                    </div>
                )}
            </div>
        </div>
    );
}