import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as CalcStore from '../store/Calculator';
import { ApplicationState, AppThunkAction } from '../store';
import { applyOperator } from '../store/Calculator';

interface ThunkActions {
    applyOperator: (operator: CalcStore.CalcOperator) => AppThunkAction<CalcStore.KnownAction>
}

type HomeActions =
    ThunkActions &
    typeof CalcStore.actionCreators;

type HomeProps =
    CalcStore.CalculatorState &
    HomeActions;

const getCurrentValue = (props: HomeProps) => {
    let s = props.value;
    if (props.negative) {
        s = "-" + s;
    }
    if (props.decimal) {
        s = s + ".";
    }
    return s;
}

const operatorToString = (op: CalcStore.CalcOperator) => {
    switch (op.name) {
        case 'ADD':
            return '+';
        case 'SUBTRACT':
            return '-';
        case 'DIVIDE':
            return '/';
        case 'MULTIPLY':
            return 'x';
    }
}

class Home extends React.PureComponent<HomeProps> {
    public render() {
        console.log(this.props);
        return (
            <div>
                <div>
                    <div>
                        <input name="currentValue" readOnly={true} value={getCurrentValue(this.props)} />
                    </div>
                    <div>
                        <button disabled={this.props.busy} onClick={() => this.props.clear()}>C</button>
                        <button onClick={() => this.props.clearEntry()}>CE</button>
                        <button onClick={() => this.props.backspace()}>&larr;</button>
                        <button onClick={() => this.props.applyOperator({ name: 'ADD' })}>+</button>
                    </div>
                    <div>
                        <button onClick={() => this.props.append('7')}>7</button>
                        <button onClick={() => this.props.append('8')}>8</button>
                        <button onClick={() => this.props.append('9')}>9</button>
                        <button onClick={() => this.props.applyOperator({ name: 'SUBTRACT' })}>-</button>
                    </div>
                    <div>
                        <button onClick={() => this.props.append('4')}>4</button>
                        <button onClick={() => this.props.append('5')}>5</button>
                        <button onClick={() => this.props.append('6')}>6</button>
                        <button onClick={() => this.props.applyOperator({ name: 'MULTIPLY' })}>&times;</button>
                    </div>
                    <div>
                        <button onClick={() => { console.log(this.props); this.props.append('1')}}>1</button>
                        <button onClick={() => this.props.append('2')}>2</button>
                        <button onClick={() => this.props.append('3')}>3</button>
                        <button onClick={() => this.props.applyOperator({ name: 'DIVIDE' })}>&divide;</button>
                    </div>
                    <div>
                        <button onClick={() => this.props.toggleModifier({ name: 'NEGATIVE' })}>&plusmn;</button>
                        <button onClick={() => this.props.append('0')}>0</button>
                        <button onClick={() => this.props.toggleModifier({ name: 'DECIMAL' })}>.</button>
                        <button onClick={() => this.props.applyOperator({ name: 'EQUALS' })}>=</button>
                    </div>
                </div>
                <div>
                    <div>
                        <h3>History</h3>
                        <div>
                            { this.props.history.map((entry, i, arr) => (
                                <div key={i}>
                                    <div>{entry.value} {operatorToString(entry.operator)}</div>
                                    <div><small>= {entry.total}</small></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <p>
                    View the code on <a href="https://github.com/rorymacleod/Calculator">GitHub</a>.
                </p>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): HomeActions => ({
    applyOperator: (operator: CalcStore.CalcOperator) => dispatch(applyOperator(operator)),
    toggleModifier: (modifier: CalcStore.CalcModifier) => dispatch(CalcStore.actionCreators.toggleModifier(modifier)),
    clear: () => dispatch(CalcStore.actionCreators.clear()),
    clearEntry: () => dispatch(CalcStore.actionCreators.clearEntry()),
    backspace: () => dispatch(CalcStore.actionCreators.backspace()),
    append: (value: string) => dispatch(CalcStore.actionCreators.append(value)),
});

export default connect(
    (state: ApplicationState) => state.calculator,
    mapDispatchToProps
)(Home);
