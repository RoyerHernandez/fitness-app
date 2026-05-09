// PULSE/ — extra screens (Messages, Library, Plans, Sessions, simple month view)

function ScreenHeader({ eyebrow, title, sub, action }) {
  return (
    <div className="screen-header">
      <div>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {action && <div className="actions">{action}</div>}
    </div>
  );
}

// ── Client: Messages screen ───────────────────────────────────────────────

function MessagesScreen({ t, lang }) {
  const thread = lang === 'es' ? [
    { who: 'coach', name: 'Coach Marco', time: 'AYER · 18:42', text: 'Hola Sofía, vi tus números de la semana — buen progreso en el press banca 💪. Para mañana subimos a 55kg en serie efectiva, ¿de acuerdo?' },
    { who: 'me',    name: 'Tú', time: 'AYER · 19:05', text: '¡Sí! Me sentí muy bien con 52,5. Probamos los 55kg.' },
    { who: 'coach', name: 'Coach Marco', time: 'HOY · 08:10', text: 'Perfecto. He ajustado tu rutina de hoy con la nueva carga. También te dejé un snack post-entreno con 35g de proteína para recuperación.' },
    { who: 'coach', name: 'Coach Marco', time: 'HOY · 08:11', text: '¿Cómo van los kilos esta semana? Recuerda registrar también la cinta abdominal.' },
  ] : [
    { who: 'coach', name: 'Coach Marco', time: 'YESTERDAY · 18:42', text: 'Hi Sofía, your numbers this week look great — solid progress on bench press 💪. Tomorrow we move to 55kg on the working set, sound good?' },
    { who: 'me',    name: 'You', time: 'YESTERDAY · 19:05', text: 'Yes! 52.5 felt great. Let\'s try 55kg.' },
    { who: 'coach', name: 'Coach Marco', time: 'TODAY · 08:10', text: 'Perfect. I\'ve updated today\'s routine with the new load. Also added a 35g protein post-workout snack for recovery.' },
    { who: 'coach', name: 'Coach Marco', time: 'TODAY · 08:11', text: 'How\'s body weight tracking this week? Remember to log waist measurements too.' },
  ];
  return (
    <>
      <ScreenHeader
        eyebrow={<span><Ico.message /> {t.nav.messages.toUpperCase()}</span>}
        title={lang === 'es' ? 'Conversación con tu coach' : 'Talk with your coach'}
        sub={lang === 'es' ? 'Respuestas en menos de 12h en horario laboral.' : 'Replies under 12h on weekdays.'}
      />
      <div className="card col-12" style={{ padding: 0, display: 'flex', flexDirection: 'column', minHeight: 520 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div className="avatar md tone-b">MR</div>
          <div>
            <div style={{ fontWeight: 600 }}>Marco Ruiz</div>
            <div style={{ fontSize: 11.5, color: 'var(--mint)', fontFamily: 'Geist Mono' }}>● {lang === 'es' ? 'En línea' : 'Online'}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="icon-btn"><Ico.bell /></button>
            <button className="icon-btn"><Ico.more /></button>
          </div>
        </div>
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {thread.map((m, i) => (
            <div key={i} className={`bubble bubble-${m.who}`}>
              <div className="meta">{m.name} · {m.time}</div>
              <div className="text">{m.text}</div>
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', gap: 8, padding: 14, borderTop: '1px solid var(--border)',
          background: 'var(--surface-2)',
        }}>
          <input className="set-input" style={{ flex: 1, height: 36, width: 'auto', textAlign: 'left', padding: '0 12px' }}
            placeholder={lang === 'es' ? 'Escribe un mensaje…' : 'Type a message…'} />
          <button className="btn primary"><Ico.send /></button>
        </div>
      </div>
    </>
  );
}

// ── Client: Calendar screen — month grid ──────────────────────────────────

function MonthCard({ t, lang }) {
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth();
  const first = new Date(y, m, 1).getDay(); // 0..6 with sunday=0
  const offset = (first + 6) % 7; // make monday=0
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const months_es = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const months_en = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  // simple workout pattern: M push, T rest, W legs, Th mobility, F push, Sa cardio, Su rest
  const pattern = ['push','rest','legs','mobility','push','cardio','rest'];
  const todayD = today.getDate();
  return (
    <div className="card col-7">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Ico.calendar /> {(lang === 'es' ? 'MES' : 'MONTH')}</div>
          <h3>{(lang === 'es' ? months_es : months_en)[m]} {y}</h3>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn ghost" style={{ padding: '6px 10px' }}>‹</button>
          <button className="btn ghost" style={{ padding: '6px 10px' }}>›</button>
        </div>
      </div>
      <div className="month-grid">
        {t.dow.map((d) => <div key={d} className="month-dow">{d}</div>)}
        {cells.map((c, i) => {
          if (c === null) return <div key={i} className="month-cell empty" />;
          const isToday = c === todayD;
          const w = pattern[(offset + c - 1) % 7];
          const past = c < todayD;
          return (
            <div key={i} className={`month-cell ${w} ${isToday ? 'today' : ''} ${past ? 'past' : ''}`}>
              <div className="num">{c}</div>
              {w !== 'rest' && <div className="dot"></div>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 11, fontFamily: 'Geist Mono', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
        <span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--accent)', marginRight: 6, verticalAlign: 1 }} />{t.push}</span>
        <span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--info)', marginRight: 6, verticalAlign: 1 }} />{t.legs}</span>
        <span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--mint)', marginRight: 6, verticalAlign: 1 }} />{t.cardio}</span>
        <span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--warm)', marginRight: 6, verticalAlign: 1 }} />{t.mobility}</span>
        <span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--surface-3)', marginRight: 6, verticalAlign: 1 }} />{t.rest_day}</span>
      </div>
    </div>
  );
}

function UpcomingCard({ t, lang }) {
  const items = lang === 'es' ? [
    { day: 'Mañana', what: 'Cardio · Z2', dur: '30 min', color: 'mint' },
    { day: 'Sábado',  what: 'Pull B · Espalda/Bíceps', dur: '58 min', color: 'accent' },
    { day: 'Domingo', what: 'Descanso activo', dur: 'libre', color: 'dim' },
    { day: 'Lunes',   what: 'Push A', dur: '52 min', color: 'accent' },
  ] : [
    { day: 'Tomorrow', what: 'Cardio · Z2', dur: '30 min', color: 'mint' },
    { day: 'Saturday', what: 'Pull B · Back/Biceps', dur: '58 min', color: 'accent' },
    { day: 'Sunday',   what: 'Active rest', dur: 'free', color: 'dim' },
    { day: 'Monday',   what: 'Push A', dur: '52 min', color: 'accent' },
  ];
  return (
    <div className="card col-5">
      <div className="head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>{lang === 'es' ? 'PRÓXIMAS' : 'UPCOMING'}</div>
          <h3>{lang === 'es' ? 'Siguientes sesiones' : 'Next sessions'}</h3>
        </div>
      </div>
      <div>
        {items.map((it, i) => (
          <div key={i} className="session-row">
            <div className="time" style={{ width: 'auto', minWidth: 70, color: 'var(--text)' }}>{it.day}</div>
            <div className="who">
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: it.color === 'accent' ? 'var(--accent-soft)' : it.color === 'mint' ? 'rgba(102,228,177,0.12)' : 'var(--surface-2)',
                color: it.color === 'accent' ? 'var(--accent)' : it.color === 'mint' ? 'var(--mint)' : 'var(--text-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Ico.dumbbell />
              </div>
              <div className="name">
                {it.what}
                <div className="what">{it.dur}</div>
              </div>
            </div>
            <button className="icon-btn" style={{ width: 28, height: 28 }}><Ico.chev /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Coach: Library ────────────────────────────────────────────────────────

function LibraryScreen({ t, lang }) {
  const cats = lang === 'es' ? ['Pecho', 'Espalda', 'Pierna', 'Hombro', 'Brazo', 'Core', 'Cardio'] : ['Chest', 'Back', 'Leg', 'Shoulder', 'Arm', 'Core', 'Cardio'];
  const items_es = [
    { name: 'Press banca con barra', cat: 'Pecho', muscle: 'Pectoral mayor', equip: 'Barra · Banco', tier: 'Compuesto' },
    { name: 'Sentadilla trasera', cat: 'Pierna', muscle: 'Cuádriceps · Glúteo', equip: 'Barra · Rack', tier: 'Compuesto' },
    { name: 'Peso muerto rumano', cat: 'Espalda', muscle: 'Isquios · Glúteo', equip: 'Barra', tier: 'Compuesto' },
    { name: 'Press militar mancuernas', cat: 'Hombro', muscle: 'Deltoides', equip: 'Mancuernas · Banco', tier: 'Compuesto' },
    { name: 'Remo con barra', cat: 'Espalda', muscle: 'Dorsal · Trapecio', equip: 'Barra', tier: 'Compuesto' },
    { name: 'Curl bíceps mancuerna', cat: 'Brazo', muscle: 'Bíceps', equip: 'Mancuernas', tier: 'Aislamiento' },
    { name: 'Extensión tríceps polea', cat: 'Brazo', muscle: 'Tríceps', equip: 'Polea', tier: 'Aislamiento' },
    { name: 'Plancha frontal', cat: 'Core', muscle: 'Recto abdominal', equip: 'Peso corporal', tier: 'Aislamiento' },
    { name: 'Hip thrust', cat: 'Pierna', muscle: 'Glúteo', equip: 'Barra · Banco', tier: 'Compuesto' },
  ];
  const items_en = [
    { name: 'Barbell bench press', cat: 'Chest', muscle: 'Pectoralis major', equip: 'Barbell · Bench', tier: 'Compound' },
    { name: 'Back squat', cat: 'Leg', muscle: 'Quad · Glute', equip: 'Barbell · Rack', tier: 'Compound' },
    { name: 'Romanian deadlift', cat: 'Back', muscle: 'Hamstring · Glute', equip: 'Barbell', tier: 'Compound' },
    { name: 'DB shoulder press', cat: 'Shoulder', muscle: 'Deltoid', equip: 'Dumbbells · Bench', tier: 'Compound' },
    { name: 'Barbell row', cat: 'Back', muscle: 'Lats · Traps', equip: 'Barbell', tier: 'Compound' },
    { name: 'DB biceps curl', cat: 'Arm', muscle: 'Biceps', equip: 'Dumbbells', tier: 'Isolation' },
    { name: 'Triceps pushdown', cat: 'Arm', muscle: 'Triceps', equip: 'Cable', tier: 'Isolation' },
    { name: 'Front plank', cat: 'Core', muscle: 'Rectus abdominis', equip: 'Bodyweight', tier: 'Isolation' },
    { name: 'Hip thrust', cat: 'Leg', muscle: 'Glute', equip: 'Barbell · Bench', tier: 'Compound' },
  ];
  const items = lang === 'es' ? items_es : items_en;
  return (
    <>
      <ScreenHeader
        eyebrow={<span><Ico.library /> {t.nav.library.toUpperCase()}</span>}
        title={lang === 'es' ? 'Biblioteca de ejercicios' : 'Exercise library'}
        sub={lang === 'es' ? 'Reutiliza patrones; arrástralos a una rutina o plantilla.' : 'Reuse patterns; drag them into a routine or template.'}
        action={<button className="btn primary"><Ico.plus /> {lang === 'es' ? 'Nuevo ejercicio' : 'New exercise'}</button>}
      />
      <div className="col-12" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span className="tag" style={{ background: 'var(--accent)', color: 'var(--accent-text)', borderColor: 'var(--accent)' }}>{lang === 'es' ? 'Todos' : 'All'}</span>
        {cats.map((c) => <span className="tag" key={c}>{c}</span>)}
      </div>
      <div className="col-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {items.map((it, i) => (
          <div key={i} className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="tag">{it.cat}</span>
              <span className="tag" style={{ borderColor: 'transparent', background: 'transparent', color: 'var(--text-faint)' }}>{it.tier}</span>
            </div>
            <div style={{ aspectRatio: '16/9', borderRadius: 8, marginBottom: 10,
              background: 'repeating-linear-gradient(135deg, var(--surface-2) 0, var(--surface-2) 6px, var(--surface-3) 6px, var(--surface-3) 12px)',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-faint)', fontFamily: 'Geist Mono', fontSize: 10 }}>
              VIDEO · DEMO
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{it.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 4, fontFamily: 'Geist Mono' }}>{it.muscle}</div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 8, fontFamily: 'Geist Mono' }}>{it.equip}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Coach: Plans ──────────────────────────────────────────────────────────

function PlansScreen({ t, lang }) {
  const items = lang === 'es' ? [
    { name: 'Hipertrofia 12 semanas', desc: 'Volumen progresivo en 4 mesociclos', weeks: 12, days: 5, used: 7, color: 'accent' },
    { name: 'Definición agresiva 8s', desc: 'Déficit medio + cardio Z2', weeks: 8, days: 4, used: 4, color: 'mint' },
    { name: 'Fuerza 5×5', desc: 'Compuestos básicos · linear progression', weeks: 10, days: 3, used: 3, color: 'info' },
    { name: 'Inicial · onboarding', desc: 'Movilidad + adaptación neuromuscular', weeks: 4, days: 3, used: 6, color: 'warm' },
    { name: 'Mantenimiento', desc: 'Plan abierto, sin mesociclo definido', weeks: '∞', days: '3-4', used: 2, color: 'dim' },
    { name: 'Hipertrofia femenina · glúteo', desc: 'Foco posterior + core', weeks: 10, days: 4, used: 5, color: 'accent' },
  ] : [
    { name: 'Hypertrophy 12 weeks', desc: 'Progressive volume across 4 mesocycles', weeks: 12, days: 5, used: 7, color: 'accent' },
    { name: 'Aggressive cut 8w', desc: 'Mid deficit + Z2 cardio', weeks: 8, days: 4, used: 4, color: 'mint' },
    { name: 'Strength 5×5', desc: 'Big lifts · linear progression', weeks: 10, days: 3, used: 3, color: 'info' },
    { name: 'Initial · onboarding', desc: 'Mobility + neuromuscular adaptation', weeks: 4, days: 3, used: 6, color: 'warm' },
    { name: 'Maintenance', desc: 'Open plan, no fixed mesocycle', weeks: '∞', days: '3-4', used: 2, color: 'dim' },
    { name: 'Glute hypertrophy', desc: 'Posterior chain + core', weeks: 10, days: 4, used: 5, color: 'accent' },
  ];
  return (
    <>
      <ScreenHeader
        eyebrow={<span><Ico.plans /> {t.nav.plans.toUpperCase()}</span>}
        title={lang === 'es' ? 'Plantillas de plan' : 'Plan templates'}
        sub={lang === 'es' ? 'Asigna en 1 click a tus clientes — ajustables después.' : 'Assign in 1 click — fully adjustable per client.'}
        action={<button className="btn primary"><Ico.plus /> {lang === 'es' ? 'Nueva plantilla' : 'New template'}</button>}
      />
      <div className="col-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {items.map((p, i) => (
          <div key={i} className="card" style={{ padding: 18 }}>
            <div style={{
              height: 90, marginInline: -18, marginTop: -18, marginBottom: 14,
              background: p.color === 'accent' ? 'linear-gradient(135deg, var(--accent-soft), var(--surface))' :
                          p.color === 'mint'   ? 'linear-gradient(135deg, rgba(102,228,177,0.16), var(--surface))' :
                          p.color === 'info'   ? 'linear-gradient(135deg, rgba(107,168,255,0.16), var(--surface))' :
                          p.color === 'warm'   ? 'linear-gradient(135deg, rgba(255,184,77,0.16), var(--surface))' :
                          'var(--surface-2)',
              borderBottom: '1px solid var(--border)',
              padding: '14px 18px', display: 'flex', alignItems: 'flex-end',
            }}>
              <div style={{ fontFamily: 'Geist Mono', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 600 }}>
                {p.weeks}{lang === 'es' ? ' SEM' : ' W'} · {p.days}{lang === 'es' ? ' D/SEM' : ' D/W'}
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, fontFamily: 'Bricolage Grotesque', letterSpacing: '-0.02em' }}>{p.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 5 }}>{p.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <span className="tag">{lang === 'es' ? 'En uso por' : 'Used by'} {p.used}</span>
              <button className="btn ghost"><Ico.plus /> {lang === 'es' ? 'Asignar' : 'Assign'}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Coach: Sessions ───────────────────────────────────────────────────────

function SessionsScreen({ t, lang, co }) {
  // Build a 7-day x time-blocks grid
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const days_es = ['Lun 4','Mar 5','Mié 6','Jue 7','Vie 8','Sáb 9','Dom 10'];
  const days_en = ['Mon 4','Tue 5','Wed 6','Thu 7','Fri 8','Sat 9','Sun 10'];
  // Place some sessions
  const sessions = [
    { d: 0, h: 9,  span: 1, name: 'Sofía M.', what_es: 'Push A', what_en: 'Push A', tone: 'a' },
    { d: 0, h: 11, span: 1, name: 'Lucas V.', what_es: 'Onboard.', what_en: 'Onboard.', tone: 'b' },
    { d: 0, h: 15, span: 1, name: 'Andrea L.', what_es: 'Pull B', what_en: 'Pull B', tone: 'c' },
    { d: 0, h: 18, span: 1, name: 'Tomás I.', what_es: 'Mobility', what_en: 'Mobility', tone: 'd' },
    { d: 1, h: 10, span: 1, name: 'Carla B.', what_es: 'Cut review', what_en: 'Cut review', tone: 'e' },
    { d: 1, h: 17, span: 1, name: 'Diego S.', what_es: 'Legs', what_en: 'Legs', tone: 'f' },
    { d: 2, h: 9,  span: 1, name: 'Sofía M.', what_es: 'Pull A', what_en: 'Pull A', tone: 'a' },
    { d: 2, h: 14, span: 1, name: 'Elena R.', what_es: 'Cardio', what_en: 'Cardio', tone: 'b' },
    { d: 3, h: 11, span: 1, name: 'Júlia P.', what_es: 'Pull B', what_en: 'Pull B', tone: 'd' },
    { d: 4, h: 9,  span: 1, name: 'Sofía M.', what_es: 'Legs', what_en: 'Legs', tone: 'a' },
    { d: 4, h: 16, span: 1, name: 'Marc S.', what_es: 'Onboard.', what_en: 'Onboard.', tone: 'c' },
  ];
  return (
    <>
      <ScreenHeader
        eyebrow={<span><Ico.calendar /> {t.nav.sessions.toUpperCase()}</span>}
        title={lang === 'es' ? 'Agenda de la semana' : 'Weekly schedule'}
        sub={lang === 'es' ? '11 sesiones programadas · 4 hoy' : '11 scheduled sessions · 4 today'}
        action={<button className="btn primary"><Ico.plus /> {lang === 'es' ? 'Reservar' : 'Book'}</button>}
      />
      <div className="card col-12" style={{ overflowX: 'auto', padding: 0 }}>
        <div className="schedule-grid" style={{ minWidth: 880 }}>
          <div className="schedule-time-head"></div>
          {(lang === 'es' ? days_es : days_en).map((d, i) => (
            <div key={i} className={`schedule-day-head ${i === 4 ? 'today' : ''}`}>{d}</div>
          ))}
          {hours.map((h) => (
            <React.Fragment key={h}>
              <div className="schedule-time">{h}:00</div>
              {Array.from({ length: 7 }).map((_, d) => {
                const sess = sessions.find((s) => s.d === d && s.h === h);
                return (
                  <div key={d} className={`schedule-cell ${d === 4 ? 'today' : ''}`}>
                    {sess && (
                      <div className="schedule-block">
                        <div className={`avatar sm tone-${sess.tone}`} style={{ width: 22, height: 22, fontSize: 9 }}>{sess.name.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600 }}>{sess.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Geist Mono' }}>{lang === 'es' ? sess.what_es : sess.what_en}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  ScreenHeader, MessagesScreen, MonthCard, UpcomingCard,
  LibraryScreen, PlansScreen, SessionsScreen,
});
