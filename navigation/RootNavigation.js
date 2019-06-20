import { Notifications } from "expo";
import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import registerForPushNotificationsAsync from "../api/registerForPushNotificationsAsync";

const RootStackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator
    }
  },
  { headerMode: "screen" },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: "normal"
      }
    })
  }
);

export default createAppContainer(RootStackNavigator);
