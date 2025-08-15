import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';

const VIDEOS_DIR = FileSystem.documentDirectory + 'videos/';
const SUBTITLES_DIR = FileSystem.documentDirectory + 'subtitles/';

async function ensureDirs(): Promise<void> {
	await FileSystem.makeDirectoryAsync(VIDEOS_DIR, { intermediates: true }).catch(() => {});
	await FileSystem.makeDirectoryAsync(SUBTITLES_DIR, { intermediates: true }).catch(() => {});
}

export async function pickAndImportLargeFile(allowedTypes: ('video/*' | 'text/*')[], targetDir: 'video' | 'subtitle'): Promise<{ destUri: string; name: string; size: number | null; }> {
	await ensureDirs();
	const res = await DocumentPicker.getDocumentAsync({ type: allowedTypes, multiple: false, copyToCacheDirectory: false });
	if (res.canceled || !res.assets || res.assets.length === 0) {
		throw new Error('PICKER_CANCELED');
	}
	const asset = res.assets[0];
	return importFromUri(asset.uri, asset.name ?? (targetDir === 'video' ? 'video' : 'subtitle'), targetDir, typeof asset.size === 'number' ? asset.size : null);
}

export async function importFromUri(sourceUri: string, name: string, targetDir: 'video' | 'subtitle', sizeOverride?: number | null): Promise<{ destUri: string; name: string; size: number | null; }>{
	await ensureDirs();
	const size = sizeOverride ?? null;
	const extension = name.includes('.') ? name.split('.').pop()!.toLowerCase() : (targetDir === 'video' ? 'mp4' : 'vtt');
	const sanitized = name.replace(/[^a-zA-Z0-9_\-.]/g, '_');
	const destBase = (targetDir === 'video' ? VIDEOS_DIR : SUBTITLES_DIR) + `${Date.now()}_${sanitized}`;
	const destUri = destBase.endsWith(`.${extension}`) ? destBase : `${destBase}.${extension}`;
	await FileSystem.copyAsync({ from: sourceUri, to: destUri });
	return { destUri, name, size };
}

export async function deleteFileIfExists(uri: string): Promise<void> {
	try {
		const info = await FileSystem.getInfoAsync(uri);
		if (info.exists) {
			await FileSystem.deleteAsync(uri, { idempotent: true });
		}
	} catch (e) {
		// swallow
	}
}

export { VIDEOS_DIR, SUBTITLES_DIR };