import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom' 

const Introduce = () => {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    if (document.getElementById('page-transition-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'white';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 400ms ease';
    overlay.innerHTML = `<div class="flex items-center gap-3"><svg class="animate-spin h-6 w-6 text-[#135bec]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg><div class="text-[#135bec] font-bold text-lg">Đang tải…</div></div>`;
    document.body.appendChild(overlay);
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    overlay.offsetWidth;
    overlay.style.opacity = '1';
    setTimeout(() => {
      navigate('/gioi_thieu');
    }, 400);
  };
  return (
    <div className='py-16 lg:py-24 bg-white' id='gioi-thieu'>
      <div className='layout-container flex justify-center'>
        <div className='layout-content-container flex flex-col md:flex-row gap-12 max-w-[1280px] w-full px-4 lg:px-10 items-center'>
            <div className='w-full md:w-1/2 relative'>
                <div className='absolute -top-4 -left-4 w-24 h-24 bg-[#135bec]/10 rounded-full z-0'></div>
                <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full z-0'></div>
                <img src={assets.introduce} className='relative z-10 w-full h-auto rounded-2xl shadow-xl object-cover aspect-[4/3]' alt=""/>
                <div className='absolute bottom-8 left-8 z-20 bg-white p-4 rounded-xl shadow-lg border-l-4 border-[#135bec] max-w-[200px] hidden lg:block'>
                    <p className='text-3xl font-black text-[#135bec] mb-1'>10+</p>
                    <p className='text-sm font-medium text-gray-600'>Năm kinh nghiệm đào tạo lái xe</p>
                </div>
            </div>

            <div className='w-full md:w-1/2 flex flex-col gap-6'>
                <div>
                    <span className='text-[#135bec] font-bold uppercase tracking-wider text-sm mb-2 block'>
                        Về chúng tôi
                    </span>
                    <h2 className='text-[#111318] text-3xl lg:text-4xl font-black leading-tight mb-4'>
                        Trung tâm Sát hạch Lái xe - Khởi đầu vững chắc
                    </h2>
                <p className='text-gray-800 font-medium text-lg leading-relaxed mb-4'>
                        Được thành lập từ năm 2008, chúng tôi tự hào là một trong những
                        trung tâm đào tạo và sát hạch lái xe hàng đầu khu vực, được Sở 
                        Giao thông Vận tải cấp phép hoạt động.
                    </p>
                <p className='text-gray-800 font-medium text-lg leading-relaxed'>
                        Với phương châm "An toàn của bạn là hạnh phúc của chúng tôi", 
                        trung tâm không ngừng đầu tư nâng cấp cơ sở vật chất, sân tập 
                        chuẩn ISO và đội ngũ giáo viên tận tâm. Chúng tôi cam kết mang 
                        đến cho học viên những giờ học chất lượng, kỹ năng lái xe thực 
                        tế và sự tự tin khi tham gia giao thông.
                    </p>
                </div>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div className='flex items-start gap-3'>
                        <span className='material-symbols-outlined text-[#135bec] mt-1'>school</span>
                        <div>
                            <h4 className='font-bold text-[#111318]'>Đào tạo chuẩn</h4>
                        <p className='text-sm text-gray-600 font-medium'>Giáo trình bám sát quy định mới nhất</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3'>
                        <span className='material-symbols-outlined text-[#135bec] mt-1'>directions_car</span>
                        <div>
                            <h4 className='font-bold text-[#111318]'>Xe tập đời mới</h4>
                        <p className='text-sm text-gray-600 font-medium'>100% xe tập có máy lạnh, cảm biến</p>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <button onClick={handleViewDetails} type='button' className='inline-flex items-center text-[#135bec] font-bold hover:text-blue-700 transition-colors group'>
                        Xem chi tiết về chúng tôi
                        <span className='material-symbols-outlined ml-1 text-lg group-hover:translate-x-1 transition-transform'>arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Introduce
