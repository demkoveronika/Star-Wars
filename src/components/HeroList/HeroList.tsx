import React, { useEffect, useState } from "react";
import { Hero } from "../../types/Hero";
import { fetchHeroes } from "../../api/starWarsApi";
import './HeroList.css';
import { Loader } from "../Loader/Loader";

export const HeroList = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const getHeroes = async () => {
      if (!hasMore) return;

      setIsLoading(true);
      try {
        const data = await fetchHeroes(currentPage);
        setHeroes(prevHeroes => [...prevHeroes, ...data.results]);
        setHasMore(data.results.length > 0);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getHeroes();
  }, [currentPage, hasMore])

  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (bottom && hasMore && currentPage < 9) {
        setCurrentPage(prevPage => prevPage + 1);
      }

      if (currentPage >= 9) {
        window.removeEventListener('scroll', handleScroll)
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, currentPage]);


  return (
    <>
      {isLoading && <Loader />}

        <div className="content">
          <ul className="hero__list">
            {heroes.length > 0 ? (
              heroes.map((hero, index) => (
                <li key={index} className="hero__item">{hero.name}</li>
              ))
            ) : (
              <li>Not found</li>
            )}
            
          </ul>
        </div>
    </>
  )
}