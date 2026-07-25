import type { MessageResponse } from "@/lib/api/generated/model";
import type { MessageVM } from "./types";

/**
 * `MessageResponse`(生成型) → `MessageVM` の変換。
 *
 * 送信直後(`ChatComposer`)と、将来の履歴取得(`data.ts` の `getMessages` 実 API 化)の
 * 両方でメッセージ VM の組み立てをここに集約する。生成箇所が割れると、実 API が返す
 * `id` / `createdAt` を使いたくなったときに複数箇所を直すことになるため。
 *
 * `reaction` はサーバーに無い(見た目だけの機能)ので常に null 始まり。
 */
export function toMessageVM(res: MessageResponse): MessageVM {
	return {
		id: res.id,
		content: res.content,
		isMine: res.isMine,
		createdAt: res.createdAt,
		reaction: null,
	};
}
