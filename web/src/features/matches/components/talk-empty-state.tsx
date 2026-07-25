/**
 * トークが 1 件も無いときの空状態(Figma 3:1126)。
 * 吹き出しイラスト + 見出し + 誘導文を縦に中央寄せする。
 */
export function TalkEmptyState() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-5 py-15">
			{/* biome-ignore lint/performance/noImgElement: 装飾 SVG は最適化不要のため img を使う */}
			<img
				src="/images/empty-talk.svg"
				alt=""
				aria-hidden="true"
				className="h-[108px] w-[170px]"
			/>
			<div className="flex flex-col items-center gap-3 text-ink italic">
				<p className="font-semibold text-xl">まだトークがありません</p>
				<p className="text-center text-base">
					気になる人を見つけて
					<br />
					初めてのマッチを作ろう
				</p>
			</div>
		</div>
	);
}
