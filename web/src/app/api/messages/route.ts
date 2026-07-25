import type { NextRequest } from "next/server";
import { apiFetch } from "@/lib/api/fetcher";
import type {
	MessageResponse,
	SendMessageRequest,
} from "@/lib/api/generated/model";

/** OpenAPI の SendMessageRequest.content と同じ制約。 */
const CONTENT_MAX_LENGTH = 1000;

/**
 * メッセージ送信のプロキシ Route Handler。
 *
 * 認証トークンが httpOnly Cookie にありクライアント JS から backend を直接
 * 叩けないため、チャット入力欄の fetch はここを経由して `POST /messages` に
 * 転送する(`app/api/things/route.ts` と同じパターン)。
 *
 * 生成フック `useSendMessage` を使わないのは、相対 URL かつ Authorization を
 * 付けない実装で、この Cookie 方式と噛み合わないため。
 */
export async function POST(request: NextRequest) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json({ message: "不正なリクエストです" }, { status: 400 });
	}

	// backend に投げる前にここで弾く(422 を往復させず、UI のエラー表示を早くする)。
	const { roomId, content } = (body ?? {}) as Partial<SendMessageRequest>;
	if (typeof roomId !== "number" || !Number.isInteger(roomId)) {
		return Response.json({ message: "不正なリクエストです" }, { status: 400 });
	}
	if (
		typeof content !== "string" ||
		content.trim() === "" ||
		content.length > CONTENT_MAX_LENGTH
	) {
		return Response.json({ message: "不正なリクエストです" }, { status: 400 });
	}

	const res = await apiFetch<MessageResponse>(
		"/messages",
		{
			method: "POST",
			body: JSON.stringify({ roomId, content } satisfies SendMessageRequest),
		},
		{ auth: true },
	);
	if (!res.ok) {
		// backend のステータスを透過する。ネットワークエラー(status 0)は 502 に倒す。
		return Response.json(res.error ?? {}, {
			status: res.status === 0 ? 502 : res.status,
		});
	}
	return Response.json(res.data ?? {}, { status: res.status });
}
