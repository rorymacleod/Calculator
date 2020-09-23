import { Action, Reducer } from 'redux';

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

export type KnownAction =
    ApplyOperatorAction |
    ToggleModifierAction |
    ClearAction |
    ClearEntryAction |
    BackspaceAction |
    AppendAction;

export const actionCreators = {
    applyOperator: (operator: CalcOperator) => ({ type: 'APPLY_OPERATOR', operator } as ApplyOperatorAction),
    toggleModifier: (modifier: CalcModifier) => ({ type: 'TOGGLE_MODIFIER', modifier } as ToggleModifierAction),
    clear: () => ({ type: 'CLEAR' } as ClearAction),
    clearEntry: () => ({ type: 'CLEAR_ENTRY' } as ClearEntryAction),
    backspace: () => ({ type: 'BACKSPACE' } as BackspaceAction),
    append: (value: string) => ({ type: 'APPEND', value } as AppendAction),
}

export interface CalcEntry {
    value: number;
    operator: CalcOperator;
}

export interface CalculatorState {
    total: number;
    value: string;
    operator: CalcOperator | undefined;
    negative: boolean;
    decimal: boolean;
    history: CalcEntry[];
}

const postCalculation = async (subtotal: number, entry: CalcEntry): Promise<number> => {
    const request = new Request(
        'api/calculation',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subtotal,
                operand: entry.value,
                operator: entry.operator
            })
        }
    );
    const response = await fetch(request);
    const result = await response.text();
    return parseFloat(result);
}

export const reducer: Reducer<CalculatorState> = (state: CalculatorState | undefined, action: Action) => {
    if (state === undefined) {
        return {
            total: 0,
            value: '0',
            history: [],
            operator: undefined,
            decimal: false,
            negative: false
        };
    }

    const knownAction = action as KnownAction;
    let newValue: string;
    switch (knownAction.type) {
        case 'APPLY_OPERATOR':
            const op = (knownAction as ApplyOperatorAction).operator;
            const entry: CalcEntry = { value: parseFloat(state.value), operator: op }

            postCalculation(state.total, entry)
                .then((newTotal) => {
                    console.log(newTotal);
                });

            return {
                ...state,
                history: [
                    ...state.history,
                    entry
                ],
                operator: op,
                value: '0'
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
                total: 0,
                value: '0',
                history: [],
                operator: undefined,
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
                value: newValue,
                decimal: false,
            };
            return result;
        default:
            return state;
    }
};