import React, { Component } from 'react';
import { Col } from 'react-native-easy-grid';
import { Text, Stylesheet } from 'native-base';

// SEMITA
//
// DisableSOS component is used when user turns emergency notificaiton off. The Status indicator
// has a RED background, WHITE Text, and text that says "DISABLED"

class DisableSOS extends Component {

  constructor( props ) {
    super( props );
  }

  render() {

    return (
      <Col  size={2}
        styles={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Text style={{
          fontWeight: 'bold',
          color: 'white'
        }}>DISABLED</Text>
      </Col>
    );
  }
}


// const styles = Stylesheet.create({
//
//     col: {
//         backgroundColor: 'red',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     text: {
//         fontWeight: 'bold',
//         color: 'white'
//     }
//
// });

export default DisableSOS;
