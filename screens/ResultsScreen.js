import React from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, DatePickerIOS } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import axios from 'axios';
import { players } from '../players';
import Colours from '../constants/Colours'

export default class ResultsScreen extends React.Component {
  static navigationOptions = {
    title: 'New Result',
  };

  constructor(props) {
    super(props);
    this.state = {
      roundDate: new Date(),
      LurchScore: '',
      SpudScore: '',
      TurtleScore: '',
      HeffScore: '',
      FrostyScore: '',
      hatHolder: '',
      winner: '',
      selectedHat: '',
      selectedTrophy: '',
    }
  }

  viewPlayerScreen = (player) => {
    this.props.navigation.navigate('Player', { player })
  }

  _setDate = (newDate) => {
    this.setState({roundDate: newDate})
  }

  _renderHatImage(player, key) {
    let style = styles.hat
    if (this.state.selectedHat === key) {
      style = styles.selectedHat
    }
    return (
      <TouchableOpacity onPress={() => this.setState({
        hatHolder: player.nick_name,
        selectedHat: key,
      })}>
        <Image
          source={require('../assets/images/pink_hat.png')}
          style={style}
        />
      </TouchableOpacity>
    )
  }

  _renderTrophyImage(player, key) {
    let style = styles.trophy
    if (this.state.selectedTrophy === key) {
      style = styles.selectedTrophy
    }
    return (
      <TouchableOpacity onPress={() => this.setState({
        winner: player.nick_name,
        selectedTrophy: key,
      })}>
      <Image
        source={{uri: 'https://emojipedia-us.s3.amazonaws.com/thumbs/240/apple/129/trophy_1f3c6.png'}}
        style={style}
      />
      </TouchableOpacity>
    )
  }

  _renderPlayers() {
    return players.map((player, i) => {
      return (
        <View key={i} style={styles.playerView}>
          <Image
            source={{uri: player.avatar_url}}
            style={styles.image}
          />
          <Text style={styles.playerName}>{player.nick_name}</Text>
          <View style={styles.inputView}>
            {this._renderTrophyImage(player, i)}
            {this._renderHatImage(player, i)}
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => this.setState({ [`${player.nick_name}Score`]: text })}
              value={this.state[`${player.nick_name}Score`]}
            />
          </View>
        </View>
      )
    })
  }

  _submitScores = async () => {
    console.log('things to send', this.state.roundDate, this.state.hatHolder, this.state.winner, this.state.LurchScore, this.state.SpudScore);
    const {
      roundDate, hatHolder, winner, LurchScore, SpudScore,
      TurtleScore, HeffScore, FrostyScore
    } = this.state
    const response = await axios.post('http://localhost:3000/results', {
      roundDate, hatHolder, winner,
      scores: {
        Lurch: { score: LurchScore },
        Spud: { score: SpudScore },
        Turtle: { score: TurtleScore },
        Heff: { score: HeffScore },
        Frosty: { score: FrostyScore },
      }
    })
    console.log('response', response)
  }

  render() {
    const _sumbitScores = this._submitScores
    return (
      <View style={styles.container}>
        <DatePickerIOS
          style={styles.pickerStyle}
          date={this.state.roundDate}
          onDateChange={this._setDate}
          mode={'date'}
        />
        {this._renderPlayers()}
        <View style={styles.buttonView}>
          <Button
            buttonStyle={{ backgroundColor: Colours.chairmansPink }}
            title="SUBMIT"
            onPress={() => _sumbitScores()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  playerView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    padding: 10,
    margin: 15,
  },
  image: {
    height: 40,
    width: 40,
  },
  playerName: {
    fontSize: 22,
    marginLeft: 10,
  },
  inputView: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  inputStyle: {
    height: 40,
    width: 40,
    backgroundColor: '#ecf0f1',
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 10,
  },
  hat: {
    height: 30,
    width: 30,
    margin: 5,
    marginRight: 20,
    opacity: 0.2,
  },
  selectedHat: {
    height: 30,
    width: 30,
    margin: 5,
    marginRight: 20,
    opacity: 1,
  },
  trophy: {
    height: 30,
    width: 30,
    margin: 5,
    marginRight: 20,
    opacity: 0.2,
  },
  selectedTrophy: {
    height: 30,
    width: 30,
    margin: 5,
    marginRight: 20,
    opacity: 1,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  pickerStyle: {
    height: 80,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  }
});
