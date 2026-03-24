import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { SectionCard } from "@/components/section-card";
import { getDemoUsers, isAuthenticated } from "@/lib/auth";

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/");
  }

  const demoUsers = getDemoUsers();

  return (
    <main className="login-shell">
      <div className="login-wrap">
        <section className="login-info">
          <span className="eyebrow">Pancardia Multisuperspecility Hospital</span>
          <h1>Secure CRM login for counseling and marketing operations</h1>
          <p>
            Is panel se admin, marketing, counselor aur content team apne role-specific workflow me
            login kar sakte hain.
          </p>
          <div className="credential-list">
            {demoUsers.map((user) => (
              <div className="credential-item" key={user.email}>
                <strong>{user.role}</strong>
                <div>{user.email}</div>
                <div>{user.password}</div>
              </div>
            ))}
          </div>
        </section>

        <SectionCard
          title="CRM Access"
          subtitle="Role-based login active hai. Demo ke liye kisi bhi provided account se login karo."
        >
          <LoginForm />
        </SectionCard>
      </div>
    </main>
  );
}
