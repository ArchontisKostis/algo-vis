import { useState, useEffect, useRef, useCallback } from 'react';
import Graph from '../../components/Graph/Graph.jsx';
import GraphEditor from '../../components/GraphEditor/GraphEditor.jsx';
import { initializeKruskal, processNextEdge } from '../../utils/kruskal';
import { generateNodes, generateEdges } from '../../utils/graphGenerators';
import ControlsComponent from "../../components/ControlsComponent/ControlsComponent.jsx";
import Legend from "../../components/Legend/Legend.jsx";
import HelpModal from "../../components/HelpModal/HelpModal.jsx";

const KRUSKAL_LEGEND_DATA = [
    { color: '#FF5722', label: 'Current Edge' },
    { color: '#4CAF50', label: 'MST Edge' },
    { color: '#ddd', label: 'Unprocessed Edge' },
    { color: '#666', label: 'Excluded Edge (forms cycle)' }
];

export default function KruskalsPage() {
    const [graphState, setGraphState] = useState({
        nodes: [],
        edges: [],
        mstEdges: [],
        mstSequence: [],
        isRunning: false,
        currentEdge: null,
        isPaused: false,
        isEditing: false,
        currentStep: 0
    });

    const [stepDelay, setStepDelay] = useState(1500);
    const isPausedRef = useRef(false);
    const kruskalStateRef = useRef(null);

    useEffect(() => {
        isPausedRef.current = graphState.isPaused;
    }, [graphState.isPaused]);

    useEffect(() => {
        const loadDefaultGraph = async () => {
            try {
                const response = await fetch('./example_graph_1.json');
                if (!response.ok) throw new Error('Failed to load default graph');
                const data = await response.json();
                setGraphState(prev => ({ ...prev, nodes: data.nodes, edges: data.edges, mstEdges: [], mstSequence: [], currentEdge: null }));
            } catch (error) {
                console.error('Error loading default graph:', error);
            }
        };

        loadDefaultGraph();
    }, []);

    const resetGraph = () => {
        setGraphState(prev => ({
            ...prev,
            edges: prev.edges.map(edge => ({ ...edge, color: '#ddd' })),
            mstEdges: [],
            mstSequence: [],
            currentEdge: null,
            isRunning: false,
            isPaused: false,
            currentStep: 0
        }));

        kruskalStateRef.current = null;
    };

    const generateGraph = () => {
        const newNodes = generateNodes(7);
        const newEdges = generateEdges(newNodes, 8);
        setGraphState({ nodes: newNodes, edges: newEdges, mstEdges: [], mstSequence: [], currentEdge: null, isRunning: false, isPaused: false, isEditing: false, currentStep: 0 });
    };

    const startKruskal = useCallback(() => {
        if (!graphState.nodes.length || graphState.isRunning) return;

        kruskalStateRef.current = initializeKruskal(graphState.nodes, graphState.edges);
        setGraphState(prev => ({ ...prev, isRunning: true, isPaused: false, currentStep: 0 }));

        processNextEdge(kruskalStateRef.current, setGraphState, isPausedRef, stepDelay);
    }, [graphState.nodes, graphState.edges, graphState.isRunning, stepDelay]);

    const handlePauseResume = () => {
        setGraphState(prev => ({ ...prev, isPaused: !prev.isPaused }));
        isPausedRef.current = !isPausedRef.current;

        if (!isPausedRef.current) {
            processNextEdge(kruskalStateRef.current, setGraphState, isPausedRef, stepDelay);
        }
    };

    const toggleEditMode = () => {
        setGraphState(prev => ({ ...prev, isEditing: !prev.isEditing, mstEdges: [], mstSequence: [], currentEdge: null }));

        if (!graphState.isEditing) {
            setGraphState(prev => ({ ...prev, nodes: [], edges: [] }));
        }
    };

    const handleStop = () => {
        setGraphState(prev => ({
            ...prev,
            isRunning: false,
            isPaused: false,
            mstEdges: [],
            mstSequence: [],
            currentEdge: null,
            currentStep: kruskalStateRef.current?.sortedEdges.length || 0
        }));

        resetGraph();
    };

    return (
        <>
            <HelpModal/>
            <h1 style={{ fontSize: "1.5em", textAlign: "center" }}>Kruskal's Algorithm Visualization</h1>
            <br/>

            <ControlsComponent
                isEditing={graphState.isEditing}
                toggleEditMode={toggleEditMode}
                generateGraph={generateGraph}
                resetGraph={resetGraph}
                nodes={graphState.nodes}
                isRunning={graphState.isRunning}
                startKruskal={startKruskal}
                isPaused={graphState.isPaused}
                handlePauseResume={handlePauseResume}
                handleStop={handleStop}
                stepDelay={stepDelay}
                setStepDelay={setStepDelay}
            />

            {graphState.isEditing ? (
                <GraphEditor nodes={graphState.nodes} edges={graphState.edges} onNodesChange={nodes => setGraphState(prev => ({ ...prev, nodes }))} onEdgesChange={edges => setGraphState(prev => ({ ...prev, edges }))} />
            ) : (
                <>
                    <Graph nodes={graphState.nodes} edges={graphState.edges} highlightedEdges={graphState.mstEdges} currentEdge={graphState.currentEdge} />
                    <Legend data={KRUSKAL_LEGEND_DATA} />
                </>
            )}

            <br/>

            {!graphState.isEditing && graphState.mstSequence.length > 0 && (
                <div className="mst-sequence">
                    <h5><strong>Edge Addition Sequence:</strong></h5>
                    <ol className="list-group list-group-numbered">
                        {graphState.mstSequence.map((edge, index) => (
                            <li className="list-group-item" key={index}>{edge}</li>
                        ))}
                    </ol>
                </div>
            )}
        </>
    );
}
