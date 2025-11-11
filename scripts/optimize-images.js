import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_DIR = join(__dirname, '../src/assets');
const QUALITY = 80; // WebP quality
const TARGET_SIZE_KB = 50; // Target max size in KB

async function getFiles(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      await getFiles(filePath, fileList);
    } else {
      const ext = extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  
  return fileList;
}

async function optimizeImage(inputPath) {
  const ext = extname(inputPath);
  const outputPath = inputPath.replace(ext, '.webp');
  const fileName = basename(inputPath);
  
  try {
    // Get original file size
    const originalStat = await stat(inputPath);
    const originalSizeKB = (originalStat.size / 1024).toFixed(2);
    
    // Convert to WebP with optimization
    await sharp(inputPath)
      .webp({ 
        quality: QUALITY,
        effort: 6, // Max compression effort (0-6)
      })
      .toFile(outputPath);
    
    // Get new file size
    const newStat = await stat(outputPath);
    const newSizeKB = (newStat.size / 1024).toFixed(2);
    const savings = ((1 - newStat.size / originalStat.size) * 100).toFixed(1);
    
    console.log(`✓ ${fileName}`);
    console.log(`  ${originalSizeKB}KB → ${newSizeKB}KB (${savings}% besparing)`);
    
    if (newStat.size / 1024 > TARGET_SIZE_KB) {
      console.log(`  ⚠️  Nog steeds groter dan ${TARGET_SIZE_KB}KB - overweeg handmatige optimalisatie`);
    }
    
    return true;
  } catch (error) {
    console.error(`✗ Fout bij optimaliseren van ${fileName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🖼️  Afbeeldingen optimaliseren naar WebP formaat...\n');
  
  const imageFiles = await getFiles(ASSETS_DIR);
  
  if (imageFiles.length === 0) {
    console.log('Geen PNG/JPG afbeeldingen gevonden om te optimaliseren.');
    return;
  }
  
  console.log(`Gevonden: ${imageFiles.length} afbeeldingen\n`);
  
  let successCount = 0;
  for (const imagePath of imageFiles) {
    const success = await optimizeImage(imagePath);
    if (success) successCount++;
  }
  
  console.log(`\n✅ ${successCount}/${imageFiles.length} afbeeldingen succesvol geoptimaliseerd!`);
  console.log('\n💡 Tip: Update je imports om .webp extensies te gebruiken');
  console.log('💡 De originele PNG/JPG bestanden blijven behouden als backup');
}

main().catch(console.error);
