/**
 * `/matches` 系パスの判定ヘルパー。
 *
 * 詳細ページかどうか・roomId の抽出を複数のコンポーネント(一覧カラムの表示制御、
 * 検索セクションの activeRoomId、下部タブバーの非表示判定)が個別に持つと、
 * ルート形が変わったとき直し漏れる。判定の真理源をここに 1 つ置く。
 */

/** `/matches/[roomId]`(詳細)のパスか。一覧 `/matches` そのものは false。 */
export function isMatchDetailPath(pathname: string): boolean {
	return pathname.startsWith("/matches/");
}

/**
 * 詳細パスから roomId を取り出す。詳細でなければ `NaN`。
 * `Number("")` は 0 になってしまうため、セグメントが無いときは明示的に `NaN`。
 */
export function parseActiveRoomId(pathname: string): number {
	const segment = pathname.split("/")[2];
	return segment ? Number(segment) : Number.NaN;
}
