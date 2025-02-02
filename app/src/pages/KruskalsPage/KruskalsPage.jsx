import { useState, useEffect, useRef, useCallback } from 'react';
import Graph from '../../components/Graph/Graph.jsx';
import GraphEditor from '../../components/GraphEditor/GraphEditor.jsx';
import { UnionFind } from '../../utils/UnionFind.js';
import { generateNodes, generateEdges } from '../../utils/graphGenerators';
import { BallTriangle, Bars } from 'react-loader-spinner';
import ControlsComponent from "../../components/ControlsComponent/ControlsComponent.jsx";
import Legend from "../../components/Legend/Legend.jsx";
import HelpModal from "../../components/HelpModal/HelpModal.jsx";

const KRUSKAL_LEGEND_DATA = [
    {
        color: '#FF5722',
        label: 'Current Edge'
    },
    {
        color: '#4CAF50',
        label: 'MST Edge'
    },
    {
        color: '#ddd',
        label: 'Unprocessed Edge'
    },
    {
        color: '#666',
        label: 'Excluded Edge (forms cycle)'
    }
];

export default function KruskalsPage() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [mstEdges, setMstEdges] = useState([]);
    const [mstSequence, setMstSequence] = useState([]); // To store the sequence of edges in MST
    const [stepDelay, setStepDelay] = useState(1500);
    const [isRunning, setIsRunning] = useState(false);
    const [currentEdge, setCurrentEdge] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const isPausedRef = useRef(false);
    const sortedEdgesRef = useRef([]);
    const ufRef = useRef(null);
    const currentStepRef = useRef(0);
    const mstRef = useRef([]);
    const mstSequenceTempRef = useRef([]);
    const [isPaused, setIsPaused] = useState(false);

    // Sync paused state with ref
    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    // Load default graph from assets folder
    useEffect(() => {
        const loadDefaultGraph = async () => {
            try {
                const response = await fetch('./example_graph_1.json');
                if (!response.ok) {
                    throw new Error('Failed to load default graph');
                }
                const data = await response.json();
                setNodes(data.nodes);
                setEdges(data.edges);
                setMstEdges([]);
                setMstSequence([]); // Reset sequence when new file is loaded
                setCurrentEdge(null);
            } catch (error) {
                console.error('Error loading default graph:', error);
            }
        };

        loadDefaultGraph();
    }, []); // This runs once when the component mounts

    const processNextEdge = useCallback(async () => {
        if (currentStepRef.current >= sortedEdgesRef.current.length || isPausedRef.current) {
            if (currentStepRef.current >= sortedEdgesRef.current.length) {
                setIsRunning(false);
                setMstSequence(mstSequenceTempRef.current);
            }
            return;
        }

        const edge = sortedEdgesRef.current[currentStepRef.current];
        setCurrentEdge(edge);
        await new Promise(resolve => setTimeout(resolve, stepDelay));

        if (ufRef.current.union(edge.from, edge.to)) {
            mstRef.current.push(edge);
            mstSequenceTempRef.current.push(`(${edge.from},${edge.to})`);
            setMstEdges([...mstRef.current]);
        } else {
            setEdges(prevEdges =>
                prevEdges.map(e =>
                    e.id === edge.id ? { ...e, color: 'gray' } : e
                )
            );
        }

        setCurrentEdge(null);
        currentStepRef.current += 1;

        if (!isPausedRef.current) {
            processNextEdge();
        }
    }, [edges, setEdges, setMstEdges, setMstSequence]);

    // Modified reset function
    const resetGraph = () => {
        // Reset state
        setEdges(edges.map(edge => ({ ...edge, color: '#ddd' })));
        setMstEdges([]);
        setMstSequence([]);
        setCurrentEdge(null);
        setIsRunning(false);
        setIsPaused(false);

        // Reset algorithm state
        sortedEdgesRef.current = [];
        ufRef.current = null;
        currentStepRef.current = 0;
        mstRef.current = [];
        mstSequenceTempRef.current = [];
    };

    const generateGraph = () => {
        const newNodes = generateNodes(7);
        const newEdges = generateEdges(newNodes, 8);
        setNodes(newNodes);
        setEdges(newEdges);
        setMstEdges([]);
        setMstSequence([]); // Reset sequence when new graph is generated
        setCurrentEdge(null);
    };

    const startKruskal = useCallback(() => {
        if (!nodes.length || isRunning) return;

        // Initialize algorithm state
        setIsRunning(true);
        setIsPaused(false);
        sortedEdgesRef.current = [...edges].sort((a, b) => a.weight - b.weight);
        ufRef.current = new UnionFind(nodes.length);
        currentStepRef.current = 0;
        mstRef.current = [];
        mstSequenceTempRef.current = [];

        // Start processing
        processNextEdge();
    }, [nodes, edges, isRunning, processNextEdge]);

    const handlePauseResume = () => {
        if (isPausedRef.current) {
            setIsPaused(false);
            isPausedRef.current = false;  // Ensure the ref is updated
            processNextEdge();  // Explicitly call it to resume
        } else {
            setIsPaused(true);
            isPausedRef.current = true;
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        setMstEdges([]);
        setMstSequence([]); // Reset MST sequence
        setCurrentEdge(null);
        if (!isEditing) {
            setNodes([]);
            setEdges([]);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
        setIsPaused(false);
        isPausedRef.current = false;
        currentStepRef.current = sortedEdgesRef.current.length; // Prevents further execution
        setMstEdges([]);
        setMstSequence([]);
        setCurrentEdge(null);

        // Reset algorithm state
        resetGraph()
    };

    return (
        <>
            <HelpModal/>

            <h1 style={{fontSize: "1.5em", textAlign: "center"}}>
                Kruskal's Algorithm Visualization
            </h1>

            <br/>

            <ControlsComponent
                isEditing={isEditing}
                toggleEditMode={toggleEditMode}
                generateGraph={generateGraph}
                resetGraph={resetGraph}
                nodes={nodes}
                isRunning={isRunning}
                startKruskal={startKruskal}
                isPaused={isPaused}
                handlePauseResume={handlePauseResume}
                handleStop={handleStop}
                stepDelay={stepDelay}
                setStepDelay={setStepDelay}
            />

            {isEditing ? (
                <GraphEditor
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={setNodes}
                    onEdgesChange={setEdges}
                />
            ) : (
                <>
                    <Graph
                        nodes={nodes}
                        edges={edges}
                        highlightedEdges={mstEdges}
                        currentEdge={currentEdge}
                    />

                    <Legend data={KRUSKAL_LEGEND_DATA}/>
                </>
            )}

            <br/>

            {mstSequence.length > 0 && (
                <div className="mst-sequence">
                    <h5><strong>Edge Addition Sequence:</strong></h5>
                    <ol className="list-group list-group-numbered">
                        {mstSequence.map((edge, index) => (
                            <li className="list-group-item" key={index}>{edge}</li>
                        ))}
                    </ol>
                </div>
            )}
        </>
    );
}
