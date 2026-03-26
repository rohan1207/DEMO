import React from 'react';

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7FAF73]">Contact Us</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">
          Let&apos;s connect
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          For order support, returns, product information, or bulk enquiries, our team is here to help.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Support Email</p>
              <a className="mt-1 inline-block text-lg font-medium text-slate-900 hover:text-[#5f8f57]" href="mailto:customercare@trexstore.in">
                customercare@trexstore.in
              </a>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Phone</p>
              <p className="mt-1 text-lg font-medium text-slate-900">+91-00000-00000</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Address</p>
              <p className="mt-1 text-slate-700">
                T-REX
                <br />
                B3+4, Navswarajya Housing Society
                <br />
                Paud Road, Kothrud, Pune – 411 038
              </p>
            </div>
          </div>

          <form className="space-y-4 rounded-2xl border border-slate-200 p-6">
            <input
              type="text"
              placeholder="Full name"
              autoComplete="name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7FAF73]"
            />
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7FAF73]"
            />
            <input
              type="tel"
              placeholder="Phone number"
              autoComplete="tel"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7FAF73]"
            />
            <textarea
              rows={5}
              placeholder="How can we help you?"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7FAF73]"
            />
            <button
              type="button"
              className="inline-flex rounded-full bg-[#7FAF73] px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#6fa064]"
            >
              Send Message
            </button>
            <p className="text-xs text-slate-500">We usually respond within 24 business hours.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
