import { useState, useRef } from 'react';
import './index.css';

// ── Shopee products ─────────────────────────────────────────────────────────
const PRODUCTS: { name: string; link: string; img: string }[] = [
  {
    name: 'MÓC KHOÁ LỜI NHẴN HANDMADE',
    link: 'https://s.shopee.vn/3B3GMOvO0f',
    img: 'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mmozw47gjzt1cd@resize_w450_nl.webp',
  },
  {
    name: 'LÒ NƯỚNG Xinh Mình Dùng',
    link: 'https://s.shopee.vn/Lj4zWtMKM',
    img: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mivdthrk9khz73@resize_w450_nl.webp',
  },
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
    <div className='mx-auto w-full' style={{ maxWidth: 640 }}>
      {/* Toast container */}
      <div className='toast-container'>
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* ── HERO ── */}
      <header className='relative overflow-hidden text-center'>
        <img
          src='/cover.jpeg'
          alt='Hương Loan - Lời Nhắn Nhỏ Store'
          className='w-full block'
        />
        <div
          className='absolute inset-0'
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 100%)' }}
        />
        <div className='absolute inset-0 flex flex-col items-center justify-end pb-8 px-4 anim-fade'>
          <h1
            className='font-cursive text-4xl drop-shadow-lg'
            style={{ color: '#ffffff', textShadow: '0 2px 16px rgba(233,30,99,0.5), 0 1px 4px rgba(0,0,0,0.5)' }}
          >
            Hương Loan - Lời Nhắn Nhỏ Store
          </h1>
        </div>
      </header>

      <div className='section-divider' />

      {/* ── PRODUCTS ── */}
      <section id='products' className='py-10 px-4'>
        <div className='max-w-lg mx-auto'>
          <div className='text-center mb-6'>
            <div className='text-3xl mb-2'>🛒</div>
            <h2
              className='font-cursive text-3xl mb-2'
              style={{ color: '#e91e63' }}
            >
              Sản Phẩm
            </h2>
            <p className='text-sm font-medium' style={{ color: '#ad1457' }}>
              Mọi người đặt móc khoá ở dưới đây nha ạ 😘
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            {PRODUCTS.map((p) => (
              <ProductCard key={p.link} name={p.name} link={p.link} img={p.img} />
            ))}
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

          {/* Shopee */}
          <a
            href='https://s.shopee.vn/4VYdz2wpeR'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Shopee'
            className='transition-transform hover:scale-110 active:scale-95'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='#EE4D2D'
            >
              <path d='M12 1a5 5 0 0 0-5 5H5a2 2 0 0 0-2 2l-1 12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2L21 8a2 2 0 0 0-2-2h-2a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3H9a3 3 0 0 1 3-3zm0 7c2.21 0 4 1.34 4 3s-1.79 3-4 3-4-1.34-4-3 1.79-3 4-3zm0 1.5c-1.38 0-2.5.67-2.5 1.5s1.12 1.5 2.5 1.5 2.5-.67 2.5-1.5-1.12-1.5-2.5-1.5z'/>
            </svg>
          </a>

          {/* Threads */}
          <a
            href='https://www.threads.com/@loi.nhan.nho.store'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Threads'
            className='transition-transform hover:scale-110 active:scale-95'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='#000000'
            >
              <path d='M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.8-.409-1.382-.862-1.732-.761-.588-1.824-.607-2.658-.607h-.054c-.guillotine-635-.013-1.278.2-1.72.591l-1.376-1.558C8.908 5.78 10.034 5.31 11.61 5.3h.08c1.81 0 3.47.444 4.605 1.33 1.207.938 1.856 2.352 1.93 4.204.052.136.102.274.148.414.587 1.677.53 4.52-1.602 6.624-1.899 1.873-4.328 2.13-6.586 2.128zM13.35 13.22c-.433-.016-.87-.012-1.303.012-1.583.09-2.418.748-2.37 1.664.047.866.834 1.35 2.197 1.276 1.698-.091 2.659-1.086 2.659-2.748a8.907 8.907 0 0 0-1.183-.204z'/>
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
    </div>
  );
}
