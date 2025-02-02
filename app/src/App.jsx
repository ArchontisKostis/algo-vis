import {useState, useEffect, useRef, useCallback} from 'react';
import Graph from './components/Graph';
import GraphEditor from './components/GraphEditor';
import { UnionFind } from './utils/algorithms';
import { generateNodes, generateEdges } from './utils/graphGenerators';
import './App.css';
import { BallTriangle, Bars } from 'react-loader-spinner';

export default function App() {
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


    // For loading JSON graph data
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    // Check for valid data format
                    if (data.nodes && data.edges) {
                        setNodes(data.nodes);
                        setEdges(data.edges);
                        setMstEdges([]);
                        setMstSequence([]); // Reset sequence when new file is loaded
                        setCurrentEdge(null);
                    } else {
                        alert('Invalid graph data.');
                    }
                } catch (error) {
                    alert('Error parsing the file.');
                }
            };
            reader.readAsText(file);
        }
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
            <div className="modal fade" id="helpModal" tabIndex="-1" aria-labelledby="helpModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="helpModalLabel">
                                <i className="bi bi-question-circle"></i> Help
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <ul style={{
                                listStyleType: "none",
                                padding: "0",
                                margin: "0",
                                textAlign: "left",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5em"
                            }}>
                                <li>
                                    <button style={{height: "100%"}} className="btn btn-dark"> <i className="bi bi-pencil"></i> </button> - Enter Edit Mode to create a custom graph.
                                </li>

                                <li>
                                    <button style={{height: "100%"}} className="btn btn-dark"> <i className="bi bi-magic"></i> </button> - Generate a random graph.
                                </li>

                                <li>
                                    <button style={{height: "100%"}} className="btn btn-dark"> <i className="bi bi-arrow-counterclockwise"></i> </button> - Reset the graph.
                                </li>

                                <li>
                                    <button style={{height: "100%"}} className="btn btn-success"> <i className="bi bi-play-circle"></i> </button> - Run the algorithm.
                                </li>

                                <li>
                                    <button style={{height: "100%"}} className="btn btn-warning"> <i className="bi bi-pause-circle"></i> </button> - Pause the algorithm.
                                </li>

                                <li>
                                    <button style={{height: "100%"}} className="btn btn-danger"> <i className="bi bi-stop-circle"></i> </button> - Stop the algorithm.
                                </li>

                                <li>
                                    <input
                                        style={{width: "20%", backgroundColor: "#e9ecef", padding: ".375rem .75rem", borderRadius: "0.375rem", border: "none"}}
                                        type="number"
                                        value="1500"
                                        disabled="true"
                                        step="100"
                                    />&nbsp;&nbsp;- Delay between steps (in ms). Press Enter to apply.
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <i style={{textAlign: "center", fontSize: "0.8rem"}}>
                                The buttons on the current help modal are for demonstration purposes only and do not have any functionality.
                            </i>
                        </div>
                    </div>
                </div>
            </div>


            <div className="App">
                <h1 style={{fontSize: "1.5em", textAlign: "center"}}>
                    Kruskal's Algorithm Visualization
                </h1>

                <br/>

                <div className="controls">
                    <button
                        onClick={toggleEditMode}
                        className={isEditing ? 'btn btn-dark active' : 'btn btn-dark'}
                        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Tooltip on bottom"
                        title={isEditing ? 'Exit Edit Mode' : 'Custom Graph'}
                    >
                        {isEditing ? 'Exit Edit Mode' : <i className="bi bi-pencil"></i>}
                    </button>

                    {!isEditing && (
                        <>
                            <button type="button" className="btn btn-dark" onClick={generateGraph} disabled={isRunning}
                                    title="Generate Random Graph">
                                <i className="bi bi-magic"></i>
                            </button>

                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={resetGraph}
                                disabled={isRunning || nodes.length === 0}
                                title="Reset"
                            >
                                <i className="bi bi-arrow-counterclockwise"></i>
                            </button>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={startKruskal}
                                disabled={isRunning || nodes.length === 0}
                                title={nodes.length === 0 ? 'Generate a graph first' : "Run Kruskal's Algorithm"}
                            >
                                {isRunning ? (
                                    <Bars
                                        height="20"
                                        width="20"
                                        color="#fff"
                                        ariaLabel="bars-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                    />
                                ) : (
                                    <i className="bi bi-play-circle"></i>
                                )}
                            </button>

                            <button
                                onClick={handlePauseResume}
                                disabled={!isRunning}
                                className="btn btn-warning"
                                title={isPaused ? 'Resume' : 'Pause'}
                            >
                                {isPaused ? (
                                    <>
                                        <i className="bi bi-play-circle"></i>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-pause-circle"></i>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleStop}
                                disabled={!isRunning}
                                className="btn btn-danger"
                                title="Stop"
                            >
                                <i className="bi bi-stop-circle"></i>
                            </button>

                            <div className="form-outline">
                                {/*<label className="form-label" htmlFor="typeNumber">*/}
                                {/*    Delay (ms)*/}
                                {/*</label>*/}
                                <input
                                    type="number"
                                    id="typeNumber"
                                    className="form-control"
                                    value={stepDelay}
                                    onChange={(e) => setStepDelay(e.target.value)}
                                    onBlur={(e) => setStepDelay(e.target.value)}
                                    disabled={isRunning}
                                    step={100}
                                    min={0}
                                />
                            </div>

                            <button
                                data-bs-toggle="modal" data-bs-target="#helpModal"
                                className="btn btn-primary"
                                title="Help"
                            >
                                <i className="bi bi-question-circle-fill"></i>
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

                <br/>

                {mstSequence.length > 0 && (
                    <div className="mst-sequence">
                        <h5><strong>Edge Addition Sequence:</strong></h5>
                        <ul>
                            {mstSequence.map((edge, index) => (
                                <li key={index}>{edge}</li>
                            ))}
                        </ul>
                    </div>
                )}


                <footer style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5em",
                }}>
                    <i className="bi bi-github"> </i> <a href="https://github.com/ArchontisKostis/algo-vis"
                                                         rel="noreferrer" target="_blank"> Source Code</a>
                </footer>
            </div>
        </>
    );
}
