// routes/pokemon.routes.ts
import { Router } from 'express';
import {
	getAllPokemon,
	getUserPokemon,
	catchPokemon,
	updatePokemon,
	addPokemonXP,
	evolvePokemon,
	getPokemonById,
	getBattleTeam,
} from '../controllers/pokemon.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.route('/').get(getAllPokemon);
router.route('/:pokemonId').get(getPokemonById);

// Protected routes
router.use(verifyJWT);

router.route('/collection').get(getUserPokemon);
router.route('/catch').post(catchPokemon);
router.route('/team').get(getBattleTeam);
router.route('/:pokemonId').patch(updatePokemon);
router.route('/:pokemonId/xp').post(addPokemonXP);
router.route('/:pokemonId/evolve').post(evolvePokemon);

export default router;
