"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { isMatchDetailPath } from "../path";

/**
 * split view 左のトーク一覧カラム(Client)。中身は `matches/layout.tsx` から
 * children で受け取る(器だけを Client にしてバンドルを最小化する)。
 *
 * SP はトーク詳細を開いている間このカラムを隠してチャットだけを見せ、PC では
 * 常に残して一覧 + チャットの 2 ペインにする。判定に `usePathname` を使うのは、
 * layout が現在のパスを知らないため。
 *
 * カラム幅は段階的に広げる。Figma の 460px を md から適用すると、サイドバー
 * (md: 88px / lg: 320px)と合わせてチャット側に 200〜250px しか残らないため。
 */
export function TalkListColumn({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const isDetail = isMatchDetailPath(pathname);

	return (
		<div
			className={cn(
				"w-full flex-col overflow-y-auto overscroll-contain md:flex md:w-[320px] md:shrink-0 md:border-border md:border-r xl:w-[460px]",
				isDetail ? "hidden" : "flex",
			)}
		>
			{children}
		</div>
	);
}
