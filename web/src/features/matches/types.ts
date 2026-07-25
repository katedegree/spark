/**
 * トーク一覧 / トーク詳細 UI 用のローカル View Model。
 *
 * home と同じ方針で、コンポーネントは生成型ではなくこの非 optional な VM だけを
 * 受け取る。一覧・履歴の API はまだ存在せず `data.ts` がダミーを返すが、
 * 実 API が来ても VM の形は変えずマッパーだけを差し替えられるようにしている。
 */
import type { NewArrivalVM } from "@/features/home/types";

export type TalkRoomVM = {
	roomId: number;
	partnerName: string;
	partnerIconUrl: string | null;
	/** 最後のメッセージ本文(一覧の 2 行目)。まだ 1 通も無ければ空文字。 */
	lastMessage: string;
	/** 最後のメッセージの日時(ISO8601)。一覧右上の日付に使う。 */
	lastMessageAt: string;
	/** 未読件数。0 ならバッジを出さない。 */
	unreadCount: number;
};

/**
 * 「新しいマッチ」の 1 件。
 * home の新着ユーザーと構造・表示(`NewArrivalItem`)が同一のため型ごと共有する。
 * 構造一致に暗黙依存せず `NewArrivalVM` の変更に追従させ、drift を防ぐ。
 */
export type NewMatchVM = NewArrivalVM;

export type MessageVM = {
	id: number;
	content: string;
	/** 自分が送ったメッセージなら true(右寄せのグラデバブル)。 */
	isMine: boolean;
	/** 送信日時(ISO8601)。バブル下の時刻に使う。 */
	createdAt: string;
	/**
	 * 付いているリアクションの絵文字。未リアクションは null。
	 * 現状は永続化しないクライアント state の初期値でしかない。
	 */
	reaction: string | null;
};

/** トーク一覧の取得失敗。一覧セクション単位で degrade するために使う。 */
export type TalkListError = { error: true };
