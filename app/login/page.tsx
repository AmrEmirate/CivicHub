'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import Link from 'next/link';
import { ShieldCheck, Phone, Lock, ArrowRight, HelpCircle, Building } from 'lucide-react';

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

    const result = await login(phone, password);
    if (!result.success) {
      setError(result.error || 'Login gagal. Periksa kredensial Anda.');
      setIsLoading(false);
      return;
    }
    
    router.push('/dashboard');
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
      <section className="hidden lg:flex w-7/12 relative overflow-hidden bg-[#00141c] items-center justify-center p-12 isolate">
        <div className="absolute inset-0 z-0 bg-[#00141c]">
          <img 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000&auto=format&fit=crop"
            alt="Community Unity" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000f14]/95 via-[#001f2a]/80 to-[#001f2a]/20"></div>
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        </div>
        
        <div className="relative z-10 max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-800/50 backdrop-blur-md mb-6">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-cyan-200 text-[10px] font-bold tracking-widest uppercase">Platform Tata Kelola Digital</span>
          </div>
          <h1 className="font-headline text-5xl font-black text-white leading-tight tracking-tighter mb-6 drop-shadow-md">
            Harmoni Komunitas dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">Satu Ketukan.</span>
          </h1>
          <p className="text-cyan-50/80 text-lg font-medium leading-relaxed mb-10 drop-shadow-sm max-w-lg">
            Selamat datang di CivicHub. Kelola administrasi warga, transparansi finansial, dan harmoni lingkungan dengan presisi dan keanggunan.
          </p>
          <div className="flex gap-5 items-center p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-max">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#00141c] bg-cyan-200 flex items-center justify-center text-cyan-800 font-bold text-xs">RT</div>
              <div className="w-10 h-10 rounded-full border-2 border-[#00141c] bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-xs">SK</div>
              <div className="w-10 h-10 rounded-full border-2 border-[#00141c] bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">BD</div>
            </div>
            <div className="text-white">
              <span className="block font-bold text-sm tracking-tight text-white">4 Peran Spesifik</span>
              <span className="text-cyan-100/70 text-[10px] font-bold uppercase tracking-wider">Akses Terkontrol Penuh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form Canvas */}
      <main className="w-full lg:w-5/12 flex flex-col items-center justify-center p-6 lg:p-12 bg-surface overflow-y-auto relative isolate">
        {/* Subtle background blob for right side */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none transform translate-x-1/2 -translate-y-1/4"></div>

        <div className="w-full max-w-sm my-auto flex flex-col pt-8 animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
          {/* Branding Header */}
          <div className="mb-10 flex flex-col items-start">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              <Building strokeWidth={2.5} className="text-white w-7 h-7" />
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">CivicHub</h2>
            <p className="text-outline mt-2 text-sm font-medium">Masukkan kredensial Anda untuk mengakses portal.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="font-label text-xs font-bold uppercase tracking-widest text-outline-variant">Akses Sebagai</label>
              <div className="grid grid-cols-2 gap-2">
                {(['rt', 'sekretaris', 'bendahara', 'warga'] as const).map((role) => (
                  <label key={role} className="cursor-pointer group">
                    <input 
                      type="radio" 
                      name="role" 
                      value={role} 
                      checked={selectedRole === role}
                      onChange={() => setSelectedRole(role)}
                      className="peer hidden" 
                    />
                    <div className="flex items-center justify-center py-2.5 px-2 rounded-xl border border-outline-variant/30 text-[11px] font-bold text-outline peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-md peer-checked:shadow-primary/20 transition-all uppercase tracking-wider group-hover:border-outline-variant/60">
                      {role === 'rt' ? 'Super Admin' : role}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-error-container/50 border border-error/20 text-error rounded-xl p-4 text-xs font-semibold flex items-start animate-in fade-in zoom-in-95 duration-300">
                <ShieldCheck className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Input Group: Phone */}
              <div className="relative group">
                <label htmlFor="phone" className="font-label text-[10px] font-bold uppercase tracking-widest text-outline-variant block mb-1">
                  {selectedRole === 'warga' ? 'No. KK / Telepon' : 'Nomor Telepon'}
                </label>
                <div className="flex items-center border-b-[1.5px] border-outline-variant/40 focus-within:border-primary transition-colors duration-300">
                  <Phone strokeWidth={2.5} className="text-outline-variant group-focus-within:text-primary w-5 h-5 mr-3 transition-colors" />
                  <input 
                    type="text" 
                    id="phone" 
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={selectedRole === 'warga' ? 'Masukkan 16 digit No. KK...' : '+62 812 3456...'}
                    className="w-full py-3 bg-transparent border-none focus:ring-0 text-on-surface font-semibold placeholder:text-outline-variant/50 focus:outline-none" 
                    required
                  />
                </div>
              </div>

              {/* Input Group: Password */}
              <div className="relative group">
                <label htmlFor="password" className="font-label text-[10px] font-bold uppercase tracking-widest text-outline-variant block mb-1">Kata Sandi</label>
                <div className="flex items-center border-b-[1.5px] border-outline-variant/40 focus-within:border-primary transition-colors duration-300">
                  <Lock strokeWidth={2.5} className="text-outline-variant group-focus-within:text-primary w-5 h-5 mr-3 transition-colors" />
                  <input 
                    type="password" 
                    id="password" 
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full py-3 bg-transparent border-none focus:ring-0 text-on-surface font-semibold placeholder:text-outline-variant/50 focus:outline-none tracking-widest" 
                    required
                  />
                </div>
              </div>
            </div>

            {/* Utility Links */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 focus:ring-offset-0 transition-colors cursor-pointer" />
                <span className="ml-2 text-xs font-semibold text-outline group-hover:text-on-surface transition-colors">Ingat saya</span>
              </label>
              <a href="#" className="text-xs font-bold text-primary hover:text-primary-container transition-colors">Lupa Kata Sandi?</a>
            </div>

            {/* Primary CTA */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold py-4 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Masuk <ArrowRight strokeWidth={2.5} className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Development Utility / Demo Login */}
          <div className="mt-8 flex flex-col items-center pt-8 border-t border-outline-variant/20">
            <span className="text-[9px] text-outline-variant font-bold uppercase tracking-widest mb-3">Auto-Fill Kredensial Demo</span>
            <div className="flex flex-wrap gap-2 justify-center">
              {['rt', 'sekretaris', 'bendahara', 'warga'].map((role) => (
                <button 
                  key={role}
                  onClick={() => loadDemo(role)} 
                  type="button" 
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-full text-[10px] text-outline font-bold uppercase tracking-widest transition-colors border border-outline-variant/30"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-16 pb-4 flex flex-col items-center gap-6 w-full">
            <div className="flex items-center gap-6">
              <a href="#" className="flex items-center gap-1.5 text-[11px] text-outline hover:text-on-surface transition-colors font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" /> Bantuan
              </a>
              <div className="h-3 w-[2px] bg-outline-variant/40 rounded-full"></div>
              <a href="#" className="text-[11px] text-outline hover:text-on-surface transition-colors font-bold uppercase tracking-wider">Privasi</a>
            </div>
            <p className="text-[10px] text-outline-variant font-bold uppercase tracking-widest">
              © 2026 CivicHub. Crafted for Harmony.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
