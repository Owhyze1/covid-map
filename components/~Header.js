import React, { Component } from 'React';
import { Grid, Col } from 'react-native-easy-grid';

class Header extends Component {
  render() {
    return (

      <Grid style={styles.header_grid}>

        <Col size={1} style={styles.header_left}>
          <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14 }}>ENABLED</Text>
        </Col>

        <Col size={4} style={styles.header_center}>
          <Text style={{ fontWeight: 'bold', color: 'red' }}>EMERGENCY NOTIFICATIONS</Text>
        </Col>

        <Col size={1} style={styles.header_right}>
          <Button
            transparent
            onPress={() => this.props.navigation.navigate( 'Settings' )}
          >
            <Icon style={{ color: 'white' }} active name="settings" />
          </Button>
        </Col>
          
      </Grid>

    );
  }
}
