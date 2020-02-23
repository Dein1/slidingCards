import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Dimensions,
  Image,
} from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const CARD = {WIDTH: 260, HEIGHT: 156};
const SCROLLED_ENOUGH_TO_SLIDE = 85;
const SHOWN_POSITION = WINDOW_HEIGHT / 3.5;
const HIDDEN_POSITION = WINDOW_HEIGHT - CARD.HEIGHT / 2;
const MAXIMUM_SCROLL_DISTANCE = HIDDEN_POSITION - SHOWN_POSITION;
const SPEED_RATIO = 0.7;

export class MainScreen extends React.Component {
  state = {
    onTop: false,
  };

  scrollY = new Animated.Value(HIDDEN_POSITION);

  moveToBottom() {
    Animated.spring(this.scrollY, {
      toValue: HIDDEN_POSITION,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }

  moveToTop() {
    Animated.spring(this.scrollY, {
      toValue: SHOWN_POSITION,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }

  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (
          (!this.state.onTop &&
            gestureState.dy <= 0 &&
            gestureState.dy >= -MAXIMUM_SCROLL_DISTANCE / SPEED_RATIO) ||
          (this.state.onTop &&
            gestureState.dy >= 0 &&
            gestureState.dy <= MAXIMUM_SCROLL_DISTANCE / SPEED_RATIO)
        ) {
          const offset = this.state.onTop ? SHOWN_POSITION : HIDDEN_POSITION;
          this.scrollY.setValue(gestureState.dy * SPEED_RATIO + offset);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.onTop && gestureState.dy >= SCROLLED_ENOUGH_TO_SLIDE) {
          this.setState({
            onTop: false,
          });
          this.moveToBottom();
        } else if (
          !this.state.onTop &&
          -gestureState.dy >= SCROLLED_ENOUGH_TO_SLIDE
        ) {
          this.setState({
            onTop: true,
          });
          this.moveToTop();
        } else {
          if (this.state.onTop) {
            this.moveToTop();
          } else {
            this.moveToBottom();
          }
        }
      },
    });
  }

  get topCardTranslate() {
    return {
      transform: [
        {
          translateY: this.scrollY.interpolate({
            inputRange: [SHOWN_POSITION, HIDDEN_POSITION],
            outputRange: [-(CARD.HEIGHT / 2), SHOWN_POSITION],
          }),
        },
      ],
    };
  }

  get topCardTypeOpacity() {
    return {
      opacity: this.scrollY.interpolate({
        inputRange: [
          SHOWN_POSITION,
          SHOWN_POSITION + 20,
          SHOWN_POSITION + 40,
          HIDDEN_POSITION,
        ],
        outputRange: [1, 0.2, 0.1, 0],
      }),
    };
  }

  get topCardDescription() {
    return {
      transform: [
        {
          translateY: this.scrollY.interpolate({
            inputRange: [SHOWN_POSITION, HIDDEN_POSITION - 60, HIDDEN_POSITION],
            outputRange: [-100, -90, 10],
          }),
        },
      ],
      opacity: this.scrollY.interpolate({
        inputRange: [SHOWN_POSITION, HIDDEN_POSITION - 10, HIDDEN_POSITION],
        outputRange: [0, 0.6, 1],
      }),
    };
  }

  get bottomCardTranslate() {
    return {transform: [{translateY: this.scrollY}]};
  }

  get bottomCardTypeOpacity() {
    return {
      opacity: this.scrollY.interpolate({
        inputRange: [
          SHOWN_POSITION,
          HIDDEN_POSITION - 40,
          HIDDEN_POSITION - 20,
          HIDDEN_POSITION,
        ],
        outputRange: [0, 0.1, 0.2, 1],
      }),
    };
  }

  get bottomCardDescription() {
    return {
      transform: [
        {
          translateY: this.scrollY.interpolate({
            inputRange: [SHOWN_POSITION, SHOWN_POSITION + 100, HIDDEN_POSITION],
            outputRange: [10, 90, 100],
          }),
        },
      ],
      opacity: this.scrollY.interpolate({
        inputRange: [SHOWN_POSITION, SHOWN_POSITION + 60, HIDDEN_POSITION],
        outputRange: [1, 0, 0],
      }),
    };
  }

  render() {
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <Animated.View style={[styles.cardContainer, this.topCardTranslate]}>
          <Image source={require('./credit_card.png')} style={styles.card} />
          <Animated.Text
            style={[
              styles.cardType,
              styles.topCardType,
              this.topCardTypeOpacity,
            ]}>
            {'Virtual card'}
          </Animated.Text>
          <Animated.Text
            style={[styles.description, this.topCardDescription]}
            numberOfLines={2}>
            {
              "This is your virtual card. It's \n like a physical card, but virtual"
            }
          </Animated.Text>
        </Animated.View>
        <Animated.View style={[styles.cardContainer, this.bottomCardTranslate]}>
          <Animated.Text
            style={[
              styles.cardType,
              styles.bottomCardType,
              this.bottomCardTypeOpacity,
            ]}>
            {'Physical card'}
          </Animated.Text>
          <Image source={require('./credit_card.png')} style={styles.card} />
          <Animated.Text
            style={[styles.description, this.bottomCardDescription]}
            numberOfLines={2}>
            {
              "This is your physical card. It's \n like a virtual card, but physical"
            }
          </Animated.Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    width: CARD.WIDTH,
    height: CARD.HEIGHT,
    zIndex: 100,
  },
  bottomCardType: {
    position: 'absolute',
    top: -32,
  },
  topCardType: {
    position: 'absolute',
    bottom: 0,
  },
  cardType: {
    fontSize: 15,
    color: '#A9A9A9',
  },
  description: {
    marginTop: 6,
    fontSize: 15,
    color: '#A9A9A9',
    textAlign: 'center',
  },
});
