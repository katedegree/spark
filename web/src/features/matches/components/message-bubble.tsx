"use client";

import { SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { formatTime } from "@/lib/format-date";
import type { MessageVM } from "../types";
import { ReactionPicker } from "./reaction-picker";

/**
 * メッセージ 1 件のバブル(Figma 準拠)。
 * 自分は右寄せのブランドグラデ + 白文字、相手は左寄せのグレー。相手側のバブルの
 * 下だけ、時刻の右にリアクションのピルとピッカーを置く。
 *
 * リアクションは見た目だけの機能で永続化しない(API 未定義のため)。状態は
 * `ChatScreen` の messages に載せ、ここは開閉だけをローカルに持つ。
 */
export function MessageBubble({
	message,
	partnerName,
	partnerIconUrl,
	onReact,
}: {
	message: MessageVM;
	partnerName: string;
	partnerIconUrl: string | null;
	onReact: (messageId: number, reaction: string) => void;
}) {
	const [pickerOpen, setPickerOpen] = useState(false);
	// ピル + ピッカーを含む範囲。外側クリック判定に使う。
	const reactionAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!pickerOpen) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setPickerOpen(false);
		}
		// click ではなく pointerdown で閉じる(ピル自身のクリックは範囲内なので
		// トグルとして機能し、閉じた直後に開き直すことがない)。
		function handlePointerDown(event: PointerEvent) {
			if (!reactionAreaRef.current?.contains(event.target as Node)) {
				setPickerOpen(false);
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("pointerdown", handlePointerDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [pickerOpen]);

	const time = formatTime(message.createdAt);
	// クロージャ(onClick)の中でも string に絞り込まれるようローカルに取り出す。
	const reaction = message.reaction;

	if (message.isMine) {
		return (
			<li className="flex flex-col items-end gap-2">
				{/* 送信者は右寄せ + グラデという見た目でしか区別できないため、
				    読み上げ用に明示する(相手側は Avatar の alt が名前を読む) */}
				<span className="sr-only">自分</span>
				{/* Figma: 右下だけ角丸 4px にして吹き出しの向きを表す。tracking も Figma 値 */}
				<div className="max-w-[296px] whitespace-pre-wrap break-words rounded-[20px] rounded-br-[4px] bg-brand-gradient p-2.5 font-medium text-sm text-white tracking-[2px]">
					{message.content}
				</div>
				<span className="font-medium text-secondary text-sm">{time}</span>
			</li>
		);
	}

	return (
		<li className="flex gap-3">
			<Avatar src={partnerIconUrl} name={partnerName} size="sm" />
			<div className="flex min-w-0 flex-col items-start gap-2">
				<div className="max-w-60 whitespace-pre-wrap break-words rounded-[20px] rounded-bl-[4px] bg-[#f3f3f3] p-2.5 font-medium text-ink text-sm tracking-[0.28px]">
					{message.content}
				</div>
				<div ref={reactionAreaRef} className="relative flex items-center gap-3">
					<span className="font-medium text-secondary text-sm">{time}</span>
					{reaction ? (
						<button
							type="button"
							aria-label={`リアクション ${reaction} を取り消す`}
							onClick={() => onReact(message.id, reaction)}
							className="flex size-8 items-center justify-center rounded-full border border-brand-yellow bg-white text-base"
						>
							{reaction}
						</button>
					) : (
						<button
							type="button"
							aria-label="リアクションを追加"
							aria-expanded={pickerOpen}
							onClick={() => setPickerOpen((open) => !open)}
							className="flex items-center rounded-2xl bg-brand-gradient px-4 py-0.5"
						>
							<SmilePlus
								className="size-5 text-white"
								strokeWidth={1.5}
								aria-hidden="true"
							/>
						</button>
					)}
					{pickerOpen && (
						<ReactionPicker
							onSelect={(reaction) => {
								onReact(message.id, reaction);
								setPickerOpen(false);
							}}
						/>
					)}
				</div>
			</div>
		</li>
	);
}
