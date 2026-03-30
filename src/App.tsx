import { useState, useRef } from 'react';
import './index.css';

// ── Update gallery images here ──────────────────────────────────────────────
// Each item can be a URL string or an emoji (shown as placeholder when no URL)
const GALLERY_IMAGES: { src?: string; emoji: string; alt: string }[] = [
  { emoji: '🌸', alt: 'Hoa anh đào' },
  { emoji: '🐰', alt: 'Thỏ cute' },
  { emoji: '🦋', alt: 'Bướm xinh' },
  { emoji: '🌈', alt: 'Cầu vồng' },
  { emoji: '🍓', alt: 'Dâu tây' },
  { emoji: '💖', alt: 'Trái tim' },
];
// ────────────────────────────────────────────────────────────────────────────

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
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!VN_PHONE_REGEX.test(form.phone)) {
      setPhoneError(
        'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)',
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
        'success',
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
      className='w-full min-h-full overflow-auto'
      style={{
        background:
          'linear-gradient(180deg, #fff0f5 0%, #ffffff 30%, #fff5f8 60%, #fce4ec 100%)',
      }}
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
      <header className='relative overflow-hidden py-16 px-4 text-center'>
        <div
          className='blob'
          style={{
            width: 300,
            height: 300,
            background: '#f48fb1',
            top: -50,
            left: -80,
          }}
        />
        <div
          className='blob'
          style={{
            width: 250,
            height: 250,
            background: '#ce93d8',
            top: 40,
            right: -60,
          }}
        />
        <div
          className='blob'
          style={{
            width: 200,
            height: 200,
            background: '#ffcc80',
            bottom: -40,
            left: '40%',
          }}
        />

        <div className='relative z-10 max-w-2xl mx-auto anim-fade'>
          <div className='text-5xl mb-4 anim-float'>💌✨🍀</div>
          <h1
            className='font-cursive text-4xl md:text-5xl mb-3'
            style={{ color: '#e91e63' }}
          >
            Lời Nhắn Nhỏ Store
          </h1>
          <p
            className='text-xl md:text-2xl font-bold mb-3'
            style={{ color: '#ad1457' }}
          >
            Có những điều khó nói thành lời, để mình giúp bạn gửi đi 💌🍀
          </p>
          <p className='text-base md:text-lg mb-6' style={{ color: '#6a1b3a' }}>
            Được làm thủ công với tình yêu, dành riêng cho bạn. Quà tặng ý
            nghĩa, giá siêu yêu!
          </p>
          <a
            href='#order-form'
            className='flex flex-wrap gap-3 justify-center mb-6 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer'
          >
            <span className='price-tag text-lg'>Chỉ từ 25K - 50K VNĐ</span>
          </a>
          <div
            className='flex flex-wrap gap-2 justify-center text-sm font-semibold'
            style={{ color: '#e91e63' }}
          >
            <span className='bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow-sm'>
              🎨 Tuỳ chỉnh nội dung
            </span>
            <span className='bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow-sm'>
              💝 Làm thủ công
            </span>
            <span className='bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow-sm'>
              🚀 Giao hàng nhanh
            </span>
          </div>
        </div>
      </header>

      <div className='section-divider' />

      {/* ── GALLERY ── */}
      <section className='py-14 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='text-3xl mb-2'>🖼️</div>
          <h2
            className='font-cursive text-3xl mb-2'
            style={{ color: '#e91e63' }}
          >
            Bộ Sưu Tập
          </h2>
          <p className='mb-8 font-medium' style={{ color: '#ad1457' }}>
            Những mẫu móc khóa xinh xắn đang chờ bạn ✨
          </p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {GALLERY_IMAGES.map((item, i) => (
              <div
                key={i}
                className='gallery-placeholder anim-fade'
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className='w-full h-full object-cover rounded-2xl'
                  />
                ) : (
                  item.emoji
                )}
              </div>
            ))}
          </div>
          <p className='mt-4 text-sm font-medium' style={{ color: '#f06292' }}>
            📸 Hình ảnh sẽ được cập nhật sớm nhất!
          </p>
        </div>
      </section>

      <div className='section-divider' />

      {/* ── TESTIMONIALS ── */}
      <section
        className='py-14 px-4'
        style={{
          background:
            'linear-gradient(180deg, transparent, #fce4ec30, transparent)',
        }}
      >
        <div className='max-w-4xl mx-auto text-center'>
          <div className='text-3xl mb-2'>💬</div>
          <h2
            className='font-cursive text-3xl mb-8'
            style={{ color: '#e91e63' }}
          >
            Khách Hàng Nói Gì?
          </h2>
          <div className='grid md:grid-cols-3 gap-5'>
            {[
              {
                emoji: '🥰',
                name: 'Linh Nguyễn',
                delay: '0.1s',
                text: '"Móc khóa xinh quá luôn! Mình đặt cho cả nhóm bạn, ai cũng thích. Chất lượng tuyệt vời!"',
              },
              {
                emoji: '😍',
                name: 'Minh Anh',
                delay: '0.2s',
                text: '"Giao hàng nhanh, đóng gói dễ thương. Móc khóa làm quà Valentine hoàn hảo! 💕"',
              },
              {
                emoji: '🤩',
                name: 'Hải Đăng',
                delay: '0.3s',
                text: '"Giá rẻ mà chất lượng. Mình đã đặt lại lần 3 rồi. Shop tư vấn nhiệt tình lắm!"',
              },
            ].map((r) => (
              <div
                key={r.name}
                className='testimonial-card bg-white rounded-2xl p-6 shadow-md text-left anim-slide'
                style={{ animationDelay: r.delay }}
              >
                <div className='flex items-center gap-2 mb-3'>
                  <div
                    className='w-10 h-10 rounded-full flex items-center justify-center text-lg'
                    style={{ background: '#fce4ec' }}
                  >
                    {r.emoji}
                  </div>
                  <div>
                    <p
                      className='font-bold text-sm'
                      style={{ color: '#ad1457' }}
                    >
                      {r.name}
                    </p>
                    <div style={{ color: '#f06292' }}>⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className='text-sm' style={{ color: '#6a1b3a' }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className='section-divider' />

      {/* ── ORDER FORM ── */}
      <section id='order-form' className='py-14 px-4'>
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
                <option value='Hoa / Thiên nhiên'>🌸 Hoa / Thiên nhiên</option>
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
        className='py-8 px-4 text-center'
        style={{ background: 'linear-gradient(180deg, transparent, #fce4ec)' }}
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
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='#1877F2'
            >
              <path d='M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z' />
            </svg>
          </a>

          {/* TikTok */}
          <a
            href='https://www.tiktok.com/@loi.nhan.nho.store'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='TikTok'
            className='transition-transform hover:scale-110 active:scale-95'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='#010101'
            >
              <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z' />
            </svg>
          </a>

          {/* Instagram (TBD – placeholder link) */}
          <a
            href='#'
            aria-label='Instagram (sắp ra mắt)'
            className='transition-transform hover:scale-110 active:scale-95 opacity-40 cursor-not-allowed'
            onClick={(e) => e.preventDefault()}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 24 24'
            >
              <defs>
                <linearGradient id='ig-grad' x1='0%' y1='100%' x2='100%' y2='0%'>
                  <stop offset='0%' stopColor='#f09433' />
                  <stop offset='25%' stopColor='#e6683c' />
                  <stop offset='50%' stopColor='#dc2743' />
                  <stop offset='75%' stopColor='#cc2366' />
                  <stop offset='100%' stopColor='#bc1888' />
                </linearGradient>
              </defs>
              <path
                fill='url(#ig-grad)'
                d='M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.247 2.242 1.31 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.31 3.608-.975.975-2.242 1.247-3.608 1.31-1.265.058-1.645.069-4.849.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.31-.975-.975-1.247-2.242-1.31-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.31-3.608.975-.975 2.242-1.247 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.856.601 3.698 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.856-.085 3.698-.601 5.038-1.942 1.341-1.34 1.857-3.182 1.942-5.038C23.986 15.668 24 15.259 24 12s-.014-3.667-.072-4.947c-.085-1.856-.601-3.698-1.942-5.038C20.646.673 18.804.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z'
              />
            </svg>
          </a>
        </div>

        <p className='text-xs mt-1' style={{ color: '#f06292' }}>
          © {new Date().getFullYear()} Lời Nhắn Nhỏ Store — Made with love ✨
        </p>
      </footer>
    </div>
  );
}
