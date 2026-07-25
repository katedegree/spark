"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import type { MessageVM, TalkRoomVM } from "../types";
import { ChatComposer } from "./chat-composer";
import { MessageBubble } from "./message-bubble";

/**
 * トーク詳細のチャット画面(Client、Figma 準拠)。
 *
 * メッセージ本体とリアクションの state をここで持つ(送信結果の追加と、
 * 見た目だけのリアクション付与の両方がこの配列を更新する)。
 *
 * 高さ: ヘッダと入力欄を固定してメッセージだけをスクロールさせるため、
 * 親(`matches/layout.tsx`)の `h-dvh` を受けて `flex-1` + 内側スクロールにする。
 *
 * TODO(ws): 相手の新着メッセージはリロードするまで反映されない。WebSocket
 * (`/ws/rooms/{roomId}`)での購読は認証方式が未確定のため未対応(`data.ts` 参照)。
 */
export function ChatScreen({
	room,
	initialMessages,
}: {
	room: TalkRoomVM;
	initialMessages: MessageVM[];
}) {
	const [messages, setMessages] = useState(initialMessages);
	const scrollRef = useRef<HTMLDivElement>(null);

	// 初回表示と送信後は最新のメッセージが見える位置まで送る。
	// 依存が件数なのは、リアクション付与(`handleReact` は map で新しい配列を返す)
	// でも発火して読んでいた位置が最下部へ飛ぶのを避けるため。
	// biome-ignore lint/correctness/useExhaustiveDependencies: 本文では参照しないが、メッセージ追加を検知するために件数を依存に残す
	useEffect(() => {
		const el = scrollRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages.length]);

	// VM の組み立ては ChatComposer(= toMessageVM)に寄せ、ここは追加するだけ。
	function handleSent(message: MessageVM) {
		setMessages((prev) => [...prev, message]);
	}

	/** 同じ絵文字をもう一度選んだら解除する(トグル)。 */
	function handleReact(messageId: number, reaction: string) {
		setMessages((prev) =>
			prev.map((message) =>
				message.id === messageId
					? {
							...message,
							reaction: message.reaction === reaction ? null : reaction,
						}
					: message,
			),
		);
	}

	return (
		<div className="relative flex min-w-0 flex-1 flex-col">
			{/* ヘッダと入力欄はメッセージの上に重ね、その分をスクロール領域の上下
			    padding で避ける。背景は白ベタにせず、ぼかし(マスクで端に向けて
			    弱める)と白のグラデを重ねて、メッセージが境界線を作らず自然に
			    消えるようにする。
			    PC の高さは左カラム(`MatchesHeader`)と揃えて 78px 固定にする。 */}
			<header className="absolute inset-x-0 top-0 z-10 h-18 md:h-[78px]">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white from-40% to-transparent"
				/>
				<div className="relative flex h-full items-center gap-4 px-5">
					{/* 戻るは SP のみ。PC は左カラムに一覧が残るため不要(Figma 3:2400) */}
					<Link
						href="/matches"
						aria-label="トーク一覧に戻る"
						className="flex items-center justify-center rounded-full bg-white p-2 drop-shadow-[0px_2px_2px_rgba(77,77,77,0.25)] md:hidden"
					>
						<ChevronLeft
							className="size-8 text-ink"
							strokeWidth={1.5}
							aria-hidden="true"
						/>
					</Link>
					<Avatar
						src={room.partnerIconUrl}
						name={room.partnerName}
						size="md"
						className="hidden md:inline-flex"
					/>
					<h1 className="truncate font-semibold text-base text-ink md:text-xl">
						{room.partnerName}
					</h1>
				</div>
			</header>

			{/* padding = 重ねたヘッダ / 入力欄の高さ + 余白 */}
			<div
				ref={scrollRef}
				className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-26 pb-28 md:pt-[110px] md:pb-32"
			>
				<ul className="flex flex-col gap-5">
					{messages.map((message) => (
						<MessageBubble
							key={message.id}
							message={message}
							partnerName={room.partnerName}
							partnerIconUrl={room.partnerIconUrl}
							onReact={handleReact}
						/>
					))}
				</ul>
			</div>

			<div className="absolute inset-x-0 bottom-0 z-10">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 backdrop-blur-md [mask-image:linear-gradient(to_top,black_45%,transparent)]"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white from-40% to-transparent"
				/>
				<div className="relative px-5 pt-6 pb-5 md:py-6">
					<ChatComposer roomId={room.roomId} onSent={handleSent} />
				</div>
			</div>
		</div>
	);
}
