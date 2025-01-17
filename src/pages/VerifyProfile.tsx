import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const VerifyProfile = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCapturing(true);
      setError(null);
    } catch (err) {
      setError('Nu s-a putut accesa camera. Te rugăm să verifici permisiunile.');
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const submitVerification = async () => {
    if (!capturedImage || !user) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Convert base64 image to blob
      const base64Response = await fetch(capturedImage);
      const blob = await base64Response.blob();

      // Upload verification photo to Supabase Storage
      const fileName = `verification/${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('verifications')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Update profile verification status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          verification_status: false, // Pending verification
          verification_photo: fileName,
          verification_submitted_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setVerificationSubmitted(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Error submitting verification:', err);
      setError('A apărut o eroare la trimiterea verificării. Te rugăm să încerci din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 text-center border-b border-gray-200">
            <Shield className="mx-auto h-12 w-12 text-purple-600" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Verificare Profil</h2>
            <p className="mt-2 text-lg text-gray-600">
              Verifică-ți profilul pentru mai multă credibilitate și încredere
            </p>
          </div>

          {/* Benefits Section */}
          <div className="px-6 py-8 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">De ce să-ți verifici profilul?</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">Credibilitate Crescută</h4>
                  <p className="mt-1 text-gray-600">Profilurile verificate primesc mai multă încredere din partea vizitatorilor.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">Vizibilitate Mai Mare</h4>
                  <p className="mt-1 text-gray-600">Profilurile verificate apar primele în rezultatele căutării.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">Mai Multe Fotografii</h4>
                  <p className="mt-1 text-gray-600">Poți încărca până la 8 fotografii și un clip video.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">Badge Special</h4>
                  <p className="mt-1 text-gray-600">Primești un badge distinctiv care arată că profilul tău este verificat.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Instructions */}
          <div className="px-6 py-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cum se face verificarea?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-sm">
                  1
                </div>
                <p className="ml-3 text-gray-600">
                  Pregătește o coală de hârtie și un pix
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-sm">
                  2
                </div>
                <p className="ml-3 text-gray-600">
                  Scrie pe coală: numele site-ului și data de astăzi ({new Date().toLocaleDateString()})
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-sm">
                  3
                </div>
                <p className="ml-3 text-gray-600">
                  Ține coala în mână și fă-ți un selfie clar cu fața și textul vizibil
                </p>
              </div>
            </div>
          </div>

          {/* Camera Section */}
          <div className="px-6 py-8 border-t border-gray-200">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {verificationSubmitted ? (
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-4 text-xl font-medium text-gray-900">Verificare Trimisă cu Succes!</h3>
                <p className="mt-2 text-gray-600">
                  Cererea ta de verificare a fost trimisă. Vei primi un răspuns în curând.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {!isCapturing && !capturedImage && (
                  <button
                    onClick={startCamera}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Pornește Camera
                  </button>
                )}

                {isCapturing && (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={capturePhoto}
                        className="px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        Captează Fotografia
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Anulează
                      </button>
                    </div>
                  </div>
                )}

                {capturedImage && (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                      <img
                        src={capturedImage}
                        alt="Captured verification"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={submitVerification}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Se trimite...' : 'Trimite pentru Verificare'}
                      </button>
                      <button
                        onClick={retakePhoto}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Refă Fotografia
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyProfile;