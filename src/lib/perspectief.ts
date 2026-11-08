/**
 * Homografie die de vier hoeken van `bron` op die van `doel` legt, als CSS matrix3d.
 * Gebruikt om een plat vlak (de site) op een scherm in een foto te leggen, zie
 * CaseToestel en CaseVoorNa.
 */
export function perspectief(bron: number[][], doel: number[][]): string {
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [u, v] = bron[i]!, [x, y] = doel[i]!;
    A.push([u!, v!, 1, 0, 0, 0, -u! * x!, -v! * x!]); b.push(x!);
    A.push([0, 0, 0, u!, v!, 1, -u! * y!, -v! * y!]); b.push(y!);
  }
  for (let c = 0; c < 8; c++) {
    let m = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r]![c]!) > Math.abs(A[m]![c]!)) m = r;
    [A[c], A[m]] = [A[m]!, A[c]!]; [b[c], b[m]] = [b[m]!, b[c]!];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r]![c]! / A[c]![c]!;
      for (let k = c; k < 8; k++) A[r]![k]! -= f * A[c]![k]!;
      b[r]! -= f * b[c]!;
    }
  }
  const [a, bb, cc, d, e, f, g, h] = b.map((v, i) => v / A[i]![i]!) as [number, number, number, number, number, number, number, number];
  // CSS matrix3d is kolom-voor-kolom.
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${h},0,0,1,0,${cc},${f},0,1)`;
}
