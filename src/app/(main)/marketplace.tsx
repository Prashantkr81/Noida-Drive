import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';

export default function MarketplaceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Buy & Sell
      </Text>

      <Text style={styles.subtitle}>
        Discover cars and send quotes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 60,
  },

  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '800',
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 8,
  },
});