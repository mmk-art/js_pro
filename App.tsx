import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, FlatList, Alert, ActivityIndicator, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { VideoView, useVideoPlayer, VideoPlayer, VideoSource } from 'expo-video';
import * as Haptics from 'expo-haptics';
import * as DocumentPicker from 'expo-document-picker';
import { insertVideo, listVideos, deleteVideo as dbDeleteVideo, listSubtitles, insertSubtitle, updateVideoDuration } from './src/db';
import { pickAndImportLargeFile, deleteFileIfExists, importFromUri } from './src/storage';
import { Cue, SubtitleRecord, VideoRecord } from './src/types';
import { loadCuesFromFile } from './src/subtitles';

// Simple styles without external libs
const colors = {
	bg: '#0b0b0d',
	card: '#141418',
	text: '#f5f5f7',
	muted: '#a1a1aa',
	accent: '#4f46e5',
	danger: '#ef4444',
	border: '#27272a',
};

const Stack = createNativeStackNavigator<{ Home: undefined; Player: { id: string }; }>();

function Button({ title, onPress, variant = 'default' }: { title: string; onPress: () => void; variant?: 'default' | 'danger' | 'secondary'; }) {
	const backgroundColor = variant === 'danger' ? colors.danger : variant === 'secondary' ? colors.card : colors.accent;
	const color = variant === 'secondary' ? colors.text : '#ffffff';
	return (
		<Pressable onPress={onPress} style={{ backgroundColor, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}>
			<Text style={{ color, fontWeight: '600' }}>{title}</Text>
		</Pressable>
	);
}

function HomeScreen({ navigation }: NativeStackScreenProps<{ Home: undefined; Player: { id: string }; }, 'Home'>) {
	const [videos, setVideos] = useState<VideoRecord[] | null>(null);
	const [isBusy, setIsBusy] = useState(false);

	async function refresh() {
		const list = await listVideos();
		setVideos(list);
	}

	useEffect(() => {
		refresh();
	}, []);

	async function onImportVideo() {
		try {
			setIsBusy(true);
			const { destUri, name, size } = await pickAndImportLargeFile(['video/*'], 'video');
			const record = await insertVideo({ title: name, fileUri: destUri, sizeBytes: size ?? null, durationSeconds: null });
			await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			await refresh();
		} catch (e: any) {
			if (e?.message !== 'PICKER_CANCELED') Alert.alert('Import failed', String(e?.message ?? e));
		} finally {
			setIsBusy(false);
		}
	}

	async function onDeleteVideo(id: string, fileUri: string) {
		Alert.alert('Delete video', 'This will remove the file and metadata. Continue?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: async () => {
				// remove video file
				await deleteFileIfExists(fileUri);
				// remove subtitle files
				try {
					const subs = await listSubtitles(id);
					for (const s of subs) {
						await deleteFileIfExists(s.fileUri);
					}
				} catch {}
				// remove db rows (subtitles cascade)
				await dbDeleteVideo(id);
				await refresh();
			}},
		]);
	}

	async function onAddSubtitles(video: VideoRecord) {
		try {
			setIsBusy(true);
			const res = await DocumentPicker.getDocumentAsync({ type: ['text/vtt', 'text/plain', 'application/x-subrip'], multiple: false, copyToCacheDirectory: false });
			if (res.canceled || !res.assets?.length) return;
			const asset = res.assets[0];
			const nameLower = (asset.name ?? '').toLowerCase();
			const format: 'vtt' | 'srt' = nameLower.endsWith('.srt') ? 'srt' : 'vtt';
			const { destUri, name } = await importFromUri(asset.uri, asset.name ?? 'subtitle', 'subtitle', typeof asset.size === 'number' ? asset.size : null);
			await insertSubtitle({ videoId: video.id, fileUri: destUri, label: name, language: null, format });
			await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		} catch (e: any) {
			if (e?.message !== 'PICKER_CANCELED') Alert.alert('Add subtitles failed', String(e?.message ?? e));
		} finally {
			setIsBusy(false);
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
			<View style={{ padding: 16, gap: 12 }}>
				<Text style={{ color: colors.text, fontSize: 22, fontWeight: '700' }}>Offline Videos</Text>
				<Button title={isBusy ? 'Working…' : 'Import Video'} onPress={onImportVideo} />
			</View>
			{videos === null ? (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator color={colors.accent} />
				</View>
			) : (
				<FlatList
					data={videos}
					keyExtractor={(item) => item.id}
					ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
					contentContainerStyle={{ padding: 16 }}
					renderItem={({ item }) => (
						<View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border }}>
							<Pressable onPress={() => navigation.navigate('Player', { id: item.id })}>
								<Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
								<Text style={{ color: colors.muted, marginTop: 4 }}>{item.sizeBytes ? `${(item.sizeBytes / (1024*1024)).toFixed(1)} MB` : 'Size unknown'}</Text>
								{item.durationSeconds != null && (
									<Text style={{ color: colors.muted, marginTop: 2 }}>{Math.round(item.durationSeconds)}s</Text>
								)}
							</Pressable>
							<View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
								<Button title="Add Subtitles" onPress={() => onAddSubtitles(item)} variant="secondary" />
								<Button title="Delete" onPress={() => onDeleteVideo(item.id, item.fileUri)} variant="danger" />
							</View>
						</View>
					)}
				/>
			)}
		</SafeAreaView>
	);
}

function PlayerScreen({ route, navigation }: NativeStackScreenProps<{ Home: undefined; Player: { id: string }; }, 'Player'>) {
	const videoId = route.params.id;
	const [video, setVideo] = useState<VideoRecord | null>(null);
	const [subs, setSubs] = useState<SubtitleRecord[]>([]);
	const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
	const [cues, setCues] = useState<Cue[] | null>(null);
	const [currentTime, setCurrentTime] = useState(0);

	useEffect(() => {
		(async () => {
			const v = await (await import('./src/db')).getVideo(videoId);
			setVideo(v);
			const s = await listSubtitles(videoId);
			setSubs(s);
			setSelectedSubId(s.length ? s[0].id : null);
		})();
	}, [videoId]);

	useEffect(() => {
		(async () => {
			if (!selectedSubId) { setCues(null); return; }
			const sub = subs.find(s => s.id === selectedSubId);
			if (!sub) return;
			const parsed = await loadCuesFromFile(sub.fileUri, sub.format);
			setCues(parsed);
		})();
	}, [selectedSubId, subs]);

	const player = useVideoPlayer(video?.fileUri ?? '', (player) => {
		player.loop = false;
		player.play();
	});

	// Update duration to DB when available
	useEffect(() => {
		let mounted = true;
		const id = setInterval(() => {
			if (!mounted) return;
			const dur = player.duration ?? null;
			if (dur && video?.id) {
				updateVideoDuration(video.id, dur).catch(() => {});
			}
			setCurrentTime(player.currentTime ?? 0);
		}, 500);
		return () => { mounted = false; clearInterval(id); };
	}, [player, video?.id]);

	const activeSubtitle = useMemo(() => {
		if (!cues) return null;
		const t = player.currentTime ?? currentTime;
		const cue = cues.find(c => t >= c.start && t <= c.end);
		return cue?.text ?? null;
	}, [cues, player.currentTime, currentTime]);

	if (!video) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator color={colors.accent} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
			<View style={{ flex: 1 }}>
				<VideoView
					style={{ width: '100%', aspectRatio: 16/9, backgroundColor: 'black' }}
					player={player}
				/>
				{/* Simple controls */}
				<View style={{ padding: 12, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderBottomWidth: 1, borderColor: colors.border }}>
					<Text style={{ color: colors.text, fontWeight: '600' }}>{video.title}</Text>
					<View style={{ flexDirection: 'row', gap: 8 }}>
						<Button title={player.playing ? 'Pause' : 'Play'} onPress={() => player.playing ? player.pause() : player.play()} variant="secondary" />
						<Button title="-10s" onPress={() => { player.currentTime = Math.max(0, (player.currentTime ?? 0) - 10); }} variant="secondary" />
						<Button title="+10s" onPress={() => { const d = player.duration ?? 0; player.currentTime = Math.min(d, (player.currentTime ?? 0) + 10); }} variant="secondary" />
					</View>
				</View>

				{/* Subtitle and Audio selection */}
				<View style={{ padding: 12, gap: 12 }}>
					<Text style={{ color: colors.muted, fontWeight: '600' }}>Subtitles</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
						<Button title="Off" onPress={() => setSelectedSubId(null)} variant={selectedSubId === null ? 'default' : 'secondary'} />
						{subs.map(s => (
							<Button key={s.id} title={s.label ?? (s.language ?? s.format.toUpperCase())} onPress={() => setSelectedSubId(s.id)} variant={selectedSubId === s.id ? 'default' : 'secondary'} />
						))}
					</View>

					<Text style={{ color: colors.muted, fontWeight: '600' }}>Audio Track</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
						{/* expo-video exposes player.audioTracks and selectedAudioTrackIndex */}
						{(player.audioTracks ?? []).map((t, idx) => (
							<Button key={String(idx)} title={t.label ?? t.language ?? `Track ${idx+1}`} onPress={() => { player.selectedAudioTrackIndex = idx; }} variant={player.selectedAudioTrackIndex === idx ? 'default' : 'secondary'} />
						))}
					</View>
				</View>

				{/* Subtitle overlay */}
				{activeSubtitle && (
					<View style={{ position: 'absolute', bottom: 80, left: 16, right: 16, alignItems: 'center' }} pointerEvents="none">
						<View style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 }}>
							<Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>{activeSubtitle}</Text>
						</View>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
					<Stack.Screen name="Player" component={PlayerScreen} options={{ headerStyle: { backgroundColor: colors.bg }, headerTintColor: colors.text, headerTitle: 'Player' }} />
				</Stack.Navigator>
			</NavigationContainer>
		</GestureHandlerRootView>
	);
}