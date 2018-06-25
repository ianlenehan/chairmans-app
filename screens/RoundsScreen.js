import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import axios from 'axios'
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
  }

  componentDidMount() {
    this.makeApiRequest()
  }

  async makeApiRequest() {
    const { data } = await axios.get('https://chairmans-api.herokuapp.com/full_results?from=2018-01-01')
    const res = await axios.get('https://chairmans-api.herokuapp.com/players')
    this.setState({ data, players: res.data.players })
  }

  _renderTableHead() {
    const { data, players } = this.state
    if (data && players) {
      return data.rounds[0].scores.map((score, i) => {
        const [player] = players.filter((player => player.id === score.player_id))
        return (
          <View style={styles.cellView} key={i}>
            <Text style={styles.nameCell}>
              {player.nick_name}
            </Text>
          </View>
        )
      })
    }
  }

  _renderTableRows() {
    const { data } = this.state
    return data.rounds.map((round, i) => {
      return (
        <View style={styles.tableRow} key={i}>
          {
            round.scores.map((score, i) => {
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
                <View style={style} key={i}>
                  <Text style={cellStyle}>{s}</Text>
                </View>
              )
            })
          }
        </View>
      )
    })
  }

  _renderDateColumn() {
    const { data } = this.state
    return (
      <View style={styles.dateColumn}>
        <View style={styles.dateCellView}>
          <Text style={[styles.dateCell, { fontWeight: 'bold' }]}>Date</Text>
        </View>
        {
          data.rounds.map((round, i) => {
            return (
              <View key={i} style={styles.dateCellView}>
                <Text style={styles.dateCell}>{new Date(round.result.round_date).toLocaleDateString('en-AU')}</Text>
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
          <View style={styles.tableView}>
            {this._renderDateColumn()}
            <View style={styles.otherColumns}>
              <View style={styles.tableRow}>
                {this._renderTableHead()}
              </View>
              {this._renderTableRows()}
            </View>
          </View>
          <Text style={styles.pullText}>Pull down to refresh</Text>
          <Text style={styles.pullText}>{'V1.1'}</Text>
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
    flex: 1,
    padding: 5,
    marginRight: 1,
    marginLeft: 1,
  },
  winnerCellView: {
    flex: 1,
    padding: 5,
    backgroundColor: Colours.championGold,
    marginRight: 1,
    marginLeft: 1,
  },
  loserCellView: {
    flex: 1,
    padding: 5,
    backgroundColor: Colours.chairmansPink,
    marginRight: 1,
    marginLeft: 1,
  },
  tableRow: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 3,
    backgroundColor: '#fff',
  },
  dateColumn: {
    flex: 2,
  },
  otherColumns: {
    flexDirection:'column',
    flex: 5,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'gamja-flower',
    fontSize: 18,
  },
  loserCell: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'gamja-flower',
    fontSize: 18,
    color: 'white',
  },
  playerCell: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  dateCellView: {
    padding: 5,
    marginBottom: 3,
    backgroundColor: '#fff',
  },
  dateCell: {

  },
  nameCell: {
    fontWeight: 'bold',
    fontSize: small ? 10 : 14,
    textAlign: 'center'
  },
  pullText: {
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
    marginTop: 10,
  }
})
