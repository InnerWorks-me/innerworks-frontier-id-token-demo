import Head from "next/head";

export default function Privacy() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
      }}>
      <Head>
        <title>ID Token Demo</title>
      </Head>

      <h1 style={{ textAlign: "center" }}>ID Token Demo</h1>
      <p>
        This is a simple application designed to demonstrate the use of OIDC Id tokens for authentication to the
        Fr0ntierX Wallet API.
      </p>
      <p>
        In order to test the Wallet API, you can sign in with one of the listed login methods. After signing in you will
        be able to see and copy your Id token. You will also be logged in into the Wallet API and see your corresponding
        wallet address.
      </p>
      <p>
        The source code of this application is available on GitHub{" "}
        <a href="https://github.com/Fr0ntierX/id-token-demo" style={{ color: "blue" }}>
          here
        </a>
      </p>
      <p>
        <a
          style={{
            width: "300px",
            margin: "100px auto",
            display: "block",
            fontSize: "24px",
            padding: "12px 32px",
            background: "#eee",
            textAlign: "center",
          }}
          href="/">
          Sign in
        </a>
      </p>

      <footer
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          margin: "8px auto",
          width: "100%",
          textAlign: "center",
          fontSize: "14px",
          color: "#999",
        }}>
        <a href="/privacy">Privacy Policy</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="/terms">Terms & Conditions</a>
      </footer>
    </div>
  );
}
