'use client';

import Script from 'next/script';

interface JotFormProps {
  formId: string;
  title?: string;
  urlParams?: Record<string, string>;
  height?: string;
}

export function JotForm({ formId, title = 'Form', urlParams, height = '85vh' }: JotFormProps) {
  // Build the URL with query parameters if provided
  const baseUrl = `https://form.jotform.com/${formId}`;
  const queryString = urlParams ? '?' + new URLSearchParams(urlParams).toString() : '';
  const formUrl = baseUrl + queryString;

  // Generate unique IDs for this form instance
  const iframeId = `JotFormIFrame-${formId}`;
  const scriptId = `jotform-handler-${formId}`;

  return (
    <>
      <div className="@container/main h-full min-h-[80vh]">
        <div className="w-full h-full">
          <iframe
            id={iframeId}
            title={title}
            onLoad={() => window.parent.scrollTo(0, 0)}
            allowTransparency={true}
            allow="geolocation; microphone; camera; fullscreen; payment"
            src={formUrl}
            frameBorder={0}
            style={{
              width: '100%',
              height,
              border: 'none',
            }}
            scrolling="auto"
          />
        </div>
      </div>

      <Script src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js" />
      <Script id={scriptId}>
        {`window.jotformEmbedHandler("iframe[id='${iframeId}']", "https://form.jotform.com/")`}
      </Script>
    </>
  );
}
