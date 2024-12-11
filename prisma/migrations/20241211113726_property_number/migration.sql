-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT concat('account_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "discounts" ALTER COLUMN "id" SET DEFAULT concat('discount_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "id" SET DEFAULT concat('order_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "id" SET DEFAULT concat('property_', replace(cast(gen_random_uuid() as text), '-', '')),
ALTER COLUMN "propertyNumber" DROP DEFAULT;
DROP SEQUENCE "properties_propertyNumber_seq";

-- AlterTable
ALTER TABLE "propertyDetail" ALTER COLUMN "id" SET DEFAULT concat('propertyDetail_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "property_number_seq" ALTER COLUMN "id" SET DEFAULT 1,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "seq" SET DEFAULT 6999;
DROP SEQUENCE "property_number_seq_id_seq";

-- AlterTable
ALTER TABLE "queries" ALTER COLUMN "id" SET DEFAULT concat('query_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT concat('session_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT concat('subscription_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT concat('user_', replace(cast(gen_random_uuid() as text), '-', ''));
