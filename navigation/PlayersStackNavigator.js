import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation";

import Colours from "../constants/Colours";

import PlayersScreen from "../screens/PlayersScreen";
import PlayerScreen from "../screens/PlayerScreen";

export default createStackNavigator(
  {
    Players: { screen: PlayersScreen },
    Player: { screen: PlayerScreen }
  },
  { headerMode: "none" },
  {
    navigationOptions: {
      swipeEnabled: false
    }
  }
);
