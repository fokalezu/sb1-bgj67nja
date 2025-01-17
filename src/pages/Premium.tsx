import React, { useState } from 'react';
import { Crown, CheckCircle, CreditCard, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Premium = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    // Here you would integrate with PayPal's API
    // This is a placeholder for the actual implementation
    window.open('https://paypal.me/YourPayPalUsername', '_blank');
  };

  const handleRevolutPayment = () => {
    // Open Revolut payment link
    window.open('https://revolut.me/YourRevolutUsername', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 text-center border-b border-gray-200">
            <Crown className="mx-auto h-12 w-12 text-yellow-500" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Cont Premium</h2>
            <p className="mt-2 text-lg text-gray-600">
              Deblochează toate funcționalitățile și maximizează-ți vizibilitatea
            </p>
          </div>

          {/* Benefits Section */}
          <div className="px-6 py-8 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Beneficii Premium</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-yellow-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">12 Fotografii</h4>
                  <p className="mt-1 text-gray-600">Încarcă până la 12 fotografii pentru a-ți prezenta profilul în detaliu.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-yellow-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">2 Clipuri Video</h4>
                  <p className="mt-1 text-gray-600">Adaugă până la 2 clipuri video de maxim 2 minute.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-yellow-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">Poziție Top</h4>
                  <p className="mt-1 text-gray-600">Profilul tău va apărea întotdeauna în primele poziții ale căutărilor.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-yellow-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">Badge Premium</h4>
                  <p className="mt-1 text-gray-600">Un badge distinctiv care arată că ești un membru premium.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-yellow-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">Statistici Avansate</h4>
                  <p className="mt-1 text-gray-600">Vezi cine ți-a vizitat profilul și alte statistici detaliate.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-yellow-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">Suport Priority</h4>
                  <p className="mt-1 text-gray-600">Asistență dedicată și timp de răspuns rapid la solicitări.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="px-6 py-8 border-t border-gray-200">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-gray-900">30 RON / lună</h3>
              <p className="mt-4 text-lg text-gray-600">
                Investește în vizibilitatea ta și bucură-te de toate beneficiile premium
              </p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="px-6 py-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Alege Metoda de Plată</h3>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
              <button
                onClick={handlePayPalPayment}
                disabled={isProcessing}
                className="flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50"
              >
                <CreditCard className="h-6 w-6 mr-2" />
                Plătește cu PayPal
              </button>

              <button
                onClick={handleRevolutPayment}
                disabled={isProcessing}
                className="flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-150 disabled:opacity-50"
              >
                <Smartphone className="h-6 w-6 mr-2" />
                Plătește cu Revolut
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>După efectuarea plății, trimite dovada plății la adresa de email: support@example.com</p>
              <p className="mt-2">Menționează numele de utilizator: {user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;