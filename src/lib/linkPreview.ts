// Đường dẫn: src/lib/linkPreview.ts

export interface LinkMetadata {
    title: string;
    description: string;
    image: string | null;
    logo: string | null;
    url: string;
}

// ========== YouTube Helper ==========

/**
 * Kiểm tra xem URL có phải YouTube không, trả về videoId nếu đúng
 */
const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};

/**
 * Lấy metadata YouTube qua noembed + Invidious API (miễn phí, không cần API key)
 * Invidious trả về mô tả đầy đủ của video
 */
const INVIDIOUS_INSTANCES = [
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://iv.ggtyler.dev',
];

const fetchYouTubeMetadata = async (videoId: string, originalUrl: string): Promise<LinkMetadata | null> => {
    // Thử lần lượt các Invidious instance
    for (const instance of INVIDIOUS_INSTANCES) {
        try {
            const apiUrl = `${instance}/api/v1/videos/${videoId}?fields=title,description,videoThumbnails,author`;
            const response = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });

            if (!response.ok) continue;

            const data = await response.json();

            // Lấy thumbnail chất lượng cao
            const thumbnail = data.videoThumbnails?.find(
                (t: { quality: string }) => t.quality === 'maxresdefault' || t.quality === 'sddefault'
            ) || data.videoThumbnails?.[0];

            return {
                title: data.title || '',
                description: data.description || '',
                image: thumbnail?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                logo: 'https://www.youtube.com/favicon.ico',
                url: originalUrl,
            };
        } catch {
            // Thử instance tiếp theo
            continue;
        }
    }

    // Fallback: dùng noembed (chỉ có title, không có description đầy đủ)
    try {
        const noembedUrl = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
        const response = await fetch(noembedUrl, { signal: AbortSignal.timeout(5000) });
        const data = await response.json();

        return {
            title: data.title || '',
            description: data.author_name ? `Video bởi ${data.author_name}` : '',
            image: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            logo: 'https://www.youtube.com/favicon.ico',
            url: originalUrl,
        };
    } catch {
        return null;
    }
};

// ========== Generic Metadata (Microlink) ==========

const fetchGenericMetadata = async (url: string): Promise<LinkMetadata | null> => {
    try {
        const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== 'success' || !data.data) {
            return null;
        }

        const { title, description, image, logo } = data.data;

        return {
            title: title || '',
            description: description || '',
            image: image?.url || null,
            logo: logo?.url || null,
            url: data.data.url || url,
        };
    } catch (error) {
        console.error('Lỗi khi lấy metadata:', error);
        return null;
    }
};

// ========== Main Export ==========

/**
 * Lấy metadata của một URL
 * - YouTube: dùng Invidious API → lấy title + mô tả đầy đủ video
 * - Trang khác: dùng Microlink API
 */
export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata | null> => {
    if (!url || !url.startsWith('http')) return null;

    // Kiểm tra YouTube
    const youtubeId = extractYouTubeVideoId(url);
    if (youtubeId) {
        return fetchYouTubeMetadata(youtubeId, url);
    }

    // Trang web thông thường
    return fetchGenericMetadata(url);
};
