import React from 'react'

const DetailedIntroduction = () => {
  return (
    <div className='relative w-full bg-white dark:bg-background-dark py-16 lg:py-24'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-start text-left mb-10'>
            <span className='text-[#f97316] font-bold uppercase tracking-widest text-sm mb-2'>
                Giới thiệu
            </span>
            <h1 className='text-[#111318] dark:text-white text-4xl sm:text-5xl font-extrabold uppercase leading-tight tracking-tight mb-6'>
                SÂN TẬP LÁI XE CẦN ĐƯỚC
            </h1>
            <div className='w-20 h-1.5 bg-[#f97316]/80 rounded-full mb-8'></div>
            <div className='prose prose-lg dark:prose-invert max-w-none text-[#4b5563] dark:text-gray-300'>
                <p className='font-medium text-lg mb-6 italic'>
                    Lời đầu tiên, cho phép chúng tôi gửi tới quý khách những lời chúc an lành và tốt đẹp nhất.
                </p>
                <p className='mb-6 leading-relaxed'>
                    Là một trong những doanh nghiệp tại VN, hoạt động chuyên về lĩnh vực <strong className='text-primary dark:text-blue-
                    400'>Đào Tạo và Sát Hạch thi lấy GPLX hạng B (Số tự động) hạng B (Số sàn) và hạng C (Tải)</strong>. Sau
                    nhiều năm hoạt động, được sự ủng hộ và tin tưởng của quý học viên, Trung tâm Đào Tạo và Sát Hạch lái xe 
                    Hoàng Gia chúng tôi đã không ngừng nỗ lực nâng cao chất lượng đào tạo.
                </p>
                <p className='mb-6 leading-relaxed'>
                    Và hiện nay, chúng tôi đã tập trung đầu tư mạnh về phương tiện và thiết bị cảm ứng nhằm phục vụ tốt hơn 
                    nữa trong công tác đào tạo. Đồng thời chúng tôi cũng tiến hành liên kết với rất nhiều đơn vị đào tạo nhằm 
                    mở rộng quy mô sát hạch. Với mục tiêu <em className='font-bold text-[#111318] dark:text-white'>"Vì quyền 
                    lợi học tập của quý học viên"</em> chúng tôi luôn nghiên cứu đổi mới quy trình quản lý và đào tạo, giúp 
                    quý học viên học và thi GPLX được dễ dàng.
                </p>
                <p className='mb-6 leading-relaxed'>
                    Chúng tôi có một đội ngũ nhân viên và giáo viên chuyên nghiệp, dạy nhiệt tình, thực hành nhuần nhuyễn và 
                    chăm sóc kỹ lưỡng. Tỷ lệ học viên học, đỗ sát hạch và được cấp GPLX tại Trung tâm là trên 90%. Số học viên 
                    chưa đạt sẽ đăng ký và được thi lại vào khoảng 2 đến 3 tuần sau đó.
                </p>
                <p className='mb-6 leading-relaxed'>
                    Đặc biệt chúng tôi tạo lập thêm nhiều giá trị mới giúp cho quý học viên sau khóa học không chỉ là có được 
                    "Giấy phép lái xe" mà điều quan trọng đáng quý là có được kỹ năng lái xe chuẩn mực, đồng thời quý học viên 
                    nắm bắt đầy đủ các kiến thức cơ bản về xe, về luật để chấp hành luật tốt và an toàn khi tham gia giao thông, 
                    góp một phần nào giúp cho quý học viên vững bước trên đường thành công và phát triển sự nghiệp.
                </p>
                <p className='mb-6 leading-relaxed'>
                    Tiêu chí hoạt động của chúng tôi là luôn mang lại cho quý học viên đầy đủ các yếu tố sau:
                </p>
                <ul className='mb-8 list-disc pl-6 space-y-3'>
                    <li>Kỹ năng lái xe và tinh thần đạo đức tốt nhất.</li>
                    <li>Thời gian học tập linh động nhất.</li>
                    <li>Thông thạo Luật Giao thông đường bộ và có ý thức chấp hành tốt.</li>
                </ul>
                <p className='font-extrabold text-[#f97316] uppercase text-lg mb-6'>
                    RẤT HÂN HẠNH ĐƯỢC ĐÓN TIẾP QUÝ KHÁCH!
                </p>
                <p className='font-semibold mb-4'>
                    Mọi chi tiết vui lòng liên hệ về Trung tâm:
                </p>
                <div className='space-y-2'>
                    <p>
                        <strong>VĂN PHÒNG:</strong> GJP2+X7X, Mỹ Lệ, Cần Đước, Long An, Việt Nam
                    </p>
                    <p>
                        <strong>ĐIỆN THOẠI:</strong> 1900 1000
                    </p>
                    <p>
                        <strong>SMS:</strong> 0909 1000 10
                    </p>
                    <p>
                        <strong>MOB:</strong> 0987654321
                    </p>
                    <p>
                        <strong>EMAIL:</strong>{' '}
                        <a href="daotaosathach@gmail.com"
                            className='text-primary dark:text-blue-400 underline'>
                                daotaosathach@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default DetailedIntroduction
