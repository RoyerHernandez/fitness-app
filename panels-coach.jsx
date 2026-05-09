// PULSE/ — coach perspective panels

function CoachBanner({ t, lang, co, displayName }) {
  return (
    <div className="banner">
      <div>
        <div className="eyebrow"><span style={{ color: 'var(--accent)' }}>●</span> {t.coach_overview} · {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <h1>{t.coach_greeting}, <b>{displayName}</b></h1>
        <div className="meta">
          <span>{co.active_clients} {t.active_clients.toLowerCase()}</span>
          <span className="dot"></span>
          <span>{co.sessions_today} {t.sessions_today.toLowerCase()}</span>
          <span className="dot"></span>
          <span>{co.unread_msgs} {t.new_msgs.toLowerCase()}</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="label">{t.active_clients}</div>
          <div className="val accent">{co.active_clients}</div>
          <div className="delta">{co.delta_clients}</div>
        </div>
        <div className="stat">
          <div className="label">{t.avg_adherence}</div>
          <div className="val">{co.avg_adherence}<span className="unit">%</span></div>
          <div className="delta">{co.delta_adherence}</div>
        </div>
        <div className="stat">
          <div className="label">{t.sessions_today}</div>
          <div className="val">{co.sessions_today}</div>
          <div className="delta" style={{ color: 'var(--text-faint)' }}>9:00 → 18:30</div>
        </div>
      </div>
    </div>
  );
}

function CoachKPIs({ t, co }) {
  // Adherence sparkline
  const W = 220, H = 60, P = 6;
  const s = co.adherence_series;
  const min = Math.min(...s) - 2, max = Math.max(...s) + 2;
  const x = (i) => P + (W - P * 2) * (i / (s.length - 1));
  const y = (v) => P + (H - P * 2) * (1 - (v - min) / (max - min));
  const path = s.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return null; // KPIs already in banner; this is reserved
}

function ClientsTable({ t, lang, co }) {
  return (
    <div className="card col-8">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.clients /> {t.your_clients.toUpperCase()}</div>
          <h3>{co.clients.length} {t.active_clients.toLowerCase()}</h3>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost"><Ico.search /></button>
          <button className="btn primary"><Ico.plus /> {lang === 'es' ? 'Añadir cliente' : 'Add client'}</button>
        </div>
      </div>

      <div>
        <div className="client-row head">
          <div></div>
          <div>{t.client_col}</div>
          <div>{t.plan_col}</div>
          <div>{t.adherence_col}</div>
          <div>{t.progress_col}</div>
          <div>{t.status_col}</div>
          <div></div>
        </div>
        {co.clients.map((cl, i) => {
          const adClass = cl.adherence >= 85 ? '' : cl.adherence >= 70 ? 'warn' : 'bad';
          const statusKey = cl.status; // on-track / warn / behind
          const statusLabel = statusKey === 'on-track' ? t.on_track : statusKey === 'warn' ? (lang === 'es' ? 'Atención' : 'Attention') : t.behind;
          return (
            <div className="client-row" key={i}>
              <div className={`avatar md tone-${cl.tone}`}>{cl.initials}</div>
              <div className="who">
                <div>
                  <div className="name">{cl.name}</div>
                  <div className="email">{cl.email}</div>
                </div>
              </div>
              <div className="plan">
                <b>{lang === 'es' ? cl.plan_es : cl.plan_en}</b>
                <span>{cl.plan_week}</span>
              </div>
              <div className={`adherence ${adClass}`}>
                <div className="track"><div className="fill" style={{ width: `${cl.adherence}%` }} /></div>
                <span>{cl.adherence}%</span>
              </div>
              <div className="last" style={{ color: cl.delta_kg < 0 ? 'var(--mint)' : cl.delta_kg > 0 ? 'var(--accent)' : 'var(--text-dim)' }}>
                {cl.delta_kg > 0 ? '+' : ''}{cl.delta_kg}{t.kg}
              </div>
              <div>
                <span className={`status-pill ${statusKey}`}>
                  <span className="dot"></span>{statusLabel}
                </span>
              </div>
              <div style={{ color: 'var(--text-faint)' }}><Ico.more /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TodaySessions({ t, lang, co }) {
  return (
    <div className="card col-4">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.clock /> {t.today_sessions.toUpperCase()}</div>
          <h3>{co.today_sessions.length} {lang === 'es' ? 'sesiones' : 'sessions'}</h3>
        </div>
        <button className="btn ghost"><Ico.plus /></button>
      </div>
      <div>
        {co.today_sessions.map((s, i) => (
          <div className="session-row" key={i}>
            <div className="time">{s.time}</div>
            <div className="who">
              <div className={`avatar sm tone-${s.tone}`}>{s.initials}</div>
              <div className="name">
                {s.client}
                <div className="what">{lang === 'es' ? s.what_es : s.what_en}</div>
              </div>
            </div>
            <button className="icon-btn" style={{ width: 28, height: 28 }}><Ico.chev /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdherenceCard({ t, lang, co }) {
  const W = 540, H = 160, P = 24;
  const s = co.adherence_series;
  const min = Math.min(...s) - 4, max = Math.max(...s) + 4;
  const x = (i) => P + (W - P * 2) * (i / (s.length - 1));
  const y = (v) => P + (H - P * 2) * (1 - (v - min) / (max - min));
  const path = s.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = path + ` L ${x(s.length - 1)} ${H - P} L ${x(0)} ${H - P} Z`;
  const cur = s[s.length - 1];
  return (
    <div className="card chart-card col-7">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.progress /> {t.avg_adherence.toUpperCase()}</div>
          <h3>{lang === 'es' ? 'Adherencia del grupo · 12 sem' : 'Group adherence · 12w'}</h3>
        </div>
        <div className="tabs">
          <button aria-selected="true">{lang === 'es' ? 'Grupo' : 'Group'}</button>
          <button>{lang === 'es' ? 'Por cliente' : 'By client'}</button>
        </div>
      </div>
      <div className="chart-stats">
        <div className="item">
          <div className="label">{lang === 'es' ? 'Actual' : 'Current'}</div>
          <div className="val">{cur}<span className="unit">%</span></div>
          <div className="delta">+4 pp · 12s</div>
        </div>
        <div className="item">
          <div className="label">{lang === 'es' ? 'Mejor cliente' : 'Top client'}</div>
          <div className="val" style={{ fontSize: 18 }}>Elena R.<span className="unit"> 96%</span></div>
        </div>
        <div className="item">
          <div className="label">{lang === 'es' ? 'Atención' : 'Attention'}</div>
          <div className="val" style={{ fontSize: 18, color: 'var(--danger)' }}>Diego S.<span className="unit"> 41%</span></div>
        </div>
      </div>
      <div className="chart-svg-wrap">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="agrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.33, 0.66].map((f, i) => (
            <line key={i} x1={P} x2={W - P} y1={P + (H - P * 2) * f} y2={P + (H - P * 2) * f}
              stroke="var(--grid-line)" strokeDasharray="2 4" />
          ))}
          <path d={area} fill="url(#agrad)" />
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={x(s.length - 1)} cy={y(cur)} r="5" fill="var(--accent)" />
        </svg>
      </div>
    </div>
  );
}

function QuickActions({ t, lang }) {
  const items = [
    { icon: <Ico.plans />, label: t.assign_routine, sub: lang === 'es' ? 'Desde plantilla o nueva' : 'From template or new' },
    { icon: <Ico.meals />, label: t.create_plan, sub: lang === 'es' ? 'Plan nutricional personalizado' : 'Custom nutrition plan' },
    { icon: <Ico.send />, label: t.send_message, sub: lang === 'es' ? 'Individual o difusión' : 'Direct or broadcast' },
    { icon: <Ico.progress />, label: t.log_metric, sub: lang === 'es' ? 'Peso · medidas · fotos' : 'Weight · measures · photos' },
  ];
  return (
    <div className="card col-5">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.lightning /> {t.quick_actions.toUpperCase()}</div>
          <h3>{lang === 'es' ? 'Hacer en 1 clic' : 'One-click actions'}</h3>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((it, i) => (
          <button key={i} className="card flat" style={{
            padding: '14px 14px', textAlign: 'left', cursor: 'default',
            background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 8,
            color: 'var(--text)', fontFamily: 'inherit', alignItems: 'flex-start',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent-soft)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {it.icon}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{it.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 3, fontFamily: 'Geist Mono' }}>{it.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { CoachBanner, ClientsTable, TodaySessions, AdherenceCard, QuickActions });
