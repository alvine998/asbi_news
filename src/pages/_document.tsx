import { Html, Main, NextScript, Head } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1465977632288270"
          crossOrigin="anonymous"
        ></Script>
        <ins
          className="block adsbygoogle"
          data-ad-client="ca-pub-1465977632288270"
          data-ad-slot="2260079280"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <Script>(adsbygoogle = window.adsbygoogle || []).push({});</Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
