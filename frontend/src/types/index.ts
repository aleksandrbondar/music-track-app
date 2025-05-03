export type Genre = string;

export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    genres: Genre[];
    slug: string;
    coverImage: string | null;
    audioFile: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTrackDTO {
    title: string;
    artist: string;
    album?: string;
    genres: Genre[];
    coverImage?: string;
}

export interface UpdateTrackDTO {
    title?: string;
    artist?: string;
    album?: string;
    genres?: Genre[];
    coverImage?: string;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedTracksResponse {
    data: Track[];
    meta: PaginationMeta;
}

export interface GetTracksParams {
    page?: number;
    limit?: number;
    sort?: 'title' | 'artist' | 'album' | 'createdAt';
    order?: 'asc' | 'desc';
    search?: string;
    genre?: string;
    artist?: string;
}

export interface BulkDeleteResponse {
    success: string[];
    failed: string[];
}

export interface BulkDeleteDTO {
    ids: string[];
}

export type SortOrder = 'asc' | 'desc';

export type SortField = 'title' | 'artist' | 'album' | 'createdAt';