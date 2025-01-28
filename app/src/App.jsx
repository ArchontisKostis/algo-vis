import { useState } from 'react';
import Graph from './components/Graph';
import { UnionFind } from './utils/algorithms';
import { generateNodes, generateEdges } from './utils/graphGenerators';
import './App.css';

export default function App() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [mstEdges, setMstEdges] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [currentEdge, setCurrentEdge] = useState(null);

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
            setCurrentEdge(edge);
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (uf.union(edge.from, edge.to)) {
                mst.push(edge);
                setMstEdges([...mst]);
            }

            setCurrentEdge(null);
        }
        setIsRunning(false);
    };

    return (
        <div className="App">
            <div className="controls">
                <button onClick={generateGraph} disabled={isRunning}>
                    Generate New Graph
                </button>
                <button
                    onClick={startKruskal}
                    disabled={isRunning || nodes.length === 0}
                >
                    {isRunning ? 'Running...' : 'Run Kruskal\'s Algorithm'}
                </button>
            </div>

            <Graph
                nodes={nodes}
                edges={edges}
                mstEdges={mstEdges}
                currentEdge={currentEdge}
            />

            <div className="legend">
                <div><span style={{ color: '#FF5722' }}>Orange</span> - Current Edge</div>
                <div><span style={{ color: '#4CAF50' }}>Green</span> - MST Edge</div>
                <div><span style={{ color: '#ddd' }}>Gray</span> - Unprocessed Edge</div>
            </div>
        </div>
    );
}