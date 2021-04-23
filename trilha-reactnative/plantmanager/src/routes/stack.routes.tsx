import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Welcome } from '../pages/Welcome';
import { UserIdentification } from '../pages/UserIdentification';
import { Confirmation } from '../pages/Confirmation';
import colors from '../styles/colors';

const StackNavigation = createStackNavigator();

const StackRoutes: React.FC = () => (
  <StackNavigation.Navigator
    headerMode="none"
    screenOptions={{ cardStyle: { backgroundColor: colors.white } }}
  >
    <StackNavigation.Screen name="Welcome" component={Welcome} />

    <StackNavigation.Screen
      name="UserIdentification"
      component={UserIdentification}
    />

    <StackNavigation.Screen name="Confirmation" component={Confirmation} />
  </StackNavigation.Navigator>
);

export default StackRoutes;
