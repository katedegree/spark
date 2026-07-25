"use client";

import { Send } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import type { MessageResponse } from "@/lib/api/generated/model";
import { toMessageVM } from "../message-vm";
import type { MessageVM } from "../types";

/** OpenAPI の SendMessageRequest.content と同じ上限。 */
const CONTENT_MAX_LENGTH = 1000;

/**
 * メッセージ入力欄(Client、Figma 準拠)。
 * グラデの丸角入力 + 円形の送信ボタン。
 *
 * `<input>` ではなく `<textarea>` にしているのは改行を許すため。form 内でも
 * `<textarea>` は Enter で submit しないので、素の Enter は改行になる。送信は
 * 送信ボタン、または Cmd(mac)/Ctrl(win) + Enter で行う。
 * 入力量に応じて `max-h` まで自動で高さを伸ばし、超えたら内部スクロールにする。
 *
 * 送信は `/api/messages`(プロキシ Route Handler)へ POST する。楽観更新はせず、
 * 201 が返ってから `onSent` で親に追加させる。失敗時はここにインラインで
 * エラーを出し、下書きは消さずに残す。
 */
export function ChatComposer({
	roomId,
	onSent,
}: {
	roomId: number;
	onSent: (message: MessageVM) => void;
}) {
	const [content, setContent] = useState("");
	const [pending, setPending] = useState(false);
	const [failed, setFailed] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const trimmed = content.trim();
	const tooLong = content.length > CONTENT_MAX_LENGTH;
	const canSend = trimmed !== "" && !tooLong && !pending;

	// 内容に合わせて高さを合わせる(いったん auto に戻して scrollHeight を測り直す)。
	// content が変わるたび = 入力時も送信後の空化時もリセットされる。
	// biome-ignore lint/correctness/useExhaustiveDependencies: 本文では参照しないが、内容変化を検知するために content を依存に残す
	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	}, [content]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!canSend) return;

		setPending(true);
		setFailed(false);
		try {
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ roomId, content: trimmed }),
			});
			if (!res.ok) throw new Error(`send message failed: ${res.status}`);

			const body = (await res
				.json()
				.catch(() => null)) as MessageResponse | null;
			// レスポンスから VM を組む(生成は toMessageVM に集約)。ただし mock は
			// example の本文を返すため content は送信した本文で上書きする。
			// TODO(api): 実 API 化後はこの上書きを外し body.content をそのまま使う。
			// レスポンスが壊れている場合はローカルの一時値で最低限の VM を作る。
			const message: MessageVM = body
				? { ...toMessageVM(body), content: trimmed }
				: {
						id: Date.now(),
						content: trimmed,
						isMine: true,
						createdAt: new Date().toISOString(),
						reaction: null,
					};
			onSent(message);
			setContent("");
		} catch {
			setFailed(true);
		} finally {
			setPending(false);
		}
	}

	// Cmd(mac)/Ctrl(win) + Enter で送信する。素の Enter は改行のまま残す。
	// IME 変換確定の Enter を送信と誤認しないよう `isComposing` 中は無視する。
	function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (
			event.key === "Enter" &&
			(event.metaKey || event.ctrlKey) &&
			!event.nativeEvent.isComposing
		) {
			event.preventDefault();
			event.currentTarget.form?.requestSubmit();
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2">
			{(failed || tooLong) && (
				<p role="alert" className="px-2 text-error text-sm">
					{tooLong
						? `メッセージは${CONTENT_MAX_LENGTH}文字以内で入力してください`
						: "メッセージを送信できませんでした"}
				</p>
			)}
			{/* 複数行に伸びたときは送信ボタンを下端に合わせる */}
			<div className="flex items-end gap-4">
				<div className="flex min-h-13 min-w-0 flex-1 items-center rounded-[26px] bg-brand-gradient px-4 py-[13px]">
					<textarea
						ref={textareaRef}
						rows={1}
						value={content}
						onChange={(event) => setContent(event.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="メッセージを入力・・・"
						aria-label="メッセージ"
						aria-invalid={tooLong || undefined}
						className="scrollbar-none max-h-32 min-w-0 flex-1 resize-none bg-transparent font-medium text-sm text-white leading-normal outline-none placeholder:text-white/90"
					/>
				</div>
				<button
					type="submit"
					disabled={!canSend}
					aria-label="送信"
					className="flex size-13 shrink-0 items-center justify-center rounded-full bg-brand-gradient transition-opacity disabled:opacity-50"
				>
					<Send
						className="size-8 text-white"
						strokeWidth={1.5}
						aria-hidden="true"
					/>
				</button>
			</div>
		</form>
	);
}
