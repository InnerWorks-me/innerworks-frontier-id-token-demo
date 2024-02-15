"use client";

import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { InnerworksAuth } from "@innerworks-me/iw-auth-sdk";

export default function Home() {
  const [idToken, setIdToken] = useState("");
  const [walletData, setWalletData] = useState({});

  const buttonContainerRef = useRef(null);

  const refreshToken = async (refreshToken) => {
    console.log("refresh!");
    try {
      const res = await fetch(`https://api.qa.innerworks.me/api/v1/innerworks/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "projectId" : process.env.NEXT_PUBLIC_INNERWORKS_PROJECT_ID,
          "grant_type" : "refresh_token",
          "refresh_token" : refreshToken
        }),
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

  // Set up innerworks sign in button
  useEffect(() => {
    if(process.env.NEXT_PUBLIC_INNERWORKS_PROJECT_ID && process.env.NEXT_PUBLIC_INNERWORKS_REDIRECT_URL) {
      const iwAuth = new InnerworksAuth(
        process.env.NEXT_PUBLIC_INNERWORKS_PROJECT_ID,
        process.env.NEXT_PUBLIC_INNERWORKS_REDIRECT_URL
      );
      if(buttonContainerRef) {
        const button = iwAuth.getInnerworksSignInButton();
        buttonContainerRef.current.appendChild(button);
      }
    }
  }, []);

  // Set id token from url params
  useEffect(() => {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    const idParam = urlParams.get('id');
    const refreshParam = urlParams.get('refresh');
    if (idParam) {
      setIdToken(idParam);
      localStorage.setItem("id_token", idParam);
    }
    if (refreshParam) {
      localStorage.setItem("refresh_token", refreshParam);
    }
  }, []);

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
            <a ref={buttonContainerRef}>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
