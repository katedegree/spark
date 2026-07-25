import { GradientPageHeader } from "@/components/ui/gradient-page-header";

/**
 * トーク一覧カラムの見出し(Server、Figma 準拠)。
 *
 * グラデ帯の骨格は `/search` の見出しと共通のため `GradientPageHeader` を使う。
 * SP は「マッチ一覧」+ 新規マッチ数、PC は split view 左カラムのタイトルバーとして
 * 白地 + 下線に「マッチ」のみ。カラム内スクロールに追従させるため `sticky top-0`。
 * SP は下のコンテンツと色が近く境界が曖昧になるため、`MobileHeader` と同じ影で分離する。
 *
 * PC の高さは右ペイン(`ChatScreen` のヘッダ)と揃えて 78px 固定にする。
 * 内容(こちらはテキストのみ、あちらはアバター 52px)の差で下線がズレるため。
 */
export function MatchesHeader({ newMatchCount }: { newMatchCount: number }) {
	return (
		<GradientPageHeader className="sticky top-0 z-10 shrink-0 shadow-[0_4px_12px_rgba(77,77,77,0.25)] md:h-[78px] md:border-border md:border-b md:bg-white md:text-ink md:shadow-none">
			<div className="flex h-full flex-col gap-2 px-5 py-5 md:justify-center md:gap-0 md:px-4 md:py-0">
				<h1 className="font-semibold text-2xl md:font-bold">
					マッチ
					{/* PC の左カラムは幅が狭いため Figma どおり「マッチ」だけにする */}
					<span className="md:hidden">一覧</span>
				</h1>
				{newMatchCount > 0 && (
					<p className="font-medium text-sm md:hidden">
						新規マッチングが{newMatchCount}人います！
					</p>
				)}
			</div>
		</GradientPageHeader>
	);
}
