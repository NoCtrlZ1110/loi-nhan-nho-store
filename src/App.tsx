import { useState, useRef } from 'react';
import './index.css';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import ShopeeIcon from './icons/ShopeeIcon';
import ThreadsIcon from './icons/ThreadsIcon';
import TikTokIcon from './icons/TikTokIcon';
import { useGoogleSheetProducts } from './hooks/useGoogleSheetProducts';

// Google Form configuration
// Replace FORM_ID with your actual Google Form ID
// Replace each ENTRY_ID with the actual entry IDs from your Google Form
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSey4uawJAtGYiVTBBOlbJOJ00onP_NnnKYxde7vFdVmo7gRuA/formResponse';
const FORM_ENTRIES = {
  fullName: 'entry.527082014',
  keychainContent: 'entry.574613159',
  productStyle: 'entry.1051166331',
  address: 'entry.1855916917',
  phone: 'entry.544541788',
  note: 'entry.1592277776',
};

const VN_PHONE_REGEX =
  /^(0|\+84)(3[2-9]|5[6-9]|7[06-9]|8[0-9]|9[0-9])[0-9]{7}$/;

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface FormData {
  fullName: string;
  keychainContent: string;
  productStyle: string;
  address: string;
  phone: string;
  note: string;
}

function ProductCard({
  name,
  link,
  img,
}: {
  name: string;
  link: string;
  img: string;
}) {
  return (
    <a
      href={link}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center rounded-2xl overflow-hidden border-2 border-dashed hover:shadow-lg transition-all active:scale-[0.98]'
      style={{ borderColor: '#f06292', background: 'white' }}
    >
      <div className='w-36 h-28 flex-shrink-0 overflow-hidden'>
        <img src={img} alt={name} className='w-full h-full object-cover' />
      </div>
      <div className='flex-1 px-4'>
        <p
          className='font-extrabold text-sm uppercase leading-snug'
          style={{ color: '#ad1457' }}
        >
          {name}
        </p>
        <p className='text-xs mt-2 font-semibold' style={{ color: '#f06292' }}>
          🛒 Xem trên Shopee
        </p>
      </div>
    </a>
  );
}

export default function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [form, setForm] = useState<FormData>({
    fullName: '',
    keychainContent: '',
    productStyle: '',
    address: '',
    phone: '',
    note: '',
  });
  const toastIdRef = useRef(0);
  const { products, loading } = useGoogleSheetProducts();

  function showToast(message: string, type: 'success' | 'error') {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!VN_PHONE_REGEX.test(form.phone)) {
      setPhoneError(
        'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)'
      );
      return;
    }
    setPhoneError('');
    setSubmitting(true);

    const body = new URLSearchParams();
    body.append(FORM_ENTRIES.fullName, form.fullName);
    body.append(FORM_ENTRIES.keychainContent, form.keychainContent);
    body.append(FORM_ENTRIES.productStyle, form.productStyle);
    body.append(FORM_ENTRIES.address, form.address);
    body.append(FORM_ENTRIES.phone, form.phone);
    body.append(FORM_ENTRIES.note, form.note);

    try {
      // Google Forms does not support CORS, so we use no-cors mode.
      // The request will succeed (opaque response) but we can't read the response.
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      showToast(
        'Đặt hàng thành công! Mình sẽ liên hệ bạn sớm nhất 💌',
        'success'
      );
      setForm({
        fullName: '',
        keychainContent: '',
        productStyle: '',
        address: '',
        phone: '',
        note: '',
      });
    } catch {
      showToast('Có lỗi xảy ra, vui lòng thử lại sau nhé!', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className='w-full min-h-screen overflow-auto lg:p-4'
      style={{
        background:
          'linear-gradient(180deg, #fff0f5 0%, #ffffff 30%, #fff5f8 60%, #fce4ec 100%)',
      }}
    >
      <div
        className='mx-auto w-full flex flex-col h-full lg:p-4 lg:rounded-xl lg:border-2 lg:border-dashed lg:border-gray-300'
        style={{ maxWidth: 640 }}
      >
        {/* Toast container */}
        <div className='toast-container'>
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              {t.message}
            </div>
          ))}
        </div>

        {/* ── HERO ── */}
        <header className='relative overflow-hidden text-center lg:rounded-t-lg'>
          <div>
            <img
              src='/cover.jpg'
              alt='Hương Loan - Lời Nhắn Nhỏ Store'
              className='w-full block max-h-100 object-cover'
            />
            <div
              className='
                mask absolute w-full
                [inset:50%_0_0]
                z-[2]
                bg-cover bg-center
                overflow-hidden
                [transform:translateZ(0)]
                [background:linear-gradient(rgba(0,0,0,0),white)]
                filter-none
              '
            />
          </div>
          <div
            className='absolute inset-0'
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 100%)',
            }}
          />
        </header>
        <h1
          className='font-cursive text-3xl drop-shadow-lg text-center mb-4 leading-12'
          style={{
            color: 'rgb(233, 30, 99)',
          }}
        >
          Hương Loan
          <br />
          Lời Nhắn Nhỏ Store
        </h1>
        <div className='section-divider' />

        {/* ── PRODUCTS ── */}
        <section id='products' className='py-10 px-4'>
          <div className='max-w-lg mx-auto'>
            <div className='text-center mb-6'>
              <p className='text-sm font-medium' style={{ color: '#ad1457' }}>
                Mọi người đặt móc khoá ở dưới đây nha ạ 😘
              </p>
            </div>
            <div className='flex flex-col gap-4'>
              {products.map((p) => (
                <ProductCard
                  key={p.link}
                  name={p.name}
                  link={p.link}
                  img={p.img}
                />
              ))}
            </div>
            <div className='text-center mt-4'>
              {/* Button tat ca */}
              <a
                href='https://s.shopee.vn/4VYdz2wpeR'
                target='_blank'
                rel='noopener noreferrer'
                className='w-full py-3 rounded-xl font-bold text-white text-base transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
                style={{
                  background: 'linear-gradient(135deg, #e91e63, #f06292)',
                }}
              >
                Xem tất cả sản phẩm
                {loading && (
                  <svg
                    className='animate-spin w-4 h-4'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                )}
              </a>
            </div>
          </div>
        </section>

        <div className='section-divider' />

        {/* ── ORDER FORM ── */}
        <section id='order-form' className='py-14 px-4 hidden'>
          <div className='max-w-lg mx-auto'>
            <div className='text-center mb-8'>
              <div className='text-3xl mb-2'>📝</div>
              <h2
                className='font-cursive text-3xl mb-2'
                style={{ color: '#e91e63' }}
              >
                Đặt Hàng Ngay
              </h2>
              <p className='text-sm font-medium' style={{ color: '#ad1457' }}>
                Điền thông tin bên dưới, mình sẽ liên hệ bạn sớm nhất nhé! 🌟
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className='bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-5'
              style={{ border: '2px solid #fce4ec' }}
            >
              <div>
                <label
                  className='block text-sm font-bold mb-1'
                  style={{ color: '#ad1457' }}
                >
                  Họ và Tên <span style={{ color: '#e91e63' }}>*</span>
                </label>
                <input
                  type='text'
                  name='fullName'
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder='VD: Nguyễn Văn A'
                  className='w-full px-4 py-3 rounded-xl border-2 text-sm'
                  style={{ borderColor: '#f8bbd0', color: '#6a1b3a' }}
                />
              </div>

              <div>
                <label
                  className='block text-sm font-bold mb-1'
                  style={{ color: '#ad1457' }}
                >
                  Nội dung móc khóa <span style={{ color: '#e91e63' }}>*</span>
                </label>
                <input
                  type='text'
                  name='keychainContent'
                  required
                  value={form.keychainContent}
                  onChange={handleChange}
                  placeholder='VD: Tên, chữ cái, hình yêu thích...'
                  className='w-full px-4 py-3 rounded-xl border-2 text-sm'
                  style={{ borderColor: '#f8bbd0', color: '#6a1b3a' }}
                />
              </div>

              <div>
                <label
                  className='block text-sm font-bold mb-1'
                  style={{ color: '#ad1457' }}
                >
                  Kiểu sản phẩm
                </label>
                <select
                  name='productStyle'
                  value={form.productStyle}
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-xl border-2 text-sm'
                  style={{ borderColor: '#f8bbd0', color: '#6a1b3a' }}
                >
                  <option value=''>-- Chọn kiểu --</option>
                  <option value='Chữ cái / Tên'>🔤 Chữ cái / Tên</option>
                  <option value='Hình thú cưng'>🐾 Hình thú cưng</option>
                  <option value='Hoa / Thiên nhiên'>
                    🌸 Hoa / Thiên nhiên
                  </option>
                  <option value='Trái tim / Tình yêu'>
                    💕 Trái tim / Tình yêu
                  </option>
                  <option value='Hoạt hình / Cute'>🧸 Hoạt hình / Cute</option>
                  <option value='Khác'>✨ Khác (ghi ở ghi chú)</option>
                </select>
              </div>

              <div>
                <label
                  className='block text-sm font-bold mb-1'
                  style={{ color: '#ad1457' }}
                >
                  Địa chỉ nhận hàng <span style={{ color: '#e91e63' }}>*</span>
                </label>
                <textarea
                  name='address'
                  required
                  rows={2}
                  value={form.address}
                  onChange={handleChange}
                  placeholder='Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP'
                  className='w-full px-4 py-3 rounded-xl border-2 text-sm resize-none'
                  style={{ borderColor: '#f8bbd0', color: '#6a1b3a' }}
                />
              </div>

              <div>
                <label
                  className='block text-sm font-bold mb-1'
                  style={{ color: '#ad1457' }}
                >
                  Số điện thoại <span style={{ color: '#e91e63' }}>*</span>
                </label>
                <input
                  type='tel'
                  name='phone'
                  required
                  value={form.phone}
                  onChange={(e) => {
                    setPhoneError('');
                    handleChange(e);
                  }}
                  placeholder='VD: 0912345678'
                  className='w-full px-4 py-3 rounded-xl border-2 text-sm'
                  style={{
                    borderColor: phoneError ? '#e91e63' : '#f8bbd0',
                    color: '#6a1b3a',
                  }}
                />
                {phoneError && (
                  <p className='mt-1 text-xs' style={{ color: '#e91e63' }}>
                    {phoneError}
                  </p>
                )}
              </div>

              <div>
                <label
                  className='block text-sm font-bold mb-1'
                  style={{ color: '#ad1457' }}
                >
                  Ghi chú thêm
                </label>
                <textarea
                  name='note'
                  rows={2}
                  value={form.note}
                  onChange={handleChange}
                  placeholder='Màu sắc yêu thích, yêu cầu đặc biệt...'
                  className='w-full px-4 py-3 rounded-xl border-2 text-sm resize-none'
                  style={{ borderColor: '#f8bbd0', color: '#6a1b3a' }}
                />
              </div>

              <button
                type='submit'
                disabled={submitting}
                className='w-full py-3 rounded-xl font-bold text-white text-base transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
                style={{
                  background: 'linear-gradient(135deg, #e91e63, #f06292)',
                }}
              >
                {submitting ? (
                  <>
                    <svg
                      className='animate-spin w-5 h-5'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v8H4z'
                      />
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi Đơn Đặt Hàng 💌'
                )}
              </button>
            </form>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className='py-8 px-4 text-center mt-auto'
          style={{
            background: 'linear-gradient(180deg, transparent, #fce4ec)',
          }}
        >
          <div className='text-2xl mb-2'>💌💖🍀</div>
          <p className='font-bold text-sm' style={{ color: '#ad1457' }}>
            Cảm ơn bạn đã ghé thăm! Hẹn gặp lại nhé 💕
          </p>

          {/* Social icons */}
          <div className='flex justify-center gap-4 mt-4 mb-3'>
            {/* Facebook */}
            <a
              href='https://www.facebook.com/profile.php?id=61578087008073'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Facebook'
              className='transition-transform hover:scale-110 active:scale-95'
            >
              <FacebookIcon width='32' height='32' fill='#1877F2' />
            </a>

            {/* TikTok */}
            <a
              href='https://www.tiktok.com/@loi.nhan.nho.store'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='TikTok'
              className='transition-transform hover:scale-110 active:scale-95'
            >
              <TikTokIcon width='32' height='32' fill='#010101' />
            </a>

            {/* Shopee */}
            <a
              href='https://s.shopee.vn/4VYdz2wpeR'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Shopee'
              className='transition-transform hover:scale-110 active:scale-95'
            >
              <ShopeeIcon width='32' height='32' fill='#EE4D2D' />
            </a>

            {/* Threads */}
            <a
              href='https://www.threads.com/@loi.nhan.nho.store'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Threads'
              className='transition-transform hover:scale-110 active:scale-95'
            >
              <ThreadsIcon width='32' height='32' fill='#000000' />
            </a>

            {/* Instagram (TBD – placeholder link) */}
            <a
              href='https://www.instagram.com/loi.nhan.nho.store'
              aria-label='Instagram'
              className='transition-transform hover:scale-110 active:scale-95 opacity-40 cursor-not-allowed'
            >
              <InstagramIcon width='32' height='32' />
            </a>
          </div>

          <p className='text-xs mt-1' style={{ color: '#f06292' }}>
            © {new Date().getFullYear()} Lời Nhắn Nhỏ Store — Made with love ✨
          </p>
        </footer>
      </div>
    </div>
  );
}
