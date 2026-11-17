"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      const { error } = await createSupabaseBrowserClient().auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) throw error;
      setMessage("Check your email to verify your account.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "We couldn’t create your account."); }
  }

  return <main className="auth-page"><div className="auth-card"><p className="eyebrow">Join SmartCart Africa</p><h1>Make everyday shopping simpler.</h1><form onSubmit={submit}><label>Full name<input required value={name} onChange={(event) => setName(event.target.value)} /></label><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label>{message && <p className="form-message" role="status">{message}</p>}<button className="button button-dark" type="submit">Create account</button></form><p className="auth-foot">Already registered? <Link href="/auth/login">Sign in</Link></p></div></main>;
}
