import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as CalcLogsStore from '../store/CalcLogs';

type CalcLogsProps =
  CalcLogsStore.CalcLogsState
  & typeof CalcLogsStore.actionCreators
  & RouteComponentProps<{ startId: string }>;


class FetchData extends React.PureComponent<CalcLogsProps> {
    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    public render() {
        return (
            <React.Fragment>
                <h1 id="tabelLabel">Calculations</h1>
                {this.renderLogsTable()}
                {this.renderPagination()}
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        const startId = parseInt(this.props.match.params.startId, 10) || 0;
        this.props.requestLogs(startId);
    }

    private renderLogsTable() {
        return (
            <table className="table table-striped" aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date and Time</th>
                        <th>Value</th>
                        <th>Operator</th>
                        <th>Operand</th>
                        <th>Client IP Address</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.entries.map((log: CalcLogsStore.CalcLogEntry) =>
                        <tr key={log.id}>
                            <td>{log.dateTime}</td>
                            <td>{log.subtotal}</td>
                            <td>{log.operator}</td>
                            <td>{log.value}</td>
                            <td>{log.clientAddress}</td>
                        </tr>
                )}
                </tbody>
            </table>
        );
    }

    private renderPagination() {
        const prevStartDateIndex = (this.props.startId || 0) - 5;
        const nextStartDateIndex = (this.props.startId || 0) + 5;

        return (
            <div className="d-flex justify-content-between">
                <Link className="btn btn-outline-secondary btn-sm" to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
                {this.props.isLoading && <span>Loading...</span>}
                <Link className="btn btn-outline-secondary btn-sm" to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
            </div>
        );
    }
}

export default connect(
  (state: ApplicationState) => state.logs,
  CalcLogsStore.actionCreators
)(FetchData as any);
