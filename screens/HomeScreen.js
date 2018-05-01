import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios'
import _ from 'lodash'

import Card from '../components/Card';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: (
        <Image
          style={{ width: 100, height: 30 }}
          resizeMode='contain'
          source={require('../assets/images/meow.png')}
        />
      ),
  };

  state = {
    data: [],
    hatHolder: null,
    mostWins: null,
    mostHats: null,
    immunePlayer: null,
  }

  componentDidMount() {
    this.makeApiRequest()
  }

  async makeApiRequest() {
    const res = await axios.get('http://localhost:3000/results?from=2018-01-01')
    const { players, results } = res.data
    if (results.length) {
      this.getHatHolder(results, players)
      this.getImmunePlayer(results, players)
      this.getMostHats(results, players)
      this.getMostWins(results, players)
    }
  }

  getHatHolder(results, players) {
    const [lastRound] = results
    const hatHolders = players.filter((player) => player.id === lastRound.loser)
    this.setState({ hatHolder: hatHolders[0] })
  }

  getImmunePlayer(results, players) {
    const [lastRound] = results
    const immunePlayers = players.filter((player) => player.id === lastRound.winner)
    this.setState({ immunePlayer: immunePlayers[0] })
  }

  _resultsPerPlayer(playerId, rewards) {
    if (playerId === 11) {
      // console.log('results per player', playerId, rewards);
    }
    return rewards.reduce((acc, reward) => {
      if (reward === playerId) acc += 1
      return acc
    }, 0)
  }

  _initialCounts(players, rewards) {
    return players.map((player) => {
      const total = this._resultsPerPlayer(player.id, rewards)
      return { player, total }
    })
  }

  _sortedCounts(counts) {
    return counts.sort(function (a, b) {
      return Number(b.total) - Number(a.total)
    })
  }

  _mostHatsOrLosses(counts) {
    const sortedCounts = this._sortedCounts(counts)
    const most = sortedCounts[0].total
    const filtered = sortedCounts.filter((count) => Number(count.total) === most)
    const players = filtered.map((x) => x.player)
    return { most, players }
  }

  getMostHats(results, players) {
    const rewards = results.map((result) => result.loser)
    const counts = this._initialCounts(players, rewards)
    const mostHats = this._mostHatsOrLosses(counts)
    this.setState({ mostHats })
  }

  getMostWins(results, players) {
    const rewards = results.map((result) => result.winner)
    const counts = this._initialCounts(players, rewards)
    const mostWins = this._mostHatsOrLosses(counts)
    this.setState({ mostWins })
  }

  render() {
    const { hatHolder, mostHats, mostWins, highestAverage, immunePlayer } = this.state
    if (mostHats && mostWins) {
      return (
        <ScrollView style={styles.container}>
        <Card
        data={hatHolder}
        navigation={this.props.navigation}
        title='Current Hat Holder'
        singlePlayer
        />
        <Card
        data={immunePlayer}
        navigation={this.props.navigation}
        title='Four Point Advantage'
        singlePlayer
        />
        <Card
        data={mostHats}
        navigation={this.props.navigation}
        title='Most Hats'
        subtitle={mostHats.most}
        />
        <Card
        data={mostWins}
        navigation={this.props.navigation}
        title='Most Wins'
        subtitle={mostWins.most}
        />
        </ScrollView>
      );
    }
    return <ActivityIndicator/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcdcdc',
  },
  titleText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ff0080',
    height: 100,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  hatOwnerContainer: {
    padding: 10,
    margin: 25,
    borderWidth: 5,
    borderColor: '#ff0080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hatImageStyle: {
    height: 150,
    width: 150,
  }
});
