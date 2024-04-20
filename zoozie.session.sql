select
    u.id,
    c.id as customer_id,
    u.name
from
    users u
    left join customers c on c.user_id = u.id;