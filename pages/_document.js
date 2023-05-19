import { Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <body>
        <Main />
        <NextScript />
      </body>
      <script type="text/javascript"
        src={process.env.MIDTRANS_PRODUCTION_ENV === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"}
        data-client-key={process.env.MIDTRANS_CLIENT_KEY} 
      />
    </Html>
  )
}
