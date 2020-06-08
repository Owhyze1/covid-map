import React, { Component } from "react";
import { Col } from "react-native-easy-grid";
import { Text, Stylesheet } from "native-base";

// SEMITA
//
// EnableSOS component is used when user turns emergency notificaiton on. The Status indicator
// has a GREEN background, WHITE Text, and text that says "ENABLED"

class EnableSOS extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Col size={2}
                 style={{
                     backgroundColor: 'green',
                     justifyContent: 'center',
                     alignItems: 'center'
                 }}>
                <Text style={{
                    fontWeight: 'bold',
                    color: 'white'
                }}>ENABLED</Text>
            </Col>
        );
    }

}


// const style = Stylesheet.create({
//
//     col: {
//         backgroundColor: 'green',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     text: {
//         fontWeight: 'bold',
//         color: 'white'
//     }
//
// });

export default EnableSOS;
