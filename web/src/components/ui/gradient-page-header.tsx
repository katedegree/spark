import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/**
 * ブランドグラデの見出し帯(SP)。白 20% オーバーレイと下方向の角丸込み。
 *
 * `/search` と `/matches` の見出しで共通の骨格。SP はグラデ帯 + 白オーバーレイで
 * タイトルを白抜きにし、PC(md 以上)ではグラデと角丸を外して白地の見出しに戻す。
 * 背景色・枠線・高さ・レイアウトなど各ページ固有の見た目は `className`(ルートへ付く)
 * と `children` で足す。
 *
 * `MobileHeader` も同系統の装飾だが、スクロール追従(オートハイド)ロジックを持ち
 * 構造が異なるため共通化の対象にしていない。
 */
export function GradientPageHeader({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-b-[20px] bg-brand-gradient-top text-white md:rounded-none md:bg-none",
				className,
			)}
		>
			{/* Figma: SP はグラデの上に白 20% を重ねて淡いトーンにする */}
			<div
				className="absolute inset-0 bg-white/20 md:hidden"
				aria-hidden="true"
			/>
			<div className="relative z-10 h-full">{children}</div>
		</div>
	);
}
