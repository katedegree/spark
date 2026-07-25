/**
 * トーク一覧 / トーク詳細のデータアクセス層。Server Component からのみ呼ぶ。
 *
 * 一覧と履歴のエンドポイント(`GET /rooms` / `GET /rooms/{roomId}/messages`)は
 * まだ OpenAPI に存在しないため、**シグネチャだけ実 API 前提で確定させ、中身を
 * ダミーで返している**。実 API が生えたら各関数の本体を `apiFetch` に差し替える
 * だけで、呼び出し側(layout / page / コンポーネント)は変更不要にしてある。
 *
 * 送信(`POST /messages`)だけは実装済みで、クライアントから
 * `app/api/messages/route.ts`(プロキシ Route Handler)経由で叩いている。
 *
 * TODO(ws): リアルタイム受信は未対応。backend には `/ws/rooms/{roomId}` があるが、
 * アクセストークンが httpOnly Cookie にあり WS へ渡す方式が未確定
 * (backend も `?token=` を検証していない)ため、本 PR ではスコープ外にしている。
 */
import "server-only";
import {
	DUMMY_MESSAGES,
	DUMMY_NEW_MATCHES,
	DUMMY_TALK_ROOMS,
} from "./dummy-data";
import type { MessageVM, NewMatchVM, TalkListError, TalkRoomVM } from "./types";

/**
 * トーク一覧を取得する。
 * 取得失敗は例外にせず `{ error: true }` を返し、一覧セクションだけ degrade させる
 * (home の `getPickupUsers` と同じ方針)。
 *
 * TODO(api): 実装後は以下に差し替える。
 *   const res = await apiFetch<RoomsResponse>("/rooms", undefined, { auth: true });
 *   if (!res.ok) return { error: true };
 *   return (res.data?.rooms ?? []).map(toTalkRoomVM).filter(...);
 */
export async function getTalkRooms(): Promise<TalkRoomVM[] | TalkListError> {
	return DUMMY_TALK_ROOMS;
}

/**
 * 「新しいマッチ」を取得する。取得失敗時は空配列(セクション非表示)で degrade する。
 *
 * TODO(api): マッチ一覧のエンドポイント実装後に apiFetch へ差し替える。
 */
export async function getNewMatches(): Promise<NewMatchVM[]> {
	return DUMMY_NEW_MATCHES;
}

/**
 * ルーム 1 件を取得する。存在しなければ null(呼び出し側で `notFound()`)。
 *
 * TODO(api): 実装後は `GET /rooms/{roomId}` もしくは一覧結果からの絞り込みにする。
 */
export async function getTalkRoom(roomId: number): Promise<TalkRoomVM | null> {
	return DUMMY_TALK_ROOMS.find((room) => room.roomId === roomId) ?? null;
}

/**
 * ルームのメッセージ履歴を古い順で取得する。
 *
 * TODO(api): 実装後は以下に差し替える。
 *   const res = await apiFetch<MessagesResponse>(`/rooms/${roomId}/messages`, undefined, { auth: true });
 *   if (!res.ok) return [];
 *   return (res.data?.messages ?? []).map(toMessageVM).filter(...);
 */
export async function getMessages(roomId: number): Promise<MessageVM[]> {
	return DUMMY_MESSAGES[roomId] ?? [];
}
