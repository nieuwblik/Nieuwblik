// Quick test om te zien of regions data werkt
import { getRegionBySlug } from './src/data/regions.ts';

console.log('Testing Enkhuizen:', getRegionBySlug('enkhuizen'));
console.log('Testing Amsterdam:', getRegionBySlug('amsterdam'));
console.log('Testing Hoorn:', getRegionBySlug('hoorn'));
