/**
 * 表示用の日時フォーマッタ。
 *
 * タイムゾーンを日本時間に固定するのは、Server Component での初期描画と
 * ブラウザでの hydration がサーバ TZ(多くは UTC)とユーザー TZ の差でズレて
 * mismatch を起こすのを防ぐため(サービスの対象が国内のため JST 固定でよい)。
 * `Intl` のインスタンスはモジュールスコープで使い回す(生成コストが高いため)。
 */

const TIME_ZONE = "Asia/Tokyo";

/** `"3/2"`(ゼロ埋めなし)。en-US の numeric は `M/D` になる。 */
const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
	timeZone: TIME_ZONE,
	month: "numeric",
	day: "numeric",
});

/** `"20:55"`(ゼロ埋めあり・24 時間表記)。 */
const timeFormatter = new Intl.DateTimeFormat("en-GB", {
	timeZone: TIME_ZONE,
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});

/**
 * ISO8601 文字列を `"3/2"` 形式にする。
 * パースできない値は空文字を返す(API 由来の不正値で画面を壊さない)。
 */
export function formatMonthDay(iso: string): string {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	return monthDayFormatter.format(date);
}

/**
 * ISO8601 文字列を `"20:55"` 形式にする。
 * パースできない値は空文字を返す。
 */
export function formatTime(iso: string): string {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	return timeFormatter.format(date);
}
