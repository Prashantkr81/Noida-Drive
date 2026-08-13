import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@noida:user';

export const saveUserToStorage = async (user: any) => {
	try {
		await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
	} catch (e) {
		console.error('Failed to save user', e);
	}
};

export const getUserFromStorage = async () => {
	try {
		const json = await AsyncStorage.getItem(USER_KEY);
		return json ? JSON.parse(json) : null;
	} catch (e) {
		console.error('Failed to read user', e);
		return null;
	}
};

export const removeUserFromStorage = async () => {
	try {
		await AsyncStorage.removeItem(USER_KEY);
	} catch (e) {
		console.error('Failed to remove user', e);
	}
};
