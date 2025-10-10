// models/worldMap.model.ts
import { Schema, model } from 'mongoose';
import { IWorldMap } from '../types/worldMap.types';

const WorldMapSchema = new Schema<IWorldMap>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		theme: {
			type: String,
			enum: ['forest', 'ocean', 'mountain', 'desert', 'volcano', 'sky'],
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		order: {
			type: Number,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		requiredLevel: {
			type: Number,
			default: 1,
		},
		subjects: [
			{
				type: String,
				enum: ['math', 'science', 'coding'],
			},
		],
	},
	{
		timestamps: true,
	},
);

// Index for active worlds
WorldMapSchema.index({ isActive: 1, order: 1 });

export const WorldMap = model<IWorldMap>('WorldMap', WorldMapSchema);
