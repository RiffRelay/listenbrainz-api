# Art routes

- `/1/art/grid/`
- `/1/art/grid-stats/{user_name}/{time_range}/{dimension}/{layout}/{image_size}`
- `/1/art/{custom_name}/{user_name}/{time_range}/{image_size}`
- `/1/art/year-in-music/{year}/{user_name}`

Art routes may return images rather than JSON. Use the generic request method
when a non-JSON response or custom headers are required.
