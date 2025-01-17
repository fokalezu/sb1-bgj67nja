import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { counties, citiesByCounty } from '../utils/romanianCities';
import { User, Phone, MapPin, Calendar, Camera, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// ... (services array and schema remain the same)

const Profile = () => {
  // ... (existing state declarations remain the same)

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('userId', userId);

      try {
        const response = await fetch('/api/upload/photo', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload photo');
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }
    }

    return uploadedUrls;
  };

  const uploadVideos = async (userId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const video of videos) {
      const fileExt = video.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const formData = new FormData();
      formData.append('video', video);
      formData.append('userId', userId);

      try {
        const response = await fetch('/api/upload/video', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload video');
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
      }
    }

    return uploadedUrls;
  };

  // ... (rest of the component remains the same)
};

export default Profile;