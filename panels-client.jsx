// PULSE/ — client perspective panels

const { useState } = React;

function ClientBanner({ t, lang, c, displayName }) {
  const greet = (() => {
    const h = new Date().getHours();
    if (h < 12) return t.greeting_morning;
    if (h < 19) return t.greeting_afternoon;
    return t.greeting_evening;
  })();
  return (
    <div className="banner">
      <div>
        <div className="eyebrow"><span style={{ color: 'var(--accent)' }}>●</span> {t.today} · {t.day_n} {c.day} {t.of} {c.plan_total}</div>
        <h1>{greet}, <b>{displayName}</b></h1>
        <div className="meta">
          <span>{t.phase}: <b style={{ color: 'var(--text)' }}>{t.phases[c.phase]}</b></span>
          <span className="dot"></span>
          <span>{t.objective}: <b style={{ color: 'var(--text)' }}>{t.objectives[c.objective]}</b></span>
          <span className="dot"></span>
          <span>{t.workouts_done_week_label || ''}{c.workouts_done_week}/{c.workouts_target_week} {t.workouts_week.toLowerCase()}</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="label">{t.streak_label}</div>
          <div className="val accent">{c.streak}<span className="unit">{t.days_short}</span></div>
        </div>
        <div className="stat">
          <div className="label">{t.today_kcal}</div>
          <div className="val">{c.kcal_today}<span className="unit">/{c.kcal_target}</span></div>
          <div className="delta">{Math.round(c.kcal_today / c.kcal_target * 100)}%</div>
        </div>
        <div className="stat">
          <div className="label">{t.today_weight}</div>
          <div className="val">{c.weight_today}<span className="unit">{t.kg}</span></div>
          <div className="delta">{c.weight_delta_30d > 0 ? '+' : ''}{c.weight_delta_30d}{t.kg} · 30d</div>
        </div>
      </div>
    </div>
  );
}

// ── Routine card with active set tracker ───────────────────────────────────

function RoutineCard({ t, lang, c }) {
  const [activeIdx, setActiveIdx] = useState(c.routine.exercises.findIndex((e) => e.status === 'active'));
  const ex = c.routine.exercises;
  const total = ex.length;
  const done = ex.filter((e) => e.status === 'done').length;
  return (
    <div className="card feature col-7">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            <Ico.dumbbell /> {t.todays_routine.toUpperCase()}
          </div>
          <h3 style={{ fontSize: 22 }}>{lang === 'es' ? c.routine.name_es : c.routine.name_en}</h3>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-dim)', marginTop: 6, fontFamily: 'Geist Mono' }}>
            <span><Ico.clock style={{ verticalAlign: -2, marginRight: 4 }} /> {c.routine.duration_min} {t.minutes}</span>
            <span>{total} {t.routine_meta}</span>
            <span>{done}/{total} ✓</span>
          </div>
        </div>
        <button className="btn primary"><Ico.play /> {t.start_workout}</button>
      </div>

      <div>
        {ex.map((e, i) => {
          const isActive = i === activeIdx;
          const isDone = e.status === 'done';
          return (
            <React.Fragment key={i}>
              <div
                className={`routine-row ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIdx(i)}
              >
                <div className="num">{isDone ? <Ico.check /> : i + 1}</div>
                <div className="name">
                  {lang === 'es' ? e.name_es : e.name_en}
                  <div className="sub">{e.sets} × {e.reps} · {e.weight}{t.kg}</div>
                </div>
                <div className="target">
                  {isDone && <span style={{ color: 'var(--mint)' }}>{e.sets}/{e.sets} ✓</span>}
                  {isActive && <span style={{ color: 'var(--accent)' }}>{e.done_sets ? e.done_sets.filter((s) => s.ok).length : 0}/{e.sets}</span>}
                  {!isDone && !isActive && <span>—</span>}
                </div>
                <div className="chevron"><Ico.chev /></div>
              </div>

              {isActive && (
                <div className="set-tracker">
                  <div className="ex-head">
                    <div>
                      <div className="title">{lang === 'es' ? e.name_es : e.name_en}</div>
                      <div className="target" style={{ marginTop: 2 }}>
                        {t.last_session}: {e.last_session || '—'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn ghost" style={{ padding: '6px 10px' }}><Ico.clock /> 90s</button>
                      <button className="btn"><Ico.lightning /> {t.notes}</button>
                    </div>
                  </div>

                  <div className="set-grid">
                    <div className="head-row" style={{ display: 'contents' }}>
                      <div>#</div>
                      <div>{t.weight}</div>
                      <div>{t.reps}</div>
                      <div>{t.rest}</div>
                      <div></div>
                    </div>
                    {Array.from({ length: e.sets }).map((_, si) => {
                      const data = e.done_sets && e.done_sets[si];
                      const ok = data && data.ok;
                      const isPending = !data || !data.ok;
                      return (
                        <div className={`row ${ok ? 'complete' : ''}`} style={{ display: 'contents' }} key={si}>
                          <div>{si + 1}</div>
                          <div>
                            <input className="set-input" defaultValue={data ? data.w : e.weight} />
                            <span style={{ color: 'var(--text-faint)', marginLeft: 4 }}>{t.kg}</span>
                          </div>
                          <div>
                            <input className="set-input" defaultValue={data ? data.r : ''} placeholder={String(e.reps).split('–')[0]} style={{ width: 56 }} />
                          </div>
                          <div style={{ color: 'var(--text-faint)' }}>{ok ? '01:30' : (isPending && si === 2 ? '00:42' : '—')}</div>
                          <div>
                            <button className="set-check" data-on={ok ? '1' : '0'}>
                              {ok && <Ico.check />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ── Macros ring ────────────────────────────────────────────────────────────

function MacrosCard({ t, lang, c }) {
  const r = 56;
  const C = 2 * Math.PI * r;
  const pct = Math.min(1, c.kcal_today / c.kcal_target);
  return (
    <div className="card col-5">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.flame /> {t.nutrition.toUpperCase()}</div>
          <h3>{t.calories} · {t.today.toLowerCase()}</h3>
        </div>
        <button className="btn ghost"><Ico.plus /> {t.log_meal}</button>
      </div>

      <div className="macros">
        <div className="ring">
          <svg width="132" height="132" viewBox="0 0 132 132">
            <circle cx="66" cy="66" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="10" />
            <circle cx="66" cy="66" r={r} fill="none"
              stroke="var(--accent)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${C * pct} ${C}`} />
          </svg>
          <div className="center">
            <div className="num">{c.kcal_today}</div>
            <div className="of">/ {c.kcal_target} {t.kcal}</div>
            <div className="label">{Math.round(pct * 100)}% {t.goal}</div>
          </div>
        </div>
        <div className="bars">
          <div className="bar-row">
            <div className="lbl"><span className="name">{t.macro_p}</span><span className="val">{c.macros.protein.value}/{c.macros.protein.target}{t.g_unit}</span></div>
            <div className="bar protein"><div className="fill" style={{ width: `${c.macros.protein.value / c.macros.protein.target * 100}%` }} /></div>
          </div>
          <div className="bar-row">
            <div className="lbl"><span className="name">{t.macro_c}</span><span className="val">{c.macros.carbs.value}/{c.macros.carbs.target}{t.g_unit}</span></div>
            <div className="bar carbs"><div className="fill" style={{ width: `${c.macros.carbs.value / c.macros.carbs.target * 100}%` }} /></div>
          </div>
          <div className="bar-row">
            <div className="lbl"><span className="name">{t.macro_f}</span><span className="val">{c.macros.fat.value}/{c.macros.fat.target}{t.g_unit}</span></div>
            <div className="bar fat"><div className="fill" style={{ width: `${c.macros.fat.value / c.macros.fat.target * 100}%` }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Meals list ─────────────────────────────────────────────────────────────

function MealsCard({ t, lang, c }) {
  const typeLabel = (k) => t[k] || k;
  return (
    <div className="card col-5">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.meals /> {t.todays_meals.toUpperCase()}</div>
          <h3>{lang === 'es' ? '5 comidas planificadas' : '5 planned meals'}</h3>
        </div>
        <span className="tag">{c.meals.filter((m) => m.logged).length}/{c.meals.length} ✓</span>
      </div>
      <div className="meal-list">
        {c.meals.map((m, i) => (
          <div className={`meal-row ${m.logged ? 'logged' : ''}`} key={i}>
            <div className="time">{m.time}</div>
            <div className="name">
              {lang === 'es' ? m.name_es : m.name_en}
              <div className="desc">{typeLabel(m.type)} · {lang === 'es' ? m.desc_es : m.desc_en}</div>
            </div>
            <div className="kcal">{m.kcal}<span className="unit"> {t.kcal}</span></div>
            <div className="check">{m.logged && <Ico.check />}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Progress chart ─────────────────────────────────────────────────────────

function ChartCard({ t, lang, c }) {
  const [tab, setTab] = useState('weight');
  const series = tab === 'weight' ? c.weight_series : c.bf_series;
  const unit = tab === 'weight' ? t.kg : t.pct;
  const goal = tab === 'weight' ? c.weight_goal : null;
  const cur = series[series.length - 1];
  const start = series[0];
  const delta = +(cur - start).toFixed(1);
  // Build SVG path
  const W = 540, H = 160, P = 24;
  const min = Math.min(...series, goal || Infinity) - 0.5;
  const max = Math.max(...series, goal || -Infinity) + 0.5;
  const x = (i) => P + (W - P * 2) * (i / (series.length - 1));
  const y = (v) => P + (H - P * 2) * (1 - (v - min) / (max - min));
  const path = series.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = path + ` L ${x(series.length - 1)} ${H - P} L ${x(0)} ${H - P} Z`;

  return (
    <div className="card chart-card col-7">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.progress /> {t.progress.toUpperCase()}</div>
          <h3>{tab === 'weight' ? t.body_weight : t.body_fat} · 12 {t.week.split(' ').pop().toLowerCase()}</h3>
        </div>
        <div className="tabs">
          <button aria-selected={tab === 'weight'} onClick={() => setTab('weight')}>{t.body_weight}</button>
          <button aria-selected={tab === 'bf'} onClick={() => setTab('bf')}>{t.body_fat}</button>
        </div>
      </div>

      <div className="chart-stats">
        <div className="item">
          <div className="label">{t.last}</div>
          <div className="val">{cur}<span className="unit">{unit}</span></div>
          <div className={`delta ${delta > 0 && tab === 'weight' ? 'bad' : ''}`}>
            {delta > 0 ? '+' : ''}{delta}{unit} · 12s
          </div>
        </div>
        {goal && (
          <div className="item">
            <div className="label">{t.goal}</div>
            <div className="val" style={{ color: 'var(--text-dim)' }}>{goal}<span className="unit">{unit}</span></div>
            <div className="delta" style={{ color: 'var(--text-faint)' }}>{(cur - goal).toFixed(1)}{unit} {lang === 'es' ? 'restantes' : 'to go'}</div>
          </div>
        )}
        <div className="item">
          <div className="label">{lang === 'es' ? 'Tendencia' : 'Trend'}</div>
          <div className="val" style={{ fontSize: 18, color: 'var(--mint)' }}>{lang === 'es' ? 'En camino' : 'On track'}</div>
        </div>
      </div>

      <div className="chart-svg-wrap">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="cgrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid */}
          {[0.25, 0.5, 0.75].map((f, i) => (
            <line key={i} x1={P} x2={W - P} y1={P + (H - P * 2) * f} y2={P + (H - P * 2) * f}
              stroke="var(--grid-line)" strokeDasharray="2 4" />
          ))}
          {/* Goal line */}
          {goal && (
            <line x1={P} x2={W - P} y1={y(goal)} y2={y(goal)}
              stroke="var(--text-faint)" strokeDasharray="3 4" strokeWidth="1" />
          )}
          {/* Area */}
          <path d={area} fill="url(#cgrad)" />
          {/* Line */}
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Endpoint dot */}
          <circle cx={x(series.length - 1)} cy={y(cur)} r="5" fill="var(--accent)" />
          <circle cx={x(series.length - 1)} cy={y(cur)} r="9" fill="var(--accent)" opacity="0.18" />
          {/* X labels */}
          {[0, 3, 6, 9, 11].map((i) => (
            <text key={i} className="chart-axis" x={x(i)} y={H - 4} textAnchor="middle">
              {`s${i + 1}`}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ── Measurements ───────────────────────────────────────────────────────────

function MeasurementsCard({ t, lang, c }) {
  return (
    <div className="card col-5">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>{t.measurements.toUpperCase()}</div>
          <h3>{t.measurements} · {t.last}</h3>
        </div>
        <span className="text-link">14 ABR · 2026</span>
      </div>
      <div className="measure-grid">
        {c.measurements.map((m, i) => {
          const goingDown = m.delta < 0;
          const goingUp = m.delta > 0;
          const flat = m.delta === 0;
          // For the client objective "gain", + is good for chest/arm/thigh, - is good for waist/hip
          const goodIfDown = ['waist', 'hip'].includes(m.key);
          const isGood = flat ? false : (goodIfDown ? goingDown : goingUp);
          const cls = flat ? 'flat' : (isGood ? '' : 'bad');
          return (
            <div className="measure-cell" key={i}>
              <div className="lbl">{t[m.key]}</div>
              <div className="val">{m.val}<span className="unit">{t.cm}</span></div>
              <div className={`delta ${cls}`}>
                {flat ? '—' : `${m.delta > 0 ? '+' : ''}${m.delta}${t.cm}`} · 30d
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Hydration ──────────────────────────────────────────────────────────────

function HydrationCard({ t, lang, c }) {
  return (
    <div className="card hydration col-3">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.drop /> {t.hydration.toUpperCase()}</div>
          <h3 style={{ fontSize: 16 }}>{c.hydration.glasses}{t.of_target ? ' ' + t.of_target : '/'} {c.hydration.target} {t.glasses}</h3>
        </div>
      </div>
      <div className="glasses">
        {Array.from({ length: c.hydration.target }).map((_, i) => (
          <div key={i} className="glass" data-filled={i < c.hydration.glasses ? '1' : '0'} />
        ))}
      </div>
      <div className="meta">
        <span><b>{(c.hydration.glasses * 0.25).toFixed(2)}L</b> / {(c.hydration.target * 0.25).toFixed(1)}L</span>
        <span>+{c.hydration.target - c.hydration.glasses}</span>
      </div>
    </div>
  );
}

// ── Progress photos ────────────────────────────────────────────────────────

function PhotosCard({ t, lang, c }) {
  return (
    <div className="card col-4">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.camera /> {t.photos.toUpperCase()}</div>
          <h3 style={{ fontSize: 16 }}>{t.last} · 14 ABR</h3>
        </div>
        <button className="btn ghost"><Ico.plus /> {t.add_photo}</button>
      </div>
      <div className="photos">
        {c.photos.map((p, i) => (
          <div className="photo" key={i}>
            <div className="corner">{p.date}</div>
            <div className="label">{t[p.label]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Calendar week ──────────────────────────────────────────────────────────

function WeekCard({ t, lang, c }) {
  const workoutLabel = (k) => k === 'rest' ? t.rest_day : t[k] || k;
  return (
    <div className="card col-12">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.calendar /> {t.cal_week.toUpperCase()}</div>
          <h3>{lang_es_label(t)}</h3>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" style={{ padding: '6px 10px' }}>‹</button>
          <button className="btn ghost" style={{ padding: '6px 10px' }}>›</button>
        </div>
      </div>
      <div className="week-strip">
        {c.week.map((d, i) => {
          const isRest = d.workout === 'rest';
          return (
            <div key={i} className={`day-card ${d.today ? 'today' : ''} ${isRest ? 'rest' : ''} ${d.done ? 'done' : ''}`}>
              <div className="dow">{t.dow[d.dow]}</div>
              <div className="num">{d.num}</div>
              <div className="work">
                {workoutLabel(d.workout)}
                {!isRest && <div className="dur">{d.dur}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function lang_es_label(t) {
  // Simple month label, locale-agnostic-ish
  const d = new Date();
  const months_es = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const months_en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = (t.dow[0] === 'Lun' ? months_es : months_en)[d.getMonth()];
  return `${m} ${d.getFullYear()} · S ${Math.ceil(d.getDate() / 7)}`;
}

Object.assign(window, {
  ClientBanner, RoutineCard, MacrosCard, MealsCard,
  ChartCard, MeasurementsCard, HydrationCard, PhotosCard, WeekCard,
});
