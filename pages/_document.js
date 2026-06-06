import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Chatbot entretien RLH interactif - Fratries" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
