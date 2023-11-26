import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StartScreen from './screens/StartScreen';
import MainScreen from './screens/MainScreen';
import SettingsScreen from './screens/SettingsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import AppContext from './components/AppContext';
import VehicleListScreen from './screens/VehicleListScreen';
import SignupScreen from './screens/SignupScreen';
import SignupThanksScreen from './screens/SignupThanksScreen';
import SearchScreen from './screens/SearchScreen';
import ResultsScreen from './screens/ResultsScreen';
import DestDetailsScreen from './screens/DestDetailsScreen';
import EditDestScreen from './screens/EditDestScreen';
import NavigateScreen from './screens/NavigateScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function StackNavigator() {
  return (
    /* Define your stack screens */
    <Stack.Navigator screenOptions={{
      headerShown: true,
    }}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="DestDetails" component={DestDetailsScreen} />
      <Stack.Screen name="EditDest" component={EditDestScreen} />
      <Stack.Screen name="Navigate" component={NavigateScreen} />
      <Stack.Screen name="VehicleList" component={VehicleListScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    /* Define your tab screens */
    < Tab.Navigator
      initialRouteName='MainStack' ///the name of the initial screen
      screenOptions={{
        headerShown: false,
      }
      }>
      <Tab.Screen name="MainStack" component={StackNavigator} options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings" color={color} size={size} />
        ),
      }} />
    </Tab.Navigator >
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="MainNav" component={TabNavigator} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="SignupThanks" component={SignupThanksScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  const [Profile, setProfile] = useState({});
  const [SearchLat, setSearchLat] = useState(0.0);
  const [SearchLon, setSearchLon] = useState(0.0);
  const [SearchPostcode, setSearchPostcode] = useState('');
  const [SearchCompany, setSearchCompany] = useState('');
  const [SearchSite, setSearchSite] = useState('');
  const [SearchUnit, setSearchUnit] = useState('');
  const [SearchRadius, setSearchRadius] = useState(0);
  const [SearchResults, setSearchResults] = useState({});
  const [SelectedId, setSelectedId] = useState(null);
  const [SelectedLat, setSelectedLat] = useState(0.0);
  const [SelectedLon, setSelectedLon] = useState(0.0);
  const [SelectedPostcode, setSelectedPostcode] = useState('');
  const [SelectedCompany, setSelectedCompany] = useState('');
  const [SelectedSite, setSelectedSite] = useState('');
  const [SelectedUnit, setSelectedUnit] = useState('');
  const userSettings = {
    Profile, setProfile,
    SearchLat, setSearchLat,
    SearchLon, setSearchLon,
    SearchPostcode, setSearchPostcode,
    SearchCompany, setSearchCompany,
    SearchSite, setSearchSite,
    SearchUnit, setSearchUnit,
    SearchRadius, setSearchRadius,
    SearchResults, setSearchResults,
    SelectedId, setSelectedId,
    SelectedLat, setSelectedLat,
    SelectedLon, setSelectedLon,
    SelectedPostcode, setSelectedPostcode,
    SelectedCompany, setSelectedCompany,
    SelectedSite, setSelectedSite,
    SelectedUnit, setSelectedUnit,
  };
  /* </AppContext.Provider>  */
  return (
    <AppContext.Provider value={userSettings}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
