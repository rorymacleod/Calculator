import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface AddOperator { name: 'ADD' };
export interface SubtractOperator { name: 'SUBTRACT' };
export interface MultiplyOperator { name: 'MULTIPLY' };
export interface DivideOperator { name: 'DIVIDE' };
export interface EqualsOperator { name: 'EQUALS' };

export type CalcOperator =
    AddOperator |
    SubtractOperator |
    MultiplyOperator |
    DivideOperator |
    EqualsOperator;

export interface DecimalModifier { name: 'DECIMAL' };
export interface NegativeModifier { name: 'NEGATIVE' };

export type CalcModifier = DecimalModifier | NegativeModifier;

export interface ApplyOperatorAction { type: 'APPLY_OPERATOR', operator: CalcOperator };
export interface ToggleModifierAction { type: 'TOGGLE_MODIFIER', modifier: CalcModifier };
export interface ClearAction { type: 'CLEAR' };
export interface ClearEntryAction { type: 'CLEAR_ENTRY' };
export interface BackspaceAction { type: 'BACKSPACE' };
export interface AppendAction { type: 'APPEND', value: string };
export interface CalculationRequestedAction { type: 'CALCULATION_REQUESTED' };
export interface CalculationReceivedAction { type: 'CALCULATION_RECEIVED', total: number, entry: CalcEntry };
export interface CalculationFailedAction { type: 'CALCULATION_FAILED', error: string };

export type KnownAction =
    ApplyOperatorAction |
    ToggleModifierAction |
    ClearAction |
    ClearEntryAction |
    BackspaceAction |
    AppendAction |
    CalculationRequestedAction |
    CalculationReceivedAction |
    CalculationFailedAction;

export function applyOperator(operator: CalcOperator): AppThunkAction<KnownAction> {
    return (dispatch, getState) => {
        const state = getState().calculator;
        const entry = { value: parseFloat(state.value), operator };
        if (state.negative) {
            entry.value = 0 - entry.value;
        }

        const request = new Request(
            'api/calculation',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subtotal: state.total,
                    operand: entry.value,
                    operator: entry.operator
                })
            }
        );
        console.log('Request:', request);
        fetch(request)
            .then(response => response.text())
            .then(data => {
                console.log('CALCULATION_RECEIVED', data);
                const total = parseFloat(data);
                dispatch({
                    type: 'CALCULATION_RECEIVED',
                    total,
                    entry
                } as CalculationReceivedAction);
            })
            .catch(error => {
                console.error(error);
                dispatch({
                    type: 'CALCULATION_FAILED',
                    error: 'Error.',
                });
            });

        dispatch({ type: 'CALCULATION_REQUESTED' } as CalculationRequestedAction);
    }
}

export const actionCreators = {
    toggleModifier: (modifier: CalcModifier) => ({ type: 'TOGGLE_MODIFIER', modifier } as ToggleModifierAction),
    clear: () => ({ type: 'CLEAR' } as ClearAction),
    clearEntry: () => ({ type: 'CLEAR_ENTRY' } as ClearEntryAction),
    backspace: () => ({ type: 'BACKSPACE' } as BackspaceAction),
    append: (value: string) => ({ type: 'APPEND', value } as AppendAction),
}

export interface CalcEntry {
    value: number;
    total?: number;
    operator: CalcOperator;
}

export interface CalculatorState {
    busy: boolean;
    error: string | undefined;
    total: number;
    value: string;
    negative: boolean;
    decimal: boolean;
    history: CalcEntry[];
}

export const reducer: Reducer<CalculatorState> = (state: CalculatorState | undefined, action: Action): CalculatorState => {
    if (state === undefined) {
        return {
            busy: false,
            error: undefined,
            total: 0,
            value: '0',
            history: [],
            decimal: false,
            negative: false
        };
    }

    const knownAction = action as KnownAction;
    let entry: CalcEntry;
    let newValue: string;
    switch (knownAction.type) {
        case 'CALCULATION_REQUESTED':
            console.log('CALCULATION_REQUESTED');
            return {
                ...state,
                busy: true,
                error: undefined,
            };

        case 'CALCULATION_RECEIVED':
            console.log('CALCULATION_RECEIVED');
            const calculationReceivedAction = knownAction as CalculationReceivedAction;
            entry = calculationReceivedAction.entry;
            entry.total = calculationReceivedAction.total;
            return {
                ...state,
                busy: false,
                history: [
                    ...state.history,
                    entry
                ],
                value: '0',
                total: entry.total,
                decimal: false,
                negative: false,
                error: undefined,
            };

        case 'CALCULATION_FAILED':
            const calculationFailedAction = knownAction as CalculationFailedAction;
            return {
                ...state,
                busy: false,
                error: calculationFailedAction.error,
                value: '0',
                decimal: false,
                negative: false,
            };

        case 'TOGGLE_MODIFIER':
            const modifier = (knownAction as ToggleModifierAction).modifier;
            switch (modifier.name) {
                case 'NEGATIVE':
                    return {
                        ...state,
                        negative: !state.negative
                    };
                case 'DECIMAL':
                    return {
                        ...state,
                        decimal: state.value.indexOf('.') === -1
                    };
                default:
                    return state;
            }

        case 'CLEAR':
            return {
                busy: false,
                error: undefined,
                total: 0,
                value: '0',
                history: [],
                decimal: false,
                negative: false
            };
        case 'CLEAR_ENTRY':
            return {
                ...state,
                value: '0'
            };
        case 'BACKSPACE':
            if (state.value === '0') {
                newValue = '0';
            } else if (state.value.length === 1) {
                newValue = '0';
            } else {
                newValue = state.value.substring(0, state.value.length - 1);
                if (newValue.charAt(newValue.length - 1) === '.') {
                    newValue = newValue.substring(0, newValue.length - 1);
                }
            }

            return {
                ...state,
                value: newValue,
            }
        case 'APPEND':
            const char = (knownAction as AppendAction).value;
            if (char === '0' && state.value === '0') {
                newValue = '0';
            } else if (state.value === '0' && !state.decimal) {
                newValue = char;
            } else {
                if (state.decimal) {
                    newValue = state.value + '.' + char;
                } else {
                    newValue = state.value + char;
                }
            }

            const result = {
                ...state,
                error: undefined,
                value: newValue,
                decimal: false,
            };
            return result;
        default:
            return state;
    }
};