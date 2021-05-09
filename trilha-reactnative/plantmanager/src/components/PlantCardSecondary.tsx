import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import {
  RectButton,
  RectButtonProps,
  Swipeable,
} from 'react-native-gesture-handler';
import { SvgFromUri } from 'react-native-svg';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface PlantProps extends RectButtonProps {
  data: {
    name: string;
    photo: string;
    hour: string;
  };
  handleRemove: () => void;
}

export function PlantCardSecondary({
  data,
  handleRemove,
  ...rest
}: PlantProps) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <View style={styles.buttonRemoveContainer}>
          <RectButton style={styles.buttonRemove} onPress={handleRemove}>
            <Feather name="trash" size={24} color={colors.white} />
          </RectButton>
        </View>
      )}
    >
      <RectButton style={styles.container} {...rest}>
        <SvgFromUri uri={data.photo} width={50} height={50} />
        <Text style={styles.title}>{data.name}</Text>
        <View style={styles.details}>
          <Text style={styles.timeLabel}>Regar às</Text>
          <Text style={styles.time}>{data.hour}</Text>
        </View>
      </RectButton>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.shape,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 26,
    paddingRight: 16,
    marginVertical: 5,
  },
  title: {
    flex: 1,
    color: colors.heading,
    fontSize: 17,
    fontFamily: fonts.heading,
    marginLeft: 26,
  },
  details: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.body_light,
  },
  time: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.body_dark,
  },
  buttonRemoveContainer: {
    borderRadius: 20,
  },
  buttonRemove: {
    backgroundColor: colors.red,
    width: 120,
    height: 90,
    marginTop: 5,
    marginLeft: -40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingLeft: 30,
  },
});
