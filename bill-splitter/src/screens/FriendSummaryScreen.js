import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useData } from '../context/DataContext';

export default function FriendSummaryScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const { tripId, friend } = route.params || {};
	const { getTripById, getFriendTotalInTrip, getFriendBreakdownInTrip } = useData();
	const trip = getTripById(tripId);

	const total = useMemo(() => getFriendTotalInTrip(tripId, friend), [getFriendTotalInTrip, tripId, friend]);
	const breakdown = useMemo(() => getFriendBreakdownInTrip(tripId, friend), [getFriendBreakdownInTrip, tripId, friend]);

	if (!trip) return null;

	return (
		<View style={{ flex: 1 }}>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title={friend} subtitle={trip.name} />
			</Appbar.Header>
			<ScrollView>
				<Card style={{ margin: 12 }}>
					<Card.Title title="Total Spent" />
					<Card.Content>
						<Text variant="headlineSmall">₹{total.toFixed(2)}</Text>
					</Card.Content>
				</Card>

				<Card style={{ margin: 12 }}>
					<Card.Title title="By Category" />
					<Card.Content>
						{Object.keys(breakdown).length === 0 ? (
							<Text>No expenses yet.</Text>
						) : (
							Object.entries(breakdown).map(([cat, amt]) => (
								<View key={cat} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
									<Text>{cat}</Text>
									<Text>₹{amt.toFixed(2)}</Text>
								</View>
							))
						)}
					</Card.Content>
				</Card>
			</ScrollView>
		</View>
	);
}