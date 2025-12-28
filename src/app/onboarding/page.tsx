'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const colors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = '';

      // Upload avatar if exists
      if (avatarFile && user) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          avatarUrl = data.publicUrl;
        }
      }

      // Update user profile
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          username: username,
          bio: bio,
          avatar_url: avatarUrl || null,
        })
        .eq('id', user?.id);

      if (error) throw error;

      router.push('/');
    } catch (error: any) {
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Adım {step}/3</span>
            <span className="text-sm text-gray-400">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-[#1C1F26] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-violet-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent mb-2">
            Profilini Oluştur
          </h1>
          <p className="text-gray-400">Topluluğa katılmak için birkaç adım kaldı</p>
        </div>

        {/* Step Content */}
        <div className="bg-[#1C1F26] rounded-xl p-8 border border-white/5">
          {/* Step 1: Name & Username */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👤</div>
                <h2 className="text-2xl font-bold mb-2">Kimsin?</h2>
                <p className="text-gray-400 text-sm">İsmin ve kullanıcı adın</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full bg-[#0F1115] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Kullanıcı Adı *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  placeholder="ahmetyilmaz"
                  className="w-full bg-[#0F1115] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Küçük harf, boşluksuz</p>
              </div>
            </div>
          )}

          {/* Step 2: Avatar */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📸</div>
                <h2 className="text-2xl font-bold mb-2">Profil Fotoğrafı</h2>
                <p className="text-gray-400 text-sm">Fotoğraf yükle veya renk seç</p>
              </div>

              {/* Avatar Preview */}
              <div className="flex justify-center mb-6">
                {avatarPreview ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10">
                    <Image 
                      src={avatarPreview} 
                      alt="Avatar" 
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}dd)` }}
                  >
                    {fullName.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div>
                <label className="block w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold py-3 rounded-lg transition-colors cursor-pointer text-center">
                    📁 Fotoğraf Yükle
                  </div>
                </label>
              </div>

              {/* Color Picker */}
              {!avatarPreview && (
                <>
                  <div className="text-center text-sm text-gray-400">veya renk seç</div>
                  <div className="grid grid-cols-6 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-full aspect-square rounded-lg transition-all ${
                          selectedColor === color ? 'ring-4 ring-white/30 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Bio */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">✍️</div>
                <h2 className="text-2xl font-bold mb-2">Kendini Tanıt</h2>
                <p className="text-gray-400 text-sm">Biyografini ekle (opsiyonel)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Spor tutkunu, 5 yıldır salonlardayım. PR'larımı paylaşıyorum! 💪"
                  rows={4}
                  maxLength={160}
                  className="w-full bg-[#0F1115] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{bio.length}/160</p>
              </div>

              {/* Preview Card */}
              <div className="bg-[#0F1115] rounded-lg p-4 border border-white/5">
                <p className="text-xs text-gray-500 mb-3">Önizleme</p>
                <div className="flex items-center gap-3">
                  {avatarPreview ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                      <Image 
                        src={avatarPreview} 
                        alt="Avatar" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white"
                      style={{ background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}dd)` }}
                    >
                      {fullName.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{fullName || 'İsim'}</h3>
                    <p className="text-sm text-gray-400 truncate">@{username || 'username'}</p>
                    {bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{bio}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-[#0F1115] hover:bg-[#1a1d23] border border-white/10 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Geri
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading || (step === 1 && (!fullName || !username))}
              className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kaydediliyor...' : step === 3 ? 'Tamamla' : 'İleri'}
            </button>
          </div>
        </div>

        {/* Skip Button */}
        {step < 3 && (
          <button
            onClick={() => router.push('/')}
            className="w-full mt-4 text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            Şimdilik atla →
          </button>
        )}
      </div>
    </div>
  );
}

