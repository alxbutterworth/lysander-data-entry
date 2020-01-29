import React from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { addDataToMap } from 'kepler.gl/actions';
import { Button, SidebarFactory } from 'kepler.gl/components';

import { FullStateTree, IncrementAction } from '../interfaces';
import actionCreators from '../action-creators';
import mockdata from '../mockdata';
import singletons from '../singletons';
import { GetLocationsStatement } from '../canned-statements';
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

function QueryBuilderPanelFactory(
    Sidebar: any
) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class extends React.Component<any> {
            onClick() {
                singletons.gateway.retrieveLocations().then(r => {
                    console.log("record count is ", r.records.length);
                    const count = r.records.length;
                    if (count === 0) {
                        notification.error({
                            message: 'Error',
                            description: 'No locations found.'
                        });
                    }
                    const newRows = r.records.map(x => {
                        return [
                            '1940-01-01 08:30:00 +00:00',
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
            
            render() {
                return (
                    <div>
                      <Sidebar width={300}
                               isOpen={true}
                               minifiedWidth={0}>
                        <Button onClick={this.onClick.bind(this)}>Query</Button>
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