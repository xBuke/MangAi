/* Simulirani Stripe Checkout (demo): 4242… prolazi, 4000 0000 0000 0002 je odbijena, 18+ obavezno. */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useShop } from './shop.jsx';
import Bottle from './Bottle.jsx';
import './checkout.css';

function luhn(num) {
  let s = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = +num[i];
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    s += n; alt = !alt;
  }
  return s % 10 === 0;
}

export default function Checkout({ merchant }) {
  const { lines, subtotal, shipping, money, t, L, lang, setLang, clear, site } = useShop();
  const [paid, setPaid] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const formRef = useRef(null);
  const okRef = useRef(null);

  useEffect(() => { document.body.className = 'co'; }, []);
  useEffect(() => { document.title = merchant + ' — ' + (lang === 'hr' ? 'plaćanje' : 'checkout'); }, [lang, merchant]);
  useEffect(() => { if (paid && okRef.current) okRef.current.focus(); }, [paid]);

  const total = subtotal + shipping;

  function onSubmit(e) {
    e.preventDefault();
    setError('');
    const form = formRef.current;
    form.querySelectorAll('.invalid').forEach((x) => x.classList.remove('invalid'));
    const f = form.elements;
    const fail = (el, key) => { if (el) { el.classList.add('invalid'); el.focus(); } setError(t(key)); };
    if (!/^\S+@\S+\.\S+$/.test(f.email.value)) return fail(f.email, 'co.err.email');
    if (f.name.value.trim().length < 3) return fail(f.name, 'co.err.name');
    if (f.address.value.trim().length < 4) return fail(f.address, 'co.err.address');
    if (!/^\d{5}$/.test(f.zip.value.trim())) return fail(f.zip, 'co.err.zip');
    if (f.city.value.trim().length < 2) return fail(f.city, 'co.err.city');
    const num = card.replace(/\s/g, '');
    if (num.length < 15 || !luhn(num)) return fail(f.card, 'co.err.card');
    const m = exp.replace(/\D/g, '');
    const mm = +m.slice(0, 2), yy = +m.slice(2);
    const now = new Date(), cy = now.getFullYear() % 100, cm = now.getMonth() + 1;
    if (m.length !== 4 || mm < 1 || mm > 12 || yy < cy || (yy === cy && mm < cm)) return fail(f.exp, 'co.err.exp');
    if (cvc.length < 3) return fail(f.cvc, 'co.err.cvc');
    if (!f.age.checked) return fail(f.age, 'co.err.age');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (num === '4000000000000002') return fail(f.card, 'co.err.declined');
      const orderNo = site.orderPrefix + '-' + String(Date.now() % 100000).padStart(5, '0');
      setPaid({ orderNo, email: f.email.value, total });
      clear();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1600);
  }

  const shownTotal = paid ? paid.total : total;

  return (
    <>
      <section className="co-left" aria-labelledby="co-sum-title">
        <div className="co-left-in">
          <div className="co-top">
            <a href="index.html#vina" aria-label={t('co.back')}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="co-merchant">{merchant}</span>
            </a>
            <span className="co-test">{t('co.test')}</span>
            <div className="co-lang" role="group" aria-label={t('lang.aria')}>
              {['hr', 'en'].map((l) => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
            </div>
          </div>
          <p className="co-label" id="co-sum-title">{t('co.pay.to')} {merchant}</p>
          <p className="co-big">{money(shownTotal)}</p>
          <div>
            {lines.map((l) => (
              <motion.div key={l.p.id} className="co-line" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="co-thumb"><Bottle p={l.p} font={site.labelFont} sub={site.labelSub} /><span className="co-q">{l.q}</span></div>
                <div><strong>{l.p.name}</strong><span>{L(l.p.kind)} · {l.p.vol}</span></div>
                <div className="co-lp">{money(l.q * l.p.price)}</div>
              </motion.div>
            ))}
          </div>
          {!paid && (
            <div className="co-sum">
              <div><span>{t('co.subtotal')}</span><span>{money(subtotal)}</span></div>
              <div><span>{t('co.shipping')}</span><span>{shipping === 0 ? t('cart.free') : money(shipping)}</span></div>
              <div className="co-tot"><span>{t('co.total')}</span><span>{money(total)}</span></div>
            </div>
          )}
          <p className="co-foot">{t('demo.bar')}</p>
        </div>
      </section>

      <main className="co-right">
        <div className="co-right-in">
          <AnimatePresence mode="wait">
            {paid ? (
              <motion.div key="ok" className="co-success" tabIndex={-1} ref={okRef}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <motion.div className="tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><motion.path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.4 }} /></svg>
                </motion.div>
                <h1>{t('co.ok.title')}</h1>
                <p>{t('co.ok.text')}: <strong>{paid.orderNo}</strong></p>
                <p>{t('co.ok.mail')} <strong>{paid.email}</strong></p>
                <p>{t('co.ok.next')}</p>
                <a href="index.html">{t('co.ok.back')}</a>
              </motion.div>
            ) : !lines.length ? (
              <div key="empty" className="co-empty">
                <p>{t('co.empty')}</p>
                <a href="index.html#vina">{t('co.back')}</a>
              </div>
            ) : (
              <motion.form key="form" ref={formRef} noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2>{t('co.contact')}</h2>
                <div className="co-field"><input name="email" type="email" autoComplete="email" placeholder={t('co.email')} aria-label={t('co.email')} required /></div>
                <h2>{t('co.shipTo')}</h2>
                <div className="co-field">
                  <input name="name" autoComplete="name" placeholder={t('co.name')} aria-label={t('co.name')} required />
                  <input name="address" autoComplete="street-address" placeholder={t('co.address')} aria-label={t('co.address')} required />
                  <div className="co-row">
                    <input name="zip" inputMode="numeric" autoComplete="postal-code" placeholder={t('co.zip')} aria-label={t('co.zip')} required />
                    <input name="city" autoComplete="address-level2" placeholder={t('co.city')} aria-label={t('co.city')} required />
                  </div>
                  <input name="phone" type="tel" autoComplete="tel" placeholder={t('co.phone')} aria-label={t('co.phone')} />
                </div>
                <h2>{t('co.card')}</h2>
                <div className="co-field">
                  <input name="card" inputMode="numeric" autoComplete="cc-number" placeholder="1234 1234 1234 1234" aria-label={t('co.cardNo')} required
                    value={card} onChange={(e) => setCard(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} />
                  <div className="co-row">
                    <input name="exp" inputMode="numeric" autoComplete="cc-exp" placeholder={t('co.exp')} aria-label={t('co.exp')} required
                      value={exp} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setExp(v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v); }} />
                    <input name="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" aria-label="CVC" required
                      value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} />
                  </div>
                </div>
                <div className="co-hint">{t('co.hint')}<br />
                  <button type="button" onClick={() => { setCard('4242 4242 4242 4242'); setExp('12 / 34'); setCvc('123'); }}>{t('co.fill')}</button>
                </div>
                <label className="co-check"><input type="checkbox" name="age" /><span>{t('co.age')}</span></label>
                <p className="co-error" role="alert">{error}</p>
                <button className={'co-pay' + (loading ? ' loading' : '')} type="submit" disabled={loading}>{t('co.payBtn')} {money(total)}</button>
                <p className="co-secure"><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M2 6V4a4 4 0 0 1 8 0v2h1v8H1V6zm2 0h4V4a2 2 0 0 0-4 0z" fill="currentColor" /></svg>{t('co.secure')}</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
