create sequence "public"."listings_listing_id_seq";

create sequence "public"."nfts_token_id_seq";

create table "public"."favorites" (
    "profile_id" character varying(42) not null,
    "nft_id" integer not null
);


create table "public"."listings" (
    "listing_id" integer not null default nextval('listings_listing_id_seq'::regclass),
    "token_id" integer not null,
    "price" numeric(18,8) not null,
    "seller_address" character varying(42) not null,
    "is_active" boolean default true
);


create table "public"."nfts" (
    "token_id" integer not null default nextval('nfts_token_id_seq'::regclass),
    "owner_address" character varying(42) not null,
    "minted_at" timestamp without time zone default CURRENT_TIMESTAMP
);


create table "public"."profiles" (
    "wallet_address" character varying(42) not null,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);


alter sequence "public"."listings_listing_id_seq" owned by "public"."listings"."listing_id";

alter sequence "public"."nfts_token_id_seq" owned by "public"."nfts"."token_id";

CREATE UNIQUE INDEX favorites_pkey ON public.favorites USING btree (profile_id, nft_id);

CREATE INDEX idx_favorites_profile_id ON public.favorites USING btree (profile_id);

CREATE INDEX idx_listings_active ON public.listings USING btree (is_active);

CREATE INDEX idx_nfts_owner_address ON public.nfts USING btree (owner_address);

CREATE UNIQUE INDEX listings_pkey ON public.listings USING btree (listing_id);

CREATE UNIQUE INDEX nfts_pkey ON public.nfts USING btree (token_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (wallet_address);

alter table "public"."favorites" add constraint "favorites_pkey" PRIMARY KEY using index "favorites_pkey";

alter table "public"."listings" add constraint "listings_pkey" PRIMARY KEY using index "listings_pkey";

alter table "public"."nfts" add constraint "nfts_pkey" PRIMARY KEY using index "nfts_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."favorites" add constraint "favorites_nft_id_fkey" FOREIGN KEY (nft_id) REFERENCES nfts(token_id) ON DELETE CASCADE not valid;

alter table "public"."favorites" validate constraint "favorites_nft_id_fkey";

alter table "public"."favorites" add constraint "favorites_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(wallet_address) ON DELETE CASCADE not valid;

alter table "public"."favorites" validate constraint "favorites_profile_id_fkey";

alter table "public"."listings" add constraint "listings_seller_address_fkey" FOREIGN KEY (seller_address) REFERENCES profiles(wallet_address) ON DELETE SET NULL not valid;

alter table "public"."listings" validate constraint "listings_seller_address_fkey";

alter table "public"."listings" add constraint "listings_token_id_fkey" FOREIGN KEY (token_id) REFERENCES nfts(token_id) ON DELETE CASCADE not valid;

alter table "public"."listings" validate constraint "listings_token_id_fkey";

alter table "public"."nfts" add constraint "nfts_owner_address_fkey" FOREIGN KEY (owner_address) REFERENCES profiles(wallet_address) ON DELETE SET NULL not valid;

alter table "public"."nfts" validate constraint "nfts_owner_address_fkey";

grant delete on table "public"."favorites" to "anon";

grant insert on table "public"."favorites" to "anon";

grant references on table "public"."favorites" to "anon";

grant select on table "public"."favorites" to "anon";

grant trigger on table "public"."favorites" to "anon";

grant truncate on table "public"."favorites" to "anon";

grant update on table "public"."favorites" to "anon";

grant delete on table "public"."favorites" to "authenticated";

grant insert on table "public"."favorites" to "authenticated";

grant references on table "public"."favorites" to "authenticated";

grant select on table "public"."favorites" to "authenticated";

grant trigger on table "public"."favorites" to "authenticated";

grant truncate on table "public"."favorites" to "authenticated";

grant update on table "public"."favorites" to "authenticated";

grant delete on table "public"."favorites" to "service_role";

grant insert on table "public"."favorites" to "service_role";

grant references on table "public"."favorites" to "service_role";

grant select on table "public"."favorites" to "service_role";

grant trigger on table "public"."favorites" to "service_role";

grant truncate on table "public"."favorites" to "service_role";

grant update on table "public"."favorites" to "service_role";

grant delete on table "public"."listings" to "anon";

grant insert on table "public"."listings" to "anon";

grant references on table "public"."listings" to "anon";

grant select on table "public"."listings" to "anon";

grant trigger on table "public"."listings" to "anon";

grant truncate on table "public"."listings" to "anon";

grant update on table "public"."listings" to "anon";

grant delete on table "public"."listings" to "authenticated";

grant insert on table "public"."listings" to "authenticated";

grant references on table "public"."listings" to "authenticated";

grant select on table "public"."listings" to "authenticated";

grant trigger on table "public"."listings" to "authenticated";

grant truncate on table "public"."listings" to "authenticated";

grant update on table "public"."listings" to "authenticated";

grant delete on table "public"."listings" to "service_role";

grant insert on table "public"."listings" to "service_role";

grant references on table "public"."listings" to "service_role";

grant select on table "public"."listings" to "service_role";

grant trigger on table "public"."listings" to "service_role";

grant truncate on table "public"."listings" to "service_role";

grant update on table "public"."listings" to "service_role";

grant delete on table "public"."nfts" to "anon";

grant insert on table "public"."nfts" to "anon";

grant references on table "public"."nfts" to "anon";

grant select on table "public"."nfts" to "anon";

grant trigger on table "public"."nfts" to "anon";

grant truncate on table "public"."nfts" to "anon";

grant update on table "public"."nfts" to "anon";

grant delete on table "public"."nfts" to "authenticated";

grant insert on table "public"."nfts" to "authenticated";

grant references on table "public"."nfts" to "authenticated";

grant select on table "public"."nfts" to "authenticated";

grant trigger on table "public"."nfts" to "authenticated";

grant truncate on table "public"."nfts" to "authenticated";

grant update on table "public"."nfts" to "authenticated";

grant delete on table "public"."nfts" to "service_role";

grant insert on table "public"."nfts" to "service_role";

grant references on table "public"."nfts" to "service_role";

grant select on table "public"."nfts" to "service_role";

grant trigger on table "public"."nfts" to "service_role";

grant truncate on table "public"."nfts" to "service_role";

grant update on table "public"."nfts" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";


