import React from 'react';
import { Globe, Sparkles, ExternalLink } from 'lucide-react';
import type { LinkMetadata } from '../../lib/linkPreview';

interface LinkPreviewCardProps {
    metadata: LinkMetadata;
    isLoading?: boolean;
    onApplyTitle?: () => void;
    onApplyDescription?: () => void;
    onApplyAll?: () => void;
}

export const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({
    metadata,
    isLoading,
    onApplyTitle,
    onApplyDescription,
    onApplyAll,
}) => {
    if (isLoading) {
        return (
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-pulse">
                <div className="flex gap-3">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-200 rounded w-2/3" />
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">Đang tải thông tin trang web...</p>
            </div>
        );
    }

    return (
        <div className="mt-3 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-200 overflow-hidden">
            {/* Preview Header */}
            <div className="px-3 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Globe size={12} />
                    <span className="font-medium">Xem trước trang web</span>
                </div>
                {onApplyAll && (
                    <button
                        type="button"
                        onClick={onApplyAll}
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
                    >
                        <Sparkles size={12} />
                        Áp dụng tất cả
                    </button>
                )}
            </div>

            {/* Preview Content */}
            <div className="p-3">
                <div className="flex gap-3">
                    {/* Image / Logo */}
                    {(metadata.image || metadata.logo) && (
                        <div className="flex-shrink-0">
                            <img
                                src={metadata.image || metadata.logo || ''}
                                alt=""
                                className="w-20 h-20 object-cover rounded-lg border border-slate-200 bg-white"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                        {metadata.title && (
                            <div className="flex items-start gap-1 mb-1">
                                <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 flex-1">
                                    {metadata.title}
                                </h4>
                                {onApplyTitle && (
                                    <button
                                        type="button"
                                        onClick={onApplyTitle}
                                        title="Dùng làm tiêu đề"
                                        className="flex-shrink-0 p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    >
                                        <Sparkles size={14} />
                                    </button>
                                )}
                            </div>
                        )}
                        {metadata.description && (
                            <div className="flex items-start gap-1">
                                <p className="text-xs text-slate-500 line-clamp-3 flex-1 leading-relaxed">
                                    {metadata.description}
                                </p>
                                {onApplyDescription && (
                                    <button
                                        type="button"
                                        onClick={onApplyDescription}
                                        title="Dùng làm mô tả"
                                        className="flex-shrink-0 p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                    >
                                        <Sparkles size={14} />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
                            {metadata.logo && (
                                <img
                                    src={metadata.logo}
                                    alt=""
                                    className="w-3.5 h-3.5 rounded-sm"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            )}
                            <span className="truncate">{new URL(metadata.url).hostname}</span>
                            <a
                                href={metadata.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto p-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                                title="Mở trang"
                            >
                                <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
