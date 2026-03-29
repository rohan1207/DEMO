import React from 'react';

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12 lg:py-12 pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8 md:p-10 lg:p-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7FAF73] sm:text-xs sm:tracking-[0.24em]">
          Contact Us
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
          Let&apos;s connect
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">
          For order support, returns, product information, or bulk enquiries, our team is here to help.
        </p>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:space-y-6 sm:p-6 md:p-7">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                Support Email
              </p>
              <a
                className="mt-1.5 inline-block break-all text-base font-medium text-slate-900 underline-offset-2 hover:text-[#5f8f57] sm:mt-2 sm:text-lg"
                href="mailto:customercare@trexstore.in"
              >
                customercare@trexstore.in
              </a>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                Phone
              </p>
              <a
                className="mt-1.5 inline-block text-base font-medium text-slate-900 sm:mt-2 sm:text-lg"
                href="tel:+9100000000000"
              >
                +91-00000-00000
              </a>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                Address
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700 sm:mt-2 sm:text-base">
                T-REX
                <br />
                B3+4, Navswarajya Housing Society
                <br />
                Paud Road, Kothrud, Pune – 411 038
              </p>
            </div>
          </div>

          <form
            className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:space-y-4 sm:p-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              name="name"
              placeholder="Full name"
              autoComplete="name"
              className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#7FAF73] sm:min-h-0"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#7FAF73] sm:min-h-0"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              autoComplete="tel"
              inputMode="tel"
              className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#7FAF73] sm:min-h-0"
            />
            <textarea
              name="message"
              rows={5}
              placeholder="How can we help you?"
              className="w-full max-h-[min(40vh,280px)] min-h-[140px] resize-y rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#7FAF73] sm:max-h-none sm:min-h-[160px]"
            />
            <button
              type="submit"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#7FAF73] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#6fa064] sm:w-auto sm:tracking-[0.18em]"
            >
              Send message
            </button>
            <p className="text-center text-[11px] text-slate-500 sm:text-left sm:text-xs">
              We usually respond within 24 business hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
