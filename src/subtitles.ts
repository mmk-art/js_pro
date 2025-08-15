import * as FileSystem from 'expo-file-system';
import { Cue } from './types';

function parseTimestampToSeconds(ts: string): number {
	// Supports 00:00:00.000 or 00:00:00,000
	const m = ts.trim().match(/^(\d{2}):(\d{2}):(\d{2})[\.,](\d{1,3})$/);
	if (!m) return 0;
	const hours = parseInt(m[1], 10);
	const minutes = parseInt(m[2], 10);
	const seconds = parseInt(m[3], 10);
	const millis = parseInt(m[4].padEnd(3, '0').slice(0, 3), 10);
	return hours * 3600 + minutes * 60 + seconds + millis / 1000;
}

export function parseSrtToCues(srt: string): Cue[] {
	const blocks = srt.replace(/\r/g, '').split(/\n\n+/);
	const cues: Cue[] = [];
	for (const block of blocks) {
		const lines = block.split('\n').filter(Boolean);
		if (lines.length < 2) continue;
		const timingLine = lines[0].match(/\d+\s*-->\s*\d+/) ? lines[0] : lines[1];
		const textLines = timingLine === lines[0] ? lines.slice(1) : lines.slice(2);
		const match = timingLine.match(/(\d{2}:\d{2}:\d{2}[\.,]\d{1,3})\s*-->\s*(\d{2}:\d{2}:\d{2}[\.,]\d{1,3})/);
		if (!match) continue;
		const start = parseTimestampToSeconds(match[1]);
		const end = parseTimestampToSeconds(match[2]);
		const text = textLines.join('\n');
		cues.push({ start, end, text });
	}
	return cues.sort((a, b) => a.start - b.start);
}

export function parseVttToCues(vtt: string): Cue[] {
	const content = vtt.replace(/\r/g, '').replace(/^WEBVTT.*\n/, '');
	const blocks = content.split(/\n\n+/);
	const cues: Cue[] = [];
	for (const block of blocks) {
		const lines = block.split('\n').filter(Boolean);
		if (lines.length < 1) continue;
		const timingIndex = lines.findIndex(l => /-->/.test(l));
		if (timingIndex === -1) continue;
		const timingLine = lines[timingIndex];
		const textLines = lines.slice(timingIndex + 1);
		const match = timingLine.match(/(\d{2}:\d{2}:\d{2}[\.,]\d{1,3})\s*-->\s*(\d{2}:\d{2}:\d{2}[\.,]\d{1,3})/);
		if (!match) continue;
		const start = parseTimestampToSeconds(match[1]);
		const end = parseTimestampToSeconds(match[2]);
		const text = textLines.join('\n');
		cues.push({ start, end, text });
	}
	return cues.sort((a, b) => a.start - b.start);
}

export async function loadCuesFromFile(uri: string, format: 'srt' | 'vtt'): Promise<Cue[]> {
	const raw = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });
	if (format === 'srt') return parseSrtToCues(raw);
	return parseVttToCues(raw);
}

export function getActiveCueText(cues: Cue[], currentTimeSec: number): string | null {
	const cue = cues.find(c => currentTimeSec >= c.start && currentTimeSec <= c.end);
	return cue ? cue.text : null;
}