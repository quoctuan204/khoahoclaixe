import React from 'react'
import { assets } from '../assets/assets'

const PassRate = () => {
    return (
        <div>
            {/* HEADER */}
            <div className='bg-white py-8 lg:py-12 border-b border-gray-100'>
                <div className='layout-container flex justify-center'>
                    <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
                        <nav aria-label='Breadcrumb' className='flex mb-6'>
                            <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                                <li className='inline-flex items-center'>
                                    <a className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#135bec]' href="/">
                                        <span className='material-symbols-outlined mr-2 text-lg'>home</span>
                                        Trang chủ
                                    </a>
                                </li>

                                <li>
                                    <div className='flex items-center'>
                                        <span className='material-symbols-outlined text-gray-400 mx-1'>chevron_right</span>
                                        <span className='text-sm font-medium text-gray-500'>Giới thiệu</span>
                                    </div>
                                </li>
                                <li aria-label='page'>
                                    <div className='flex items-center'>
                                        <span className='material-symbols-outlined text-gray-400 mx-1'>chevron_right</span>
                                        <span className='text-sm font-medium text-[#135bec]'>Hiệu quả đào tạo</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>

                        <div className='flex flex-col md:flex-row gap-8 items-start md:items-center justify-between'>
                            <div className='max-w-2xl'>
                                <h1 className='text-[#111318] text-3xl lg:text-5xl font-black leading-tight tracking-[-0.033em] mb-4'>
                                    Lý do học viên luôn đạt <span className='text-[#135bec]'>kết quả sát hạch cao</span>
                                </h1>
                                <p className='text-gray-600 text-lg leading-relaxed'>
                                    Chúng tôi không chỉ dạy lái xe để thi đậu, mà đào tạo kỹ năng để lái xe an toàn.
                                    Kết quả thi tốt là hệ quả tất yếu của một quy trình đào tạo bài bản, khoa học và
                                    sự tận tâm của đội ngũ giảng viên.
                                </p>
                            </div>

                            <div className='flex gap-4'>
                                <div className='flex flex-col items-center bg-blue-50 px-6 py-4 rounded-xl border border-blue-100'>
                                    <span className='text-3xl font-black text-[#135bec]'>5★</span>
                                    <span className='text-sm font-medium text-gray-600'>Chất lượng đào tạo</span>
                                </div>
                                <div className='flex flex-col items-center bg-orange-50 px-6 py-4 rounded-xl border border-orange-100'>
                                    <span className='text-3xl font-black text-[#f97316]'>10k+</span>
                                    <span className='text-sm font-medium text-gray-600'>Học viên tốt nghiệp</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phương pháp đào tạo */}
            <div className='py-12 lg:py-20 bg-[#f8f9fa]'>
                <div className='layout-container flex justify-center'>
                    <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
                            <div className='order-2 lg:order-1 relative'>
                                <div className='absolute inset-0 bg-[#135bec]/10 rounded-3xl transform rotate-3 scale-105 z-0'></div>
                                <img src={assets.passrate} className='relative z-10 rounded-3xl shadow-xl w-full object-cover h-[400px] lg:h-[500px]' alt="" />
                                <div className='absolute -bottom-6 -right-6 z-20 bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#f97316] max-w-[260px'>
                                    <p className='font-bold text-gray-800 text-lg mb-1'>
                                        "Vững vàng tay lái"
                                    </p>
                                    <p className='text-gray-500 text-sm'>
                                        Cam kết đồng hành và hỗ trợ tối đa cho từng học viên.
                                    </p>
                                </div>
                            </div>

                            <div className='order-1 lg:order-2 flex flex-col gap-8'>
                                <div>
                                    <span className='text-[#f97316] font-bold uppercase tracking-wider text-sm mb-2 block'>
                                        Phương pháp đào tạo
                                    </span>
                                    <h2 className='text-3xl lg:text-4xl font-bold text-[#111318] mb-6'>
                                        Giáo trình "Thực Chiến" <br /> Học đến đâu - Chắc đến đó
                                    </h2>
                                    <p className='text-gray-600 text-lg mb-6 leading-relaxed'>
                                        Khác với cách dạy truyền thống, SafeDrive áp dụng phương pháp đào tạo hiện đại:
                                        Lý thuyết đi đôi với thực hành ngay lập tức. Học viên được giải thích cặn kẽ luật
                                        giao thông và áp dụng ngay trên sa hình thực tế.
                                    </p>
                                </div>

                                <div className='space-y-6'>
                                    <div className='flex gap-4'>
                                        <div className='flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#135bec]'>
                                            <span className='material-symbols-outlined'>menu_book</span>
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold text-gray-900 mb-2'>Hệ thống kiến thức bài bản</h3>
                                            <p className='text-gray-600'>
                                                Phương pháp học hiểu bản chất, loại bỏ việc học vẹt. Ứng dụng công nghệ mô phỏng giúp
                                                học viên nắm bắt tình huống giao thông nhanh chóng.
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex gap-4'>
                                        <div className='flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#135bec]'>
                                            <span className='material-symbols-outlined'>school</span>
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold text-gray-900 mb-2'>1 Kèm 1 Cầm tay chỉ việc</h3>
                                            <p className='text-gray-600'>
                                                Giáo viên theo sát từng thao tác, chỉnh sửa thói quen lái xe sai ngay từ đầu. 
                                                Tối ưu thời gian thực hành trên vô lăng.
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex gap-4'>
                                        <div className='flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#135bec]'>
                                            <span className='material-symbols-outlined'>map</span>
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold text-gray-900 mb-2'>Sa hình chuẩn ISO</h3>
                                            <p className='text-gray-600'>
                                                Sân tập thiết kế đúng chuẩn sân thi sát hạch. Học viên quen sân, 
                                                quen xe nên khi đi thi tâm lý cực kỳ vững vàng.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lộ trình ôn luyện */}
            <div className='py-16 lg:py-24 bg-[#f8f9fa]'>
                <div className='layout-container flex justify-center'>
                    <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
                        <div className='text-center mb-16 max-w-3xl mx-auto'>
                            <span className='text-[#f97316] font-bold uppercase tracking-wider text-sm'>
                                Lộ trình ôn luyện
                            </span>
                            <h2 className='text-3xl lg:text-4xl font-bold text-[#111318] mt-2 mb-4'>
                                Quy trình "3 Bước Vàng" đảm bảo kỹ năng
                            </h2>
                            <p className='text-gray-600'>
                                Chúng tôi xây dựng lộ trình học tập khoa học, giúp học viên từ chưa biết gì trở 
                                thành tài xế vững tay lái, am hiểu luật chỉ sau một khóa học.
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative'>
                            <div className='hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-200 -z-0'></div>
                            {/* Bước 1 */}
                            <div className='flex flex-col items-center text-center relative z-10'>
                                <div className='w-24 h-24 rounded-full bg-white border-4 border-[#135bec] flex items-center justify-center mb-6 shadow-lg'>
                                    <span className='material-symbols-outlined text-4xl text-[#135bec]'>auto_stories</span>
                                </div>
                                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full hover:shadow-md transition-shadow'>
                                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                                        Bước 1: Nắm vững lý thuyết
                                    </h3>
                                    <p className='text-gray-600 text-sm'>
                                        Học luật giao thông, biển báo qua phần mềm trực quan. Hiểu rõ quy tắc để lái xe an toàn.
                                    </p>
                                </div>
                            </div>

                            {/* Bước 2 */}
                            <div className='flex flex-col items-center text-center relative z-10'>
                                <div className='w-24 h-24 rounded-full bg-white border-4 border-[#135bec] flex items-center justify-center mb-6 shadow-lg'>
                                    <span className='material-symbols-outlined text-4xl text-[#135bec]'>directions_car</span>
                                </div>
                                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full hover:shadow-md transition-shadow'>
                                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                                        Bước 2: Thực hành đường trường
                                    </h3>
                                    <p className='text-gray-600 text-sm'>
                                        Lái xe thực tế trên đường phố đông đúc, đường cao tốc để rèn luyện phản xạ và kỹ năng xử lý tình huống.
                                    </p>
                                </div>
                            </div>

                            {/* Bước 3 */}
                            <div className='flex flex-col items-center text-center relative z-10'>
                                <div className='w-24 h-24 rounded-full bg-white border-4 border-[#135bec] flex items-center justify-center mb-6 shadow-lg'>
                                    <span className='material-symbols-outlined text-4xl text-[#135bec]'>flag</span>
                                </div>
                                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full hover:shadow-md transition-shadow'>
                                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                                        Bước 3: Tổng ôn Sa hình
                                    </h3>
                                    <p className='text-gray-600 text-sm'>
                                        Luyện tập trên xe gắn chip chấm điểm tự động. Làm quen với áp lực thi cử và hoàn thiện kỹ năng.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Câu hỏi thường gặp */}
            <div className='py-16 bg-[#f8f9fa] border-t border-gray-200'>
                <div className='layout-container flex justify-center'>
                    <div className='layout-content-container flex flex-col max-w-[800px] w-full px-4 lg:px-10'>
                        <h2 className='text-3xl font-bold text-center text-[#111318] mb-10'>
                            Câu hỏi thường gặp về thi sát hạch
                        </h2>
                        <div className='flex flex-col gap-4'>

                            {/* Câu 1 */}
                            <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                                <details className='group'>
                                    <summary className='flex justify-between items-center font-medium cursor-pointer list-none'>
                                        <span className='text-lg font-bold text-gray-900'>
                                            Nếu thi trượt thì bao lâu được thi lại?
                                        </span>
                                        <span className='transition group-open:rotate-180'>
                                            <span className='material-symbols-outlined'>
                                                expand_more
                                            </span>
                                        </span>
                                    </summary>

                                    <div className='text-gray-600 mt-3 group-open:animate-fadeIn'>
                                        Thông thường, bạn sẽ được đăng ký thi lại sau khoảng 2-4 tuần kể từ ngày thi trượt. 
                                        Tôi sẽ hỗ trợ bạn đăng ký lịch thi lại sớm nhất có thể và tổ chức ôn tập bổ 
                                        sung miễn phí.
                                    </div>
                                </details>
                            </div>

                            {/* Câu 2 */}
                            <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                                <details className='group'>
                                    <summary className='flex justify-between items-center font-medium cursor-pointer list-none'>
                                        <span className='text-lg font-bold text-gray-900'>
                                            Thi tốt nghiệp và thi sát hạch khác nhau thế nào?
                                        </span>
                                        <span className='transition group-open:rotate-180'>
                                            <span className='material-symbols-outlined'>
                                                expand_more
                                            </span>
                                        </span>
                                    </summary>

                                    <div className='text-gray-600 mt-3 group-open:animate-fadeIn'>
                                        Thi tốt nghiệp là kỳ thi cấp chứng chỉ sơ cấp nghề do trung tâm tổ chức. 
                                        Sau khi đậu tốt nghiệp, bạn mới đủ điều kiện tham gia kỳ thi Sát hạch cấp 
                                        giấy phép lái xe do Sở GTVT tổ chức.
                                    </div>
                                </details>
                            </div>

                            {/* Câu 3 */}
                            <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                                <details className='group'>
                                    <summary className='flex justify-between items-center font-medium cursor-pointer list-none'>
                                        <span className='text-lg font-bold text-gray-900'>
                                            Học xe chip có quan trọng không?
                                        </span>
                                        <span className='transition group-open:rotate-180'>
                                            <span className='material-symbols-outlined'>
                                                expand_more
                                            </span>
                                        </span>
                                    </summary>

                                    <div className='text-gray-600 mt-3 group-open:animate-fadeIn'>
                                        Cực kỳ quan trọng! Xe chip là xe có gắn thiết bị chấm điểm tự động giống hệt xe thi thật. 
                                        Tập trên xe chip giúp bạn làm quen với sân thi, biết được các điểm trừ lỗi để tránh vi 
                                        phạm khi thi chính thức.
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PassRate
