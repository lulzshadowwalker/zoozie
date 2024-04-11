-- +goose Up
-- +goose StatementBegin
INSERT INTO listings_i18n(
    id,
    language_code,
    listing_id, 
    description
)
VALUES
    (-42069, 'en', -42069, 'Aut aut inventore at ut temporibus saepe. Nihil rerum nobis corrupti similique assumenda id nobis libero autem. Adipisci magni optio distinctio. Pariatur sit perferendis necessitatibus possimus aspernatur. Voluptatum aperiam mollitia aliquam labore. In doloribus quisquam iste. At sequi est porro molestiae. Porro optio maxime voluptatem.'),
    (-42070, 'ar', -42069, 'لوريم إيبسوم هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر.كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة من الأحرف بشكل عشوائي أخذتها من نص ، لتكون هذه الأحرف هي بداية نص لوريم إيبسوم.مازالت النسخة الأولى من لوريم إيبسوم تستخدم بشكل متنوع في مجالات النصوص الشكلية المختلفة'); 
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM listings_i18n WHERE id = -42069;
-- +goose StatementEnd
