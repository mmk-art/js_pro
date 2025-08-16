import * as SQLite from 'expo-sqlite';
import { VideoRecord, SubtitleRecord } from './types';

const DB_NAME = 'videos.db';

function generateId(): string {
	return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
	if (dbInstance) return dbInstance;
	const db = await SQLite.openDatabaseAsync(DB_NAME);
	await db.execAsync(`PRAGMA journal_mode = WAL;`);
	await db.execAsync(`PRAGMA foreign_keys = ON;`);
	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS videos (
			id TEXT PRIMARY KEY NOT NULL,
			title TEXT NOT NULL,
			file_uri TEXT NOT NULL,
			size_bytes INTEGER,
			duration_seconds REAL,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		);
	`);
	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS subtitles (
			id TEXT PRIMARY KEY NOT NULL,
			video_id TEXT NOT NULL,
			file_uri TEXT NOT NULL,
			label TEXT,
			language TEXT,
			format TEXT NOT NULL,
			created_at TEXT NOT NULL,
			FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE
		);
	`);
	dbInstance = db;
	return dbInstance;
}

export async function insertVideo(meta: Omit<VideoRecord, 'createdAt' | 'updatedAt' | 'id'> & { id?: string }): Promise<VideoRecord> {
	const db = await getDb();
	const id = meta.id ?? generateId();
	const now = new Date().toISOString();
	await db.runAsync(
		`INSERT INTO videos (id, title, file_uri, size_bytes, duration_seconds, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[id, meta.title, meta.fileUri, meta.sizeBytes ?? null, meta.durationSeconds ?? null, now, now]
	);
	return { id, title: meta.title, fileUri: meta.fileUri, sizeBytes: meta.sizeBytes ?? null, durationSeconds: meta.durationSeconds ?? null, createdAt: now, updatedAt: now };
}

export async function updateVideoDuration(id: string, durationSeconds: number | null): Promise<void> {
	const db = await getDb();
	const now = new Date().toISOString();
	await db.runAsync(`UPDATE videos SET duration_seconds = ?, updated_at = ? WHERE id = ?`, [durationSeconds ?? null, now, id]);
}

export async function listVideos(): Promise<VideoRecord[]> {
	const db = await getDb();
	const rows = await db.getAllAsync<{
		id: string; title: string; file_uri: string; size_bytes: number | null; duration_seconds: number | null; created_at: string; updated_at: string;
	}>(`SELECT * FROM videos ORDER BY datetime(updated_at) DESC`);
	return rows.map(r => ({ id: r.id, title: r.title, fileUri: r.file_uri, sizeBytes: r.size_bytes, durationSeconds: r.duration_seconds, createdAt: r.created_at, updatedAt: r.updated_at }));
}

export async function getVideo(id: string): Promise<VideoRecord | null> {
	const db = await getDb();
	const row = await db.getFirstAsync<{
		id: string; title: string; file_uri: string; size_bytes: number | null; duration_seconds: number | null; created_at: string; updated_at: string;
	}>(`SELECT * FROM videos WHERE id = ?`, [id]);
	if (!row) return null;
	return { id: row.id, title: row.title, fileUri: row.file_uri, sizeBytes: row.size_bytes, durationSeconds: row.duration_seconds, createdAt: row.created_at, updatedAt: row.updated_at };
}

export async function deleteVideo(id: string): Promise<void> {
	const db = await getDb();
	await db.runAsync(`DELETE FROM videos WHERE id = ?`, [id]);
}

export async function insertSubtitle(sub: Omit<SubtitleRecord, 'createdAt' | 'id'> & { id?: string }): Promise<SubtitleRecord> {
	const db = await getDb();
	const id = sub.id ?? generateId();
	const now = new Date().toISOString();
	await db.runAsync(
		`INSERT INTO subtitles (id, video_id, file_uri, label, language, format, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[id, sub.videoId, sub.fileUri, sub.label ?? null, sub.language ?? null, sub.format, now]
	);
	return { id, videoId: sub.videoId, fileUri: sub.fileUri, label: sub.label ?? null, language: sub.language ?? null, format: sub.format, createdAt: now };
}

export async function listSubtitles(videoId: string): Promise<SubtitleRecord[]> {
	const db = await getDb();
	const rows = await db.getAllAsync<{
		id: string; video_id: string; file_uri: string; label: string | null; language: string | null; format: 'vtt' | 'srt'; created_at: string;
	}>(`SELECT * FROM subtitles WHERE video_id = ? ORDER BY datetime(created_at) ASC`, [videoId]);
	return rows.map(r => ({ id: r.id, videoId: r.video_id, fileUri: r.file_uri, label: r.label, language: r.language, format: r.format, createdAt: r.created_at }));
}

export async function deleteSubtitlesForVideo(videoId: string): Promise<void> {
	const db = await getDb();
	await db.runAsync(`DELETE FROM subtitles WHERE video_id = ?`, [videoId]);
}