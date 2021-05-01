import { Platform, StatusBar, StyleSheet } from 'react-native';

export default StyleSheet.create({
  androidSafe: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
