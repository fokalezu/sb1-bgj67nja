import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, MessageCircle, Send, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  name: string;
  birth_date: string;
  phone: string;
  county: string;
  city: string;
  user_type: 'standard' | 'verified' | 'premium';
  verification_status: boolean;
  media: {
    photos: string[];
    videos: string[];
  };
  services: string[];
  incall_30min?: number;
  incall_1h?: number;
  incall_2h?: number;
  incall_night?: number;
  outcall_30min?: number;
  outcall_1h?: number;
  outcall_2h?: number;
  outcall_night?: number;
}

const serviceLabels: { [key: string]: string } = {
  sex_anal: 'Sex Anal',
  finalizare_orala: 'Finalizare Orală',
  finalizare_faciala: 'Finalizare Facială',
  finalizare_corporala: 'Finalizare Corporală',
  dildo_jucarii: 'Dildo Jucării Erotice',
  sarut: 'Sărut',
  gfe: 'Girlfriend Experience',
  oral_protejat: 'Oral Protejat',
  oral_neprotejat: 'Oral Neprotejat',
  sex_pozitii: 'Sex în Diferite Poziții',
  masaj_erotic: 'Masaj Erotic',
  body_masaj: 'Body Masaj',
  masaj_relaxare: 'Masaj de Relaxare',
  masaj_tantric: 'Masaj Tantric',
  masaj_intretinere: 'Masaj Întreținere',
  deepthroat: 'Deepthroat',
  sex_sani: 'Sex între Sâni',
  handjob: 'Handjob',
  threesome: 'Threesome',
  sex_grup: 'Sex în Grup',
  lesby_show: 'Lesby Show',
  squirt: 'Squirt',
  uro_activ: 'Uro Activ',
  dominare_soft: 'Dominare Soft',
  dominare_hard: 'Dominare Hard',
  footfetish: 'Footfetish',
  facesitting: 'Facesitting'
};

const ViewProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setProfile(data as Profile);
          if (data.media?.photos?.length > 0) {
            setSelectedImage(data.media.photos[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('A apărut o eroare la încărcarea profilului');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    let formattedPhone = phone.replace(/\D/g, '');
    
    // Add 40 prefix if number starts with 0
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '40' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('40')) {
      formattedPhone = '40' + formattedPhone;
    }
    
    return formattedPhone;
  };

  const handlePhoneClick = () => {
    if (profile?.phone) {
      // Log the click event
      supabase
        .from('profile_stats')
        .insert([{ profile_id: profile.id, event_type: 'phone_click' }])
        .then(() => {
          window.location.href = `tel:${profile.phone}`;
        });
    }
  };

  const handleWhatsAppClick = () => {
    if (profile?.phone) {
      // Log the click event
      supabase
        .from('profile_stats')
        .insert([{ profile_id: profile.id, event_type: 'whatsapp_click' }])
        .then(() => {
          const formattedPhone = formatPhoneNumber(profile.phone);
          const message = encodeURIComponent(`Buna ${profile.name}, am gasit anuntul tau pe Dating CMS, mai este valabil?`);
          window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
        });
    }
  };

  const handleTelegramClick = () => {
    if (profile?.phone) {
      // Log the click event
      supabase
        .from('profile_stats')
        .insert([{ profile_id: profile.id, event_type: 'telegram_click' }])
        .then(() => {
          const formattedPhone = formatPhoneNumber(profile.phone);
          window.open(`https://t.me/${formattedPhone}`, '_blank');
        });
    }
  };

  useEffect(() => {
    // Log view event when profile is loaded
    if (profile) {
      supabase
        .from('profile_stats')
        .insert([{ profile_id: profile.id, event_type: 'view' }])
        .then(() => {
          console.log('View logged');
        })
        .catch(error => {
          console.error('Error logging view:', error);
        });
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Se încarcă profilul...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error || 'Profilul nu a fost găsit'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Photo Gallery */}
            <div className="space-y-4">
              {/* Main Photo */}
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedImage || profile.media.photos[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3'}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {profile.media.photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {profile.media.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(photo)}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        selectedImage === photo ? 'ring-2 ring-purple-500' : ''
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`${profile.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <div className="flex gap-2">
                  {profile.user_type === 'premium' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Premium
                    </span>
                  )}
                  {profile.verification_status && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verificat
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Locație</h3>
                  <p className="mt-1 text-lg text-gray-900">{profile.city}, {profile.county}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Vârstă</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date().getFullYear() - new Date(profile.birth_date).getFullYear()} ani
                  </p>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handlePhoneClick}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Sună Acum
                </button>
                
                <button
                  onClick={handleWhatsAppClick}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </button>

                <button
                  onClick={handleTelegramClick}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Telegram
                </button>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Servicii Oferite</h3>
                <div className="grid grid-cols-2 gap-3">
                  {profile.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{serviceLabels[service] || service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                {/* Incall Pricing */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tarife Incall (La mine)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {profile.incall_30min && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-500">30 min</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.incall_30min} RON</p>
                      </div>
                    )}
                    {profile.incall_1h && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-500">1 oră</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.incall_1h} RON</p>
                      </div>
                    )}
                    {profile.incall_2h && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-500">2 ore</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.incall_2h} RON</p>
                      </div>
                    )}
                    {profile.incall_night && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Noapte</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.incall_night} RON</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Outcall Pricing */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tarife Outcall (La tine)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {profile.outcall_30min && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-500">30 min</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.outcall_30min} RON</p>
                      </div>
                    )}
                    {profile.outcall_1h && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-500">1 oră</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.outcall_1h} RON</p>
                      </div>
                    )}
                    {profile.outcall_2h && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-500">2 ore</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.outcall_2h} RON</p>
                      </div>
                    )}
                    {profile.outcall_night && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Noapte</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.outcall_night} RON</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;