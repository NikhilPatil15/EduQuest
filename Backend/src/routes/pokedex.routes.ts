// routes/pokedex.routes.ts
import { Router } from 'express';
import {
	getPokedex,
	getPokedexStats,
	getPokemonDetails,
	toggleFavorite,
	addNotes,
	checkEvolutions,
	evolvePokemon,
	getEvolutionHistory,
	processAutoEvolutions,
} from '../controllers/pokedex.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Pokédex routes
router.route(['/', '/pokedex']).get(getPokedex);
router.route(['/stats', '/pokedex/stats']).get(getPokedexStats);
router.route(['/:pokemonId', '/pokedex/:pokemonId']).get(getPokemonDetails);
router.route(['/:pokemonId/favorite', '/pokedex/:pokemonId/favorite']).patch(toggleFavorite);
router.route(['/:pokemonId/notes', '/pokedex/:pokemonId/notes']).patch(addNotes);

// Evolution routes
router.route('/evolutions/check').get(checkEvolutions);
router.route('/evolutions/evolve').post(evolvePokemon);
router.route('/evolutions/history').get(getEvolutionHistory);
router.route('/evolutions/auto-evolve').post(processAutoEvolutions);

export default router;
