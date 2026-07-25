import { ScrollEdgeFade } from "@/components/ui/scroll-edge-fade";
import { NewArrivalItem } from "@/features/home/components/new-arrival-item";
import type { NewMatchVM } from "../types";

/**
 * 「新しいマッチ」セクション(Server)。
 * 丸アバター + 名前を横スクロールで並べる。0 件のときは見出しごと非表示にする
 * (Figma 3:1100 の「新しいマッチなし」状態)。
 *
 * 表示は home の新着ユーザーと同一デザインのため `NewArrivalItem` を再利用する
 * (`/search` が `RecommendedCard` を再利用しているのと同じ方針)。
 *
 * TODO: ユーザー詳細ページが実装されたら各項目をプロフィールへのリンクにする。
 */
export function NewMatchesSection({ matches }: { matches: NewMatchVM[] }) {
	if (matches.length === 0) return null;

	return (
		<section className="flex flex-col gap-3">
			<h2 className="font-bold text-ink text-xl">新しいマッチ</h2>
			{/* スクロール領域はコンテナ余白を打ち消して端まで全幅化し、
			    左右に白グラデを重ねて端で自然にフェードさせる。 */}
			<div className="relative -mx-5 md:-mx-4">
				<ul className="scrollbar-none flex gap-1 overflow-x-auto px-5 pb-1 md:px-4">
					{matches.map((match) => (
						<NewArrivalItem key={match.userId} user={match} />
					))}
				</ul>
				<ScrollEdgeFade />
			</div>
		</section>
	);
}
