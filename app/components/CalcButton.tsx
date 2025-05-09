import React, {FC} from 'react';
import {Pressable, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';

interface Props {
  title?: string;
  style?: StyleProp<ViewStyle>;
  onPress?(): void;
}

const CalcButton: FC<Props> = props => {
  return (
    <Pressable
      style={[styles.buttonWrapper, props.style]}
      onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    // padding: 10,
  },
});

export default CalcButton;
