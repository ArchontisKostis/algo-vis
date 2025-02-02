import './ControlsComponent.css';
import {Bars} from "react-loader-spinner";

const ControlsComponent = ({
    isEditing,
    toggleEditMode,
    generateGraph,
    resetGraph,
    nodes,
    isRunning,
    startKruskal,
    isPaused,
    handlePauseResume,
    handleStop,
    stepDelay,
    setStepDelay
}) => {
    return (
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
    );
}

export default ControlsComponent;