"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { parseActiveRoomId } from "../path";
import type { TalkListError, TalkRoomVM } from "../types";
import { TalkEmptyState } from "./talk-empty-state";
import { TalkListItem } from "./talk-list-item";

/**
 * 「トーク」セクション(Client)。
 * 名前の検索入力とトーク行のリストを持つ。
 *
 * 検索は取得済みの一覧に対するクライアントフィルタ(件数が小さくサーバ往復が
 * 不要なため)。入力状態は `matches/layout.tsx` が保持するこのコンポーネントに
 * 載るので、一覧 ↔ 詳細の遷移をまたいでも消えない。
 *
 * 検索入力は共通の `Input` を使わない。あちらはブランドの黄枠スタイルが前提で、
 * Figma のこの入力(グレーの塗り・枠線なし)とは別物のため。
 */
export function TalkListSection({
	rooms,
}: {
	rooms: TalkRoomVM[] | TalkListError;
}) {
	const pathname = usePathname();
	const [query, setQuery] = useState("");

	// `/matches/123` → 123。PC の split view で開いている行をハイライトする。
	const activeRoomId = parseActiveRoomId(pathname);

	const isError = !Array.isArray(rooms);
	const keyword = query.trim();
	const filtered = isError
		? []
		: rooms.filter((room) => room.partnerName.includes(keyword));

	return (
		<section className="flex flex-1 flex-col gap-2">
			<h2 className="font-bold text-ink text-xl">トーク</h2>
			<div className="flex items-center gap-2 rounded-lg bg-[#f3f3f3] p-3">
				<Search
					className="size-6 shrink-0 text-secondary"
					strokeWidth={1.5}
					aria-hidden="true"
				/>
				<input
					type="text"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="名前で検索"
					aria-label="名前で検索"
					className="min-w-0 flex-1 bg-transparent font-medium text-base text-ink outline-none placeholder:text-secondary"
				/>
			</div>
			{isError ? (
				<p className="py-10 text-center text-secondary text-sm">
					トークを取得できませんでした。時間をおいて再度お試しください。
				</p>
			) : rooms.length === 0 ? (
				<TalkEmptyState />
			) : filtered.length === 0 ? (
				<p className="py-10 text-center text-secondary text-sm">
					該当するトークがありません
				</p>
			) : (
				<ul className="flex flex-col pt-2">
					{filtered.map((room) => (
						<TalkListItem
							key={room.roomId}
							room={room}
							active={room.roomId === activeRoomId}
						/>
					))}
				</ul>
			)}
		</section>
	);
}
