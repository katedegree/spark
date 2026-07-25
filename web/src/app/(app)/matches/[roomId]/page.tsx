import { notFound } from "next/navigation";
import { ChatScreen } from "@/features/matches/components/chat-screen";
import { getMessages, getTalkRoom } from "@/features/matches/data";

/**
 * トーク詳細 (`/matches/[roomId]`)。Server Component。
 *
 * 一覧カラムは `matches/layout.tsx` が描画するため、ここは右ペイン(チャット)
 * だけを返す。数値でない roomId や存在しないルームは 404 にする。
 */
export default async function TalkRoomPage({
	params,
}: {
	params: Promise<{ roomId: string }>;
}) {
	const { roomId } = await params;
	const parsedRoomId = Number(roomId);
	if (!Number.isInteger(parsedRoomId)) notFound();

	const [room, messages] = await Promise.all([
		getTalkRoom(parsedRoomId),
		getMessages(parsedRoomId),
	]);
	if (room === null) notFound();

	return <ChatScreen room={room} initialMessages={messages} />;
}
