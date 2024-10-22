SELECT COUNT(movie_id), movie_id, m.title 
FROM public.watchlist_movies AS wm 
JOIN public.movies AS m ON wm.movie_id = m.id  WHERE watched = true
GROUP BY(wm.movie_id, m.title)

