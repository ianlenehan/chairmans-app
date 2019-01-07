import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import axios from 'axios'
import { Button } from 'react-native-elements'
import moment from 'moment'
import Colours from '../constants/Colours'
import Layout from '../constants/Layout'

export default class RoundsScreen extends React.Component {
  static navigationOptions = {
    title: 'Rounds',
  };

  state = {
    data: null,
    players: null,
    refreshing: false,
    fromDate: "2019-01-01"
  }

  componentDidMount() {
    this.makeApiRequest()
  }

  async makeApiRequest() {
    const { fromDate } = this.state
    const { data } = await axios.get(`https://chairmans-api.herokuapp.com/full_results?from=${fromDate}`)
    const res = await axios.get('https://chairmans-api.herokuapp.com/players')
    this.setState({ data, players: res.data.players })
  }

  _renderTableHead() {
    const { data } = this.state
    if (data) {
      return data.rounds.map((round, i) => {
        return (
          <View style={styles.dateCellView} key={i}>
            <Text style={styles.dateCell}>
              {moment(round.result.round_date).format("D MMM")}
            </Text>
            <Text style={styles.dateCell}>
              {moment(round.result.round_date).format("YYYY")}
            </Text>
          </View>
        )
      })
    }
  }

  _sortScoresByPlayerId(scores) {
    return scores.sort((a, b) => {
      return a.player_id - b.player_id
    })
  }

  _renderTableColumns() {
    const { data } = this.state
    return data.rounds.map((round, i) => {
      const scores = this._sortScoresByPlayerId(round.scores)
      return (
        <View style={styles.tableColumn} key={i}>
          {
            scores.map((score, i) => {
              const winner = score.player_id === round.result.winner
              const loser = score.player_id === round.result.loser
              let style = styles.cellView
              let cellStyle = styles.cell
              if (winner) style = styles.winnerCellView
              if (loser) {
                style = styles.loserCellView
                cellStyle = styles.loserCell
              }
              const s = score.score === 0 ? '-' : score.score
              return (
                <View style={[styles.cellView, style]} key={i}>
                  <Text style={[styles.cell, cellStyle]}>{s}</Text>
                </View>
              )
            })
          }
        </View>
      )
    })
  }

  _renderPlayersColumn() {
    const { players, data } = this.state
    return (
      <View style={styles.playersColumn}>
        <View style={styles.playersCellView}>
          <Text style={[styles.playerCell, styles.nameCell]}></Text>
        </View>
        {
          players.map((player, i) => {
            return (
              <View key={i} style={styles.playersCellView}>
                <Text style={styles.playerCell}>{player.nick_name}</Text>
              </View>
            )
          })
        }
      </View>
    )
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.makeApiRequest()
    this.setState({ refreshing: false })
  }

  filterByYear = async (fromDate) => {
    await this.setState({ fromDate })
    this.makeApiRequest()
  }

  render() {
    if (this.state.data) {
      return (
        <ScrollView
        contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <Button
              title='2018' borderRadius={5} onPress={() => this.filterByYear('2018-01-01')} />
            <Button
            title='2019' borderRadius={5} onPress={() => this.filterByYear('2019-01-01')} />
          </View>
          <View style={styles.tableView}>
            {this._renderPlayersColumn()}
            <ScrollView horizontal contentContainerStyle={{ flexDirection: 'column' }}>
              <View style={styles.tableHead}>
                {this._renderTableHead()}
              </View>
              <View style={styles.tableRows}>
                {this._renderTableColumns()}
              </View>
            </ScrollView>
          </View>
          <Text style={styles.pullText}>Pull down to refresh</Text>
          <Text style={styles.pullText}>{'V2.0'}</Text>
        </ScrollView>
      )
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator/>
        </View>
      )
    }
  }
}

const small = Layout.isSmallDevice

const styles = StyleSheet.create({
  tableView: {
    flexDirection: 'row',
  },
  cellView: {
    padding: 15,
    marginBottom: 3,
    width: 60,
    backgroundColor: '#fff',
  },
  playersCellView: {
    flex: 1,
    padding: 15,
    marginBottom: 3,
    backgroundColor: '#fff',
  },
  dateCellView: {
    height: 60,
    width: 60,
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerCellView: {
    backgroundColor: Colours.championGold,
  },
  loserCellView: {
    backgroundColor: Colours.chairmansPink,
  },
  cell: {
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'gamja-flower',
    fontSize: 22,
  },
  dateCell: {
    fontWeight: 'bold',
  },
  playerCell: {
    alignItems: 'center',
    textAlign: 'left',
    fontSize: small ? 12 : 16,
  },
  loserCell: {
    color: 'white',
  },
  nameCell: {
    fontWeight: 'bold',
  },
  tableHead: {
    flexDirection: 'row',
  },
  tableColumn: {
    flexDirection: 'column',
    // marginBottom: 3,
  },
  tableRows: {
    flexDirection: 'row',
    // flex: 5,
  },
  pullText: {
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
    marginTop: 10,
  }
})
