// Splits a heading into masked words so they can rise one by one (ScrollMotion animates `.wm > span`).
export function Words({ text }: { text: string }) {
  const parts = text.split(/(\s+)/).filter(Boolean);
  return <>{parts.map((p, i) => (/^\s+$/.test(p) ? p : <span className="wm" key={i}><span>{p}</span></span>))}</>;
}
