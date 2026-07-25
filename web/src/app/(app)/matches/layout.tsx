import type { ReactNode } from "react";
import { MatchesHeader } from "@/features/matches/components/matches-header";
import { NewMatchesSection } from "@/features/matches/components/new-matches-section";
import { TalkListColumn } from "@/features/matches/components/talk-list-column";
import { TalkListSection } from "@/features/matches/components/talk-list-section";
import { getNewMatches, getTalkRooms } from "@/features/matches/data";

/**
 * トーク画面共通レイアウト(`/matches` 配下)。Server Component。
 *
 * 左のトーク一覧カラムをここで描画し、`{children}` を右ペイン
 * (`/matches` はプレースホルダー、`/matches/[roomId]` はチャット)にする。
 * layout は遷移で再マウントされないため、行をクリックしても一覧の検索文字列と
 * スクロール位置が保たれる(parallel routes を使わずこれで split view にする)。
 *
 * 高さ: チャットの入力欄を下端に固定しメッセージだけをスクロールさせるため、
 * ページスクロールではなく `h-dvh` + ペイン内スクロールにする。SP では
 * `MobileHeader` を出さないので画面高をそのまま使える。
 *
 * ルートを `<main>` にするのは、`(app)/layout.tsx` がランドマークを持たず
 * ページ側で出す運用のため(home / search と同じ)。あわせて配下の 2 つの
 * `<header>` が暗黙の banner にならず、ランドマークの重複も避けられる。
 */
export default async function MatchesLayout({
	children,
}: {
	children: ReactNode;
}) {
	const [rooms, newMatches] = await Promise.all([
		getTalkRooms(),
		getNewMatches(),
	]);

	return (
		<main className="flex h-dvh w-full min-w-0 overflow-hidden">
			<TalkListColumn>
				<MatchesHeader newMatchCount={newMatches.length} />
				{/* SP は下部タブバー(fixed)に最終行が隠れないよう余白を多めに取る */}
				<div className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-24 md:px-4 md:pb-6">
					<NewMatchesSection matches={newMatches} />
					<TalkListSection rooms={rooms} />
				</div>
			</TalkListColumn>
			{children}
		</main>
	);
}
