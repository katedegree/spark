import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatMonthDay } from "@/lib/format-date";
import { cn } from "@/utils/cn";
import type { TalkRoomVM } from "../types";

/**
 * トーク一覧の 1 行(Figma 準拠)。
 * アバター + 名前 + 最終メッセージ、右に日付と未読バッジ。
 * PC は行が一回り大きく(SP 68px / PC 84px)、開いているルームを薄い背景で示す。
 *
 * Figma の SP にはアバター右下のオンライン(緑)ドットがあるが、プレゼンス情報を
 * 返す API が無くダミー値にしかならないため実装していない。
 */
export function TalkListItem({
	room,
	active,
}: {
	room: TalkRoomVM;
	active: boolean;
}) {
	const badgeLabel = room.unreadCount > 99 ? "99+" : String(room.unreadCount);

	return (
		<li>
			<Link
				href={`/matches/${room.roomId}`}
				aria-current={active ? "page" : undefined}
				className={cn(
					"flex h-17 items-center gap-4 py-3 transition-colors md:h-21 md:rounded-xl md:px-2",
					active && "md:bg-border/40",
				)}
			>
				<Avatar
					src={room.partnerIconUrl}
					name={room.partnerName}
					size="sm"
					className="md:size-13"
				/>
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<span className="truncate font-medium text-ink text-sm md:text-base">
						{room.partnerName}
					</span>
					<span className="truncate text-secondary text-xs md:text-sm">
						{room.lastMessage}
					</span>
				</div>
				<div className="flex w-7 shrink-0 flex-col items-center gap-1">
					<span className="text-ink text-sm tabular-nums">
						{formatMonthDay(room.lastMessageAt)}
					</span>
					{room.unreadCount > 0 && (
						<>
							{/* バッジは 99+ に丸めるため、読み上げには実数を別途渡す */}
							<span className="sr-only">未読 {room.unreadCount} 件</span>
							<span
								aria-hidden="true"
								className="flex size-6 items-center justify-center rounded-full bg-brand-gradient px-1 font-bold text-white text-xs tabular-nums leading-none md:size-7"
							>
								{badgeLabel}
							</span>
						</>
					)}
				</div>
			</Link>
		</li>
	);
}
