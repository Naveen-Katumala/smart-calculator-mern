function History({ history }) {

    return (

        <div className="history-container">

            <h3>Calculation History</h3>

            {history.length === 0 ? (

                <p className="empty-history">
                    No calculations yet
                </p>

            ) : (

                <div className="history-list">

                    {history.map((item) => (

                        <div
                            className="history-item"
                            key={item._id || item.id}
                        >

                            <span>{item.expression}</span>

                            <strong>{item.result}</strong>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default History;