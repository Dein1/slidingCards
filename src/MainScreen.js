import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Dimensions,
  Image,
} from 'react-native';

const WINDOW = Dimensions.get('window');
const CARD_WIDTH = WINDOW.width * 0.7;
const CARD_HEIGHT = CARD_WIDTH / 1.7;
const SCROLLED_ENOUGH_TO_SLIDE = 85;
const TOP_POSITION = WINDOW.height / 3.5;
const BOTTOM_POSITION = WINDOW.height - CARD_HEIGHT / 3;
const MAXIMUM_SCROLL_DISTANCE = BOTTOM_POSITION - TOP_POSITION;
const VELOCITY_RATIO = 0.7;

export class MainScreen extends React.Component {
  onTop = false;
  scrollY = new Animated.Value(BOTTOM_POSITION);

  moveToBottom = () => {
    this.onTop = false;
    Animated.spring(this.scrollY, {
      toValue: BOTTOM_POSITION,
      speed: 6,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  moveToTop = () => {
    this.onTop = true;
    Animated.spring(this.scrollY, {
      toValue: TOP_POSITION,
      speed: 6,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      if (
        (!this.onTop &&
          gestureState.dy <= 0 &&
          gestureState.dy >= -(MAXIMUM_SCROLL_DISTANCE / VELOCITY_RATIO)) ||
        (this.onTop &&
          gestureState.dy >= 0 &&
          gestureState.dy <= MAXIMUM_SCROLL_DISTANCE / VELOCITY_RATIO)
      ) {
        const offset = this.onTop ? TOP_POSITION : BOTTOM_POSITION;
        this.scrollY.setValue(gestureState.dy * VELOCITY_RATIO + offset);
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (this.onTop && gestureState.dy >= SCROLLED_ENOUGH_TO_SLIDE) {
        this.moveToBottom();
      } else if (!this.onTop && -gestureState.dy >= SCROLLED_ENOUGH_TO_SLIDE) {
        this.moveToTop();
      } else {
        if (this.onTop) {
          this.moveToTop();
        } else {
          this.moveToBottom();
        }
      }
    },
  });

  topCardTranslate = {
    transform: [
      {
        translateY: this.scrollY.interpolate({
          inputRange: [TOP_POSITION, BOTTOM_POSITION],
          outputRange: [-(CARD_HEIGHT / 1.5), TOP_POSITION],
        }),
      },
    ],
  };

  topCardTypeOpacity = {
    opacity: this.scrollY.interpolate({
      inputRange: [
        TOP_POSITION,
        TOP_POSITION + 20,
        TOP_POSITION + 40,
        BOTTOM_POSITION,
      ],
      outputRange: [1, 0.2, 0.1, 0],
    }),
  };

  topCardDescriptionAnimation = {
    transform: [
      {
        translateY: this.scrollY.interpolate({
          inputRange: [TOP_POSITION, BOTTOM_POSITION - 60, BOTTOM_POSITION],
          outputRange: [-100, -90, 0],
        }),
      },
    ],
    opacity: this.scrollY.interpolate({
      inputRange: [TOP_POSITION, BOTTOM_POSITION - 10, BOTTOM_POSITION],
      outputRange: [0, 0.6, 1],
    }),
  };

  bottomCardTranslate = {
    transform: [{translateY: this.scrollY}],
  };

  bottomCardTypeOpacity = {
    opacity: this.scrollY.interpolate({
      inputRange: [
        TOP_POSITION,
        BOTTOM_POSITION - 40,
        BOTTOM_POSITION - 20,
        BOTTOM_POSITION,
      ],
      outputRange: [0, 0.1, 0.2, 1],
    }),
  };

  bottomCardDescriptionAnimation = {
    transform: [
      {
        translateY: this.scrollY.interpolate({
          inputRange: [TOP_POSITION, TOP_POSITION + 100, BOTTOM_POSITION],
          outputRange: [0, 90, 100],
        }),
      },
    ],
    opacity: this.scrollY.interpolate({
      inputRange: [TOP_POSITION, TOP_POSITION + 60, BOTTOM_POSITION],
      outputRange: [1, 0, 0],
    }),
  };

  render() {
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <Animated.View style={[styles.cardContainer, this.topCardTranslate]}>
          <Image source={require('../credit_card.png')} style={styles.card} />
          <Animated.Text
            style={[
              styles.cardType,
              styles.topCardType,
              this.topCardTypeOpacity,
            ]}>
            {'Virtual card'}
          </Animated.Text>
          <Animated.Text
            style={[styles.description, this.topCardDescriptionAnimation]}
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
          <Image source={require('../credit_card.png')} style={styles.card} />
          <Animated.Text
            style={[styles.description, this.bottomCardDescriptionAnimation]}
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
    backgroundColor: 'white',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    zIndex: 100,
  },
  cardType: {
    fontSize: 17,
    color: '#A9A9A9',
    position: 'absolute',
  },
  bottomCardType: {
    top: -38,
  },
  topCardType: {
    bottom: 15,
  },
  description: {
    marginTop: 20,
    fontSize: 17,
    color: '#A9A9A9',
    textAlign: 'center',
  },
});
