
const HelpModal = () => {
  return (
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
                              <button style={{height: "100%"}} className="btn btn-dark"><i className="bi bi-pencil"></i>
                              </button>
                              - Enter Edit Mode to create a custom graph.
                          </li>

                          <li>
                              <button style={{height: "100%"}} className="btn btn-dark"><i className="bi bi-magic"></i>
                              </button>
                              - Generate a random graph.
                          </li>

                          <li>
                              <button style={{height: "100%"}} className="btn btn-dark"><i
                                  className="bi bi-arrow-counterclockwise"></i></button>
                              - Reset the graph.
                          </li>

                          <li>
                              <button style={{height: "100%"}} className="btn btn-success"><i
                                  className="bi bi-play-circle"></i></button>
                              - Run the algorithm.
                          </li>

                          <li>
                              <button style={{height: "100%"}} className="btn btn-warning"><i
                                  className="bi bi-pause-circle"></i></button>
                              - Pause the algorithm.
                          </li>

                          <li>
                              <button style={{height: "100%"}} className="btn btn-danger"><i
                                  className="bi bi-stop-circle"></i></button>
                              - Stop the algorithm.
                          </li>

                          <li>
                              <input
                                  style={{
                                      width: "20%",
                                      backgroundColor: "#e9ecef",
                                      padding: ".375rem .75rem",
                                      borderRadius: "0.375rem",
                                      border: "none"
                                  }}
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
                          The buttons on the current help modal are for demonstration purposes only and do not have any
                          functionality.
                      </i>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default HelpModal;