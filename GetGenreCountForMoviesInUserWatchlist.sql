<-- Get the most represented genre from a user watchlist -->
SELECT COUNT(g.name) as count, g.name, g.id FROM public.watchlist_movies as wl JOIN public.watchlists AS w 
ON w.id = wl.watchlist_id 
JOIN public.movies as m 
ON wl.movie_id = m.id 
JOIN public.genre_movies as gm
ON m.id = gm.movie_id
JOIN public.genres as g
ON gm.genre_id = g.id
WHERE w.user_id = 6
GROUP BY (g.name, g.id)
ORDER BY count DESC
LIMIT 1 

<-- Get all movies with the most represented genre in a user watchlist -->
SELECT m.title, gm.genre_id FROM public.movies AS m JOIN public.genre_movies AS gm ON m.id = gm.movie_id
JOIN (SELECT COUNT(g.name) as count, g.name, g.id FROM public.watchlist_movies as wl JOIN public.watchlists AS w 
ON w.id = wl.watchlist_id 
JOIN public.movies as m 
ON wl.movie_id = m.id 
JOIN public.genre_movies as gm
ON m.id = gm.movie_id
JOIN public.genres as g
ON gm.genre_id = g.id
WHERE w.user_id = 6
GROUP BY (g.name, g.id)
ORDER BY count DESC
LIMIT 1 ) AS sub1
ON gm.genre_id = sub1.id

<-- Get user watchlist movies -->
SELECT m.title FROM movies AS m 
JOIN watchlist_movies AS wm ON m.id = wm.movie_id
JOIN watchlists AS w ON w.id = wm.watchlist_id
JOIN users AS u ON u.id = w.user_id
WHERE u.id = 6

<-- Get the most represend genre id -->
SELECT sub.id FROM (SELECT COUNT(g.name) as count, g.name, g.id FROM public.watchlist_movies as wl JOIN public.watchlists AS w 
ON w.id = wl.watchlist_id 
JOIN public.movies as m 
ON wl.movie_id = m.id 
JOIN public.genre_movies as gm
ON m.id = gm.movie_id
JOIN public.genres as g
ON gm.genre_id = g.id
WHERE w.user_id = 6
GROUP BY (g.name, g.id)
ORDER BY count DESC
LIMIT 1 ) as sub


<-- FINAL QUERY -->
<-- Get all movies with the most represented genre in a user watchlist. And exclude movie already in the watchlist -->
SELECT title, g.id FROM movies AS m
JOIN genre_movies AS gm ON gm.movie_id = m.id
JOIN genres as g on g.id = gm.genre_id
WHERE title NOT IN (SELECT m.title FROM movies AS m 
JOIN watchlist_movies AS wm ON m.id = wm.movie_id
JOIN watchlists AS w ON w.id = wm.watchlist_id
JOIN users AS u ON u.id = w.user_id
WHERE u.id = 6) AND g.id = (SELECT sub.id FROM (SELECT COUNT(g.name) as count, g.name, g.id FROM public.watchlist_movies as wl JOIN public.watchlists AS w 
ON w.id = wl.watchlist_id 
JOIN public.movies as m 
ON wl.movie_id = m.id 
JOIN public.genre_movies as gm
ON m.id = gm.movie_id
JOIN public.genres as g
ON gm.genre_id = g.id
WHERE w.user_id = 6
GROUP BY (g.name, g.id)
ORDER BY count DESC
LIMIT 1 ) as sub)
