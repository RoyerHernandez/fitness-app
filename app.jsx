// PULSE/ — main app shell

const { useState, useMemo, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "lang": "es",
  "userName": "Sofía Martín",
  "initials": "SM",
  "perspective": "client"
}/*EDITMODE-END*/;

function Sidebar({ t, perspective, current, onNavigate, open, onClose }) {
  const clientNav = [
    { key: 'home', icon: <Ico.home />, label: t.nav.home },
    { key: 'routine', icon: <Ico.routine />, label: t.nav.routine, badge: '6' },
    { key: 'meals', icon: <Ico.meals />, label: t.nav.meals },
    { key: 'progress', icon: <Ico.progress />, label: t.nav.progress },
    { key: 'calendar', icon: <Ico.calendar />, label: t.nav.calendar },
  ];
  const coachNav = [
    { key: 'home', icon: <Ico.home />, label: t.nav.home },
    { key: 'clients', icon: <Ico.clients />, label: t.nav.clients, badge: '12' },
    { key: 'sessions', icon: <Ico.calendar />, label: t.nav.sessions, badge: '4' },
    { key: 'library', icon: <Ico.library />, label: t.nav.library },
    { key: 'plans', icon: <Ico.plans />, label: t.nav.plans },
  ];
  const main = perspective === 'coach' ? coachNav : clientNav;
  const go = (k) => { onNavigate(k); onClose && onClose(); };
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand" style={{ padding: '4px 12px 18px' }}>
        PULSE<span className="slash">/</span>
      </div>
      <div className="side-section">{perspective === 'coach' ? t.nav.group_coach : t.nav.group_main}</div>
      {main.map((it) => (
        <div key={it.key} className="nav-item" aria-current={current === it.key ? 'page' : undefined}
          onClick={() => go(it.key)}>
          {it.icon}
          <span className="lbl">{it.label}</span>
          {it.badge && <span className="badge-num">{it.badge}</span>}
        </div>
      ))}
      <div className="side-section">{t.nav.group_other}</div>
      <div className="nav-item" aria-current={current === 'messages' ? 'page' : undefined}
        onClick={() => go('messages')}>
        <Ico.message /><span className="lbl">{t.nav.messages}</span><span className="badge-num">3</span>
      </div>
      <div className="nav-item" aria-current={current === 'settings' ? 'page' : undefined}
        onClick={() => go('settings')}>
        <Ico.settings /><span className="lbl">{t.nav.settings}</span>
      </div>
    </aside>
  );
}

function PerspectiveToggle({ t, value, onChange }) {
  const ref = useRef(null);
  return (
    <div className="persp-toggle" ref={ref}>
      <div className="thumb" style={{
        left: value === 'client' ? 3 : 'calc(50% + 0px)',
        width: 'calc(50% - 3px)',
      }} />
      <button aria-selected={value === 'client'} onClick={() => onChange('client')}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: value === 'client' ? 'var(--accent)' : 'var(--text-faint)' }} />
        {t.perspective.client}
      </button>
      <button aria-selected={value === 'coach'} onClick={() => onChange('coach')}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: value === 'coach' ? 'var(--accent)' : 'var(--text-faint)' }} />
        {t.perspective.coach}
      </button>
    </div>
  );
}

function MobileMenuButton({ onClick }) {
  return (
    <button className="icon-btn mobile-toggle" onClick={onClick} aria-label="Menu" style={{ marginRight: 4 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>
  );
}

function TopBar({ t, perspective, setPerspective, displayName, initials, tone, theme, setTheme, lang, setLang, onMenu }) {
  return (
    <header className="topbar">
      <MobileMenuButton onClick={onMenu} />
      <div className="search">
        <Ico.search />
        <span>{t.search}</span>
        <kbd>⌘K</kbd>
      </div>
      <div style={{ flex: 1 }} />
      <PerspectiveToggle t={t} value={perspective} onChange={setPerspective} />
      <button className="icon-btn" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label="Language" title="Language"
        style={{ fontFamily: 'Geist Mono', fontSize: 11, fontWeight: 600 }}>
        {lang.toUpperCase()}
      </button>
      <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Theme" title="Theme">
        {theme === 'dark' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>
        )}
      </button>
      <button className="icon-btn" style={{ position: 'relative' }} aria-label="Notifications">
        <Ico.bell />
        <span className="badge"></span>
      </button>
      <div className={`avatar tone-${tone}`} title={displayName}>{initials}</div>
    </header>
  );
}

// ── Settings screen ─────────────────────────────────────────────────────

function SettingsScreen({ t, lang, current_t, setTweak, perspective }) {
  return (
    <>
      <ScreenHeader
        eyebrow={<span><Ico.settings /> {t.nav.settings.toUpperCase()}</span>}
        title={lang === 'es' ? 'Ajustes y personalización' : 'Settings & personalization'}
        sub={lang === 'es' ? 'Configura objetivos, días disponibles y preferencias alimentarias.' : 'Configure goals, available days and food preferences.'}
      />
      <div className="card col-6">
        <div className="head"><div><div className="eyebrow" style={{ marginBottom: 6 }}>{lang === 'es' ? 'OBJETIVO' : 'GOAL'}</div><h3>{lang === 'es' ? '¿Qué buscas conseguir?' : 'What do you want to achieve?'}</h3></div></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {[
            { k: 'lose', label: lang === 'es' ? 'Perder grasa' : 'Lose fat', desc: lang === 'es' ? 'Déficit calórico controlado' : 'Controlled caloric deficit' },
            { k: 'gain', label: lang === 'es' ? 'Ganar músculo' : 'Build muscle', desc: lang === 'es' ? 'Superávit + entreno progresivo' : 'Surplus + progressive training' },
            { k: 'maint', label: lang === 'es' ? 'Mantener' : 'Maintain', desc: lang === 'es' ? 'Recomposición sostenible' : 'Sustainable recomp' },
          ].map((opt, i) => (
            <label key={opt.k} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 10,
              border: `1px solid ${i === 1 ? 'var(--accent)' : 'var(--border)'}`,
              background: i === 1 ? 'var(--accent-soft)' : 'var(--surface-2)',
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                border: `2px solid ${i === 1 ? 'var(--accent)' : 'var(--border-strong)'}`,
                background: i === 1 ? 'var(--accent)' : 'transparent',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      <div className="card col-6">
        <div className="head"><div><div className="eyebrow" style={{ marginBottom: 6 }}>{lang === 'es' ? 'DISPONIBILIDAD' : 'AVAILABILITY'}</div><h3>{lang === 'es' ? 'Días para entrenar' : 'Training days'}</h3></div></div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {t.dow.map((d, i) => {
            const active = [0, 2, 3, 4, 5].includes(i);
            return (
              <div key={d} style={{
                width: 56, height: 56, borderRadius: 10,
                background: active ? 'var(--accent)' : 'var(--surface-2)',
                color: active ? 'var(--accent-text)' : 'var(--text-dim)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 13,
              }}>{d.slice(0, 3)}</div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, fontSize: 12.5, color: 'var(--text-dim)' }}>
          {lang === 'es' ? '5 días seleccionados · 60–90 min por sesión' : '5 days selected · 60–90 min per session'}
        </div>
      </div>
      <div className="card col-12">
        <div className="head"><div><div className="eyebrow" style={{ marginBottom: 6 }}>{lang === 'es' ? 'COMIDAS' : 'FOOD'}</div><h3>{lang === 'es' ? 'Preferencias alimentarias' : 'Food preferences'}</h3></div></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {(lang === 'es' ? ['Sin gluten','Vegetariano','Vegano','Sin lactosa','Bajo en sodio','Pescetariano','Sin frutos secos','Mediterránea','Keto','Alta en proteína'] :
                          ['Gluten-free','Vegetarian','Vegan','Lactose-free','Low sodium','Pescetarian','Nut-free','Mediterranean','Keto','High protein']).map((tag, i) => {
            const active = [7, 9].includes(i);
            return (
              <span key={i} className="tag" style={{
                padding: '8px 14px', fontSize: 12.5,
                background: active ? 'var(--accent)' : 'var(--surface-2)',
                color: active ? 'var(--accent-text)' : 'var(--text)',
                borderColor: active ? 'var(--accent)' : 'var(--border)',
              }}>{tag}</span>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── Routing ─────────────────────────────────────────────────────────────

function ClientHome({ I, lang, c, firstName }) {
  return (
    <>
      <ClientBanner t={I} lang={lang} c={c} displayName={firstName} />
      <RoutineCard t={I} lang={lang} c={c} />
      <MacrosCard t={I} lang={lang} c={c} />
      <ChartCard t={I} lang={lang} c={c} />
      <MealsCard t={I} lang={lang} c={c} />
      <MeasurementsCard t={I} lang={lang} c={c} />
      <HydrationCard t={I} lang={lang} c={c} />
      <PhotosCard t={I} lang={lang} c={c} />
      <WeekCard t={I} lang={lang} c={c} />
    </>
  );
}

function CoachHome({ I, lang, co, firstName }) {
  return (
    <>
      <CoachBanner t={I} lang={lang} co={co} displayName={firstName} />
      <ClientsTable t={I} lang={lang} co={co} />
      <TodaySessions t={I} lang={lang} co={co} />
      <AdherenceCard t={I} lang={lang} co={co} />
      <QuickActions t={I} lang={lang} />
    </>
  );
}

function ScreenRouter({ current, perspective, I, lang, c, co, firstName, setTweak }) {
  if (current === 'messages') return <MessagesScreen t={I} lang={lang} />;
  if (current === 'settings') return <SettingsScreen t={I} lang={lang} setTweak={setTweak} perspective={perspective} />;

  if (perspective === 'client') {
    switch (current) {
      case 'home': return <ClientHome I={I} lang={lang} c={c} firstName={firstName} />;
      case 'routine': return (<>
        <ScreenHeader
          eyebrow={<span><Ico.routine /> {I.nav.routine.toUpperCase()}</span>}
          title={I.screen.routine_title}
          sub={I.screen.routine_sub}
          action={<button className="btn primary"><Ico.play /> {I.start_workout}</button>}
        />
        <RoutineCard t={I} lang={lang} c={c} />
        <MacrosCard t={I} lang={lang} c={c} />
        <WeekCard t={I} lang={lang} c={c} />
      </>);
      case 'meals': return (<>
        <ScreenHeader
          eyebrow={<span><Ico.meals /> {I.nav.meals.toUpperCase()}</span>}
          title={I.screen.meals_title}
          sub={I.screen.meals_sub}
          action={<button className="btn primary"><Ico.plus /> {I.log_meal}</button>}
        />
        <MacrosCard t={I} lang={lang} c={c} />
        <HydrationCard t={I} lang={lang} c={c} />
        <MealsCard t={I} lang={lang} c={c} />
      </>);
      case 'progress': return (<>
        <ScreenHeader
          eyebrow={<span><Ico.progress /> {I.nav.progress.toUpperCase()}</span>}
          title={I.screen.progress_title}
          sub={I.screen.progress_sub}
        />
        <ChartCard t={I} lang={lang} c={c} />
        <MeasurementsCard t={I} lang={lang} c={c} />
        <PhotosCard t={I} lang={lang} c={c} />
      </>);
      case 'calendar': return (<>
        <ScreenHeader
          eyebrow={<span><Ico.calendar /> {I.nav.calendar.toUpperCase()}</span>}
          title={I.screen.calendar_title}
          sub={I.screen.calendar_sub}
        />
        <MonthCard t={I} lang={lang} />
        <UpcomingCard t={I} lang={lang} />
        <WeekCard t={I} lang={lang} c={c} />
      </>);
      default: return <ClientHome I={I} lang={lang} c={c} firstName={firstName} />;
    }
  }

  // coach
  switch (current) {
    case 'home': return <CoachHome I={I} lang={lang} co={co} firstName={firstName} />;
    case 'clients': return (<>
      <ScreenHeader
        eyebrow={<span><Ico.clients /> {I.nav.clients.toUpperCase()}</span>}
        title={I.screen.clients_title}
        sub={I.screen.clients_sub}
        action={<button className="btn primary"><Ico.plus /> {lang === 'es' ? 'Añadir cliente' : 'Add client'}</button>}
      />
      <ClientsTable t={I} lang={lang} co={co} />
      <AdherenceCard t={I} lang={lang} co={co} />
      <QuickActions t={I} lang={lang} />
    </>);
    case 'sessions': return <SessionsScreen t={I} lang={lang} co={co} />;
    case 'library': return <LibraryScreen t={I} lang={lang} />;
    case 'plans': return <PlansScreen t={I} lang={lang} />;
    default: return <CoachHome I={I} lang={lang} co={co} firstName={firstName} />;
  }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [current, setCurrent] = useState('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lang = t.lang || 'es';
  const I = window.I18N[lang];
  const perspective = t.perspective;

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  // Reset to home when switching perspectives so we don't land on a missing route
  useEffect(() => {
    const clientRoutes = ['home', 'routine', 'meals', 'progress', 'calendar', 'messages', 'settings'];
    const coachRoutes  = ['home', 'clients', 'sessions', 'library', 'plans', 'messages', 'settings'];
    const valid = perspective === 'coach' ? coachRoutes : clientRoutes;
    if (!valid.includes(current)) setCurrent('home');
  }, [perspective, current]);

  const c = window.MOCK.client;
  const co = window.MOCK.coach;

  const initials = t.initials || (perspective === 'coach' ? co.initials : c.initials);
  const displayName = t.userName || (perspective === 'coach' ? co.name : 'Sofía Martín');
  const firstName = displayName.split(' ')[0];
  const tone = perspective === 'coach' ? 'b' : (c.tone || 'a');

  return (
    <div className="app">
      <Sidebar t={I} perspective={perspective} current={current}
        onNavigate={setCurrent} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className={`mobile-scrim ${drawerOpen ? 'show' : ''}`} onClick={() => setDrawerOpen(false)} />
      <TopBar
        t={I}
        perspective={perspective}
        setPerspective={(v) => setTweak('perspective', v)}
        displayName={displayName}
        initials={initials}
        tone={tone}
        theme={t.theme}
        setTheme={(v) => setTweak('theme', v)}
        lang={lang}
        setLang={(v) => setTweak('lang', v)}
        onMenu={() => setDrawerOpen(true)}
      />
      <main className="main">
        <ScreenRouter current={current} perspective={perspective}
          I={I} lang={lang} c={c} co={co} firstName={firstName} setTweak={setTweak} />
      </main>

      <TweaksPanel title="PULSE/ Tweaks">
        <TweakSection label={lang === 'es' ? 'Apariencia' : 'Appearance'}>
          <TweakRadio
            label={lang === 'es' ? 'Tema' : 'Theme'}
            value={t.theme}
            options={[{ value: 'dark', label: lang === 'es' ? 'Oscuro' : 'Dark' }, { value: 'light', label: lang === 'es' ? 'Claro' : 'Light' }]}
            onChange={(v) => setTweak('theme', v)}
          />
          <TweakRadio
            label={lang === 'es' ? 'Idioma' : 'Language'}
            value={lang}
            options={[{ value: 'es', label: 'Español' }, { value: 'en', label: 'English' }]}
            onChange={(v) => setTweak('lang', v)}
          />
        </TweakSection>
        <TweakSection label={lang === 'es' ? 'Perspectiva' : 'Perspective'}>
          <TweakRadio
            label={lang === 'es' ? 'Vista' : 'View'}
            value={perspective}
            options={[
              { value: 'client', label: lang === 'es' ? 'Cliente' : 'Client' },
              { value: 'coach',  label: lang === 'es' ? 'Coach' : 'Coach' },
            ]}
            onChange={(v) => setTweak('perspective', v)}
          />
        </TweakSection>
        <TweakSection label={lang === 'es' ? 'Usuario' : 'User'}>
          <TweakText
            label={lang === 'es' ? 'Nombre' : 'Name'}
            value={t.userName}
            onChange={(v) => {
              setTweak({
                userName: v,
                initials: v.trim().split(/\s+/).slice(0, 2).map((p) => p[0] || '').join('').toUpperCase() || 'PU',
              });
            }}
          />
          <TweakText
            label={lang === 'es' ? 'Iniciales' : 'Initials'}
            value={t.initials}
            onChange={(v) => setTweak('initials', v.toUpperCase().slice(0, 2))}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
