import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Button } from "react-native-elements";
import axios from "axios";
import _ from "lodash";

import Card from "../components/Card";
import AveragesCard from "../components/AveragesCard";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: (
      <Image
        style={{ width: 100, height: 30 }}
        resizeMode="contain"
        source={require("../assets/images/meow.png")}
      />
    )
  };

  state = {
    data: [],
    hatHolder: null,
    mostWins: null,
    mostHats: null,
    allWins: null,
    hatAvg: null,
    winAvg: null,
    allHats: null,
    immunePlayer: null,
    refreshing: false,
    fromDate: "2019-01-01"
  };

  componentDidMount() {
    this.makeApiRequest();
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.makeApiRequest();
    this.setState({ refreshing: false });
  };

  async makeApiRequest() {
    const { fromDate } = this.state;
    const res = await axios.get(
      `https://chairmans-api.herokuapp.com/results?from=${fromDate}`
    );
    const { players, results, round_counts: roundCounts } = res.data;
    if (results.length) {
      this.getHatHolder(results, players);
      this.getImmunePlayer(results, players);
      this.getMostHats(results, players);
      this.getMostWins(results, players);
      this.getAllHats(results, players, roundCounts);
      this.getAllWins(results, players, roundCounts);
    }
  }

  getHatHolder(results, players) {
    const [lastRound] = results;
    const hatHolders = players.filter(player => player.id === lastRound.loser);
    this.setState({ hatHolder: hatHolders[0] });
  }

  getImmunePlayer(results, players) {
    const [lastRound] = results;
    const immunePlayers = players.filter(
      player => player.id === lastRound.winner
    );
    this.setState({ immunePlayer: immunePlayers[0] });
  }

  _resultsPerPlayer(playerId, rewards) {
    return rewards.reduce((acc, reward) => {
      if (reward === playerId) acc += 1;
      return acc;
    }, 0);
  }

  _initialCounts(players, rewards) {
    return players.map(player => {
      const total = this._resultsPerPlayer(player.id, rewards);
      return { player, total };
    });
  }

  _sortedCounts(counts) {
    return counts.sort(function(a, b) {
      return Number(b.total) - Number(a.total);
    });
  }

  _mostHatsOrLosses(counts) {
    const sortedCounts = this._sortedCounts(counts);
    const most = sortedCounts[0].total;
    const filtered = sortedCounts.filter(count => Number(count.total) === most);
    const players = filtered.map(x => x.player);
    return { most, players };
  }

  getMostHats(results, players) {
    const rewards = results.map(result => result.loser);
    const counts = this._initialCounts(players, rewards);
    const mostHats = this._mostHatsOrLosses(counts);
    this.setState({ mostHats });
  }

  _allCounts(players, rewards) {
    return players.map(player => {
      const total = this._resultsPerPlayer(player.id, rewards);
      return { playerName: player.nick_name, total };
    });
  }

  _sortedAvgs(averages) {
    return averages.sort(function(a, b) {
      return Number(b.avg) - Number(a.avg);
    });
  }

  _getHatAvgs(roundCounts, players, allHats) {
    return roundCounts.map(rounds => {
      const [player] = Object.keys(rounds);
      const [length] = Object.values(rounds);
      const [hats] = allHats.filter(playerData => {
        return playerData["playerName"] === player;
      });
      const [playerData] = players.filter(fullPlayer => {
        return fullPlayer.nick_name === player;
      });
      return { player: playerData, avg: Number(hats.total) / length };
    });
  }

  getAllHats(results, players, roundCounts) {
    const rewards = results.map(result => result.loser);
    const allHats = this._allCounts(players, rewards);
    const hatAvgs = this._getHatAvgs(roundCounts, players, allHats);
    const sortedHatAvgs = this._sortedAvgs(hatAvgs);
    this.setState({ allHats, hatAvg: sortedHatAvgs });
  }

  _getWinAvgs(roundCounts, players, allWins) {
    return roundCounts.map(rounds => {
      const [player] = Object.keys(rounds);
      const [length] = Object.values(rounds);
      const [wins] = allWins.filter(playerData => {
        return playerData["playerName"] === player;
      });
      const [playerData] = players.filter(fullPlayer => {
        return fullPlayer.nick_name === player;
      });
      return { player: playerData, avg: Number(wins.total) / length };
    });
  }

  getAllWins(results, players, roundCounts) {
    const rewards = results.map(result => result.winner);
    const allWins = this._allCounts(players, rewards);
    const winAvgs = this._getWinAvgs(roundCounts, players, allWins);
    const sortedWinAvgs = this._sortedAvgs(winAvgs);
    this.setState({ allWins, winAvg: sortedWinAvgs });
  }

  getMostWins(results, players) {
    const rewards = results.map(result => result.winner);
    const counts = this._initialCounts(players, rewards);
    const mostWins = this._mostHatsOrLosses(counts);
    this.setState({ mostWins });
  }

  filterByYear = async fromDate => {
    await this.setState({ fromDate });
    this.makeApiRequest();
  };

  render() {
    const {
      hatHolder,
      mostHats,
      mostWins,
      allHats,
      allWins,
      highestAverage,
      immunePlayer,
      hatAvg,
      winAvg
    } = this.state;
    if (mostHats && mostWins && hatAvg && winAvg) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <Button
              title="2018"
              borderRadius={5}
              onPress={() => this.filterByYear("2018-01-01")}
            />
            <Button
              title="2019"
              borderRadius={5}
              onPress={() => this.filterByYear("2019-01-01")}
            />
          </View>
          <Card
            data={hatHolder}
            navigation={this.props.navigation}
            title="Current Hat Holder"
            singlePlayer
          />
          <Card
            data={immunePlayer}
            navigation={this.props.navigation}
            title="Four Point Advantage"
            singlePlayer
          />
          <Card
            data={mostHats}
            allData={allHats}
            navigation={this.props.navigation}
            title="Most Hats"
            subtitle={mostHats.most}
          />
          <Card
            data={mostWins}
            allData={allWins}
            navigation={this.props.navigation}
            title="Most Wins"
            subtitle={mostWins.most}
          />
          <AveragesCard
            data={hatAvg[0].player}
            allData={hatAvg}
            navigation={this.props.navigation}
            title="Highest Hat Average"
            subtitle={hatAvg[0].avg}
          />
          <AveragesCard
            data={winAvg[0].player}
            allData={winAvg}
            navigation={this.props.navigation}
            title="Highest Win Average"
            subtitle={winAvg[0].avg}
          />
        </ScrollView>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#ff0080",
    height: 100
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  hatOwnerContainer: {
    padding: 10,
    margin: 25,
    borderWidth: 5,
    borderColor: "#ff0080",
    alignItems: "center",
    justifyContent: "center"
  },
  hatImageStyle: {
    height: 150,
    width: 150
  }
});
