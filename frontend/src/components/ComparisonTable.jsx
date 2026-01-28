import React from 'react'

const ComparisonTable = () => {
  return (
    <div className='bg-gray-50 py-16 dark:bg-gray-900/50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-10 text-center sm:text-left'>
            <h2 className='text-2xl font-bold text-[#111318] dark:text-white'>
                So Sánh Chi Tiết Các Hạng Bằng
            </h2>
            <p className='text-[#616f89] dark:text-gray-400'>
                Thông tin kỹ thuật và quy định đào tạo
            </p>
        </div>
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-surface-dark'>
            <div className='overflow-x-auto'>
                <table className='w-full min-w-[800px] border-collapse text-left'>
                    <thead>
                        <tr className='bg-gray-50 dark:bg-gray-800'>
                            <th className='p-4 text-sm font-semibold text-[#111318] dark:text-white w-1/4'>Tiêu chí</th>
                            <th className='p-4 text-sm font-bold text-[#111318] dark:text-white w-1/4'>Hạng B1</th>
                            <th className='p-4 text-sm font-bold text-[#135bec] dark:text-[#135bec] w-1/4'>Hạng B2</th>
                            <th className='p-4 text-sm font-bold text-[#111318] dark:text-white w-1/4'>Hạng C</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        <tr>
                            <td className='p-4 text-sm font-medium text-[#111318] dark:text-gray-200'>Loại xe được lái</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>Số tự động &lt; 9 chỗ, <br/>Không kinh doanh</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>Số sàn &amp; tự động &lt; 9 chỗ, <br/>Kinh doanh vận tải</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>Xe tải &gt; 3.5 tấn, <br/>Xe du lịch &lt; 9 chỗ</td>
                        </tr>
                        <tr>
                            <td className='p-4 text-sm font-medium text-[#111318] dark:text-gray-200'>Thời gian đào tạo</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>2.5 - 3 tháng</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>3 - 3.5 tháng</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>5 - 5.5 tháng</td>
                        </tr>
                        <tr>
                            <td className='p-4 text-sm font-medium text-[#111318] dark:text-gray-200'>Số km thực hành (DAT)</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>710 km</td>
                            <td className='p-4 text-sm font-semibold text-[#135bec]'>810 km</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>825 km</td>
                        </tr>
                        <tr>
                            <td className='p-4 text-sm font-medium text-[#111318] dark:text-gray-200'>Học xe Cabin (Mô phỏng)</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>3 giờ</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>3 giờ</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>3 giờ</td>
                        </tr>
                        <tr>
                            <td className='p-4 text-sm font-medium text-[#111318] dark:text-gray-200'>Yêu cầu sức khỏe</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>Bình thường, không dị tật tay chân</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>Tốt, đủ điều kiện lái xe kinh doanh</td>
                            <td className='p-4 text-sm text-[#616f89] dark:text-gray-400'>Tốt, đủ điều kiện lái xe tải nặng</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonTable
