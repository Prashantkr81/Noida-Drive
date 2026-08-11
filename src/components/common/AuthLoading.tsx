import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../constants/colors';

export default function AuthLoading() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NOIDA DRIVE</Text>

      <ActivityIndicator
        size="large"
        color={colors.primary}
      />

      <Text style={styles.text}>
        Loading...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 32,
  },

  text: {
    color: colors.textSecondary,
    marginTop: 16,
    fontSize: 14,
  },
});