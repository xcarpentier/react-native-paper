/* @flow */

import color from 'color';
import React, {
  PureComponent,
  PropTypes,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  View,
  StyleSheet,
} from 'react-native';
import Icon from './Icon';
import Paper from './Paper';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple';
import { black, white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type DefaultProps = {
  roundness: number;
}

type Props = {
  disabled?: boolean;
  raised?: boolean;
  primary?: boolean;
  dark?: boolean;
  loading?: boolean;
  roundness?: number;
  icon?: string;
  color?: string;
  children?: string;
  onPress?: Function;
  style?: any;
  theme: Theme;
}

type State = {
  elevation: Animated.Value;
}

class Button extends PureComponent<DefaultProps, Props, State> {
  static propTypes = {
    disabled: PropTypes.bool,
    raised: PropTypes.bool,
    primary: PropTypes.bool,
    dark: PropTypes.bool,
    loading: PropTypes.bool,
    roundness: PropTypes.number,
    icon: PropTypes.string,
    color: PropTypes.string,
    children: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    style: View.propTypes.style,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    roundness: 2,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      elevation: new Animated.Value(props.raised ? 2 : 0),
    };
  }

  state: State;

  _handlePressIn = () => {
    if (this.props.raised) {
      Animated.timing(this.state.elevation, {
        toValue: 6,
        duration: 200,
      }).start();
    }
  };

  _handlePressOut = () => {
    if (this.props.raised) {
      Animated.timing(this.state.elevation, {
        toValue: 2,
        duration: 150,
      }).start();
    }
  };

  render() {
    const {
      disabled,
      raised,
      primary,
      dark,
      loading,
      roundness,
      icon,
      color: buttonColor,
      children,
      onPress,
      style,
      theme,
    } = this.props;
    const { colors } = theme;
    const fontFamily = theme.fonts.medium;

    let backgroundColor, textColor, isDark;

    if (raised) {
      if (disabled) {
        backgroundColor = 'rgba(0, 0, 0, .12)';
      } else {
        if (buttonColor) {
          backgroundColor = buttonColor;
        } else {
          if (primary) {
            backgroundColor = colors.primary;
          } else {
            backgroundColor = dark ? black : white;
          }
        }
      }
    } else {
      backgroundColor = 'transparent';
    }

    if (typeof dark === 'boolean') {
      isDark = dark;
    } else {
      isDark = backgroundColor === 'transparent' ? false : !color(backgroundColor).light();
    }

    if (disabled) {
      textColor = 'rgba(0, 0, 0, .26)';
    } else {
      if (raised) {
        textColor = isDark ? white : black;
      } else {
        if (buttonColor) {
          textColor = buttonColor;
        } else {
          if (primary) {
            textColor = colors.primary;
          } else {
            textColor = isDark ? white : black;
          }
        }
      }
    }

    const rippleColor = color(textColor).clearer(0.32).rgbaString();
    const buttonStyle = { backgroundColor, borderRadius: roundness };
    const touchableStyle = { borderRadius: roundness };
    const textStyle = { color: textColor, fontFamily };

    const content = (
      <View style={styles.content}>
        {icon && loading !== true ?
          <Icon
            name={icon}
            size={16}
            color={textColor}
            style={styles.icon}
          /> : null
        }
        {loading ?
          <ActivityIndicator
            size='small'
            color={textColor}
            style={styles.icon}
          /> : null
        }
        <Text numberOfLines={1} style={[ styles.label, textStyle, { fontFamily } ]}>
          {children ? children.toUpperCase() : ''}
        </Text>
      </View>
    );

    return (
      <AnimatedPaper elevation={disabled ? 0 : this.state.elevation} style={[ styles.button, buttonStyle, style ]}>
        {disabled ? content :
          <TouchableRipple
            borderless
            delayPressIn={0}
            onPress={onPress}
            onPressIn={this._handlePressIn}
            onPressOut={this._handlePressOut}
            rippleColor={rippleColor}
            style={touchableStyle}
          >
            {content}
          </TouchableRipple>
        }
      </AnimatedPaper>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    minWidth: 88,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  icon: {
    width: 16,
    marginLeft: 12,
    marginRight: -4,
  },
  label: {
    textAlign: 'center',
    marginVertical: 9,
    marginHorizontal: 16,
  },
});

export default withTheme(Button);
