import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import React from 'react';
import { Linking } from 'react-native';
import StackRoutes from './stack.routes';
import * as Notifications from 'expo-notifications';

const navigationRef = React.createRef<NavigationContainerRef>();

const Routes: React.FC = () => {
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        prefixes: ['plantmanager://'],
        config: {
          screens: {
            TabBar: {
              screens: {
                MyPlants: 'myplants',
              },
            },
          },
        },
        subscribe(listener) {
          const onReceiveURL = ({ url }: { url: string }) => listener(url);

          Linking.addEventListener('url', onReceiveURL);

          const subscription = Notifications.addNotificationResponseReceivedListener(
            (response) => {
              const url = response.notification.request.content.data
                .url as string;
              console.log("Notification's url: ", url);
              listener(url);
            }
          );

          return () => {
            Linking.removeEventListener('url', onReceiveURL);
            subscription.remove();
          };
        },
      }}
    >
      <StackRoutes />
    </NavigationContainer>
  );
};
export default Routes;
