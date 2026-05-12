-- =============================================================
-- 1. XÓA BẢNG CŨ (Để tránh lỗi relation already exists)
-- =============================================================
DROP TABLE IF EXISTS public.otps CASCADE;
DROP TABLE IF EXISTS public.search_histories CASCADE;
DROP TABLE IF EXISTS public.bookmarks CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.cafe_images CASCADE;
DROP TABLE IF EXISTS public.cafes CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- =============================================================
-- 2. TẠO CẤU TRÚC BẢNG (Khai báo trực tiếp ràng buộc)
-- =============================================================

-- Bảng Users
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    email character varying(255) NOT NULL UNIQUE,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    role character varying(20) NOT NULL CHECK (role IN ('USER', 'OWNER')),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Cafes
CREATE TABLE public.cafes (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    owner_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name character varying(255) NOT NULL,
    description text,
    address character varying(255) NOT NULL,
    latitude numeric(10, 8),
    longitude numeric(11, 8),
    open_hours character varying(100),
    phone character varying(20),
    seat_status character varying(20) DEFAULT 'AVAILABLE' CHECK (seat_status IN ('AVAILABLE', 'ALMOST_FULL', 'FULL')),
    crowd_status character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Cafe Images
CREATE TABLE public.cafe_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Coupons
CREATE TABLE public.coupons (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
    code character varying(50) NOT NULL,
    description text,
    discount_value numeric(10, 2),
    valid_from timestamp with time zone NOT NULL,
    valid_to timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Reviews
CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content text,
    language character varying(10) CHECK (language IN ('JA', 'EN')),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Bookmarks
CREATE TABLE public.bookmarks (
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, cafe_id)
);

-- Bảng Search Histories
CREATE TABLE public.search_histories (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    search_query character varying(255),
    filters jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng OTPs
CREATE TABLE public.otps (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    email character varying(255) NOT NULL,
    otp_code character varying(6) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    is_used boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 3. CHÈN DỮ LIỆU MẪU (Dùng câu lệnh INSERT)
-- =============================================================

-- Chèn Users (Cần có trước để các bảng khác tham chiếu)
INSERT INTO public.users (id, email, password_hash, full_name, role) VALUES
('10000000-0000-0000-0000-000000000001', 'owner1@cafework.com', 'hashed_pwd_123', 'Tanaka Hiroshi', 'OWNER'),
('10000000-0000-0000-0000-000000000002', 'owner2@cafework.com', 'hashed_pwd_123', 'Nguyễn Văn Bình', 'OWNER'),
('20000000-0000-0000-0000-000000000001', 'user1@test.com', 'hashed_pwd_456', 'Nguyễn Bá Tú', 'USER');

-- Chèn Cafes
INSERT INTO public.cafes (id, owner_id, name, description, address, latitude, longitude, open_hours, phone, seat_status, crowd_status) VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Tranquil Books & Coffee', 'Không gian yên tĩnh, nhiều sách', '5 Nguyễn Quang Bích, Hoàn Kiếm, HN', 21.031023, 105.845814, '08:00 - 22:00', '0912345671', 'AVAILABLE', 'Vắng khách'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'The Coffee House', 'Bàn rộng, có ổ cắm, thích hợp họp nhóm', '23M Hai Bà Trưng, Hoàn Kiếm, HN', 21.025114, 105.852150, '07:30 - 22:30', '0912345672', 'ALMOST_FULL', 'Hơi đông');

-- Chèn Coupons
INSERT INTO public.coupons (id, cafe_id, code, description, discount_value, valid_from, valid_to) VALUES
(gen_random_uuid(), '30000000-0000-0000-0000-000000000002', 'SALE001', 'Giảm giá 20k cho sinh viên HUST', 20000.00, CURRENT_TIMESTAMP, '2026-12-31 23:59:59');

-- Chèn Reviews
INSERT INTO public.reviews (id, user_id, cafe_id, rating, content, language) VALUES
(gen_random_uuid(), '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 5, 'Quán rất yên tĩnh, wifi mạnh phù hợp code đồ án.', 'EN');

-- =============================================================
-- 4. TRUY VẤN KIỂM TRA
-- =============================================================
SELECT c.name, c.address, u.full_name as owner_name 
FROM public.cafes c
JOIN public.users u ON c.owner_id = u.id;