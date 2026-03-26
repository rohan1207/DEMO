import React from 'react';

export default function PolicyPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Cancellation & Returns Policy</h1>
      <p className="mt-3 text-sm text-slate-500">Last updated: March 24, 2026</p>

      <div className="mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Cancellation Policy</h2>
          <p className="mt-3 leading-7 text-slate-700">
            If you have accidentally placed an order and would like to cancel it before the order is
            shipped, write to our customer support team at
            {' '}
            <a className="text-[#5f8f57] underline" href="mailto:customercare@trexstore.in">
              customercare@trexstore.in
            </a>
            {' '}
            or call us on +91-00000-00000. The order will be cancelled and the refund will be initiated
            within 24-48 business hours after the cancellation request.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">Returns Policy</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-slate-700">
            <li>All return requests must be placed on the website within 7 days from the date of delivery.</li>
            <li>The items must be returned with their original packaging in undamaged condition.</li>
            <li>Images of the invoice, product, and packaging must be uploaded when raising a return request.</li>
            <li>In case you receive a defective or damaged item, we will replace it at no additional cost.</li>
            <li>
              For defective or damaged items, invoice image, clearly visible damage image, and packaging image
              must be uploaded when raising the request.
            </li>
            <li>
              The item will be picked up by our logistics partner and handed over to our warehouse. Replacement
              or refund will be initiated thereafter.
            </li>
            <li>The refund can take up to 15 days after the product is received by us.</li>
            <li>
              In case you receive an incorrect or incomplete order, contact
              {' '}
              <a className="text-[#5f8f57] underline" href="mailto:customercare@trexstore.in">
                customercare@trexstore.in
              </a>
              {' '}
              or +91-00000-00000 within 72 hours of receiving the order.
            </li>
            <li>
              The following are ineligible for returns:
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Damages due to misuse or usage.</li>
                <li>Products with tampered packaging or product label.</li>
                <li>Any defect or damage not covered under warranty.</li>
                <li>Incidental damage.</li>
                <li>Products returned without original packaging and all components.</li>
                <li>Products returned in a condition different from how they were received.</li>
                <li>Requests made after 7 days of delivery.</li>
              </ul>
            </li>
            <li>The above policy is solely at the discretion of the T-REX Store.</li>
            <li>Personalized items cannot be returned or replaced.</li>
          </ol>
          <p className="mt-4 leading-7 text-slate-700">
            The T-REX Store reserves the right to alter and enforce this Return and Refund Policy at any time
            without prior notice.
          </p>
        </div>
      </div>
    </section>
  );
}
