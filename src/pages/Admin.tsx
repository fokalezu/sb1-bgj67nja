import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Check, X, Edit, Trash2, Search, Crown, BadgeCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  county: string;
  city: string;
  user_type: 'standard' | 'verified' | 'premium';
  verification_status: boolean;
  is_blocked: boolean;
  created_at: string;
}

const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        if (!profileData?.is_admin) {
          navigate('/dashboard');
          return;
        }

        setIsAdmin(true);
        fetchProfiles();
      } catch (err) {
        console.error('Error checking admin status:', err);
        navigate('/dashboard');
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (profilesData) {
        setProfiles(profilesData);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('A apărut o eroare la încărcarea profilelor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserType = async (profileId: string, newType: 'standard' | 'verified' | 'premium') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: newType })
        .eq('id', profileId);

      if (error) throw error;

      // Update local state
      setProfiles(profiles.map(profile =>
        profile.id === profileId ? { ...profile, user_type: newType } : profile
      ));
    } catch (err) {
      console.error('Error updating user type:', err);
      setError('A apărut o eroare la actualizarea tipului de utilizator');
    }
  };

  const handleToggleVerification = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: !currentStatus })
        .eq('id', profileId);

      if (error) throw error;

      // Update local state
      setProfiles(profiles.map(profile =>
        profile.id === profileId ? { ...profile, verification_status: !currentStatus } : profile
      ));
    } catch (err) {
      console.error('Error toggling verification:', err);
      setError('A apărut o eroare la actualizarea statusului de verificare');
    }
  };

  const handleToggleBlock = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: !currentStatus })
        .eq('id', profileId);

      if (error) throw error;

      // Update local state
      setProfiles(profiles.map(profile =>
        profile.id === profileId ? { ...profile, is_blocked: !currentStatus } : profile
      ));
    } catch (err) {
      console.error('Error toggling block status:', err);
      setError('A apărut o eroare la actualizarea statusului de blocare');
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!window.confirm('Ești sigur că vrei să ștergi acest profil?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      // Update local state
      setProfiles(profiles.filter(profile => profile.id !== profileId));
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError('A apărut o eroare la ștergerea profilului');
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (profile.name?.toLowerCase().includes(searchLower)) ||
      (profile.email?.toLowerCase().includes(searchLower)) ||
      (profile.phone?.toLowerCase().includes(searchLower))
    );
  });

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-purple-600" />
            Panou Administrare
          </h1>
          <p className="mt-2 text-gray-600">
            Gestionează utilizatorii și profilurile acestora
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Caută după nume, email sau telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilizator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip Cont
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Înregistrării
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Se încarcă...
                    </td>
                  </tr>
                ) : filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Nu s-au găsit profile
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((profile) => (
                    <tr key={profile.id} className={profile.is_blocked ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {profile.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {profile.city}, {profile.county}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{profile.email}</div>
                        <div className="text-sm text-gray-500">{profile.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={profile.user_type}
                          onChange={(e) => handleUpdateUserType(profile.id, e.target.value as 'standard' | 'verified' | 'premium')}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        >
                          <option value="standard">Standard</option>
                          <option value="verified">Verificat</option>
                          <option value="premium">Premium</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleVerification(profile.id, profile.verification_status)}
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                              profile.verification_status
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <BadgeCheck className="h-4 w-4 mr-1" />
                            {profile.verification_status ? 'Verificat' : 'Neverificat'}
                          </button>

                          <button
                            onClick={() => handleToggleBlock(profile.id, profile.is_blocked)}
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                              profile.is_blocked
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {profile.is_blocked ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/profile/${profile.id}`)}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;