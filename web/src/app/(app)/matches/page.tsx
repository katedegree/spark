/**
 * トーク一覧 (`/matches`)。Server Component。
 *
 * 一覧そのものは `matches/layout.tsx` の左カラムが描画するため、この page は
 * PC の split view で右ペインに出す選択待ちのプレースホルダーだけを持つ。
 * SP は左カラム(= 一覧)が全幅を占めるので何も表示しない。
 */
export default function MatchesPage() {
	return (
		<div className="hidden flex-1 items-center justify-center md:flex">
			<p className="text-secondary text-sm">トークを選択してください</p>
		</div>
	);
}
