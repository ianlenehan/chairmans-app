import React from 'react';
import { Text } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class TableScreen extends React.Component {
  static navigationOptions = {
    title: 'Table',
  };

  componentDidMount() {
    const keyword = this.determineWhichData()
    this.sortData(keyword)
  }

  determineWhichData() {
    switch (this.props.title) {
      case 'Most Hats':
          return 'hats'
        break;
      case 'Most Wins':
          return 'wins'
        break;
      default: return 'average_score'

    }
  }

  sortData(keyword) {
    const { data } = this.props.navigation.state
    console.log('data', data)
  }

  render() {
    return <Text>table</Text>
  }
}
