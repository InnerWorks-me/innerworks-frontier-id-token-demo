import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";

export default function Component() {
    const { data: session } = useSession();

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "0 auto",
            }}
        >
            <Head>
                <title>ID Token Demo</title>
            </Head>

            <h1 style={{ textAlign: "center" }}>ID Token Demo</h1>

            <p>
                This is a demo application that allows the user to login using Sign in with Google and obtain an ID
                token.
            </p>

            {session ? (
                <>
                    <div>
                        <h2 style={{ textAlign: "center" }}>ID Token</h2>

                        <div style={{ margin: "16px 0px", fontSize: "16px" }}>
                            Signed in as <b>{session.user.email}</b>
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
                            }}
                        >
                            {session.idToken}
                        </div>
                        <button
                            style={{ display: "block", margin: "16px auto", fontSize: "16px" }}
                            onClick={() => navigator.clipboard.writeText(session.idToken)}
                        >
                            Copy to Clipboard
                        </button>
                    </div>

                    <div>
                        <button
                            style={{ fontSize: "24px", display: "block", margin: "64px auto", padding: "8px 32px" }}
                            onClick={() => signOut()}
                        >
                            Sign out
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <button
                            style={{
                                width: "300px",
                                margin: "100px auto",
                                display: "block",
                                fontSize: "24px",
                                padding: "8px 32px",
                            }}
                            onClick={() => signIn()}
                        >
                            Sign in with Google
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
