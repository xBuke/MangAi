/* Obrazac za upit: 4 vrste (narudžba, degustacija, B2B, pokloni). Poruka se složi automatski
 * i šalje e-mailom (mailto:) ili na WhatsApp (wa.me) vinarije — bez servera i bez plaćanja. */
import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from './shop.jsx';
import { QtyStepper } from './ui.jsx';
import { scrollToId } from './fx.jsx';

const TYPES = ['order', 'visit', 'b2b', 'gift'];
const ICONS = {
  order: <path d="M9 3h6v5c0 2 3 3 3 6v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7c0-3 3-4 3-6z M9 13h6" />,
  visit: <path d="M7 3h10c0 6-2 9-5 9s-5-3-5-9z M12 12v7 M8 21h8" />,
  b2b: <path d="M4 21V9l8-5 8 5v12 M9 21v-6h6v6 M4 21h16" />,
  gift: <path d="M4 10h16v4H4z M6 14h12v7H6z M12 10v11 M12 10c-2-4-6-4-6-1 0 1 2 1 6 1zm0 0c2-4 6-4 6-1 0 1-2 1-6 1z" />
};
const today = () => new Date().toISOString().slice(0, 10);

export default function Inquiry({ winery, email, whatsapp }) {
  const { t, lines, add, site, inqType, setInqType, clear, bottles } = useShop();
  const formRef = useRef(null);
  const [f, setF] = useState({ name: '', email: '', phone: '', msg: '', city: '', date: '', people: 2, company: '', venue: 'restaurant', occasion: 'gift', amount: '', age: false });
  const [err, setErr] = useState({ key: '', field: '' });
  const [sent, setSent] = useState(null);
  const set = (k) => (e) => {
    setF((o) => ({ ...o, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
    if (err.field === k) setErr({ key: '', field: '' });
  };

  const needsWines = inqType === 'order';
  const notInList = site.products.filter((p) => !lines.find((l) => l.p.id === p.id));

  /* tekst poruke — složen na jeziku posjetitelja */
  const message = useMemo(() => {
    const out = [t('msg.hello'), t('msg.intro'), '', `${t('msg.type')}: ${t('inq.t.' + inqType)}`];
    if (inqType === 'visit') {
      if (f.date) out.push(`${t('inq.date')}: ${f.date.split('-').reverse().join('.')}`);
      out.push(`${t('inq.people')}: ${f.people}`);
    }
    if (inqType === 'b2b') {
      if (f.company) out.push(`${t('inq.company')}: ${f.company}`);
      out.push(`${t('inq.venue')}: ${t('inq.v.' + f.venue)}`);
    }
    if (inqType === 'gift') {
      out.push(`${t('inq.occasion')}: ${t('inq.o.' + f.occasion)}`);
      if (f.date) out.push(`${t('inq.date')}: ${f.date.split('-').reverse().join('.')}`);
      if (f.amount) out.push(`${t('inq.amount')}: ${f.amount}`);
    }
    if ((inqType === 'order' || inqType === 'b2b' || inqType === 'gift') && lines.length) {
      out.push('', t('inq.wines') + ':');
      lines.forEach((l) => out.push(`- ${l.p.name}: ${bottles(l.q)}`));
    }
    if (inqType === 'order' && f.city) out.push(`${t('inq.city')}: ${f.city}`);
    if (f.msg.trim()) out.push('', f.msg.trim());
    out.push('', `${f.name}`);
    if (f.email) out.push(f.email);
    if (f.phone) out.push(f.phone);
    out.push('', t('msg.bye'));
    return out.join('\n');
  }, [t, inqType, f, lines, bottles]);

  function validate() {
    const fail = (key, field) => {
      setErr({ key, field });
      const el = field && formRef.current && formRef.current.querySelector(`[name="${field}"]`);
      if (el) el.focus();
      return false;
    };
    if (needsWines && !lines.length) return fail('inq.err.wines', '');
    if (inqType === 'visit' && !f.date) return fail('inq.err.date', 'date');
    if (inqType === 'b2b' && f.company.trim().length < 2) return fail('inq.err.company', 'company');
    if (f.name.trim().length < 3) return fail('inq.err.name', 'name');
    if (!f.email.trim() && f.phone.replace(/\D/g, '').length < 6) return fail('inq.err.contact', 'email');
    if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) return fail('inq.err.email', 'email');
    if (inqType !== 'visit' && !f.age) return fail('inq.err.age', 'age');
    setErr({ key: '', field: '' });
    return true;
  }

  const subject = `${t('inq.kicker')} — ${t('inq.t.' + inqType)} — ${f.name.trim()}`;
  const mailHref = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  function send(via) {
    if (!validate()) return;
    if (via === 'mail') window.location.href = mailHref;
    else window.open(waHref, '_blank', 'noopener');
    setSent(via);
  }

  const inv = (name) => (err.field === name ? ' invalid' : '');

  return (
    <section className="inq" id="upit" aria-labelledby="inq-title">
      <div className="inq-head">
        <p className="kicker">{t('inq.kicker')}</p>
        <h2 id="inq-title">{t('inq.title')}</h2>
        <p className="inq-lead">{t('inq.lead')}</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="ok" className="inq-ok" role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <motion.div className="inq-tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><motion.path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.4 }} /></svg>
            </motion.div>
            <h3>{t('inq.ok.title')}</h3>
            <p>{t(sent === 'mail' ? 'inq.ok.mail' : 'inq.ok.wa')}</p>
            <p><a href={sent === 'mail' ? mailHref : waHref} target={sent === 'mail' ? undefined : '_blank'} rel="noopener">{t('inq.ok.again')}</a></p>
            <div className="inq-ok-btns">
              <button type="button" className="btn btn-main" onClick={() => setSent(null)}>{t('inq.ok.new')}</button>
              {lines.length > 0 && <button type="button" className="btn btn-line" onClick={() => { clear(); setSent(null); }}>{t('inq.ok.clear')}</button>}
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" ref={formRef} className="inq-form" noValidate onSubmit={(e) => { e.preventDefault(); send('mail'); }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <fieldset className="inq-types">
              <legend>{t('inq.type')}</legend>
              {TYPES.map((k) => (
                <label key={k} className={'inq-type' + (inqType === k ? ' on' : '')}>
                  <input type="radio" name="type" value={k} checked={inqType === k} onChange={() => { setInqType(k); setErr({ key: '', field: '' }); }} />
                  {inqType === k && <motion.span layoutId="inq-pill" className="inq-pill" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">{ICONS[k]}</svg>
                  <span>{t('inq.t.' + k)}</span>
                </label>
              ))}
            </fieldset>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={inqType} className="inq-specific" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <p className="inq-desc">{t('inq.d.' + inqType)}</p>

                {inqType === 'visit' && (
                  <div className="inq-row">
                    <label className={'fld' + inv('date')}><span>{t('inq.date')} *</span><input type="date" name="date" min={today()} value={f.date} onChange={set('date')} /></label>
                    <label className="fld"><span>{t('inq.people')}</span><input type="number" name="people" min="1" max="60" value={f.people} onChange={set('people')} /></label>
                  </div>
                )}
                {inqType === 'b2b' && (
                  <div className="inq-row">
                    <label className={'fld' + inv('company')}><span>{t('inq.company')} *</span><input name="company" autoComplete="organization" value={f.company} onChange={set('company')} /></label>
                    <label className="fld"><span>{t('inq.venue')}</span>
                      <select name="venue" value={f.venue} onChange={set('venue')}>
                        {['restaurant', 'wineshop', 'hotel', 'shop', 'other'].map((v) => <option key={v} value={v}>{t('inq.v.' + v)}</option>)}
                      </select>
                    </label>
                  </div>
                )}
                {inqType === 'gift' && (
                  <div className="inq-row inq-row-3">
                    <label className="fld"><span>{t('inq.occasion')}</span>
                      <select name="occasion" value={f.occasion} onChange={set('occasion')}>
                        {['gift', 'wedding', 'corporate', 'other'].map((v) => <option key={v} value={v}>{t('inq.o.' + v)}</option>)}
                      </select>
                    </label>
                    <label className="fld"><span>{t('inq.date')}</span><input type="date" name="date" min={today()} value={f.date} onChange={set('date')} /></label>
                    <label className="fld"><span>{t('inq.amount')}</span><input name="amount" value={f.amount} onChange={set('amount')} /></label>
                  </div>
                )}

                {inqType !== 'visit' && (
                  <div className={'inq-wines' + (needsWines && err.key === 'inq.err.wines' ? ' invalid' : '')}>
                    <p className="inq-label">{t('inq.wines')}{needsWines ? ' *' : ''}</p>
                    <AnimatePresence initial={false}>
                      {lines.map((l) => (
                        <motion.div key={l.p.id} className="inq-wine" layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <span className="iw-name">{l.p.name}</span>
                          <QtyStepper id={l.p.id} q={l.q} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {notInList.length > 0 && (
                      <div className="inq-chips">
                        <span>{lines.length ? t('inq.wines.more') : t('inq.wines.empty')}</span>
                        {notInList.map((p) => <button key={p.id} type="button" className="chip" onClick={() => add(p.id)}>+ {p.name}</button>)}
                      </div>
                    )}
                    {inqType === 'order' && (
                      <label className="fld"><span>{t('inq.city')}</span><input name="city" autoComplete="address-level2" value={f.city} onChange={set('city')} /></label>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="inq-row inq-row-3">
              <label className={'fld' + inv('name')}><span>{t('inq.name')} *</span><input name="name" autoComplete="name" value={f.name} onChange={set('name')} /></label>
              <label className={'fld' + inv('email')}><span>{t('inq.email')}</span><input name="email" type="email" autoComplete="email" value={f.email} onChange={set('email')} /></label>
              <label className="fld"><span>{t('inq.phone')}</span><input name="phone" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} /></label>
            </div>
            <label className="fld"><span>{t('inq.msg')}</span><textarea name="msg" rows="4" placeholder={t('inq.msg.ph')} value={f.msg} onChange={set('msg')} /></label>
            {inqType !== 'visit' && (
              <label className={'inq-check' + inv('age')}><input type="checkbox" name="age" checked={f.age} onChange={set('age')} /><span>{t('inq.age')}</span></label>
            )}

            <p className="inq-err" role="alert">{err.key ? t(err.key) : ''}</p>

            <div className="inq-send">
              <span className="inq-via">{t('inq.via')}</span>
              <button type="submit" className="btn btn-main inq-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M3 6h18v12H3z M3 7l9 7 9-7" /></svg>
                {t('inq.mail')}
              </button>
              <button type="button" className="btn btn-wa inq-btn" onClick={() => send('wa')}>
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.4-.3z" /></svg>
                {t('inq.wa')}
              </button>
            </div>
            <details className="inq-preview">
              <summary>{t('inq.preview')}</summary>
              <pre>{message}</pre>
              <p className="inq-to">{winery} · {email} · +{whatsapp}</p>
            </details>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}

export function openInquiry(setInqType, type) {
  setInqType(type);
  scrollToId('upit');
}
