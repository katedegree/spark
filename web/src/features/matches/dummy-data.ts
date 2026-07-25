/**
 * トーク一覧 / トーク履歴のダミーフィクスチャ。
 *
 * `GET /rooms` と `GET /rooms/{roomId}/messages` は OpenAPI 未定義のため、
 * UI を先に仮組みするための固定データをここに隔離する。フィクスチャを持つのは
 * このファイルだけで、`data.ts` 以外から import してはいけない。
 *
 * アバターは mock サーバーが返すのと同じ壊れ URL(`pub-xxx.r2.dev`)を入れて
 * `resolveAvatarUrl` に通しており、実 API へ移行しても解決経路は変わらない。
 *
 * TODO(api): GET /rooms, GET /rooms/{roomId}/messages 実装後にこのファイルごと削除する。
 */
import { resolveAvatarUrl } from "@/lib/dummy-avatar";
import type { MessageVM, NewMatchVM, TalkRoomVM } from "./types";

/** mock の example と同じ形の placeholder。`resolveAvatarUrl` がダミー画像に置換する。 */
function dummyIconUrl(userId: number): string | null {
	return resolveAvatarUrl(`https://pub-xxx.r2.dev/icons/${userId}.png`, userId);
}

export const DUMMY_NEW_MATCHES: NewMatchVM[] = [
	{ userId: 101, name: "酒井 悠人", iconUrl: dummyIconUrl(101) },
	{ userId: 102, name: "篠原 咲希", iconUrl: dummyIconUrl(102) },
	{ userId: 103, name: "三浦 陽向", iconUrl: dummyIconUrl(103) },
	{ userId: 104, name: "岡本 千尋", iconUrl: dummyIconUrl(104) },
	{ userId: 105, name: "長谷川 楓", iconUrl: dummyIconUrl(105) },
];

export const DUMMY_TALK_ROOMS: TalkRoomVM[] = [
	{
		roomId: 1,
		partnerName: "中尾 春人",
		partnerIconUrl: dummyIconUrl(201),
		lastMessage: "来週の日曜日はいかがでしょうか？",
		lastMessageAt: "2026-03-02T20:55:00+09:00",
		unreadCount: 1,
	},
	{
		roomId: 2,
		partnerName: "尾崎 豊",
		partnerIconUrl: dummyIconUrl(202),
		lastMessage: "そのカメラ、どこで買ったんですか？",
		lastMessageAt: "2026-03-01T12:10:00+09:00",
		unreadCount: 0,
	},
	{
		roomId: 3,
		partnerName: "早坂 理沙",
		partnerIconUrl: dummyIconUrl(203),
		lastMessage: "写真ありがとうございます！すごく綺麗ですね",
		lastMessageAt: "2026-02-28T22:41:00+09:00",
		unreadCount: 128,
	},
	{
		roomId: 4,
		partnerName: "藤本 蓮",
		partnerIconUrl: dummyIconUrl(204),
		lastMessage: "こちらこそ、よろしくお願いします",
		lastMessageAt: "2026-02-26T09:05:00+09:00",
		unreadCount: 0,
	},
	{
		roomId: 5,
		partnerName: "白石 みなも",
		partnerIconUrl: dummyIconUrl(205),
		lastMessage: "そのお店、前から気になってました",
		lastMessageAt: "2026-02-24T18:30:00+09:00",
		unreadCount: 3,
	},
	{
		roomId: 6,
		partnerName: "森 大河",
		partnerIconUrl: dummyIconUrl(206),
		lastMessage: "了解です！当日楽しみにしてます",
		lastMessageAt: "2026-02-20T21:12:00+09:00",
		unreadCount: 0,
	},
];

/** roomId → メッセージ履歴(古い順)。 */
export const DUMMY_MESSAGES: Record<number, MessageVM[]> = {
	1: [
		{
			id: 1001,
			content:
				"はじめまして！プロフィールの登山の写真、すごく良かったです。\nどのあたりの山に行かれるんですか？",
			isMine: false,
			createdAt: "2026-03-02T20:41:00+09:00",
			reaction: null,
		},
		{
			id: 1002,
			content:
				"ありがとうございます！\n最近は奥多摩ばかりですが、そろそろ北アルプスにも行きたいなと思っています。",
			isMine: true,
			createdAt: "2026-03-02T20:48:00+09:00",
			reaction: null,
		},
		{
			id: 1003,
			content: "いいですね！よかったら今度ご一緒しませんか？",
			isMine: false,
			createdAt: "2026-03-02T20:52:00+09:00",
			// 3:1280 のリアクション選択済み状態を確認するための初期値。
			reaction: "👍",
		},
		{
			id: 1004,
			content: "来週の日曜日はいかがでしょうか？",
			isMine: false,
			createdAt: "2026-03-02T20:55:00+09:00",
			reaction: null,
		},
	],
	2: [
		{
			id: 2001,
			content: "こんばんは！同じタグが多くて驚きました",
			isMine: true,
			createdAt: "2026-03-01T11:52:00+09:00",
			reaction: null,
		},
		{
			id: 2002,
			content: "ほんとですね、フィルムカメラまで一緒とは思いませんでした",
			isMine: false,
			createdAt: "2026-03-01T12:04:00+09:00",
			reaction: null,
		},
		{
			id: 2003,
			content: "そのカメラ、どこで買ったんですか？",
			isMine: false,
			createdAt: "2026-03-01T12:10:00+09:00",
			reaction: null,
		},
	],
	3: [
		{
			id: 3001,
			content: "先週撮った写真です！",
			isMine: true,
			createdAt: "2026-02-28T22:30:00+09:00",
			reaction: null,
		},
		{
			id: 3002,
			content: "写真ありがとうございます！すごく綺麗ですね",
			isMine: false,
			createdAt: "2026-02-28T22:41:00+09:00",
			reaction: null,
		},
	],
	4: [
		{
			id: 4001,
			content: "マッチありがとうございます！よろしくお願いします",
			isMine: true,
			createdAt: "2026-02-26T08:58:00+09:00",
			reaction: null,
		},
		{
			id: 4002,
			content: "こちらこそ、よろしくお願いします",
			isMine: false,
			createdAt: "2026-02-26T09:05:00+09:00",
			reaction: null,
		},
	],
	5: [
		{
			id: 5001,
			content: "駅前に新しくできたカフェ、行きました？",
			isMine: true,
			createdAt: "2026-02-24T18:22:00+09:00",
			reaction: null,
		},
		{
			id: 5002,
			content: "そのお店、前から気になってました",
			isMine: false,
			createdAt: "2026-02-24T18:30:00+09:00",
			reaction: null,
		},
	],
	6: [
		{
			id: 6001,
			content: "土曜日の 14 時に現地集合でどうでしょう？",
			isMine: true,
			createdAt: "2026-02-20T21:04:00+09:00",
			reaction: null,
		},
		{
			id: 6002,
			content: "了解です！当日楽しみにしてます",
			isMine: false,
			createdAt: "2026-02-20T21:12:00+09:00",
			reaction: null,
		},
	],
};
