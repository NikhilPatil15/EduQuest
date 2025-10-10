// controllers/worldMap.controller.ts
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { SuccessResponse } from '../utils/successResponse';
import { WorldMapService } from '../utils/services/worldMap.service';
import { Response } from 'express';

// Get user's world map progress
const getWorldMapProgress = asyncHandler(async (req: any, res: Response) => {
	const progress = await WorldMapService.getUserWorldProgress(req.user._id.toString());

	return res
		.status(200)
		.json(new SuccessResponse(200, { progress }, 'World map progress fetched successfully'));
});

// Unlock a region
const unlockRegion = asyncHandler(async (req: any, res: Response) => {
	const { regionId } = req.body;

	if (!regionId) {
		throw new ErrorResponse(400, 'Region ID is required');
	}

	const userProgress = await WorldMapService.unlockRegion(req.user._id.toString(), regionId);

	return res
		.status(200)
		.json(new SuccessResponse(200, { userProgress }, 'Region unlocked successfully'));
});

// Get recommended region
const getRecommendedRegion = asyncHandler(async (req: any, res: Response) => {
	const recommendedRegion = await WorldMapService.getRecommendedRegion(req.user._id.toString());

	return res
		.status(200)
		.json(
			new SuccessResponse(200, { recommendedRegion }, 'Recommended region fetched successfully'),
		);
});

// Get region leaderboard
const getRegionLeaderboard = asyncHandler(async (req: any, res: Response) => {
	const { regionId } = req.params;
	const { limit = 10 } = req.query;

	const leaderboard = await WorldMapService.getRegionLeaderboard(regionId, parseInt(limit));

	return res
		.status(200)
		.json(new SuccessResponse(200, { leaderboard }, 'Region leaderboard fetched successfully'));
});

// Get region details
const getRegionDetails = asyncHandler(async (req: any, res: Response) => {
	const { regionId } = req.params;

	const { MapRegion } = await import('../models/mapRegion.model');
	const { UserWorldProgress } = await import('../models/userWorldProgress.model');

	const region = await MapRegion.findById(regionId).populate('worldMapId');
	if (!region) {
		throw new ErrorResponse(404, 'Region not found');
	}

	const userProgress = await UserWorldProgress.findOne({
		userId: req.user._id,
		regionId,
	});

	const leaderboard = await WorldMapService.getRegionLeaderboard(regionId, 5);

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				region,
				userProgress: userProgress || null,
				leaderboard,
			},
			'Region details fetched successfully',
		),
	);
});

export {
	getWorldMapProgress,
	unlockRegion,
	getRecommendedRegion,
	getRegionLeaderboard,
	getRegionDetails,
};
