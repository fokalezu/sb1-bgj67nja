import React, { useEffect, useState } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface Profile {
  id: string;
  name: string;
  county: string;
  city: string;
  user_type: 'standard' | 'verified' | 'premium';
  verification_status: boolean;
  media: {
    photos: string[];
  };
}

interface CountyCount {
  county: string;
  count: number;
}

const Home = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [countyStats, setCountyStats] = useState<CountyCount[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .not('name', 'is', null)
          .not('county', 'is', null)
          .not('city', 'is', null)
          .order('user_type', { ascending: false })
          .order('verification_status', { ascending: false });

        if (profilesError) {
          throw profilesError;
        }

        if (profilesData) {
          setProfiles(profilesData as Profile[]);
          
          // Calculate county stats from the profiles data
          const countsByCounty = profilesData.reduce((acc: { [key: string]: number }, profile) => {
            if (profile.county) {
              acc[profile.county] = (acc[profile.county] || 0) + 1;
            }
            return acc;
          }, {});

          const stats = Object.entries(countsByCounty)
            .map(([county, count]) => ({
              county,
              count
            }))
            .sort((a, b) => b.count - a.count);

          setCountyStats(stats);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('A apărut o eroare la încărcarea profilelor. Te rugăm să reîncerci.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = selectedCounty
    ? profiles.filter(profile => profile.county === selectedCounty)
    : profiles;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Se încarcă profilele...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90">
          <div className="absolute inset-0">
            {/* Animated Hearts */}
            {[...Array(20)].map((_, i) => (
              <Heart
                key={i}
                className="absolute text-pink-500 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.3 + Math.random() * 0.7,
                  transform: `scale(${0.5 + Math.random()})`,
                }}
              />
            ))}
          </div>
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-4">Găsește Compania Perfectă</h1>
              <p className="text-xl opacity-90">
                Descoperă profile verificate și de încredere pentru momente speciale.
                Siguranța și discreția sunt prioritățile noastre.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Încearcă din nou
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Counties Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                  Județe Active
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCounty(null)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      !selectedCounty
                        ? 'bg-purple-100 text-purple-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Toate județele ({profiles.length})
                  </button>
                  {countyStats.map(({ county, count }) => (
                    <button
                      key={county}
                      onClick={() => setSelectedCounty(county)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCounty === county
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {county} ({count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profiles Grid */}
            <div className="md:col-span-3">
              {filteredProfiles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Nu există încă profile active în această zonă.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map(profile => (
                    <Link
                      key={profile.id}
                      to={`/profile/${profile.id}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-[3/4]">
                        <img
                          src={profile.media?.photos?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Status Badges */}
                        <div className="absolute top-2 right-2 flex gap-2">
                          {profile.user_type === 'premium' && (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Premium
                            </span>
                          )}
                          {profile.verification_status && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Verificat
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{profile.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {profile.city}, {profile.county}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Despre Noi</h3>
              <p className="text-gray-400">
                Platforma noastră oferă un spațiu sigur și discret pentru 
                persoanele care caută companie de calitate. Toate profilele 
                sunt verificate pentru a asigura siguranța utilizatorilor.
              </p>
            </div>

            {/* Sitemap */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sitemap</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Acasă
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors">
                    Înregistrare
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Autentificare
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="hover:text-white transition-colors">
                    Premium
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Dating CMS. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;