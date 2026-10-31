import { Words } from './Words';

// Section header: label in the rail, title from column 4, optional lede under it
export function Head({ label, title, muted, lede }: { label: string; title: string; muted?: string; lede?: string }) {
  return (
    <header className="head reveal">
      <p className="label rail">{label}</p>
      <h2 className="col-main">
        <Words text={title} />
        {muted ? <> <span className="muted"><Words text={muted} /></span></> : null}
      </h2>
      {lede ? <p className="lede col-text">{lede}</p> : null}
    </header>
  );
}
