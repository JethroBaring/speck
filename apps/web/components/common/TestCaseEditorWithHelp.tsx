import type React from "react";
import { useRef, useState, useEffect } from "react";
import { CustomDropdownItem } from "../ui/dropdown/CustomDropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import {
	EditorCommandIcon,
	EditorFunctionIcon,
	EditorKeywordIcon,
	EditorSelectorIcon,
	EditorVariableIcon,
} from "../../icons";
import ComponentCard from "./ComponentCard";
import { Code, HelpCircle, Pencil, Check } from "lucide-react";
import { useTestCase, useUpdateTestCase } from "@/hooks/useTestCases";
import { useSearchParams } from "next/navigation";

const TestCaseEditorWithHelp: React.FC<{ className?: string; value?: string; onChange?: (text: string) => void; isSaving?: boolean, lastSavedAt?: number | null }> = ({ className, value, onChange, isSaving, lastSavedAt }) => {
	const searchParams = useSearchParams();
	const testCaseId = (searchParams.get("testCaseId") ?? searchParams.get("id")) as string | null;
	const { data: testCase } = useTestCase(testCaseId || "");
	const { mutate: updateTestCase } = useUpdateTestCase()

	const editorRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const [caretPosition, setCaretPosition] = useState<number>(0);
	const [showPlaceholder, setShowPlaceholder] = useState(true);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [titleDraft, setTitleDraft] = useState("");

	useEffect(() => {
		if (testCase?.data?.name != null) {
			setTitleDraft(String(testCase.data.name));
		}
	}, [testCase?.data?.id, testCase?.data?.name]);

	useEffect(() => {
		if (isEditingTitle && titleRef.current) {
			const el = titleRef.current;
			el.focus();
			// place caret at end
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	}, [isEditingTitle]);

	const saveTitle = async () => {
		console.log("saveTitle called", { testCaseId, titleDraft });
		if (!testCaseId) {
			console.log("No testCaseId, returning");
			return;
		}
		const name = titleDraft.trim();
		if (!name) {
			console.log("Empty name, returning");
			return;
		}
		try {
			console.log("Calling updateTestCase with:", { testCaseId, name });
			updateTestCase({ id: testCaseId, data: { name } as any });
			setIsEditingTitle(false);
			console.log("Title saved successfully");
		} catch (error) {
			console.error("Error saving title:", error);
		}
	};

	const cancelEdit = () => {
		setTitleDraft(String(testCase?.data?.name || ""));
		setIsEditingTitle(false);
	};

	// Maintainable syntax categories
	const COMMAND_WORDS = [
		"goto",
		"type",
		"click",
		"press",
		"wait",
		"select",
		"open",
		"close",
		"hover",
		"scroll",
		"assert",
		"expect",
	];
	const KEYWORDS = [
		"into",
		"from",
		"as",
		"if",
		"else",
		"and",
		"or",
		"not",
		"in",
		"on",
		"to",
		"with",
		"by",
		"then",
		"case",
		"when",
		"end",
	];
	const FUNCTION_WORDS = [
		"input", // add more defined function names here
	];
	const FUNCTION_WORDS_SET = new Set(
		FUNCTION_WORDS.map((w) => w.toLowerCase()),
	);

	const COLORS = {
		command: "#3641f5", // brand-600 (blue)
		string: "#039855", // success-600 (green)
		selector: "#fb6514", // orange-500 (orange)
		function: "#7a5af8", // theme-purple-500 (purple)
		keyword: "#2a31d8", // brand-700 (darker blue)
		punctuation: "#475467", // gray-600 (gray)
		comment: "#98a2b3", // gray-400 (optional)
		variable: "#0086c9", // blue-light-600 (optional)
		number: "#dc6803", // warning-600 (optional)
	};

	const ZERO_WIDTH_SPACE = "\u200B";

	// Autocomplete state
	type Suggestion = {
		value: string;
		description: string;
		kind: "command" | "function" | "keyword" | "variable" | "selector";
	};
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>(
		{ top: 0, left: 0 },
	);

	useEffect(() => {
		if (!editorRef.current) return;
		const incoming = (value ?? "");
		const currentRaw = editorRef.current.innerText || "";
		const current = currentRaw.replace(/\u200B/g, "");
		if (current === incoming) return;
		const prevCaret = getCaretPosition();
		const prevLen = current.length;
		rebuildContentWithSyntaxHighlighting(incoming);
		addCaretAnchorIfNeeded(incoming);
		setShowPlaceholder(incoming.length === 0);
		// If this is the first load (or switching to a new case), put caret at end
		if (prevLen === 0) {
			restoreCaretPosition(incoming.length);
		} else {
			restoreCaretPosition(Math.min(prevCaret, incoming.length));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const COMMAND_DESCRIPTIONS: Record<string, string> = {
		goto: "navigate the browser to a URL",
		type: "enter text into the target input",
		click: "click the target element",
		press: "press one or more keyboard keys",
		wait: "wait for a time, element, or condition",
		select: "choose an option from a dropdown or list",
		open: "open a modal, menu, or new tab/context",
		close: "close a modal, menu, or tab/context",
		hover: "move the mouse over the target element",
		scroll: "scroll the page or container to a target or offset",
		assert: "verify a condition; fail the test if it is false",
		expect: "validate a value against a matcher or condition",
	};

	// Precompiled regex helpers
	const COMMAND_RE = new RegExp(
		`^(?:${COMMAND_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
		"i",
	);
	const KEYWORD_RE = new RegExp(
		`^(?:${KEYWORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
		"i",
	);
	const NUMBER_RE = /^\b\d+(?:\.\d+)?\b/;
	const ID_SELECTOR_RE = /^#[A-Za-z_][\w-]*/;
	const CLASS_SELECTOR_RE = /^\.[A-Za-z_][\w-]*/;
	const ATTR_SELECTOR_RE = /^\[[^\]\n]*\]/;
	const PUNCTUATION_RE = /^[()\[\]{}.,:;"']/;

	// Counts characters in a DOM subtree, where text nodes count as their visible length (ZWSP ignored) and <br> counts as 1
	const countTextAndBreaks = (node: Node): number => {
		let count = 0;
		if (node.nodeType === Node.TEXT_NODE) {
			const content = (node.textContent || "").replace(/\u200B/g, "");
			count += content.length;
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const el = node as HTMLElement;
			if (el.tagName === "BR") {
				count += 1;
			} else {
				for (const child of Array.from(node.childNodes)) {
					count += countTextAndBreaks(child);
				}
			}
		}
		return count;
	};

	// Compute caret position in characters counting <br> as one char
	const getCaretPosition = (): number => {
		if (!editorRef.current) return 0;
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return 0;
		const range = selection.getRangeAt(0);

		const preRange = document.createRange();
		preRange.selectNodeContents(editorRef.current);
		preRange.setEnd(range.startContainer, range.startOffset);
		const fragment = preRange.cloneContents();
		let pos = 0;
		for (const child of Array.from(fragment.childNodes)) {
			pos += countTextAndBreaks(child);
		}
		return pos;
	};

	const getCharPositionFor = (container: Node, offset: number): number => {
		if (!editorRef.current) return 0;
		const preRange = document.createRange();
		preRange.selectNodeContents(editorRef.current);
		preRange.setEnd(container, offset);
		const fragment = preRange.cloneContents();
		let pos = 0;
		for (const child of Array.from(fragment.childNodes)) {
			pos += countTextAndBreaks(child);
		}
		return pos;
	};

	const getSelectionRangePositions = (): {
		start: number;
		end: number;
		collapsed: boolean;
	} => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) {
			const pos = getCaretPosition();
			return { start: pos, end: pos, collapsed: true };
		}
		const range = selection.getRangeAt(0);
		const start = getCharPositionFor(range.startContainer, range.startOffset);
		const end = getCharPositionFor(range.endContainer, range.endOffset);
		return {
			start: Math.min(start, end),
			end: Math.max(start, end),
			collapsed: range.collapsed,
		};
	};

	const addCaretAnchorIfNeeded = (text: string) => {
		if (!editorRef.current) return;
		const root = editorRef.current;
		const last = root.lastChild;
		const hasAnchor =
			last?.nodeType === Node.TEXT_NODE &&
			(last.textContent || "") === ZERO_WIDTH_SPACE;
		const needsAnchor = text.length === 0 || text.endsWith("\n") || !last;
		if (!hasAnchor && needsAnchor) {
			root.appendChild(document.createTextNode(ZERO_WIDTH_SPACE));
		}
	};

	const getEditorRelativeCaretRect = (): { top: number; left: number } => {
		if (!editorRef.current) return { top: 0, left: 0 };
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return { top: 0, left: 0 };
		const range = selection.getRangeAt(0);
		let rect: DOMRect | undefined;
		const rects = range.getClientRects();
		rect = rects && rects.length > 0 ? rects[0] : range.getBoundingClientRect();
		const editorRect = editorRef.current.getBoundingClientRect();
		const top = (rect?.bottom || editorRect.top) - editorRect.top;
		const left = (rect?.left || editorRect.left) - editorRect.left;
		return { top, left };
	};

	const getCurrentToken = (
		text: string,
		caret: number,
	): { start: number; end: number; value: string } => {
		// Identify simple word token made of letters only for commands
		let start = caret;
		while (start > 0 && /[A-Za-z]/.test(text[start - 1])) start -= 1;
		let end = caret;
		while (end < text.length && /[A-Za-z]/.test(text[end])) end += 1;
		return { start, end, value: text.slice(start, caret) };
	};

	const updateAutocomplete = () => {
		if (!editorRef.current) return;
		const text = (editorRef.current.innerText || "").replace(/\u200B/g, "");
		const caret = getCaretPosition();
		const { start, value } = getCurrentToken(text, caret);
		const prefix = value.toLowerCase();

		if (!prefix || !/^[a-z]+$/.test(prefix)) {
			setIsDropdownOpen(false);
			setSuggestions([]);
			return;
		}

		const cmdMatches = COMMAND_WORDS.filter((w) =>
			w.toLowerCase().startsWith(prefix),
		);
		const kwMatches = KEYWORDS.filter((w) =>
			w.toLowerCase().startsWith(prefix),
		);
		const fnMatches = FUNCTION_WORDS.filter((w) =>
			w.toLowerCase().startsWith(prefix),
		);
		const hasMatches =
			cmdMatches.length > 0 || kwMatches.length > 0 || fnMatches.length > 0;
		if (!hasMatches) {
			setIsDropdownOpen(false);
			setSuggestions([]);
			return;
		}

		const cmdSug: Suggestion[] = cmdMatches.map((m) => ({
			value: m,
			description:
				COMMAND_DESCRIPTIONS[m as keyof typeof COMMAND_DESCRIPTIONS] || "",
			kind: "command",
		}));
		const kwSug: Suggestion[] = kwMatches.map((m) => ({
			value: m,
			description: "keyword",
			kind: "keyword",
		}));
		const fnSug: Suggestion[] = fnMatches.map((m) => ({
			value: m,
			description: "function",
			kind: "function",
		}));
		const sug = [...cmdSug, ...kwSug, ...fnSug];
		setSuggestions(sug);
		setHighlightedIndex(0);
		const pos = getEditorRelativeCaretRect();
		setDropdownPos({ top: pos.top + 6, left: pos.left });
		setIsDropdownOpen(true);
	};

	const acceptSuggestion = (index: number) => {
		if (!editorRef.current || suggestions.length === 0) return;
		const chosen =
			suggestions[Math.max(0, Math.min(index, suggestions.length - 1))];
		const rawText = editorRef.current.innerText || "";
		const currentText = rawText.replace(/\u200B/g, "");
		const caret = getCaretPosition();
		const { start } = getCurrentToken(currentText, caret);

					let inserted = chosen.value;
			let newCaret: number;
			if (chosen.kind === "function") {
				// If next non-space char is already '(', insert only name; else insert name + "()" and place caret inside
				let k = caret;
				while (k < currentText.length && /\s/.test(currentText[k])) k += 1;
				if (currentText[k] === "(") {
					inserted = chosen.value;
					newCaret = start + inserted.length;
				} else {
					inserted = `${chosen.value}()`;
					newCaret = start + chosen.value.length + 1; // inside parentheses
				}
			} else {
				newCaret = start + inserted.length;
				const nextChar = currentText[caret] ?? "";
				if (!(nextChar && (/\s/.test(nextChar) || /[)\]\},.;:]/.test(nextChar)))) {
					inserted += " ";
					newCaret += 1;
				}
			}

			const newText =
				currentText.slice(0, start) + inserted + currentText.slice(caret);
			rebuildContentWithSyntaxHighlighting(newText);
			addCaretAnchorIfNeeded(newText);
			restoreCaretPosition(newCaret);
			setIsDropdownOpen(false);
			setSuggestions([]);
			onChange?.(newText);
	};

	const handleInput = (e: React.ChangeEvent<HTMLDivElement>) => {
		const position = getCaretPosition();
		setCaretPosition(position);
		const raw = e.currentTarget.innerText || "";
		const text = raw.replace(/\u200B/g, "");
		
		// Show/hide placeholder based on content
		setShowPlaceholder(text.length === 0);
		
		rebuildContentWithSyntaxHighlighting(text);
		addCaretAnchorIfNeeded(text);
		restoreCaretPosition(position);
		updateAutocomplete();
		onChange?.(text);
	};

	const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!editorRef.current) return;

		// Autocomplete navigation
		if (isDropdownOpen) {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setHighlightedIndex((i) => (i + 1) % suggestions.length);
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setHighlightedIndex(
					(i) => (i - 1 + suggestions.length) % suggestions.length,
				);
				return;
			}
			if (e.key === "Enter" || e.key === "Tab") {
				e.preventDefault();
				acceptSuggestion(highlightedIndex);
				return;
			}
			if (e.key === "Escape") {
				e.preventDefault();
				setIsDropdownOpen(false);
				return;
			}
		}

		const rawText = editorRef.current.innerText || "";
		const currentText = rawText.replace(/\u200B/g, "");
		const { start, end, collapsed } = getSelectionRangePositions();

		// TABOUT: if right before a closing ), ] or " then move caret past it
		if (e.key === "Tab" && !isDropdownOpen) {
			e.preventDefault();
			if (collapsed) {
				const pos = getCaretPosition();
				const ch = currentText[pos] ?? "";
				if (ch === ")" || ch === "]" || ch === '"') {
					restoreCaretPosition(pos + 1);
					setIsDropdownOpen(false);
					return;
				}
			}
		}

				// Auto-pair quotes and place caret between them
		if (e.key === '"' || e.key === "'") {
			e.preventDefault();
			const quote = e.key;
			if (!collapsed) {
				const newText =
					currentText.slice(0, start) +
					quote +
					currentText.slice(start, end) +
					quote +
					currentText.slice(end);
				rebuildContentWithSyntaxHighlighting(newText);
				addCaretAnchorIfNeeded(newText);
				// caret after the opening quote and selected content
				restoreCaretPosition(end + 1);
				updateAutocomplete();
				onChange?.(newText);
				return;
			}
			const caretPos = getCaretPosition();
			// If the next character is already the same quote, just move past it
			if (currentText[caretPos] === quote) {
				restoreCaretPosition(caretPos + 1);
				updateAutocomplete();
				return;
			}
			const newText =
				currentText.slice(0, caretPos) + quote + quote + currentText.slice(caretPos);
			rebuildContentWithSyntaxHighlighting(newText);
			addCaretAnchorIfNeeded(newText);
			restoreCaretPosition(caretPos + 1);
			updateAutocomplete();
			onChange?.(newText);
			return;
		}

		if (e.key === "Enter") {
			e.preventDefault();
			// Remove selection then insert a newline at start
			const base = collapsed
				? currentText
				: currentText.slice(0, start) + currentText.slice(end);
			const insertPos = start;
			const newText = base.slice(0, insertPos) + "\n" + base.slice(insertPos);
			rebuildContentWithSyntaxHighlighting(newText);
			addCaretAnchorIfNeeded(newText);
			restoreCaretPosition(insertPos + 1);
			setIsDropdownOpen(false);
			onChange?.(newText);
			return;
		}

				if (e.key === "Backspace") {
						e.preventDefault();
						if (!collapsed) {
							const newText = currentText.slice(0, start) + currentText.slice(end);
							rebuildContentWithSyntaxHighlighting(newText);
							addCaretAnchorIfNeeded(newText);
							restoreCaretPosition(start);
							updateAutocomplete();
							onChange?.(newText);
							return;
						}
						const caretPos = getCaretPosition();
						if (caretPos === 0) return; // nothing to delete
						const newText =
							currentText.slice(0, caretPos - 1) + currentText.slice(caretPos);
						
						setShowPlaceholder(newText.length === 0);
						rebuildContentWithSyntaxHighlighting(newText);
						addCaretAnchorIfNeeded(newText);
						restoreCaretPosition(caretPos - 1);
						updateAutocomplete();
						onChange?.(newText);
						return;
					}

		if (e.key === "Delete") {
			e.preventDefault();
			if (!collapsed) {
				const newText = currentText.slice(0, start) + currentText.slice(end);
				rebuildContentWithSyntaxHighlighting(newText);
				addCaretAnchorIfNeeded(newText);
				restoreCaretPosition(start);
				updateAutocomplete();
				onChange?.(newText);
				return;
			}
			if (start >= currentText.length) return; // nothing to delete
			const newText =
				currentText.slice(0, start) + currentText.slice(start + 1);
			rebuildContentWithSyntaxHighlighting(newText);
			addCaretAnchorIfNeeded(newText);
			restoreCaretPosition(start);
			updateAutocomplete();
			onChange?.(newText);
			return;
		}

		if (
			e.key === "ArrowLeft" ||
			e.key === "ArrowRight" ||
			e.key === "ArrowUp" ||
			e.key === "ArrowDown"
		) {
			setTimeout(() => {
				setCaretPosition(getCaretPosition());
				updateAutocomplete();
			}, 0);
		}
	};

	const handleClick = () => {
		setTimeout(() => {
			setCaretPosition(getCaretPosition());
			updateAutocomplete();
		}, 0);
	};

	// Map a character index back to a DOM position. <br> counts as 1, caret is placed after it (at parent, childIndex+1)
	const findNodeAndOffsetAtPosition = (
		targetPosition: number,
	): [Node, number] | null => {
		if (!editorRef.current) return null;
		let currentOffset = 0;

		const locateIn = (node: Node): [Node, number] | null => {
			const children = Array.from(node.childNodes);
			for (let i = 0; i < children.length; i += 1) {
				const child = children[i];
				if (child.nodeType === Node.TEXT_NODE) {
					const textLength = (child.textContent || "").replace(
						/\u200B/g,
						"",
					).length;
					if (targetPosition <= currentOffset + textLength) {
						return [child, targetPosition - currentOffset];
					}
					currentOffset += textLength;
				} else if (child.nodeType === Node.ELEMENT_NODE) {
					const el = child as HTMLElement;
					if (el.tagName === "BR") {
						if (targetPosition <= currentOffset + 1) {
							return [node, i + 1];
						}
						currentOffset += 1;
					} else {
						const found = locateIn(child);
						if (found) return found;
					}
				}
			}
			return null;
		};

		const root = editorRef.current as Node;
		const found = locateIn(root);
		if (found) return found;

		// If we got here, place at end
		if (root.lastChild) {
			const last = root.lastChild;
			if (last.nodeType === Node.TEXT_NODE) {
				return [last, (last.textContent || "").length];
			}
			return [root, root.childNodes.length];
		}
		return [root, 0];
	};

	const rebuildContentWithSyntaxHighlighting = (text: string) => {
		if (!editorRef.current) return;
		editorRef.current.innerHTML = "";
		if (text.length === 0) return;

		let i = 0;
		const root = editorRef.current;

		const isBoundaryBefore = (index: number) =>
			index === 0 || /[^A-Za-z0-9_-]/.test(text[index - 1] || "");
		const isBoundaryAfter = (index: number, len: number) => {
			const j = index + len;
			return j >= text.length || /[^A-Za-z0-9_-]/.test(text[j] || "");
		};

		const appendSpan = (content: string, colorVar: string) => {
			if (!content) return;
			const span = document.createElement("span");
			span.style.color = colorVar;
			span.textContent = content;
			root.appendChild(span);
		};

		while (i < text.length) {
			const ch = text[i];

			// Newlines
			if (ch === "\n") {
				root.appendChild(document.createElement("br"));
				i += 1;
				continue;
			}

			// Comments: // to end of line
			if (text.startsWith("//", i)) {
				const nextNl = text.indexOf("\n", i);
				const end = nextNl === -1 ? text.length : nextNl;
				appendSpan(text.slice(i, end), COLORS.comment);
				i = end;
				continue;
			}

			// Strings: '...' or "..." with simple escape handling
			if (ch === '"' || ch === "'") {
				const quote = ch;
				let j = i + 1;
				let foundClosing = false;
				while (j < text.length) {
					if (text[j] === "\\") {
						j += 2;
						continue;
					}
					if (text[j] === "\n") {
						break;
					}
					if (text[j] === quote) {
						foundClosing = true;
						j += 1;
						break;
					}
					j += 1;
				}
				// opening quote as punctuation
				appendSpan(quote, COLORS.punctuation);
				// content
				const contentEnd = foundClosing ? j - 1 : j;
				if (contentEnd > i + 1) {
					appendSpan(text.slice(i + 1, contentEnd), COLORS.string);
				}
				// closing quote as punctuation only if we actually found one
				if (foundClosing) {
					appendSpan(quote, COLORS.punctuation);
				}
				i = j;
				continue;
			}

			// Attribute selectors: [attr=value]
			if (ch === "[") {
				const close = text.indexOf("]", i + 1);
				const nextNl = text.indexOf("\n", i + 1);
				if (close !== -1 && (nextNl === -1 || close < nextNl)) {
					appendSpan(text.slice(i, close + 1), COLORS.selector);
					i = close + 1;
					continue;
				}
			}

			// ID/Class selectors
			if (ch === "#" && ID_SELECTOR_RE.test(text.slice(i))) {
				const m = text.slice(i).match(ID_SELECTOR_RE)!;
				appendSpan(m[0], COLORS.selector);
				i += m[0].length;
				continue;
			}
			if (ch === "." && CLASS_SELECTOR_RE.test(text.slice(i))) {
				const m = text.slice(i).match(CLASS_SELECTOR_RE)!;
				appendSpan(m[0], COLORS.selector);
				i += m[0].length;
				continue;
			}

			// Variables: $identifier
			if (ch === "$" && /[A-Za-z_]/.test(text[i + 1] || "")) {
				let j = i + 2;
				while (j < text.length && /[A-Za-z0-9_-]/.test(text[j])) j += 1;
				appendSpan(text.slice(i, j), COLORS.variable);
				i = j;
				continue;
			}

			// Function names from defined list (highlight name; parentheses will be colored as punctuation)
			if (isBoundaryBefore(i)) {
				const identMatch = text.slice(i).match(/^[A-Za-z_][\w-]*/);
				if (identMatch) {
					const name = identMatch[0];
					// Optionally require next non-space to be '(' to avoid false positives
					let k = i + name.length;
					while (k < text.length && /\s/.test(text[k])) k += 1;
					const nextIsParen = text[k] === "(";
					if (FUNCTION_WORDS_SET.has(name.toLowerCase()) && nextIsParen) {
						appendSpan(name, COLORS.function);
						i += name.length;
						continue;
					}
				}
			}

			// Numbers
			if (NUMBER_RE.test(text.slice(i))) {
				const m = text.slice(i).match(NUMBER_RE)!;
				appendSpan(m[0], COLORS.number);
				i += m[0].length;
				continue;
			}

			// Commands
			if (isBoundaryBefore(i)) {
				const cm = text.slice(i).match(COMMAND_RE);
				if (cm) {
					const word = cm[0];
					if (isBoundaryAfter(i, word.length)) {
						appendSpan(word, COLORS.command);
						i += word.length;
						continue;
					}
				}
			}

			// Keywords
			if (isBoundaryBefore(i)) {
				const km = text.slice(i).match(KEYWORD_RE);
				if (km) {
					const word = km[0];
					if (isBoundaryAfter(i, word.length)) {
						appendSpan(word, COLORS.keyword);
						i += word.length;
						continue;
					}
				}
			}

			// Punctuation
			if (PUNCTUATION_RE.test(text.slice(i, i + 1))) {
				appendSpan(text[i], COLORS.punctuation);
				i += 1;
				continue;
			}

			// Fallback: plain character
			root.appendChild(document.createTextNode(text[i]));
			i += 1;
		}
	};

	const restoreCaretPosition = (charPosition: number) => {
		if (!editorRef.current) return;
		const selection = window.getSelection();
		if (!selection) return;
		const range = document.createRange();
		const result = findNodeAndOffsetAtPosition(charPosition);
		if (result) {
			const [node, offset] = result;
			range.setStart(node, offset);
			range.setEnd(node, offset);
			selection.removeAllRanges();
			selection.addRange(range);
			setCaretPosition(charPosition);
		}
	};

	return (
			<ComponentCard
			className="h-full"
			header={<div className="flex items-center justify-between min-h-[2rem]">
				<div className="flex items-center gap-2 text">
								<Code className="text-brand-500 h-4 w-4" />
								<div className="relative group min-h-[1.5rem] flex items-center">
									{isEditingTitle ? (
										<div className="flex items-center gap-1 w-full">
											<input
												type="text"
												value={titleDraft}
												onChange={(e) => setTitleDraft(e.target.value)}
												onBlur={cancelEdit}
												onKeyDown={(e) => {
													if (e.key === "Escape") {
														e.preventDefault();
														cancelEdit();
													}
												}}
												className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 shadow-none flex-shrink min-w-0 px-1"
												style={{ 
													outline: 'none', 
													boxShadow: 'none', 
													border: 'none',
													width: `${Math.max(titleDraft.length * 0.8 + 2, 6)}ch`,
													textAlign: 'left'
												}}
												autoFocus
											/>
											<button 
												onMouseDown={(e) => e.preventDefault()}
												onClick={saveTitle}
												className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex-shrink-0"
											>
												<Check className="h-4 w-4 text-green-500" />
											</button>
										</div>
									) : (
										<button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 py-0.5 min-h-[1.5rem]" onClick={() => setIsEditingTitle(true)}>
											{titleDraft}
											<Pencil className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
										</button>
									)}
								</div>
														<div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
							{isSaving ? "Saving…" : lastSavedAt ? "Saved" : ""}
						</div>
							</div>
							<button className="text">
								<HelpCircle className="h-4 w-4" />
							</button>
			</div>}
			>
				<div className={`relative h-full ${className}`}>
				{/* Placeholder - positioned to match editor content */}
				{showPlaceholder && (
					<div 
						className="absolute top-0 left-0 pointer-events-none text-gray-400 dark:text-gray-500"
					>
						Type here
					</div>
				)}
				
				<div
					ref={editorRef}
					contentEditable={true}
					spellCheck={false}
					className="overflow-hidden focus:outline-none focus:ring-0 focus:border-gray-200 dark:focus:border-gray-800 text resize-none h-full relative z-10"
					style={{
						wordWrap: "break-word",
						whiteSpace: "pre-wrap",
						overflowWrap: "break-word",
						maxWidth: "100%",
						width: "100%",
						height: "100%",
					}}
					onInput={handleInput}
					onKeyDown={handleKeydown}
					onClick={handleClick}
				/>

				<Dropdown
					isOpen={isDropdownOpen}
					onClose={() => setIsDropdownOpen(false)}
					className="min-w-[350px]"
					style={{ top: dropdownPos.top, left: dropdownPos.left }}
				>
					{suggestions.map((s, idx) => (
						<CustomDropdownItem
							key={`${s.value}-${idx}`}
							baseClassName={
								idx === highlightedIndex
									? "block w-full text-left px-2 py-1 text-sm cursor-pointer"
									: "block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
							}
							className={idx === highlightedIndex ? "menu-item-active" : "menu-item-inactive"}
							onItemClick={() => acceptSuggestion(idx)}
						>
							<div className="flex w-full items-center justify-between px-2 py-2">
								<div className="flex items-center gap-1">
									<div className="w-4 h-4">
										{s.kind === "command" && <EditorCommandIcon />}
										{s.kind === "function" && <EditorFunctionIcon />}
										{s.kind === "keyword" && <EditorKeywordIcon />}
										{s.kind === "variable" && <EditorVariableIcon />}
										{s.kind === "selector" && <EditorSelectorIcon />}
									</div>

									<span>{s.value}</span>
								</div>
								<span className="text-gray-500">{s.description}</span>
							</div>
						</CustomDropdownItem>
					))}
				</Dropdown>
			</div>
			</ComponentCard>
	);
};

export default TestCaseEditorWithHelp;
