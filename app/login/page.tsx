'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'rt' | 'sekretaris' | 'bendahara' | 'warga'>('rt');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(phone, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Login gagal. Periksa kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo auto-fill
  const loadDemo = (role: string) => {
    switch (role) {
      case 'rt':
        setPhone('+62812345678');
        break;
      case 'bendahara':
        setPhone('+62823456789');
        break;
      case 'sekretaris':
        setPhone('+62834567890');
        break;
      case 'warga':
        setPhone('1234567890123'); // KK number
        break;
    }
    setPassword('password');
    setSelectedRole(role as any);
  };

  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-surface">
      {/* Left Side: Immersive Illustration Content */}
      <section className="hidden lg:flex w-7/12 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000&auto=format&fit=crop"
            alt="Community Unity" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-xl">
          <h1 className="font-headline text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Cultivate your community&apos;s <span className="text-secondary-container">digital sanctuary.</span>
          </h1>
          <p className="text-primary-fixed text-lg font-light leading-relaxed mb-8">
            Welcome to Civic Hub, where administration meets elegance. Manage neighborhood logistics, financial growth, and community welfare with precision.
          </p>
          <div className="flex gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary object-cover bg-cyan-200" />
              <div className="w-10 h-10 rounded-full border-2 border-primary object-cover bg-amber-200" />
              <div className="w-10 h-10 rounded-full border-2 border-primary object-cover bg-emerald-200" />
            </div>
            <div className="text-white">
              <span className="block font-bold text-sm">Joined by 1,200+ citizens</span>
              <span className="text-primary-fixed text-xs">Managing 45 local sub-districts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form Canvas */}
      <main className="w-full lg:w-5/12 flex flex-col items-center justify-center p-6 bg-surface overflow-y-auto">
        <div className="w-full max-w-md my-auto flex flex-col pt-8">
          {/* Branding Header */}
          <div className="mb-10 flex flex-col items-start">
            <div className="w-12 h-12 primary-gradient rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
              <span className="material-symbols-outlined text-white text-2xl">account_balance</span>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Civic Hub</h2>
            <p className="text-outline mt-2 font-inter">Enter your credentials to access the portal.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            
            {/* Role Selection (Asymmetric Toggle) */}
            <div>
              <label className="font-label text-xs font-semibold uppercase tracking-widest text-outline block mb-3">Select Role</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {(['rt', 'sekretaris', 'bendahara', 'warga'] as const).map((role) => (
                  <label key={role} className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value={role} 
                      checked={selectedRole === role}
                      onChange={() => setSelectedRole(role)}
                      className="peer hidden" 
                    />
                    <div className="flex items-center justify-center py-2 px-1 rounded-xl border border-outline-variant/30 text-[10px] sm:text-xs font-medium text-outline peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary-container transition-all uppercase">
                      {role === 'rt' ? 'Super Admin' : role}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container rounded-2xl p-4 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Input Group: Phone */}
            <div className="relative">
              <label htmlFor="phone" className="font-label text-xs font-semibold uppercase tracking-widest text-outline block mb-1">
                {selectedRole === 'warga' ? 'No. KK / Telepon' : 'Nomor Telepon'}
              </label>
              <div className="flex items-center border-b-2 border-outline-variant/40 focus-within:border-secondary transition-colors duration-300 group">
                <span className="material-symbols-outlined text-outline group-focus-within:text-secondary text-xl mr-3">phone_iphone</span>
                <input 
                  type="text" 
                  id="phone" 
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={selectedRole === 'warga' ? '123456789...' : '+62 812 3456...'}
                  className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-semibold placeholder:text-outline-variant/50 focus:outline-none" 
                  required
                />
              </div>
            </div>

            {/* Input Group: Password */}
            <div className="relative">
              <label htmlFor="password" className="font-label text-xs font-semibold uppercase tracking-widest text-outline block mb-1">Kata Sandi</label>
              <div className="flex items-center border-b-2 border-outline-variant/40 focus-within:border-secondary transition-colors duration-300 group">
                <span className="material-symbols-outlined text-outline group-focus-within:text-secondary text-xl mr-3">lock</span>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-semibold placeholder:text-outline-variant/50 focus:outline-none" 
                  required
                />
              </div>
            </div>

            {/* Utility Links */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary transition-colors cursor-pointer" />
                <span className="ml-2 text-xs font-semibold text-outline group-hover:text-on-surface transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-xs font-semibold text-secondary hover:text-primary transition-colors">Lupa Kata Sandi?</a>
            </div>

            {/* Primary CTA */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full primary-gradient text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk'}
              {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </form>

          {/* Development Utility / Demo Login */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center pt-8 border-t border-outline-variant/20">
            <span className="w-full text-center text-[10px] text-outline font-bold uppercase tracking-widest mb-2">Demo Accounts</span>
            {['rt', 'sekretaris', 'bendahara', 'warga'].map((role) => (
              <button 
                key={role}
                onClick={() => loadDemo(role)} 
                type="button" 
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-full text-[10px] text-on-surface font-bold uppercase tracking-wider transition-colors"
              >
                {role}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-12 pb-4 flex flex-col items-center gap-6 w-full">
            <div className="flex items-center gap-8">
              <a href="#" className="flex items-center gap-2 text-xs text-outline hover:text-on-surface transition-colors font-semibold">
                <span className="material-symbols-outlined text-[16px]">help_outline</span>
                Bantuan
              </a>
              <div className="h-4 w-[1px] bg-outline-variant/40"></div>
              <a href="#" className="text-xs text-outline hover:text-on-surface transition-colors font-semibold">Privacy Policy</a>
            </div>
            <p className="text-[10px] text-outline/60 uppercase tracking-widest font-bold">
              © 2024 Civic Sanctuary. Crafted for Harmony.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
