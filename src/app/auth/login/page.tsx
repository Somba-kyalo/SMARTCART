"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      const { error } = await createSupabaseBrowserClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = "/account";
    } catch (error) { setMessage(error instanceof Error ? error.message : "We couldn’t sign you in."); }
  }

  return <main className="auth-page"><div className="auth-card"><p className="eyebrow">Welcome back</p><h1>Sign in to your account.</h1><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label>{message && <p className="form-error" role="alert">{message}</p>}<button className="button button-dark" type="submit">Sign in</button></form><p className="auth-foot">New here? <Link href="/auth/signup">Create an account</Link></p></div></main>;
}
