import { useState } from 'react'
import { Mail, MessageCircle, Phone, Wrench } from 'lucide-react'
import PageHero from '../components/PageHero'
import { FAQ } from '../components/Sections'
import { contact } from '../data'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const cards = [
    { Icon: Phone, t: 'Sales', v: contact.sales, href: `tel:${contact.sales.replace(/\s/g, '')}` },
    { Icon: Wrench, t: 'Service', v: contact.service, href: `tel:${contact.service.replace(/\s/g, '')}` },
    { Icon: MessageCircle, t: 'WhatsApp', v: 'Chat with us', href: `https://wa.me/${contact.whatsapp}` },
    { Icon: Mail, t: 'Email', v: contact.email, href: `mailto:${contact.email}` },
  ]
  return (
    <>
      <PageHero eyebrow="Contact" title="Tell us what your factory needs to run." crumbs={[{ label: 'Contact' }]}
        text="Share the application, pressure, working hours and current problems. We’ll recommend the next practical step." />
      <section className="section !pt-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {cards.map(({ Icon, t, v, href }) => (
              <a key={t} href={href} className="glass glass-hover flex items-center gap-4 rounded-3xl p-5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-flame/15 text-flame"><Icon size={22} /></span>
                <span><span className="block text-xs uppercase tracking-wider text-fg-4">{t}</span><span className="font-semibold text-fg">{v}</span></span>
              </a>
            ))}
          </div>
          <div className="glass rounded-[2rem] p-7 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-fg">Request a quote</h2>
            {sent ? (
              <p className="mt-6 rounded-2xl bg-fg/5 p-5 text-sm text-fg-2">Thank you — we'll get back to you shortly.</p>
            ) : (
              <form className="mt-6 space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true) /* TODO: connect to backend / WhatsApp */ }}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required className="input" placeholder="Name" />
                  <input required type="tel" className="input" placeholder="Phone" />
                </div>
                <input className="input" placeholder="Company" />
                <textarea rows={5} className="input" placeholder="Application, pressure, working hours, current problems…" />
                <button className="btn btn-primary w-full sm:w-auto">Send request</button>
              </form>
            )}
          </div>
        </div>
      </section>
      <FAQ />
    </>
  )
}
