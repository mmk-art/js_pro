import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Appbar, Card, FAB, Portal, Dialog, TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';

export default function HomeScreen() {
	const navigation = useNavigation();
	const { trips, addTrip, getTotalAllTrips, getTripTotal } = useData();
	const total = useMemo(() => getTotalAllTrips(), [getTotalAllTrips]);

	const [isAddVisible, setIsAddVisible] = useState(false);
	const [tripName, setTripName] = useState('');

	const handleCreateTrip = () => {
		if (!tripName.trim()) return;
		const id = addTrip(tripName.trim());
		setTripName('');
		setIsAddVisible(false);
		navigation.navigate('Trip', { tripId: id, tripName: tripName.trim() });
	};

	return (
		<View style={{ flex: 1 }}>
			<Appbar.Header>
				<Appbar.Content title="Bill Splitter" subtitle={`Total spent: ₹${total.toFixed(2)}`} />
			</Appbar.Header>

			<FlatList
				data={trips}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Card style={{ margin: 12 }} onPress={() => navigation.navigate('Trip', { tripId: item.id, tripName: item.name })}>
						<Card.Title title={item.name} subtitle={`Categories: ${item.categories.length} • Friends: ${item.friends.length}`} />
						<Card.Content>
							<Text variant="titleMedium">Total: ₹{getTripTotal(item.id).toFixed(2)}</Text>
						</Card.Content>
					</Card>
				)}
				ListEmptyComponent={<Text style={{ margin: 16 }}>No trips yet. Tap + to add one.</Text>}
			/>

			<Portal>
				<Dialog visible={isAddVisible} onDismiss={() => setIsAddVisible(false)}>
					<Dialog.Title>New Trip</Dialog.Title>
					<Dialog.Content>
						<TextInput label="Trip name" value={tripName} onChangeText={setTripName} autoFocus />
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setIsAddVisible(false)}>Cancel</Button>
						<Button onPress={handleCreateTrip}>Create</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<FAB icon="plus" style={{ position: 'absolute', right: 16, bottom: 16 }} onPress={() => setIsAddVisible(true)} />
		</View>
	);
}