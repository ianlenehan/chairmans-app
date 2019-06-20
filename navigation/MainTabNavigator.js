import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "react-navigation";

import Colours from "../constants/Colours";

import HomeScreen from "../screens/HomeScreen";
import ResultsScreen from "../screens/ResultsScreen";
import PlayersNavigator from "./PlayersStackNavigator";
import RoundsScreen from "../screens/RoundsScreen";
import SettingsScreen from "../screens/SettingsScreen";

export default createBottomTabNavigator(
  {
    Home: { screen: HomeScreen },
    Results: { screen: ResultsScreen },
    Rounds: { screen: RoundsScreen }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: Colours.chairmansPink
      },
      headerTitleStyle: {
        color: "#fff"
      },
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case "Home":
            iconName =
              Platform.OS === "ios"
                ? `ios-trophy${focused ? "" : "-outline"}`
                : "md-trophy";
            break;
          case "Results":
            iconName =
              Platform.OS === "ios"
                ? `ios-add-circle${focused ? "" : "-outline"}`
                : "android-add-circle";
            break;
          case "Players":
            iconName =
              Platform.OS === "ios"
                ? `ios-people${focused ? "" : "-outline"}`
                : "android-people";
            break;
          case "Rounds":
            iconName =
              Platform.OS === "ios"
                ? `ios-list${focused ? "" : "-outline"}`
                : "android-list";
            break;
          case "Settings":
            iconName =
              Platform.OS === "ios"
                ? `ios-options${focused ? "" : "-outline"}`
                : "md-options";
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colours.tabIconSelected : Colours.tabIconDefault}
          />
        );
      }
    }),
    animationEnabled: false,
    swipeEnabled: false
  }
);
