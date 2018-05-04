import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import axios from 'axios'
import { players } from '../players';
import Colours from '../constants/Colours'

export default class PlayersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.player.full_name,
    }
  }

  state = {
    rounds: []
  }

  componentDidMount() {
    const { player } = this.props.navigation.state.params
    this.makeApiRequest(player)
  }

  async makeApiRequest(player) {
    const nickName = player.nick_name
    const url = `http://localhost:3000/player_scores?from=2018-01-01&nn=${nickName}`
    const res = await axios.get(url)
    this.setState({ rounds: res.data.players })
  }

  renderPlayerScores() {
    const { rounds } = this.state
    return rounds.map((score, i) => {
      return (
        <View style={styles.scoreView} key={i}>
          <Text style={[styles.scoreData, { marginRight: 2 }]}>{score.round_date}</Text>
          <Text style={styles.scoreData}>{score.score}</Text>
        </View>
      )
    })
  }

  render() {
    const { player } = this.props.navigation.state.params
    return (
      <View style={styles.container}>
        <View style={styles.playerDetails}>
          <Image
          style={styles.playerImage}
          source={{uri: player.avatar_url}}
          />
          <Text style={styles.playerName}>{player.nick_name}</Text>
          <Text>Handicap: {player.handicap}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scoresContainer}>
          <View style={styles.scoreHeaderContainer}>
            <Text style={[styles.scoreHeaderText, { marginRight: 2 }]}>Date</Text>
            <Text style={styles.scoreHeaderText}>Score</Text>
          </View>
          {this.renderPlayerScores()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  playerDetails: {
    flexDirection: 'row',
    flex: 1,
  },
  playerName: {
    fontSize: 26,
  },
  playerImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
  },
  scoresContainer: {
    flex: 2,
  },
  scoreHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  scoreHeaderText: {
    flex: 1,
    fontSize: 20,
  },
  scoreView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  scoreData: {
    flex: 1,
    fontSize: 18,
    padding: 5,
    marginTop: 2,
    backgroundColor: '#dcdcdc',
  }
});
