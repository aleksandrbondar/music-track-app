/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

import {
  Track,
  PaginatedTracksResponse,
  GetTracksParams,
  CreateTrackDTO,
  UpdateTrackDTO,
  Genre,
  BulkDeleteDTO,
  BulkDeleteResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTracks = async (params?: GetTracksParams): Promise<PaginatedTracksResponse> => {
  const response = await apiClient.get<PaginatedTracksResponse>('/tracks', { params });
  return response.data;
};

export const getTrackBySlug = async (slug: string): Promise<Track> => {
  const response = await apiClient.get<Track>(`/tracks/${slug}`);
  return response.data;
};

export const createTrack = async (trackData: CreateTrackDTO): Promise<Track> => {
  const response = await apiClient.post<Track>('/tracks', trackData);
  return response.data;
};

export const updateTrack = async (id: string, trackData: UpdateTrackDTO): Promise<Track> => {
  const response = await apiClient.put<Track>(`/tracks/${id}`, trackData);
  return response.data;
};

export const deleteTrack = async (id: string): Promise<void> => {
  await apiClient.delete(`/tracks/${id}`);
};

export const getGenres = async (): Promise<Genre[]> => {
  const response = await apiClient.get<Genre[]>('/genres');
  return response.data;
};

export const uploadTrackAudio = async (id: string, file: File, onUploadProgress?: (progressEvent: ProgressEvent) => void): Promise<Track> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<Track>(`/tracks/${id}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onUploadProgress as any,
  });
  return response.data;
};

export const deleteTrackAudio = async (id: string): Promise<Track> => {
  const response = await apiClient.delete<Track>(`/tracks/${id}/file`);
  return response.data;
};

export const deleteMultipleTracks = async (data: BulkDeleteDTO): Promise<BulkDeleteResponse> => {
  const response = await apiClient.post<BulkDeleteResponse>('/tracks/delete', data);
  return response.data;
};

export const getHealth = async (): Promise<{ status: string }> => {
  const response = await apiClient.get<{ status: string }>('/health');
  return response.data;
};

export default apiClient;