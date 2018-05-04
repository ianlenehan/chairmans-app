import React from 'react';
import { View, StyleSheet, Platform, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Colours from '../constants/Colours'

export default class Card extends React.Component {
  state = {
    showStats: false,
    data: { players: [] },
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data })
  }

  onPress = () => {
    if (this.props.allData) {
      this.setState({ showStats: !this.state.showStats })
    }
  }

  _renderStats() {
    if (this.state.showStats) {
      const { allData } = this.props
      return allData.map((player, i) => {
        return (
          <Text key={i}>{player.playerName} - {player.total}</Text>
        )
      })
    }
  }

  _subtitle() {
    if (this.props.subtitle) {
      return (
        <View style={styles.circle}>
          <Text style={styles.subtitle}>{this.props.subtitle}</Text>
        </View>
      )
    }
  }

  _renderSinglePlayer(player) {
    return (
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{uri: player.avatar_url}}
          style={styles.image}
        />
        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 5 }}>
          <Text style={styles.nickName}>{player.nick_name}</Text>
          {this._subtitle()}
        </View>
        {this._renderStats()}
      </View>
    )
  }

  _renderMostImage() {
    if (this.props.title === 'Most Hats') {
      return (
        <Image
          source={require('../assets/images/pink_hat.png')}
          style={styles.image}
        />
      )
    }

    return (
      <Image
        source={{uri: 'https://emojipedia-us.s3.amazonaws.com/thumbs/240/apple/129/trophy_1f3c6.png'}}
        style={styles.image}
      />
    )
  }

  _renderNameAndImage() {
    if (this.props.data) {
      const { data } = this.props
      if (this.props.singlePlayer) {
        return this._renderSinglePlayer(data)
      } else if (data.players && data.players.length === 1) {
        return this._renderSinglePlayer(data.players[0])
      } else if (this.props.data.players) {
        const nickNames = data.players.map((player) => {
          return player.nick_name
        })

        return (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.subtitle}>{this.props.subtitle || ''}</Text>
            {this._renderMostImage()}
            <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 5 }}>
              <Text style={styles.nickName}>{nickNames.join(', ')}</Text>
              {this._subtitle()}
            </View>

            {this._renderStats()}
          </View>
        )
      }
    }
    return <ActivityIndicator/>
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          <Text style={styles.cardTitle}>
            {this.props.title}
          </Text>
          {this._renderNameAndImage()}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 28,
    fontFamily: 'bangers',
    color: 'rgb(255,0,128)',
    padding: 5,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
  },
  nickName: {
    fontSize: 24,
    fontFamily: 'gamja-flower'
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 10,
    backgroundColor: Colours.chairmansPink,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
