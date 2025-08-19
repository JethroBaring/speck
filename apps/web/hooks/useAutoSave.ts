import { useEffect, useRef, useState } from "react";

export type AutosaveOptions = {
	delayMs?: number;
	enabled?: boolean;
};

export type AutosaveState = {
	isSaving: boolean;
	lastSavedAt: number | null;
	error: Error | null;
	flush: () => Promise<void>;
	cancel: () => void;
};

export function useAutosave<T>(
	value: T,
	save: (value: T, signal: AbortSignal) => Promise<void>,
	options?: AutosaveOptions,
): AutosaveState {
	const delayMs = options?.delayMs ?? 800;
	const enabled = options?.enabled ?? true;

	const timeoutIdRef = useRef<number | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const latestValueRef = useRef<T>(value);

	const [isSaving, setIsSaving] = useState(false);
	const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		latestValueRef.current = value;
		if (!enabled) return;

		if (timeoutIdRef.current !== null) {
			window.clearTimeout(timeoutIdRef.current);
		}

		timeoutIdRef.current = window.setTimeout(() => {
			void runSave();
		}, delayMs);

		return () => {
			if (timeoutIdRef.current !== null) {
				window.clearTimeout(timeoutIdRef.current);
				timeoutIdRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled, delayMs]);

	async function runSave() {
		if (!enabled) return;
		if (abortRef.current) {
			abortRef.current.abort();
		}
		const controller = new AbortController();
		abortRef.current = controller;
		setIsSaving(true);
		setError(null);
		try {
			await save(latestValueRef.current, controller.signal);
			setLastSavedAt(Date.now());
		} catch (e: any) {
			if (e?.name !== "AbortError") {
				setError(e instanceof Error ? e : new Error(String(e)));
			}
		} finally {
			setIsSaving(false);
			if (abortRef.current === controller) {
				abortRef.current = null;
			}
		}
	}

	async function flush() {
		if (!enabled) return;
		if (timeoutIdRef.current !== null) {
			window.clearTimeout(timeoutIdRef.current);
			timeoutIdRef.current = null;
		}
		await runSave();
	}

	function cancel() {
		if (timeoutIdRef.current !== null) {
			window.clearTimeout(timeoutIdRef.current);
			timeoutIdRef.current = null;
		}
		if (abortRef.current) {
			abortRef.current.abort();
			abortRef.current = null;
		}
	}

	useEffect(() => () => cancel(), []);

	return { isSaving, lastSavedAt, error, flush, cancel };
}
