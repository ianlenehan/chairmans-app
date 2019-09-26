import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import numeral from "numeral";
import Colours from "../constants/Colours";

export default class AveragesCard extends React.Component {
  state = {
    showStats: false,
    data: { players: [] }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });
  }

  onPress = () => {
    if (this.props.allData) {
      this.setState({ showStats: !this.state.showStats });
    }
  };

  _renderStats() {
    if (this.state.showStats) {
      const { allData } = this.props;
      return allData.map((item, i) => {
        const percentage = numeral(item.avg).format("0%");
        return (
          <View
            key={i}
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Text style={{ textAlign: "right", flex: 1 }}>
              {item.player.nick_name}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "left",
                flex: 1,
                marginLeft: 10
              }}
            >
              {percentage}
            </Text>
          </View>
        );
      });
    }
  }

  _subtitle() {
    if (this.props.subtitle) {
      const percentage = numeral(this.props.subtitle).format("0%");
      return (
        <View style={styles.circle}>
          <Text style={styles.subtitle}>{percentage}</Text>
        </View>
      );
    }
  }

  _renderNameAndImage() {
    if (this.props.data) {
      const { data: player } = this.props;
      return (
        <View style={{ alignItems: "center" }}>
          <Image source={{ uri: player.avatar_url }} style={styles.image} />
          <View
            style={{ alignItems: "center", flexDirection: "row", marginTop: 5 }}
          >
            <Text style={styles.nickName}>{player.nick_name}</Text>
            {this._subtitle()}
          </View>
          {this._renderStats()}
        </View>
      );
    }
    return <ActivityIndicator />;
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          <Text style={styles.cardTitle}>{this.props.title}</Text>
          {this._renderNameAndImage()}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 28,
    fontFamily: "bangers",
    color: "rgb(255,0,128)",
    padding: 5
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginTop: 3
  },
  nickName: {
    fontSize: 24,
    fontFamily: "gamja-flower"
  },
  subtitle: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    backgroundColor: Colours.chairmansPink,
    alignItems: "center",
    justifyContent: "center"
  }
});
