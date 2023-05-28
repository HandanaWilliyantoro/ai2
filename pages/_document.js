import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      <script type="text/javascript"
        src={process.env.MIDTRANS_PRODUCTION_ENV === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"}
        data-client-key={process.env.MIDTRANS_CLIENT_KEY} 
      />
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-10945532713"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments)}
        gtag('js', new Date());

        gtag('config', 'AW-10945532713');
      </script>
    </Html>
  )
}
