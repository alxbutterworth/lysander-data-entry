import React from 'react';
import { connect } from 'react-redux';
import actionCreators from './action-creators';
import { FullStateTree, IncrementAction } from './interfaces';

import { Button, notification } from 'antd';


import { Formik, FormikProps } from 'formik';
import { Form, Input, InputNumber, Checkbox, SubmitButton, Select } from "formik-antd";

import { KNOWN_LZ } from './known-lz';


import singletons from './singletons';


function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}

const mapDispatchToProps = {
    increment: actionCreators.increment,
};


interface AppProps {
    counter: number;
    increment: () => IncrementAction;
}

interface MyFormFields {
    firstName: string;
}

const availableOptions = [
    { value: "dog", label: "Tyrannosaurus Canis" },
    { value: "cat", label: "Feline" },
    { value: "mouse", label: "Rodent" },
];

const handleSearch = (value: string) => {
    console.log("a search was requested");
    // Here if we wanted to modify stuff we'd need to do some sort of state.
};

type FormProps = FormikProps<MyFormFields>

interface MyFormState {
    availableOptions: any;
}

class MyForm extends React.Component<FormProps, MyFormState> {
    constructor(props: FormProps) {
        super(props);
        this.state = {
            availableOptions: [
                { value: "dog", label: "Tyrannosaurus Canis" },
                { value: "cat", label: "Feline" },
                { value: "mouse", label: "Rodent" },
            ]
        };
    }

    render() {
        return (
            <Form>
                <h2>LZ codename</h2>

                <Select name="lz">
                    {KNOWN_LZ.map((lz, index) => <Select.Option key={index} value={lz}>{lz}</Select.Option>)}
                </Select>


                <Input name="firstName" placeholder="First Name" />

                <Select
                    name="select1"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Simple select"
                    onSearch={handleSearch}
                    filterOption={true}
                    optionFilterProp="children"
                    onChange={value => {
                        // select allows adding an on change handler
                        // most components do not yet support this
                        console.log("select changed", value);
                    }}
                >
                    {this.state.availableOptions.map(
                        (x: any) => <Select.Option key={x.value} value={x.value}>{x.label}</Select.Option>
                    )}
                </Select>

                <SubmitButton>Stumbit</SubmitButton>
            </Form>
        );
    }
}

function addLocation() {
    console.log("I would add a location");

    singletons.gateway.addDummyLocation().then(r => {
        notification.open({
            message: 'Notification Title',
            description: 'This is the content of the notification.',
            onClick: () => {
                console.log('Notification Clicked!');
            }
        })
    });
}

// The codesandbox for formik/antd is available here

class MyComponent extends React.Component<AppProps> {
    render() {
        return (
            <div>
                <h1>Formik/Antd demo</h1>

                <Button onClick={addLocation}>Add a location</Button>

                <Formik initialValues={{ firstName: "" }}
                    onSubmit={(values) => { console.log(values); }}
                    component={MyForm}
                />
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

