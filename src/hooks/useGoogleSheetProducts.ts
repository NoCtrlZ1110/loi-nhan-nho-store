import { useState, useEffect } from 'react';

interface Product {
  name: string;
  link: string;
  img: string;
}

const FALLBACK_PRODUCTS: Product[] = [
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

const SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbxTvNARIPCG1Ua9ZBw7uVjnKcO7L5JGFCOCxTQnXOzoYQafgdpxog1wk8oLRcqSlfQMZQ/exec';

export function useGoogleSheetProducts() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(SHEET_API_URL)
      .then((res) => res.json())
      .then((data: { STT: number; Name: string; Image: string; Link: string }[]) => {
        if (cancelled) return;
        const mapped: Product[] = data.map((row) => ({
          name: row.Name,
          link: row.Link,
          img: row.Image,
        }));
        if (mapped.length > 0) setProducts(mapped);
      })
      .catch(() => {
        // silently fall back to hardcoded products
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
