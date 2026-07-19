import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableBanner = ({ banner, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: banner._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className='group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm touch-none'>
            <img src={banner.image || undefined} alt={banner.title} className='w-full h-full object-cover' />
            <div className='absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white'>
                <h3 className='font-bold text-xl mb-1'>{banner.title || '(Không có tiêu đề)'}</h3>
                <p className='text-sm opacity-90 line-clamp-2'>{banner.description}</p>
            </div>
            <div className='absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                <button {...listeners} className='bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600 shadow-lg cursor-grab active:cursor-grabbing' title="Kéo để sắp xếp"><span className="material-symbols-outlined text-sm">drag_indicator</span></button>
                <button onClick={() => onEdit(banner)} className='bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg' title="Sửa banner"><span className="material-symbols-outlined text-sm">edit</span></button>
                <button onClick={() => onDelete(banner._id)} className='bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg' title="Xóa banner"><span className="material-symbols-outlined text-sm">delete</span></button>
            </div>
        </div>
    );
};

export default SortableBanner;