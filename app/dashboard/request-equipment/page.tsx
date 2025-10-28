'use client';

import Script from 'next/script';

export default function Page() {
  return (
    <div className="@container/main h-full min-h-[80vh]">
      <div className="w-full h-full">
        <iframe
          id="JotFormIFrame-252806991289270"
          title="Equipment Request Form"
          onLoad={() => window.parent.scrollTo(0, 0)}
          allowTransparency={true}
          allow="geolocation; microphone; camera; fullscreen; payment"
          src="https://form.jotform.com/252806991289270"
          frameBorder={0}
          style={{
            width: '100%',
            height: '85vh',
            border: 'none',
          }}
          scrolling="auto"
        />
      </div>

      <Script src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js" />
      <Script id="jotform-handler">
        {`window.jotformEmbedHandler("iframe[id='JotFormIFrame-252806991289270']", "https://form.jotform.com/")`}
      </Script>
    </div>
  );
}
