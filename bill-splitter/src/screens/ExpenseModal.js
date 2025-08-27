import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Appbar, Button, HelperText, TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useData } from '../context/DataContext';

export default function ExpenseModal() {
	const navigation = useNavigation();
	const route = useRoute();
	const { tripId, expenseId } = route.params || {};
	const { getTripById, addExpense, updateExpense, deleteExpense, expenses } = useData();
	const trip = getTripById(tripId);

	const existing = useMemo(() => expenses.find((e) => e.id === expenseId), [expenses, expenseId]);
	const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
	const [category, setCategory] = useState(existing ? existing.category : (trip?.categories?.[0] || 'Food'));
	const [friend, setFriend] = useState(existing ? existing.friend : (trip?.friends?.[0] || ''));
	const [note, setNote] = useState(existing ? existing.note : '');

	const hasAmountError = !amount || Number.isNaN(Number(amount));
	const hasCategoryError = !category;
	const hasFriendError = !friend;

	const handleSave = () => {
		if (hasAmountError || hasCategoryError || hasFriendError || !tripId) return;
		if (existing) {
			updateExpense(existing.id, { amount: Number(amount), category, friend, note });
		} else {
			addExpense(tripId, { amount: Number(amount), category, friend, note });
		}
		navigation.goBack();
	};

	const handleDelete = () => {
		if (existing) {
			deleteExpense(existing.id);
		}
		navigation.goBack();
	};

	if (!trip) {
		return null;
	}

	return (
		<View style={{ flex: 1 }}>
			<Appbar.Header>
				<Appbar.Action icon="close" onPress={() => navigation.goBack()} />
				<Appbar.Content title={existing ? 'Edit Expense' : 'Add Expense'} />
				{existing ? <Appbar.Action icon="delete" onPress={handleDelete} /> : null}
			</Appbar.Header>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, padding: 16 }}>
				<TextInput
					label="Amount"
					keyboardType="decimal-pad"
					value={amount}
					onChangeText={setAmount}
					style={{ marginBottom: 12 }}
				/>
				{hasAmountError ? <HelperText type="error">Enter a valid amount</HelperText> : null}

				<TextInput
					label="Category"
					value={category}
					onChangeText={setCategory}
					autoCapitalize="words"
					style={{ marginBottom: 12 }}
					placeholder="e.g., Food"
				/>
				{hasCategoryError ? <HelperText type="error">Category is required</HelperText> : null}

				<TextInput
					label="Friend"
					value={friend}
					onChangeText={setFriend}
					autoCapitalize="words"
					style={{ marginBottom: 12 }}
					placeholder="Friend name"
				/>
				{hasFriendError ? <HelperText type="error">Friend is required</HelperText> : null}

				<TextInput
					label="Note (optional)"
					value={note}
					onChangeText={setNote}
					style={{ marginBottom: 16 }}
					multiline
				/>

				<Button mode="contained" onPress={handleSave} disabled={hasAmountError || hasCategoryError || hasFriendError}>Save</Button>
			</KeyboardAvoidingView>
		</View>
	);
}