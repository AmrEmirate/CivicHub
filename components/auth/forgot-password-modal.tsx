'use client';

import React, { useState } from 'react';
import { X, Key, ShieldCheck, Loader2, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api/api-client';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await apiClient('/auth/request-otp', {
        method: 'POST',
        data: { noTelepon: phone }
      });
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim OTP. Pastikan nomor terdaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await apiClient('/auth/reset-password', {
        method: 'POST',
        data: { noTelepon: phone, otp, newPassword }
      });
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'OTP tidak valid atau kadaluwarsa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {step === 'success' ? 'Berhasil!' : 'Lupa Sandi'}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Keamanan Akun CivicHub</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-xs font-bold flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Masukkan nomor telepon Anda yang terdaftar. Kami akan mengirimkan kode verifikasi (OTP) via WhatsApp.
              </p>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Telepon</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
                  <input 
                    type="tel" 
                    required
                    placeholder="0812xxxxxxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-600 outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-cyan-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-900/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                Kirim Kode OTP
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Masukkan kode 6-digit yang dikirim ke <span className="text-slate-900 font-bold">{phone}</span> dan tentukan kata sandi baru.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kode Verifikasi (OTP)</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xl font-black tracking-[0.5em] focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kata Sandi Baru</label>
                  <div className="relative group">
                    <Key size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-cyan-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-900/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                Simpan Perubahan
              </button>
              <button 
                type="button"
                onClick={() => setStep('request')}
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-cyan-600 transition-colors"
              >
                Ganti Nomor Telepon
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-sm border border-emerald-100">
                <CheckCircle size={40} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Sandi Berhasil Diubah</h3>
                <p className="text-sm text-slate-500 font-medium">Anda sekarang dapat masuk kembali menggunakan kata sandi baru Anda.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-1 transition-all"
              >
                Kembali ke Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
