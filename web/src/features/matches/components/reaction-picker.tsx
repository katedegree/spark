/** 選択できるリアクション(Figma 3:1280 の 4 種)。 */
export const REACTIONS = ["👍", "❤️", "😂", "🎉"] as const;

/**
 * リアクション選択のポップオーバー(Figma 3:1298)。
 * 白カードに絵文字を横並びにするだけの表示コンポーネントで、開閉の制御と
 * 外側クリック / Escape の検知は呼び出し元(`MessageBubble`)が持つ。
 */
export function ReactionPicker({
	onSelect,
}: {
	onSelect: (reaction: string) => void;
}) {
	return (
		<div className="absolute top-full left-0 z-20 mt-2 flex gap-3 rounded-[20px] border border-border bg-white px-5 py-3 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
			{REACTIONS.map((reaction) => (
				<button
					key={reaction}
					type="button"
					aria-label={`${reaction} でリアクションする`}
					onClick={() => onSelect(reaction)}
					className="text-xl leading-5"
				>
					{reaction}
				</button>
			))}
		</div>
	);
}
