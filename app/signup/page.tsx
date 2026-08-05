import { SignupForm } from '@/components/auth/forms/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-success/10 blur-[140px] rounded-full animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 blur-[140px] rounded-full animate-blob animate-delay-300" />
      </div>

      <div className="relative z-10 w-full">
        <SignupForm />
      </div>
    </div>
  );
}
