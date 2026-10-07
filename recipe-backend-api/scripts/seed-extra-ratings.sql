-- ============================================================================
-- Task 5.1: Seed them rating de card "Mon danh gia cao" co du lieu + don rac
-- 
-- Chay bang:
--   docker exec -i cookbook-mysql mysql -uroot -ppassword cookbook < scripts/seed-extra-ratings.sql
--
-- Ghi chu quan trong:
-- 1. `Rating` co UNIQUE (userId, recipeId) => moi user chi ghi 1 lan/mon.
-- 2. Title mon `2d7fdc67` da dung UTF-8 "Trung chien hanh la" tu luc restore
--    (Task 2.1) - console/charset chi hien loi font, KHONG sua them.
-- 3. `RecipeIngredient.internalIngredientId` la ON DELETE SET NULL => xoa
--    InternalIngredient rac se khong lam mat dong nguyen lieu.
-- 4. Dung `INSERT ... SELECT ... ON DUPLICATE KEY UPDATE id=id` de anime nguoc
--    khi script chay 2 lan ma loi duplicate (tinh idempotent).
-- ============================================================================

START TRANSACTION;

-- ----------------------------------------------------------------------------
-- A. Seed rating cho 3 mon APPROVED co noi dung tot (co san tu seed admin).
--    Nguoi danh gia: user demo (`demo@cookbook.vn`) + cac user fixture co san.
-- ----------------------------------------------------------------------------
-- Mon 1: Cha ca La Vong (d279cfa9) - da co 1 luot 5* tu admin, them 5 luot nua
--        => tong 6 luot, dat >= 5 de vao card "Mon danh gia cao".
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000001-0000-4000-8000-000000000001', 'c45cd38c-517a-4252-b02d-0c25743a01bc', 'd279cfa9-a6cc-44b0-ad0d-639b18907312', NULL, 5, NOW(3), NOW(3), 'Cha ca tuoi, nuoc cham ngon'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='c45cd38c-517a-4252-b02d-0c25743a01bc' AND recipeId='d279cfa9-a6cc-44b0-ad0d-639b18907312');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000001-0000-4000-8000-000000000002', '5bc3f94b-241c-4da8-899f-4cc4e27ed03c', 'd279cfa9-a6cc-44b0-ad0d-639b18907312', NULL, 5, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='5bc3f94b-241c-4da8-899f-4cc4e27ed03c' AND recipeId='d279cfa9-a6cc-44b0-ad0d-639b18907312');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000001-0000-4000-8000-000000000003', 'f2d5742b-1492-44d5-a2eb-3b53c94bb807', 'd279cfa9-a6cc-44b0-ad0d-639b18907312', NULL, 4, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='f2d5742b-1492-44d5-a2eb-3b53c94bb807' AND recipeId='d279cfa9-a6cc-44b0-ad0d-639b18907312');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000001-0000-4000-8000-000000000004', 'eed9da83-9e73-4dd6-a2df-d38b49dac819', 'd279cfa9-a6cc-44b0-ad0d-639b18907312', NULL, 5, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='eed9da83-9e73-4dd6-a2df-d38b49dac819' AND recipeId='d279cfa9-a6cc-44b0-ad0d-639b18907312');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000001-0000-4000-8000-000000000005', 'bc4646a6-5179-43c1-b2ec-fb1a81cf0278', 'd279cfa9-a6cc-44b0-ad0d-639b18907312', NULL, 4, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='bc4646a6-5179-43c1-b2ec-fb1a81cf0278' AND recipeId='d279cfa9-a6cc-44b0-ad0d-639b18907312');

-- Mon 2: Pho bo tai gau (a1cefca6) - them 6 luot.
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000002-0000-4000-8000-000000000001', 'c45cd38c-517a-4252-b02d-0c25743a01bc', 'a1cefca6-4796-446b-8a45-fb87bf9cb5a2', NULL, 5, NOW(3), NOW(3), 'Nuoc dung ve pho Ha Noi'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='c45cd38c-517a-4252-b02d-0c25743a01bc' AND recipeId='a1cefca6-4796-446b-8a45-fb87bf9cb5a2');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000002-0000-4000-8000-000000000002', 'b5719c4c-19c5-4de1-a4a1-907e3dac95bb', 'a1cefca6-4796-446b-8a45-fb87bf9cb5a2', NULL, 5, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='b5719c4c-19c5-4de1-a4a1-907e3dac95bb' AND recipeId='a1cefca6-4796-446b-8a45-fb87bf9cb5a2');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000002-0000-4000-8000-000000000003', '00bd5f68-86c2-4e9f-b65e-9fc26dc6fd16', 'a1cefca6-4796-446b-8a45-fb87bf9cb5a2', NULL, 5, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='00bd5f68-86c2-4e9f-b65e-9fc26dc6fd16' AND recipeId='a1cefca6-4796-446b-8a45-fb87bf9cb5a2');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000002-0000-4000-8000-000000000004', '407ac7cd-17aa-4bce-9e6f-ec5fce782cec', 'a1cefca6-4796-446b-8a45-fb87bf9cb5a2', NULL, 4, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='407ac7cd-17aa-4bce-9e6f-ec5fce782cec' AND recipeId='a1cefca6-4796-446b-8a45-fb87bf9cb5a2');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000002-0000-4000-8000-000000000005', '24c641b0-988c-4429-a476-42555be66104', 'a1cefca6-4796-446b-8a45-fb87bf9cb5a2', NULL, 5, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='24c641b0-988c-4429-a476-42555be66104' AND recipeId='a1cefca6-4796-446b-8a45-fb87bf9cb5a2');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000002-0000-4000-8000-000000000006', 'cd79367a-02cb-48bd-ab64-375b8af9b14f', 'a1cefca6-4796-446b-8a45-fb87bf9cb5a2', NULL, 5, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='cd79367a-02cb-48bd-ab64-375b8af9b14f' AND recipeId='a1cefca6-4796-446b-8a45-fb87bf9cb5a2');

-- Mon 3: Trung chien hanh la (2d7fdc67) - them 6 luot (mon da restore Task 2.1).
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000003-0000-4000-8000-000000000001', 'c45cd38c-517a-4252-b02d-0c25743a01bc', '2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb', NULL, 5, NOW(3), NOW(3), 'Mo hinh va hanh la thom'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='c45cd38c-517a-4252-b02d-0c25743a01bc' AND recipeId='2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000003-0000-4000-8000-000000000002', 'c282bb27-1f0a-4dec-b813-9811a10571d3', '2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb', NULL, 4, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='c282bb27-1f0a-4dec-b813-9811a10571d3' AND recipeId='2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000003-0000-4000-8000-000000000003', '576abe18-923f-4514-87ca-2f8bc8d715c9', '2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb', NULL, 5, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='576abe18-923f-4514-87ca-2f8bc8d715c9' AND recipeId='2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000003-0000-4000-8000-000000000004', '24f23efa-b27e-4100-9df9-3f84bfb12918', '2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb', NULL, 5, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='24f23efa-b27e-4100-9df9-3f84bfb12918' AND recipeId='2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000003-0000-4000-8000-000000000005', '5bc3f94b-241c-4da8-899f-4cc4e27ed03c', '2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb', NULL, 4, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='5bc3f94b-241c-4da8-899f-4cc4e27ed03c' AND recipeId='2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb');
INSERT INTO Rating (id, userId, recipeId, recipeReferenceId, score, createdAt, updatedAt, binhLuan)
SELECT '20000003-0000-4000-8000-000000000006', 'f2d5742b-1492-44d5-a2eb-3b53c94bb807', '2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb', NULL, 5, NOW(3), NOW(3), NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Rating WHERE userId='f2d5742b-1492-44d5-a2eb-3b53c94bb807' AND recipeId='2d7fdc67-d7e0-4a29-a991-0fe7cc1f62fb');

-- ----------------------------------------------------------------------------
-- B. Don rac: InternalIngredient chua "admin ok 179053..." va dong nguyen lieu
--    tham chieu. FK la ON DELETE SET NULL => chi mat link, khong xoa mon.
--    (IngredientMapping la ON DELETE RESTRICT nen phai xoa mapping truoc.)
-- ----------------------------------------------------------------------------
DELETE FROM IngredientMapping
WHERE internalIngredientId IN (
  SELECT id FROM InternalIngredient WHERE canonicalName LIKE 'admin ok%'
);

DELETE FROM RecipeIngredient
WHERE internalIngredientId IN (
  SELECT id FROM InternalIngredient WHERE canonicalName LIKE 'admin ok%'
);

DELETE FROM InternalIngredient
WHERE canonicalName LIKE 'admin ok%';

-- Sua encoding hong: `th?t b?` (chua ky tu 0x3F + U+FFFD) -> `thit bo`.
-- Khong trung canonical nao hien co (da kiem tra). Ap dung ON UPDATE CASCADE
-- len RecipeIngredient nen cac mon (vi du "Pho bo Ha Noi") tu nhat ban moi.
UPDATE InternalIngredient
SET canonicalName = 'thịt bò'
WHERE id = '5deb86d6-9c2e-44a7-8bc9-b6b0144e53a8';

COMMIT;