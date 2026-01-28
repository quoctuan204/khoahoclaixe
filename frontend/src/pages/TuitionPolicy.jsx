import React from 'react'

const TuitionPolicy = () => {
  return (
    <div>
      <div className='relative bg-[#135bec] py-16 lg:py-24 overflow-hidden'>
        <div className='absolute inset-0 bg-cover bg-center opacity-10'
          style={{ backgroundImage: "url('/assets/cubes.png')" }}></div>
        <div className='layout-container flex justify-center relative z-10'>
          <div className='layout-content-container flex flex-col items-center text-center max-w-[800px] w-full px-4'>
            <div className='inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium text-white mb-6 backdrop-blur-sm'>
              <span className='material-symbols-outlined text-[#f97316] text-[20px]'>verified_user</span>
              Cam kết minh bạch 100%
            </div>
            <h1 className='text-white text-4xl lg:text-5xl font-black leading-tight mb-6'>Chính Sách Học Phí Trọn Gói</h1>
            <p className='text-blue-100 text-lg lg:text-xl max-w-2xl leading-relaxed'>
              Chúng tôi hiểu rằng sự minh bạch về tài chính là yếu tố quan trọng để bạn yên tâm học tập. 
              Học phí trọn gói có nghĩa là bạn chỉ đóng một lần duy nhất.
            </p>
          </div>
        </div>
      </div>

      {/* Chi tiết học phí */}
      <div className='bg-white py-16 lg:py-20'>
        <div className='layout-container flex justify-center'>
          <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
            <div className='w-full max-w-[900px] mx-auto'>
              <div className='w-full'>
                <h2 className='text-[#111318] text-3xl font-bold mb-6 flex items-center gap-3'>
                  <span className='bg-primary/10 p-2 rounded-lg text-primary'><span className='material-symbols-outlined'>payments</span></span>
                  Học phí bao gồm những gì?
                </h2>
                <p className='text-gray-600 text-lg mb-8 leading-relaxed'>
                  Khi bạn đăng ký khóa học lái xe, mức học phí bạn được thông báo là con số cuối cùng. 
                  Chúng tôi chi trả tất cả các khoản chi phí cần thiết để đưa bạn từ một người chưa biết lái xe đến 
                  khi cầm tấm bằng trên tay.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                  {/* Phí hồ sơ & Thủ tục */}
                  <div className='flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all'>
                    <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600'>
                      <span className='material-symbols-outlined'>folder_open</span>
                    </div>
                    <div>
                      <h3 className='font-bold text-[#111318] text-lg'>Phí hồ sơ &amp; Thủ tục</h3>
                      <p className='text-gray-500 text-sm mt-1'>
                        Bao gồm phí đăng ký lên Sở GTVT, làm thẻ học viên, phí in ấn tài liệu và khám sức khỏe tập trung.
                      </p>
                    </div>
                  </div>

                  {/* Đào tạo lý thuyết */}
                  <div className='flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all'>
                    <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-primary'>
                      <span className='material-symbols-outlined'>menu_book</span>
                    </div>
                    <div>
                      <h3 className='font-bold text-[#111318] text-lg'>Đào tạo Lý thuyết</h3>
                      <p className='text-gray-500 text-sm mt-1'>
                        Cung cấp miễn phí trọn bộ tài liệu 600 câu hỏi, phần mềm ôn thi trên điện thoại/máy tính và các lớp học lý thuyết không giới hạn.
                      </p>
                    </div>
                  </div>

                  {/* Xăng xe và sân bãi */}
                  <div className='flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all'>
                    <div className='w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-accent'>
                      <span className='material-symbols-outlined'>local_gas_station</span>
                    </div>
                    <div>
                      <h3 className='font-bold text-[#111318] text-lg'>Xăng xe &amp; Sân bãi</h3>
                      <p className='text-gray-500 text-sm mt-1'>
                        100% chi phí xăng xe thực hành. Phí thuê sân tập sa hình chuẩn, sân tập lái đường trường.
                      </p>
                    </div>
                  </div>

                  {/* Công giáo viên */}
                  <div className='flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all'>
                    <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0 text-purple-600'>
                      <span className='material-symbols-outlined'>engineering</span>
                    </div>
                    <div>
                      <h3 className='font-bold text-[#111318] text-lg'>Công giáo viên</h3>
                      <p className='text-gray-500 text-sm mt-1'>
                        Thù lao cho giáo viên hướng dẫn 1 kèm 1 hoặc theo nhóm (tùy gói), cam kết giáo viên nhiệt tình, không vòi vĩnh.
                      </p>
                    </div>
                  </div>

                  {/* Lệ phí thi sát hạch */}
                  <div className='flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all'>
                    <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600'>
                      <span className='material-symbols-outlined'>assignment_turned_in</span>
                    </div>
                    <div>
                      <h3 className='font-bold text-[#111318] text-lg'>Lệ phí thi Sát hạch</h3>
                      <p className='text-gray-500 text-sm mt-1'>
                        Bao gồm lệ phí thi tốt nghiệp và lệ phí thi sát hạch cấp bằng lần đầu tiên.
                      </p>
                    </div>
                  </div>

                  {/* Cấp bằng PET */}
                  <div className='flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all'>
                    <div className='w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center shrink-0 text-teal-600'>
                      <span className='material-symbols-outlined'>card_membership</span>
                    </div>
                    <div>
                      <h3 className='font-bold text-[#111318] text-lg'>Cấp bằng PET</h3>
                      <p className='text-gray-500 text-sm mt-1'>
                        Chi phí in bằng lái thẻ PET và chuyển phát hồ sơ gốc về trung tâm cho học viên.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cam kết */}
                <div className='mt-10 p-8 bg-blue-50/50 border border-blue-100 rounded-2xl'>
                  <h3 className='text-primary font-bold text-2xl mb-4 flex items-center gap-2'>
                    <span className='material-symbols-outlined text-3xl'>verified</span>
                    Cam kết "3 KHÔNG"
                  </h3>
                  <div className='space-y-4'>

                    {/* block */}
                    <div className='flex items-start gap-4'>
                      <div className='bg-white p-2 rounded-lg shadow-sm text-green-600 mt-1'>
                        <span className='material-symbols-outlined text-xl'>block</span>
                      </div>
                      <div>
                        <h4 className='font-bold text-gray-900 text-lg'>Không phát sinh chi phí</h4>
                        <p className='text-gray-600'>Mọi khoản thu đều được ghi rõ trong hợp đồng pháp lý ngay từ đầu.</p>
                      </div>
                    </div>

                    {/* coffee_maker */}
                    <div className='flex items-start gap-4'>
                      <div className='bg-white p-2 rounded-lg shadow-sm text-green-600 mt-1'>
                        <span className='material-symbols-outlined text-xl'>coffee_maker</span>
                      </div>
                      <div>
                        <h4 className='font-bold text-gray-900 text-lg'>KHÔNG "tiền trà nước"</h4>
                        <p className='text-gray-600'>Học viên không phải mời thầy ăn uống hay bồi dưỡng thêm bất kỳ khoản nào.</p>
                      </div>
                    </div>

                    {/* trending_flat */}
                    <div className='flex items-start gap-4'>
                      <div className='bg-white p-2 rounded-lg shadow-sm text-green-600 mt-1'>
                        <span className='material-symbols-outlined text-xl'>trending_flat</span>
                      </div>
                      <div>
                        <h4 className='font-bold text-gray-900 text-lg'>KHÔNG thu thêm phí xăng xe</h4>
                        <p className='text-gray-600'>Dù giá xăng thị trường có tăng, mức học phí bạn đã đóng vẫn được giữ nguyên.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-16'>
                  <h2 className='text-[#111318] text-3xl font-bold mb-8 flex items-center gap-3'>
                    <span className='bg-accent/10 p-2 rounded-lg text-accent'><span className='material-symbols-outlined'>account_balance_wallet</span></span>
                    Các lựa chọn linh hoạt
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

                    {/* tiền mặt */}
                    <div className='p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center group'>
                      <div className='w-16 h-16 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors flex items-center justify-center text-blue-600 mb-6'>
                        <span className='material-symbols-outlined text-3xl'>payments</span>
                      </div>
                      <h4 className='font-bold text-xl text-[#111318] mb-3'>Tiền mặt</h4>
                      <p className='text-gray-500 text-sm leading-relaxed'>
                        Thanh toán trực tiếp tại văn phòng tuyển sinh của trung tâm.
                      </p>
                    </div>
                    
                    {/* chuyển khoản */}
                    <div className='p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center group'>
                      <div className='w-16 h-16 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-colors flex items-center justify-center text-purple-600 mb-6'>
                        <span className='material-symbols-outlined text-3xl'>account_balance</span>
                      </div>
                      <h4 className='font-bold text-xl text-[#111318] mb-3'>Chuyển khoản</h4>
                      <p className='text-gray-500 text-sm leading-relaxed'>
                        Hỗ trợ chuyển khoản qua tất cả ngân hàng nội địa hoặc quét mã QR Code tiện lợi.
                      </p>
                    </div>

                    {/* Trả góp */}
                    <div className='p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center group'>
                      <div className='w-16 h-16 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors flex items-center justify-center text-green-600 mb-6'>
                        <span className='material-symbols-outlined text-3xl'>credit_card</span>
                      </div>
                      <h4 className='font-bold text-xl text-[#111318] mb-3'>Trả góp 0%</h4>
                      <p className='text-gray-500 text-sm leading-relaxed'>
                        Hỗ trợ trả góp lãi suất 0% kỳ hạn linh hoạt qua thẻ tín dụng (liên kết 25 ngân hàng).
                      </p>
                    </div>
                  </div>     
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Câu hỏi thường gặp về học phí */}
      <div className='bg-[#f8f9fa] py-16'>
        <div className='layout-container flex justify-center'>
          <div className='layout-content-container flex flex-col max-w-[1000px] w-full px-4 lg:px-10'>
            <div className='text-center mb-12'>
              <span className='text-primary font-bold uppercase tracking-wider text-sm'>Giải đáp thắc mắc</span>
              <h2 className='text-[#111318] text-3xl font-black mt-2'>Câu hỏi thường gặp về Học phí</h2>
            </div>

            <div className='space-y-4'>

              {/* Câu 1 */}
              <details className='group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <summary className='flex justify-between items-center p-6 cursor-pointer list-none'>
                  <h3 className='font-bold text-lg text-[#111318]'>
                    Nếu thi trượt thì tôi có phải đóng tiền thi lại không?
                  </h3>
                  <span className='transition group-open:rotate-180'>
                    <span className='material-symbols-outlined text-gray-400'>expand_more</span>
                  </span>
                </summary>
                <div className='px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4'>
                  Học phí trọn gói đã bao gồm lệ phí thi lần đầu tiên. Nếu không may thi trượt, bạn sẽ cần đóng lệ 
                  phí thi lại theo quy định của Sở GTVT (khoảng 600.000đ - 800.000đ tùy thời điểm). Trung tâm sẽ hỗ 
                  trợ bạn đăng ký thi lại sớm nhất.
                </div>
              </details>

              {/* Câu 2 */}
              <details className='group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <summary className='flex justify-between items-center p-6 cursor-pointer list-none'>
                  <h3 className='font-bold text-lg text-[#111318]'>
                    Tôi có được chia nhỏ học phí để đóng không?
                  </h3>
                  <span className='transition group-open:rotate-180'>
                    <span className='material-symbols-outlined text-gray-400'>expand_more</span>
                  </span>
                </summary>
                <div className='px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4'>
                  Có. Để giảm áp lực tài chính, SafeDrive cho phép học viên chia học phí thành 2-3 đợt đóng. Đợt 1 
                  đóng khi đăng ký nhập học, các đợt sau đóng trước khi học thực hành hoặc thi tốt nghiệp. Ngoài ra, 
                  chúng tôi hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng.
                </div>
              </details>

              {/* Câu 3 */}
              <details className='group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <summary className='flex justify-between items-center p-6 cursor-pointer list-none'>
                  <h3 className='font-bold text-lg text-[#111318]'>
                    Chi phí thuê xe chip (xe cảm ứng) có bao gồm không?
                  </h3>
                  <span className='transition group-open:rotate-180'>
                    <span className='material-symbols-outlined text-gray-400'>expand_more</span>
                  </span>
                </summary>
                <div className='px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4'>
                  Gói tiêu chuẩn thường bao gồm 1-2 giờ tập xe chip (xe thi thử). Nếu bạn muốn tập thêm nhiều giờ hơn để tự tin, 
                  chi phí thuê xe chip thêm sẽ được tính riêng theo giờ (khoảng 300.000đ - 400.000đ/giờ) và trả trực tiếp cho sân 
                  sát hạch.
                </div>
              </details>

              {/* Câu 4 */}
              <details className='group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <summary className='flex justify-between items-center p-6 cursor-pointer list-none'>
                  <h3 className='font-bold text-lg text-[#111318]'>
                    Có ưu đãi gì nếu đăng ký nhóm không?
                  </h3>
                  <span className='transition group-open:rotate-180'>
                    <span className='material-symbols-outlined text-gray-400'>expand_more</span>
                  </span>
                </summary>
                <div className='px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4'>
                  Chắc chắn rồi! SafeDrive có chính sách ưu đãi hấp dẫn cho nhóm đăng ký cùng lúc: Giảm 500.000đ/người 
                  cho nhóm 2 người, Giảm 1.000.000đ/người cho nhóm từ 3 người trở lên.
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TuitionPolicy