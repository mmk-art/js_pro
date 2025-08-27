import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { DataProvider } from './src/context/DataContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
	return (
		<PaperProvider>
			<DataProvider>
				<AppNavigator />
			</DataProvider>
		</PaperProvider>
	);
}
