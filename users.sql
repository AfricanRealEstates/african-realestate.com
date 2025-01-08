--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-0ubuntu0.23.10.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.users (
    id text DEFAULT concat('user_', replace((gen_random_uuid())::text, '-'::text, ''::text)) NOT NULL,
    name text,
    username text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    permissions text[],
    password text,
    "isVerified" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    token integer,
    "agentName" text,
    "agentEmail" text,
    "agentLocation" text,
    "officeLine" text,
    "whatsappNumber" text,
    "phoneNumber" text,
    address text,
    "postalCode" text,
    "profilePhoto" text,
    "coverPhoto" text,
    bio text,
    "xLink" text,
    "tiktokLink" text,
    "facebookLink" text,
    "youtubeLink" text,
    "linkedinLink" text,
    "instagramLink" text,
    "showAgentContact" boolean DEFAULT false,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isPremium" boolean DEFAULT false NOT NULL,
    "favoriteIds" text[]
);


ALTER TABLE public.users OWNER TO "default";

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.users (id, name, username, email, "emailVerified", image, role, permissions, password, "isVerified", "isActive", token, "agentName", "agentEmail", "agentLocation", "officeLine", "whatsappNumber", "phoneNumber", address, "postalCode", "profilePhoto", "coverPhoto", bio, "xLink", "tiktokLink", "facebookLink", "youtubeLink", "linkedinLink", "instagramLink", "showAgentContact", "createdAt", "updatedAt", "isPremium", "favoriteIds") FROM stdin;
user_e8f7ea7cc6114f0faf3dcc63d182091c	Ken Mwangi	\N	kenmwangi071@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocK3iYUFVSw05z4avyRP0FXUrr0fi0cZddLGaODdoC6EMnDDPow=s96-c	ADMIN	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2024-12-05 09:54:19.992	2024-12-05 10:48:43.236	f	\N
user_73756119025141cb9b239c650479eba6	john karanja	\N	karanjajohn147@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocIbVA4VNAhwjR_hs5qKU5pO-A5C5xILWeAyPrc-xyVEP_aevA=s96-c	AGENT	\N	\N	f	t	\N				\N	+254746460854	+254746460854			\N	\N	Selling 100 by 100 plot of land. 	Jkaranja	jkaranja	Mbugua  Karanja 	\N		Jkaranja 	f	2024-12-05 12:56:03.257	2024-12-05 13:09:53.521	f	\N
user_fa7fd79e748847b4b37a4e60dca5d472	Cosmas Aika	\N	cosmasaikara@gmail.com	\N	\N	USER	\N	$2a$12$9O2/duVyyb25vB5AZhfHDuzeM6euCyIWJ/j5rdxO4UmPUYMPce5iW	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2024-12-05 15:37:45.614	2024-12-05 15:37:45.614	f	\N
user_4ed14ac4af3a4647908c3461021971ee	MUKEMBO ALEX JURA	\N	linxander42@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocKJ6GH21OXkVyrjkar1-6LsXKIBhkd1FSPnoTq3tsnU-4S7-MF3=s96-c	USER	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2024-12-05 18:00:46.496	2024-12-05 18:00:46.496	f	\N
user_c9ca8cb987c84e5a8b65733100e267cd	African Real Estate	\N	africanrealestate0@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocK0oDMHhdMqpKgFnR3lyo74NHSKEbeukGnqUvk0yl_VeYugFOM=s96-c	USER	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2024-12-06 04:42:34.088	2024-12-06 04:42:34.088	f	\N
user_2b799ef3b3734b95baaf779bb1e341c0	dayshier atieno	\N	atienodayshier@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocIiJRxg1NWt4UFD_xgkia4wQkKqDAijv_RmZsLjWJ7VZbsVMwM=s96-c	AGENT	\N	\N	f	t	\N				\N	+254726092546	+254111366410			\N	\N	With over three years of experience in the dynamic real estate market, I specialize in off-plan properties across Kenya. My goal is to help clients unlock incredible investment opportunities and find their dream homes by providing expert guidance and market insights.\n\nHaving grown up in Nairobi, I have a deep understanding of Kenya’s real estate landscape, from bustling urban developments to serene suburban communities. I am committed to offering personalized service, ensuring that every client makes informed decisions in securing a property that aligns with their needs and goals.\n\nWhen I’m not helping clients navigate off-plan projects, I enjoy [personal hobby, e.g., exploring Kenya’s natural beauty, connecting with the local community, or staying updated on market trends].\n\nLet’s work together to turn your real estate vision into reality.				\N			f	2024-12-06 09:05:04.803	2024-12-06 09:11:49.091	f	\N
user_90dea5938c1d44d98e977cbfeccc58b9	MARTIN MUNGAI	\N	martinmungaik@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocKV6MTsWTZd-wbBDWi7rpt5-CbPw-HPX8kHkUnYKqFb9t2sgnk=s96-c	ADMIN	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2024-12-08 10:48:49.599	2024-12-08 10:53:28.504	f	\N
\.


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- PostgreSQL database dump complete
--

