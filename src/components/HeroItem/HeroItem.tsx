import ReactFlow, { Edge, Node, useEdgesState, useNodesState } from "react-flow-renderer";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { fetchHeroById, fetchFilmsForHeroes, fetchShipsForHeroes } from "../../api/starWarsApi";

import { Loader } from "../Loader/Loader";
import { Film } from "../../types/Film";
import { Ship } from "../../types/Ship";

import './HeroItem.css';

export const HeroItem = () => {
  const { heroId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [ships, setShips] = useState<Ship[]>([]);

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const shipsData = await fetchShipsForHeroes();
        console.log('Ships data:', shipsData);
        setShips(shipsData);
      } catch (error) {
        console.error('Error fetching ships:', error);
      }
    };

    fetchShips();
  }, []);

  useEffect(() => {
    const getHero = async () => {
      setIsLoading(true);
      setNodes([]);
      setEdges([]);

      try {
        const heroIdNumber = Number(heroId)
        const hero = await fetchHeroById(heroIdNumber)
        const heroNode = {
          id: `hero-${hero.id}`,
          position: { x: 650, y: 100 },
          data: { label: hero.name },
          className: 'hero__node'
        };

        const filmsData = await fetchFilmsForHeroes();
        const films: Film[] = filmsData.results;

        const newNodes: Node[] = [heroNode];
        const newEdges: Edge[] = [];

        hero.films.forEach((filmId: number, filmIndex: number) => {
          const film = films.find(f => f.episode_id === filmId);
          if (film) {
            const columnOffset = filmIndex % 2 === 0 ? -150 : 150;
            const rowOffset = Math.floor(filmIndex / 2) * 150;

            const filmNode = {
              id: `film-${film.id}`,
              position: { x: 650 + columnOffset, y: 200 + rowOffset },
              data: { label: film.title },
              className: 'film__node'
            };
            newNodes.push(filmNode)

            newEdges.push({
              id: `edge-hero-${hero.id}-film-${filmIndex}`, 
              source: `hero-${hero.id}`, 
              target: `film-${film.id}`,
              style: { stroke: 'red', strokeWidth: 2, opacity: 0.4 },
            });

            const filteredShips = ships.filter(ship => ship.films.includes(film.id) && hero.starships.includes(ship.id))
            console.log('Filtered:', filteredShips)

            const shipsRowOffset = 300;

            filteredShips.forEach((ship, shipIndex: number) => {
              if (ship) {
                const shipOffset = 200;
                const shipPosition = {
                  x: 650 + columnOffset + (shipIndex * shipOffset) - (shipOffset * (filteredShips.length - 1) / 2),
                  y: 200 + rowOffset + shipsRowOffset
                };
        
                const shipNode = {
                  id: `ship-${ship.id}`,
                  position: shipPosition,
                  data: { label: ship.name },
                  className: 'ship__node'
                };
               
                newNodes.push(shipNode)

                newEdges.push({
                  id: `edge-film-${film.id}-ship-${ship.id}`,
                  source: `film-${film.id}`,
                  target: `ship-${ship.id}`,
                  style: { stroke: 'yellow', strokeWidth: 2, opacity: 0.4 },
                })
              }
            })
          }
        });

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error('Error fetching data in getHero:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }

    getHero();
  }, [heroId, setNodes, setEdges, ships]);
  
  return (
    <div className="hero__content">
      {isLoading ? (<Loader />) : (
        <div style={{ width: '100%', height: '700px' }}>
          <ReactFlow nodes={nodes} edges={edges} />
        </div>
      )}
    </div>
  )
}