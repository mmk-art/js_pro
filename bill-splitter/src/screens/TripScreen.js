import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Chip, Card, Text, FAB, Portal, Dialog, TextInput, Button, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';

export default function TripScreen() {
	const route = useRoute();
	const navigation = useNavigation();
	const { tripId } = route.params;
	const { getTripById, getExpensesByTrip, getTripTotal, addCategoryToTrip } = useData();
	const trip = getTripById(tripId);
	const expenses = getExpensesByTrip(tripId);
	const total = useMemo(() => getTripTotal(tripId), [getTripTotal, tripId]);

	const [activeCategory, setActiveCategory] = useState('All');
	const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
	const [newCategory, setNewCategory] = useState('');

	const categories = useMemo(() => ['All', ...(trip?.categories || [])], [trip]);
	const filteredExpenses = useMemo(() => {
		if (activeCategory === 'All') return expenses;
		return expenses.filter((e) => e.category === activeCategory);
	}, [expenses, activeCategory]);

	if (!trip) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text>Trip not found</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title={trip.name} subtitle={`Total: ₹${total.toFixed(2)}`} />
			</Appbar.Header>

			<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 8, paddingHorizontal: 8 }}>
				{categories.map((c) => (
					<Chip key={c} selected={activeCategory === c} onPress={() => setActiveCategory(c)} style={{ marginRight: 8 }}>{c}</Chip>
				))}
				<Chip icon="plus" onPress={() => setIsAddCategoryVisible(true)}>Add</Chip>
			</ScrollView>

			<ScrollView style={{ flex: 1 }}>
				{filteredExpenses.map((e) => (
					<Card key={e.id} style={{ margin: 12 }} onPress={() => navigation.navigate('ExpenseModal', { tripId, expenseId: e.id })}>
						<Card.Title title={`₹${Number(e.amount).toFixed(2)} • ${e.category}`} subtitle={e.friend} right={(props) => (
							<IconButton {...props} icon="account" onPress={() => navigation.navigate('FriendSummary', { tripId, friend: e.friend })} />
						)} />
						{e.note ? (
							<Card.Content>
								<Text>{e.note}</Text>
							</Card.Content>
						) : null}
					</Card>
				))}
				{filteredExpenses.length === 0 ? <Text style={{ margin: 16 }}>No expenses yet.</Text> : null}
			</ScrollView>

			<Portal>
				<Dialog visible={isAddCategoryVisible} onDismiss={() => setIsAddCategoryVisible(false)}>
					<Dialog.Title>Add Category</Dialog.Title>
					<Dialog.Content>
						<TextInput label="Category name" value={newCategory} onChangeText={setNewCategory} />
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setIsAddCategoryVisible(false)}>Cancel</Button>
						<Button onPress={() => {
							if (newCategory.trim()) {
								addCategoryToTrip(tripId, newCategory.trim());
								setActiveCategory(newCategory.trim());
								setNewCategory('');
							}
							setIsAddCategoryVisible(false);
						}}>Add</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<FAB icon="plus" style={{ position: 'absolute', right: 16, bottom: 16 }} onPress={() => navigation.navigate('ExpenseModal', { tripId })} />
		</View>
	);
}