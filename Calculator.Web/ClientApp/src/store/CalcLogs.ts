import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface CalcLogsState {
    isLoading: boolean;
    startId?: number;
    entries: CalcLogEntry[];
}

export interface CalcLogEntry {
    id: number;
    dateTime: string;
    subtotal: number;
    operator: string;
    value: number;
    clientAddress: string;
}

interface RequestLogsAction {
    type: 'REQUEST_LOGS';
    startId: number;
}

interface ReceiveLogsAction {
    type: 'RECEIVE_LOGS';
    startId: number;
    logs: CalcLogEntry[];
}

type KnownAction = RequestLogsAction | ReceiveLogsAction;

export const actionCreators = {
    requestLogs: (startId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.logs && startId !== appState.logs.startId) {
            fetch(`api/calculation`)
                .then(response => response.json() as Promise<CalcLogEntry[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_LOGS', startId: startId, logs: data });
                });

            dispatch({ type: 'REQUEST_LOGS', startId: startId });
        }
    }
};

const unloadedState: CalcLogsState = { entries: [], isLoading: false };

export const reducer: Reducer<CalcLogsState> = (state: CalcLogsState | undefined, incomingAction: Action): CalcLogsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = (incomingAction as any) as KnownAction;
    switch (action.type) {
        case 'REQUEST_LOGS':
            return {
                startId: action.startId,
                entries: state.entries,
                isLoading: true
            };
        case 'RECEIVE_LOGS':
            if (action.startId === state.startId) {
                return {
                    startId: action.startId,
                    entries: action.logs,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
