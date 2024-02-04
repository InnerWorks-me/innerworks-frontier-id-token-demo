"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const router = useRouter();

  const [codeVerifier, setCodeVerifier] = useState(undefined);
  const [idToken, setIdToken] = useState("");
  const [walletData, setWalletData] = useState({});

  const refreshToken = async (refreshToken) => {
    try {
      const res = await fetch(`https://oauth2.googleapis.com/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`,
      });

      const data = await res.json();

      if (data.id_token) {
        setIdToken(data.id_token);
        localStorage.setItem("id_token", data.id_token);
      }
    } catch (err) {
      throw err;
    }
  };

  // Fetch ID token from local storage
  useEffect(() => {
    (async () => {
      const storedIdToken = localStorage.getItem("id_token");

      if (storedIdToken) {
        try {
          const decodedToken = jwtDecode(storedIdToken);
          const isTokenExpired = decodedToken.exp * 1000 < Date.now();

          if (!isTokenExpired) {
            setIdToken(storedIdToken);
          } else {
            await refreshToken(localStorage.getItem("refresh_token"));
          }
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, []);

  // Create the code verifier
  useEffect(() => {
    const codeVerifierFromSession = sessionStorage.getItem("code_verifier");

    if (codeVerifierFromSession) {
      setCodeVerifier(codeVerifierFromSession);
      return;
    }

    const codeVerifierValue = Math.random().toString(36).slice(-8);

    sessionStorage.setItem("code_verifier", codeVerifierValue);
    setCodeVerifier(codeVerifierValue);
  }, []);

  // Exchange auth code for ID token
  useEffect(() => {
    (async () => {
      if (router.isReady && router.query.code && !idToken) {
        const code = router.query.code;

        const params = new URLSearchParams();
        params.append("code", code);
        params.append("client_id", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
        params.append("client_secret", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET);
        params.append("redirect_uri", window.location.origin);
        params.append("grant_type", "authorization_code");
        params.append("code_verifier", codeVerifier);

        const { data } = await axios.post("https://oauth2.googleapis.com/token", params);

        router.replace("/", undefined, { shallow: true });

        setIdToken(data.id_token);
        localStorage.setItem("id_token", data.id_token);
        localStorage.setItem("refresh_token", data.refresh_token);
      }
    })();
  }, [router]);

  // Sample wallet API call
  useEffect(() => {
    (async () => {
      if (idToken) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_WALLET_API_URL}/account`,
            {},
            {
              headers: {
                authorization: `Bearer ${idToken}`,
                ["x-api-key"]: process.env.NEXT_PUBLIC_WALLET_API_KEY,
              },
            }
          );
          setWalletData(data);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [idToken]);

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

      <p>This is a demo application that allows the user to login using Sign in with Google and obtain an ID token.</p>

      {idToken ? (
        <>
          <div>
            <h2 style={{ textAlign: "center" }}>ID Token</h2>

            <div style={{ margin: "20px 0px" }}>
              Signed in as <b>{walletData.userIdentifier}</b> <br />
              Ethereum address <b style={{ fontFamily: "monospace", fontSize: "15px" }}>{walletData.ethereumAddress}</b>
            </div>

            <div
              style={{
                border: "1px solid #999",
                padding: "16px",
                backgroundColor: "#eee",
                width: "100%",
                overflow: "auto",
                wordWrap: "break-word",
                fontFamily: "monospace",
                fontSize: "16px",
              }}>
              {idToken}
            </div>
            <button
              style={{
                display: "block",
                margin: "16px auto",
                fontSize: "16px",
              }}
              onClick={() => navigator.clipboard.writeText(idToken)}>
              Copy to Clipboard
            </button>
          </div>

          <div>
            <button
              style={{
                fontSize: "24px",
                display: "block",
                margin: "64px auto",
                padding: "8px 32px",
              }}
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}>
              Sign out
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
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
              href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${
                process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
              }&redirect_uri=${
                typeof window !== "undefined" ? window.location.origin : ""
              }&response_type=code&scope=profile%20email&state=1234567890&access_type=offline&code_challenge=${codeVerifier}&code_challenge_method=plain&prompt=consent`}>
              Sign in with Google
            </a>
          </div>
        </>
      )}
    </div>
  );
}
