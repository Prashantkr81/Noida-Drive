import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../constants/colors';

export default function ProfileScreen() {
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Profile
      </Text>

      <Text style={styles.name}>
        {profile?.name || 'User'}
      </Text>

      <Text style={styles.email}>
        {profile?.email || ''}
      </Text>

      <Text style={styles.role}>
        {profile?.role || 'customer'}
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

  name: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 30,
  },

  email: {
    color: colors.textSecondary,
    marginTop: 8,
  },

  role: {
    color: colors.primary,
    marginTop: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});