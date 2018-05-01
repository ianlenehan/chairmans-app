import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { players } from '../players';
import Colours from '../constants/Colours'

export default class PlayersScreen extends React.Component {
  static navigationOptions = {
    title: 'Players',
  };

  viewPlayerScreen = (player) => {
    this.props.navigation.navigate('Player', { player })
  }

  render() {
    return (
      <List containerStyle={{marginBottom: 20}}>
        {
          players.map((player, i) => (
            <ListItem
              avatar={{uri: player.avatar_url}}
              avatarStyle={{ backgroundColor: '#fff' }}
              subtitle={player.full_name}
              key={i}
              title={player.nick_name}
              onPress={() => this.viewPlayerScreen(player)}
            />
          ))
        }
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
