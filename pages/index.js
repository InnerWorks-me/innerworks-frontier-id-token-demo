import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";

export default function Component() {
    const { data: session } = useSession();

    return (
        <>
            <Head>
                <title>Sign in with Google</title>
            </Head>
            <h1>Sign in with Google</h1>

            {session ? (
                <>
                    <div>Signed in as {session.user.email}</div>

                    <div>
                        <h2>OIDC token</h2>
                        <pre>{session.idToken}</pre>
                        <button onClick={() => navigator.clipboard.writeText(session.idToken)}>copy</button>
                    </div>

                    <div>
                        <h3>Sign Out</h3>
                        <button onClick={() => signOut()}>Sign out</button>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <button onClick={() => signIn()}>Sign in</button>
                    </div>
                </>
            )}
        </>
    );
}
