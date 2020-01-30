import React from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { addDataToMap } from 'kepler.gl/actions';

import { 
    SidebarFactory,
    Button,
    ItemSelector
} from 'kepler.gl/components';

import { FullStateTree, IncrementAction } from '../interfaces';
import actionCreators from '../action-creators';
import mockdata from '../mockdata';
import singletons from '../singletons';
import { STPointsByPilot, GetDistinctPilots } from '../canned-statements';
import { makeKeplerData } from '../munge-for-kepler';


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


const TANGMERE_LONGITUDE = -0.7063888888888888;
const TANGMERE_LATITUDE = 50.84583333333333;

// Filter the available flights so there's only one.
const WANTED_PILOT = {
    firstName: ['john', 'xavier'],
    lastName: ['doe']
};

interface AppState {
    selectedPilots: string[];
}

function QueryBuilderPanelFactory(
    Sidebar: any
) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class QueryBuilderPanel extends React.Component<any, AppState> {
            constructor(props: any) {
                super(props);
                this.state = {selectedPilots: []}
            }

            onClick() {
                singletons.gateway.search(new GetDistinctPilots()).then(
                    ({records}) => {
                        for (let x of records) {
                            console.log("%o %o", x.get('firstName'), x.get('lastName'));
                        }
                    }
                );

                singletons.gateway.search(new STPointsByPilot(WANTED_PILOT)).then(r => {
                    console.log("record count is ", r.records.length);
                    const count = r.records.length;
                    if (count === 0) {
                        notification.error({
                            message: 'Error',
                            description: 'No STPoints found.'
                        });
                    }
                    const newRows = r.records.map(x => {
                        return [
                            x.get('nightOf'),
                            TANGMERE_LONGITUDE,
                            TANGMERE_LATITUDE,
                            x.get('longitude'),
                            x.get('latitude')
                        ];
                    });
                    console.log("row values are %o", newRows);
                    const kdata = makeKeplerData(newRows);
                    this.props.addDataToMap(kdata);
                });
            }
            
            onSelectPilot(newItems: any) {
                console.log("new items are: %o", newItems);
                this.setState({selectedPilots: newItems});
            }
            
            render() {
                return (
                    <div>
                      <Sidebar width={300}
                               isOpen={true}
                               minifiedWidth={0}>
                        <ItemSelector options={['fry', 'bender', 'leela']}
                                      multiSelect={true}
                                      onChange={this.onSelectPilot.bind(this)}></ItemSelector>
                        <Button selectedItems={this.state.selectedPilots} 
                                onClick={this.onClick.bind(this)}>Query</Button>
                      </Sidebar>
                    </div>
                );
            }
        }
    );
}

QueryBuilderPanelFactory.deps = [
    SidebarFactory
];

export { QueryBuilderPanelFactory };
