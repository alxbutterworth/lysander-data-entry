import React from 'react';
import { connect } from 'react-redux';
import { addDataToMap } from 'kepler.gl/actions';
import { FullStateTree, IncrementAction } from '../interfaces';
import actionCreators from '../action-creators';
import { SidebarFactory, Histogram } from 'kepler.gl/components';

function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}

interface AppProps {
    counter: number;
    increment: () => IncrementAction;
    addDataToMap: typeof addDataToMap;
}

const mapDispatchToProps = {
    increment: actionCreators.increment,
    addDataToMap
};


function SimpleHistogramUserFactory(
    Sidebar: any
) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class SimpleHistogramUser extends React.Component<any, any> {
            constructor(props: any) {
                super(props);
                console.log("inside constructor");
            }

            componentDidMount() {
            }

            
            render() {
                return (
                    <div>
                      <h1>SimpleHistogramUser</h1>
                    </div>
                );
            }
        }
    );
}

SimpleHistogramUserFactory.deps = [
    SidebarFactory
];

export { SimpleHistogramUserFactory };
