import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en-us">
        <Head>
          <link
            rel="preload"
            href="/fonts/upheavaltt/UpheavalTT-BRK-.ttf"
            as="font"
            crossOrigin=""
          />
          <meta
            name="description"
            content="A study app for usage of fp-ts library."
          ></meta>
        </Head>
        <body>
          <main>
            <Main />
          </main>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
