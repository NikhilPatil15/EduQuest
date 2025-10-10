// models/mapRegion.model.ts
import { Schema, model } from 'mongoose';
import { IMapRegion } from '../types/worldMap.types';

const MapRegionSchema = new Schema<IMapRegion>(
	{
		worldMapId: {
			type: Schema.Types.ObjectId,
			ref: 'WorldMap',
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		position: {
			x: {
				type: Number,
				required: true,
			},
			y: {
				type: Number,
				required: true,
			},
		},
		color: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		requiredLevel: {
			type: Number,
			default: 1,
		},
		subject: {
			type: String,
			enum: ['math', 'science', 'coding'],
			required: true,
		},
		totalQuizzes: {
			type: Number,
			default: 10,
		},
		difficulty: {
			type: String,
			enum: ['beginner', 'intermediate', 'advanced', 'expert'],
			required: true,
		},
		pokemonType: {
			type: String,
			required: true,
		},
		rewards: {
			xp: {
				type: Number,
				default: 500,
			},
			coins: {
				type: Number,
				default: 100,
			},
			pokemonId: {
				type: Schema.Types.ObjectId,
				ref: 'Pokemon',
			},
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		order: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// Index for regions by world and subject
MapRegionSchema.index({ worldMapId: 1, subject: 1 });
MapRegionSchema.index({ worldMapId: 1, order: 1 });

export const MapRegion = model<IMapRegion>('MapRegion', MapRegionSchema);
