import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "../screens/MainScreen";
import PeopleScreen from "../screens/PeopleScreen";
import DiscoverScreen from "../screens/DiscoverScreen";
import ChatScreen from "../screens/ChatScreen";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatNav from "../components/ChatNav";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface tabIcon {
  color: string;
  size: number;
}

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={Navigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          header: () => <ChatNav />,
        }}
      />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="Main"
          component={MainScreen}
          options={{
            tabBarIcon: ({ color, size }: tabIcon) => (
              <Ionicons name="chatbubble" size={size + 10} color={color} />
            ),
            tabBarActiveTintColor: theme.colors.bottomTabIcon,
            tabBarLabelStyle: { display: "none" },
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="People"
          component={PeopleScreen}
          options={{
            tabBarIcon: ({ color, size }: tabIcon) => (
              <Ionicons name="people" size={size + 10} color={color} />
            ),
            tabBarActiveTintColor: theme.colors.bottomTabIcon,
            tabBarLabelStyle: { display: "none" },
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Discover"
          component={DiscoverScreen}
          options={{
            tabBarIcon: ({ color, size }: tabIcon) => (
              <Ionicons name="compass" size={size + 10} color={color} />
            ),
            tabBarActiveTintColor: theme.colors.bottomTabIcon,
            tabBarLabelStyle: { display: "none" },
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MainStack;
