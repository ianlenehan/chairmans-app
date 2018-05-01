import React from 'react';
import { Text } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    return <Text>Some game settings here maybe, like how many points does the winner get</Text>
  }
}
