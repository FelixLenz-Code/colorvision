export interface ColorEntry {
  nameDe: string
  nameEn: string
  h: number
  s: number
  l: number
}

export interface PickedColor {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  nameDe: string
  nameEn: string
  brightness: string
  brightnessDe: string
  brightnessDeSpeech: string
  descriptionDe: string
}

export const COLOR_DB: ColorEntry[] = [
  { nameDe: 'Schwarz', nameEn: 'Black', h: 0, s: 0, l: 0 },
  { nameDe: 'Schwarz', nameEn: 'Black', h: 0, s: 0, l: 6 },
  { nameDe: 'Grau', nameEn: 'Gray', h: 0, s: 0, l: 20 },
  { nameDe: 'Grau', nameEn: 'Gray', h: 0, s: 0, l: 35 },
  { nameDe: 'Grau', nameEn: 'Gray', h: 0, s: 0, l: 50 },
  { nameDe: 'Grau', nameEn: 'Gray', h: 0, s: 0, l: 65 },
  { nameDe: 'Grau', nameEn: 'Gray', h: 0, s: 0, l: 80 },
  { nameDe: 'Weiß', nameEn: 'White', h: 0, s: 0, l: 96 },
  { nameDe: 'Weiß', nameEn: 'White', h: 0, s: 0, l: 100 },
  { nameDe: 'Warmgrau', nameEn: 'Warm Gray', h: 30, s: 8, l: 45 },
  { nameDe: 'Warmgrau', nameEn: 'Warm Gray', h: 30, s: 8, l: 70 },
  { nameDe: 'Silber', nameEn: 'Silver', h: 210, s: 10, l: 75 },
  { nameDe: 'Anthrazit', nameEn: 'Charcoal', h: 210, s: 10, l: 20 },
  { nameDe: 'Rot', nameEn: 'Red', h: 0, s: 100, l: 50 },
  { nameDe: 'Rot', nameEn: 'Red', h: 5, s: 95, l: 45 },
  { nameDe: 'Rot', nameEn: 'Red', h: 355, s: 90, l: 42 },
  { nameDe: 'Rot', nameEn: 'Red', h: 0, s: 80, l: 30 },
  { nameDe: 'Rot', nameEn: 'Red', h: 0, s: 85, l: 65 },
  { nameDe: 'Rot', nameEn: 'Red', h: 8, s: 75, l: 22 },
  { nameDe: 'Scharlachrot', nameEn: 'Scarlet', h: 10, s: 100, l: 50 },
  { nameDe: 'Karmesin', nameEn: 'Crimson', h: 348, s: 83, l: 47 },
  { nameDe: 'Rubinrot', nameEn: 'Ruby', h: 340, s: 80, l: 38 },
  { nameDe: 'Weinrot', nameEn: 'Wine Red', h: 345, s: 65, l: 28 },
  { nameDe: 'Bordeaux', nameEn: 'Bordeaux', h: 345, s: 55, l: 20 },
  { nameDe: 'Burgunderrot', nameEn: 'Burgundy', h: 350, s: 60, l: 25 },
  { nameDe: 'Ziegelrot', nameEn: 'Brick Red', h: 5, s: 58, l: 38 },
  { nameDe: 'Rostrot', nameEn: 'Rust', h: 15, s: 65, l: 40 },
  { nameDe: 'Rosa', nameEn: 'Pink', h: 340, s: 80, l: 80 },
  { nameDe: 'Rosa', nameEn: 'Pink', h: 350, s: 60, l: 82 },
  { nameDe: 'Rosa', nameEn: 'Pink', h: 10, s: 70, l: 80 },
  { nameDe: 'Hellrosa', nameEn: 'Light Pink', h: 350, s: 90, l: 90 },
  { nameDe: 'Babyrot', nameEn: 'Baby Pink', h: 0, s: 50, l: 92 },
  { nameDe: 'Tiefrosa', nameEn: 'Deep Pink', h: 330, s: 90, l: 55 },
  { nameDe: 'Tiefrosa', nameEn: 'Deep Pink', h: 325, s: 85, l: 45 },
  { nameDe: 'Magentarosa', nameEn: 'Hot Pink', h: 315, s: 100, l: 55 },
  { nameDe: 'Altrosa', nameEn: 'Dusty Rose', h: 340, s: 30, l: 65 },
  { nameDe: 'Zartrosa', nameEn: 'Blush', h: 345, s: 45, l: 88 },
  { nameDe: 'Orange', nameEn: 'Orange', h: 30, s: 100, l: 50 },
  { nameDe: 'Orange', nameEn: 'Orange', h: 25, s: 95, l: 45 },
  { nameDe: 'Orange', nameEn: 'Orange', h: 33, s: 90, l: 55 },
  { nameDe: 'Orange', nameEn: 'Orange', h: 28, s: 88, l: 35 },
  { nameDe: 'Orange', nameEn: 'Orange', h: 35, s: 85, l: 68 },
  { nameDe: 'Korallenrot', nameEn: 'Coral', h: 16, s: 90, l: 65 },
  { nameDe: 'Korallenrot', nameEn: 'Coral', h: 12, s: 80, l: 60 },
  { nameDe: 'Lachs', nameEn: 'Salmon', h: 8, s: 75, l: 68 },
  { nameDe: 'Lachs', nameEn: 'Salmon', h: 14, s: 70, l: 72 },
  { nameDe: 'Pfirsich', nameEn: 'Peach', h: 24, s: 85, l: 82 },
  { nameDe: 'Pfirsich', nameEn: 'Peach', h: 20, s: 80, l: 78 },
  { nameDe: 'Apricot', nameEn: 'Apricot', h: 28, s: 80, l: 78 },
  { nameDe: 'Terrakotta', nameEn: 'Terracotta', h: 15, s: 55, l: 45 },
  { nameDe: 'Ziegel', nameEn: 'Brick', h: 10, s: 50, l: 40 },
  { nameDe: 'Kupfer', nameEn: 'Copper', h: 18, s: 62, l: 48 },
  { nameDe: 'Gelb', nameEn: 'Yellow', h: 60, s: 100, l: 50 },
  { nameDe: 'Gelb', nameEn: 'Yellow', h: 55, s: 100, l: 55 },
  { nameDe: 'Gelb', nameEn: 'Yellow', h: 60, s: 95, l: 62 },
  { nameDe: 'Gelb', nameEn: 'Yellow', h: 50, s: 90, l: 40 },
  { nameDe: 'Gelb', nameEn: 'Yellow', h: 58, s: 95, l: 75 },
  { nameDe: 'Zitronengelb', nameEn: 'Lemon Yellow', h: 63, s: 100, l: 70 },
  { nameDe: 'Kanariengelb', nameEn: 'Canary Yellow', h: 57, s: 100, l: 68 },
  { nameDe: 'Goldgelb', nameEn: 'Golden Yellow', h: 48, s: 95, l: 52 },
  { nameDe: 'Gold', nameEn: 'Gold', h: 43, s: 90, l: 48 },
  { nameDe: 'Gold', nameEn: 'Gold', h: 45, s: 80, l: 42 },
  { nameDe: 'Sandgelb', nameEn: 'Sandy Yellow', h: 45, s: 60, l: 72 },
  { nameDe: 'Vanille', nameEn: 'Vanilla', h: 48, s: 55, l: 85 },
  { nameDe: 'Strohgelb', nameEn: 'Straw', h: 50, s: 65, l: 78 },
  { nameDe: 'Maiskorn', nameEn: 'Corn', h: 50, s: 85, l: 72 },
  { nameDe: 'Buttergelb', nameEn: 'Butter Yellow', h: 52, s: 90, l: 80 },
  { nameDe: 'Senf', nameEn: 'Mustard', h: 45, s: 75, l: 38 },
  { nameDe: 'Ocker', nameEn: 'Ochre', h: 40, s: 70, l: 38 },
  { nameDe: 'Bernstein', nameEn: 'Amber', h: 40, s: 95, l: 50 },
  { nameDe: 'Gelbgrün', nameEn: 'Yellow Green', h: 75, s: 80, l: 50 },
  { nameDe: 'Gelbgrün', nameEn: 'Yellow Green', h: 80, s: 70, l: 55 },
  { nameDe: 'Limette', nameEn: 'Lime', h: 82, s: 95, l: 60 },
  { nameDe: 'Limette', nameEn: 'Lime', h: 85, s: 90, l: 48 },
  { nameDe: 'Chartreuse', nameEn: 'Chartreuse', h: 90, s: 100, l: 45 },
  { nameDe: 'Olivgrün', nameEn: 'Olive Green', h: 65, s: 40, l: 35 },
  { nameDe: 'Olivgrün', nameEn: 'Olive Green', h: 70, s: 35, l: 28 },
  { nameDe: 'Olivgrün', nameEn: 'Olive Green', h: 60, s: 45, l: 30 },
  { nameDe: 'Khaki', nameEn: 'Khaki', h: 52, s: 30, l: 60 },
  { nameDe: 'Khaki', nameEn: 'Khaki', h: 48, s: 28, l: 55 },
  { nameDe: 'Avocado', nameEn: 'Avocado', h: 78, s: 40, l: 32 },
  { nameDe: 'Grün', nameEn: 'Green', h: 120, s: 100, l: 38 },
  { nameDe: 'Grün', nameEn: 'Green', h: 125, s: 85, l: 42 },
  { nameDe: 'Grün', nameEn: 'Green', h: 115, s: 75, l: 35 },
  { nameDe: 'Grün', nameEn: 'Green', h: 130, s: 80, l: 48 },
  { nameDe: 'Grün', nameEn: 'Green', h: 120, s: 60, l: 28 },
  { nameDe: 'Grün', nameEn: 'Green', h: 120, s: 65, l: 60 },
  { nameDe: 'Waldgrün', nameEn: 'Forest Green', h: 125, s: 40, l: 22 },
  { nameDe: 'Waldgrün', nameEn: 'Forest Green', h: 120, s: 38, l: 18 },
  { nameDe: 'Flaschengrün', nameEn: 'Bottle Green', h: 148, s: 35, l: 18 },
  { nameDe: 'Smaragdgrün', nameEn: 'Emerald Green', h: 146, s: 65, l: 38 },
  { nameDe: 'Smaragdgrün', nameEn: 'Emerald Green', h: 140, s: 75, l: 42 },
  { nameDe: 'Hellgrün', nameEn: 'Light Green', h: 115, s: 70, l: 70 },
  { nameDe: 'Hellgrün', nameEn: 'Light Green', h: 120, s: 55, l: 72 },
  { nameDe: 'Apfelgrün', nameEn: 'Apple Green', h: 100, s: 70, l: 58 },
  { nameDe: 'Grasgrün', nameEn: 'Grass Green', h: 110, s: 65, l: 42 },
  { nameDe: 'Salbeigrün', nameEn: 'Sage Green', h: 140, s: 20, l: 55 },
  { nameDe: 'Salbeigrün', nameEn: 'Sage Green', h: 135, s: 18, l: 48 },
  { nameDe: 'Mintgrün', nameEn: 'Mint Green', h: 155, s: 55, l: 72 },
  { nameDe: 'Mintgrün', nameEn: 'Mint Green', h: 160, s: 45, l: 68 },
  { nameDe: 'Mintgrün', nameEn: 'Mint Green', h: 152, s: 50, l: 80 },
  { nameDe: 'Jadegrün', nameEn: 'Jade', h: 150, s: 45, l: 38 },
  { nameDe: 'Pistaziengrün', nameEn: 'Pistachio', h: 100, s: 35, l: 68 },
  { nameDe: 'Moosgrün', nameEn: 'Moss Green', h: 100, s: 30, l: 32 },
  { nameDe: 'Blattgrün', nameEn: 'Leaf Green', h: 108, s: 55, l: 35 },
  { nameDe: 'Türkis', nameEn: 'Turquoise', h: 174, s: 70, l: 50 },
  { nameDe: 'Türkis', nameEn: 'Turquoise', h: 170, s: 65, l: 45 },
  { nameDe: 'Türkis', nameEn: 'Turquoise', h: 178, s: 60, l: 40 },
  { nameDe: 'Türkis', nameEn: 'Turquoise', h: 172, s: 72, l: 60 },
  { nameDe: 'Petrol', nameEn: 'Petrol', h: 188, s: 50, l: 28 },
  { nameDe: 'Petrol', nameEn: 'Petrol', h: 185, s: 45, l: 32 },
  { nameDe: 'Cyan', nameEn: 'Cyan', h: 180, s: 100, l: 50 },
  { nameDe: 'Cyan', nameEn: 'Cyan', h: 185, s: 85, l: 55 },
  { nameDe: 'Aqua', nameEn: 'Aqua', h: 183, s: 90, l: 60 },
  { nameDe: 'Hellblau', nameEn: 'Light Blue', h: 200, s: 75, l: 72 },
  { nameDe: 'Hellblau', nameEn: 'Light Blue', h: 205, s: 70, l: 78 },
  { nameDe: 'Hellblau', nameEn: 'Light Blue', h: 195, s: 60, l: 70 },
  { nameDe: 'Eisblau', nameEn: 'Ice Blue', h: 200, s: 55, l: 86 },
  { nameDe: 'Himmelblau', nameEn: 'Sky Blue', h: 204, s: 80, l: 65 },
  { nameDe: 'Himmelblau', nameEn: 'Sky Blue', h: 200, s: 75, l: 60 },
  { nameDe: 'Himmelblau', nameEn: 'Sky Blue', h: 208, s: 70, l: 68 },
  { nameDe: 'Babyblau', nameEn: 'Baby Blue', h: 208, s: 65, l: 85 },
  { nameDe: 'Taubenblau', nameEn: 'Dove Blue', h: 210, s: 30, l: 65 },
  { nameDe: 'Blau', nameEn: 'Blue', h: 220, s: 100, l: 50 },
  { nameDe: 'Blau', nameEn: 'Blue', h: 215, s: 90, l: 45 },
  { nameDe: 'Blau', nameEn: 'Blue', h: 225, s: 85, l: 55 },
  { nameDe: 'Blau', nameEn: 'Blue', h: 220, s: 80, l: 38 },
  { nameDe: 'Blau', nameEn: 'Blue', h: 220, s: 75, l: 30 },
  { nameDe: 'Blau', nameEn: 'Blue', h: 228, s: 70, l: 62 },
  { nameDe: 'Kornblumenblau', nameEn: 'Cornflower Blue', h: 225, s: 73, l: 57 },
  { nameDe: 'Königsblau', nameEn: 'Royal Blue', h: 225, s: 80, l: 42 },
  { nameDe: 'Königsblau', nameEn: 'Royal Blue', h: 230, s: 85, l: 38 },
  { nameDe: 'Kobaltblau', nameEn: 'Cobalt Blue', h: 220, s: 90, l: 35 },
  { nameDe: 'Saphirblau', nameEn: 'Sapphire', h: 230, s: 80, l: 30 },
  { nameDe: 'Marineblau', nameEn: 'Navy Blue', h: 225, s: 75, l: 18 },
  { nameDe: 'Marineblau', nameEn: 'Navy Blue', h: 220, s: 70, l: 14 },
  { nameDe: 'Mitternachtsblau', nameEn: 'Midnight Blue', h: 230, s: 65, l: 10 },
  { nameDe: 'Jeansblau', nameEn: 'Denim', h: 215, s: 50, l: 45 },
  { nameDe: 'Stahlblau', nameEn: 'Steel Blue', h: 207, s: 44, l: 49 },
  { nameDe: 'Eisenblau', nameEn: 'Iron Blue', h: 218, s: 38, l: 35 },
  { nameDe: 'Taubenblau', nameEn: 'Slate Blue', h: 220, s: 25, l: 55 },
  { nameDe: 'Indigo', nameEn: 'Indigo', h: 245, s: 80, l: 38 },
  { nameDe: 'Indigo', nameEn: 'Indigo', h: 240, s: 70, l: 30 },
  { nameDe: 'Indigo', nameEn: 'Indigo', h: 248, s: 75, l: 42 },
  { nameDe: 'Blauviolett', nameEn: 'Blue Violet', h: 252, s: 85, l: 52 },
  { nameDe: 'Violett', nameEn: 'Violet', h: 260, s: 80, l: 48 },
  { nameDe: 'Violett', nameEn: 'Violet', h: 265, s: 75, l: 52 },
  { nameDe: 'Violett', nameEn: 'Violet', h: 258, s: 70, l: 38 },
  { nameDe: 'Violett', nameEn: 'Violet', h: 268, s: 80, l: 68 },
  { nameDe: 'Lavendel', nameEn: 'Lavender', h: 250, s: 45, l: 78 },
  { nameDe: 'Lavendel', nameEn: 'Lavender', h: 255, s: 40, l: 82 },
  { nameDe: 'Lavendel', nameEn: 'Lavender', h: 245, s: 38, l: 75 },
  { nameDe: 'Amethyst', nameEn: 'Amethyst', h: 270, s: 60, l: 58 },
  { nameDe: 'Lila', nameEn: 'Purple', h: 290, s: 70, l: 38 },
  { nameDe: 'Lila', nameEn: 'Purple', h: 280, s: 65, l: 42 },
  { nameDe: 'Lila', nameEn: 'Purple', h: 295, s: 60, l: 32 },
  { nameDe: 'Pflaume', nameEn: 'Plum', h: 300, s: 45, l: 30 },
  { nameDe: 'Pflaume', nameEn: 'Plum', h: 295, s: 40, l: 25 },
  { nameDe: 'Flieder', nameEn: 'Lilac', h: 282, s: 45, l: 72 },
  { nameDe: 'Flieder', nameEn: 'Lilac', h: 278, s: 38, l: 76 },
  { nameDe: 'Orchidee', nameEn: 'Orchid', h: 302, s: 60, l: 63 },
  { nameDe: 'Magenta', nameEn: 'Magenta', h: 300, s: 100, l: 50 },
  { nameDe: 'Magenta', nameEn: 'Magenta', h: 305, s: 85, l: 55 },
  { nameDe: 'Magenta', nameEn: 'Magenta', h: 295, s: 80, l: 45 },
  { nameDe: 'Fuchsia', nameEn: 'Fuchsia', h: 308, s: 90, l: 52 },
  { nameDe: 'Fuchsia', nameEn: 'Fuchsia', h: 315, s: 85, l: 48 },
  { nameDe: 'Himbeere', nameEn: 'Raspberry', h: 338, s: 75, l: 40 },
  { nameDe: 'Braun', nameEn: 'Brown', h: 25, s: 65, l: 35 },
  { nameDe: 'Braun', nameEn: 'Brown', h: 20, s: 55, l: 30 },
  { nameDe: 'Braun', nameEn: 'Brown', h: 28, s: 60, l: 42 },
  { nameDe: 'Braun', nameEn: 'Brown', h: 22, s: 50, l: 25 },
  { nameDe: 'Braun', nameEn: 'Brown', h: 30, s: 52, l: 50 },
  { nameDe: 'Kastanienbraun', nameEn: 'Chestnut', h: 18, s: 62, l: 30 },
  { nameDe: 'Rotbraun', nameEn: 'Auburn', h: 18, s: 70, l: 32 },
  { nameDe: 'Schokolade', nameEn: 'Chocolate', h: 20, s: 70, l: 18 },
  { nameDe: 'Schokolade', nameEn: 'Chocolate', h: 18, s: 65, l: 22 },
  { nameDe: 'Espresso', nameEn: 'Espresso', h: 20, s: 60, l: 14 },
  { nameDe: 'Kaffeebraun', nameEn: 'Coffee Brown', h: 25, s: 55, l: 20 },
  { nameDe: 'Mahagoni', nameEn: 'Mahogany', h: 12, s: 70, l: 30 },
  { nameDe: 'Zimtbraun', nameEn: 'Cinnamon', h: 20, s: 68, l: 40 },
  { nameDe: 'Karamell', nameEn: 'Caramel', h: 28, s: 72, l: 50 },
  { nameDe: 'Haselnuss', nameEn: 'Hazel', h: 22, s: 48, l: 45 },
  { nameDe: 'Sand', nameEn: 'Sand', h: 38, s: 45, l: 68 },
  { nameDe: 'Sahara', nameEn: 'Sahara', h: 35, s: 50, l: 62 },
  { nameDe: 'Taupe', nameEn: 'Taupe', h: 30, s: 18, l: 52 },
  { nameDe: 'Taupe', nameEn: 'Taupe', h: 28, s: 15, l: 45 },
  { nameDe: 'Mokka', nameEn: 'Mocha', h: 22, s: 35, l: 32 },
  { nameDe: 'Beige', nameEn: 'Beige', h: 40, s: 35, l: 80 },
  { nameDe: 'Beige', nameEn: 'Beige', h: 42, s: 40, l: 76 },
  { nameDe: 'Creme', nameEn: 'Cream', h: 48, s: 50, l: 90 },
  { nameDe: 'Elfenbein', nameEn: 'Ivory', h: 52, s: 45, l: 92 },
  { nameDe: 'Elfenbein', nameEn: 'Ivory', h: 48, s: 40, l: 94 },
  { nameDe: 'Ecru', nameEn: 'Ecru', h: 45, s: 30, l: 84 },
  { nameDe: 'Champagner', nameEn: 'Champagne', h: 44, s: 50, l: 86 },
  { nameDe: 'Blaugrün', nameEn: 'Teal', h: 180, s: 65, l: 32 },
  { nameDe: 'Blaugrün', nameEn: 'Teal', h: 176, s: 60, l: 28 },
  { nameDe: 'Blaugrün', nameEn: 'Teal', h: 184, s: 55, l: 38 },
  { nameDe: 'Meergrün', nameEn: 'Sea Green', h: 168, s: 50, l: 45 },
  { nameDe: 'Pastellblau', nameEn: 'Pastel Blue', h: 215, s: 60, l: 88 },
  { nameDe: 'Pastellgrün', nameEn: 'Pastel Green', h: 120, s: 50, l: 85 },
  { nameDe: 'Pastellrosa', nameEn: 'Pastel Pink', h: 340, s: 55, l: 90 },
  { nameDe: 'Pastellgelb', nameEn: 'Pastel Yellow', h: 55, s: 75, l: 88 },
  { nameDe: 'Pastellviolett', nameEn: 'Pastel Violet', h: 270, s: 40, l: 88 },
  { nameDe: 'Pastellorange', nameEn: 'Pastel Orange', h: 28, s: 80, l: 85 },
  { nameDe: 'Neongrün', nameEn: 'Neon Green', h: 118, s: 100, l: 58 },
  { nameDe: 'Neongelb', nameEn: 'Neon Yellow', h: 65, s: 100, l: 60 },
  { nameDe: 'Neonpink', nameEn: 'Neon Pink', h: 315, s: 100, l: 60 },
  { nameDe: 'Neonorange', nameEn: 'Neon Orange', h: 22, s: 100, l: 58 },
]

const COLOR_DESCRIPTIONS: Record<string, string> = {
  Schwarz: 'Schwarz entsteht, wenn kein Licht reflektiert wird – die dunkelste aller Farben.',
  Weiß: 'Weiß entsteht, wenn alles Licht reflektiert wird. Es enthält alle Spektralfarben.',
  Grau: 'Grau ist eine neutrale Farbe zwischen Schwarz und Weiß.',
  Warmgrau: 'Warmgrau ist ein Grau mit leichtem Gelb- oder Beige-Unterton.',
  Silber: 'Silber ist ein helles, metallisch wirkendes Grau mit kühlem Unterton.',
  Anthrazit: 'Anthrazit ist ein sehr dunkles Grau, fast schwarz.',
  Rot: 'Rot ist eine der drei Grundfarben des Lichts. Im Regenbogen eine der sieben Spektralfarben.',
  Scharlachrot: 'Scharlachrot ist ein leuchtendes Rot mit orangem Unterton.',
  Karmesin: 'Karmesin ist ein tiefes Rot mit violettem Unterton.',
  Rubinrot: 'Rubinrot ist ein tiefes, kräftiges Rot. Benannt nach dem Edelstein Rubin.',
  Weinrot: 'Weinrot ist ein dunkles, gedämpftes Rot.',
  Bordeaux: 'Bordeaux ist ein sehr dunkles Weinrot. Benannt nach der französischen Weinregion.',
  Burgunderrot: 'Burgunderrot ist ein sattes Rotviolett.',
  Ziegelrot: 'Ziegelrot ist ein gedecktes Rot mit Brauntönen.',
  Rostrot: 'Rostrot ist ein warmes, oxidiertes Rot. Erinnert an die Farbe von rostigem Eisen.',
  Rosa: 'Rosa ist ein zartes, helles Rot.',
  Hellrosa: 'Hellrosa ist ein sehr blasses, zartes Rosa.',
  Babyrot: 'Babyrot ist ein extrem zartes, fast weißes Rosa.',
  Tiefrosa: 'Tiefrosa ist ein kräftiges, leuchtendes Pink.',
  Magentarosa: 'Magentarosa ist ein intensives, leuchtendes Pink. Auch bekannt als Hot Pink.',
  Altrosa: 'Altrosa ist ein gedämpftes, staubiges Rosa mit Grauanteil.',
  Zartrosa: 'Zartrosa ist ein sehr helles, fast weißes Rosa.',
  Orange: 'Orange ist eine Mischfarbe aus Rot und Gelb.',
  Korallenrot: 'Korallenrot ist ein lebendiges Orange-Rosa. Erinnert an Meereskorallen.',
  Lachs: 'Lachs ist ein helles Orange-Rosa. Benannt nach der Fleischfarbe des Lachses.',
  Pfirsich: 'Pfirsich ist ein zartes Orange mit rosigem Unterton.',
  Apricot: 'Apricot ist ein helles, sanftes Orange. Benannt nach der Aprikose.',
  Terrakotta: 'Terrakotta ist ein warmes, erdiges Rotbraun. Benannt nach gebranntem Ton.',
  Ziegel: 'Ziegel ist ein gedecktes Rot-Braun. Benannt nach gebrannten Ziegeln.',
  Kupfer: 'Kupfer ist ein warmes Rot-Orange. Benannt nach dem Metall Kupfer.',
  Gelb: 'Gelb ist eine der drei Grundfarben des Lichts.',
  Zitronengelb: 'Zitronengelb ist ein frisches, leuchtendes Gelb mit grünlichem Unterton.',
  Kanariengelb: 'Kanariengelb ist ein helles, lebhaftes Gelb.',
  Goldgelb: 'Goldgelb ist ein sattes, warmes Gelb.',
  Gold: 'Gold ist ein tiefes, warmes Gelb-Orange. Benannt nach dem Edelmetall.',
  Sandgelb: 'Sandgelb ist ein helles, gedämpftes Gelb mit beigem Unterton.',
  Vanille: 'Vanille ist ein sehr zartes, cremiges Gelb.',
  Strohgelb: 'Strohgelb ist ein helles, trockenes Gelb. Erinnert an Stroh.',
  Maiskorn: 'Maiskorn ist ein kräftiges, lebhaftes Gelb. Benannt nach der Farbe von Maiskörnern.',
  Buttergelb: 'Buttergelb ist ein cremiges, warmes Gelb.',
  Senf: 'Senf ist ein gedämpftes, dunkles Gelb-Grün.',
  Ocker: 'Ocker ist ein erdiges Gelb-Braun.',
  Bernstein: 'Bernstein ist ein tiefes, warmes Orange-Gelb. Benannt nach dem Harz.',
  Gelbgrün: 'Gelbgrün ist eine lebhafte Mischung aus Gelb und Grün.',
  Limette: 'Limette ist ein frisches, leuchtendes Gelbgrün.',
  Chartreuse: 'Chartreuse ist ein intensives Gelbgrün. Benannt nach dem Likör.',
  Olivgrün: 'Olivgrün ist ein gedämpftes, erdiges Grün.',
  Khaki: 'Khaki ist ein helles, gedecktes Gelb-Braun oder Grünbraun.',
  Avocado: 'Avocado ist ein sattes, erdiges Dunkelgrün.',
  Grün: 'Grün ist eine der drei Grundfarben des Lichts.',
  Waldgrün: 'Waldgrün ist ein dunkles, natürliches Grün.',
  Flaschengrün: 'Flaschengrün ist ein sehr dunkles Grün.',
  Smaragdgrün: 'Smaragdgrün ist ein strahlendes, tiefes Grün. Benannt nach dem Edelstein.',
  Hellgrün: 'Hellgrün ist ein aufgehelltes, frisches Grün.',
  Apfelgrün: 'Apfelgrün ist ein frisches, mittleres Grün.',
  Grasgrün: 'Grasgrün ist ein kräftiges Grün, wie frisches Gras.',
  Salbeigrün: 'Salbeigrün ist ein gedämpftes, graugrünes Grün.',
  Mintgrün: 'Mintgrün ist ein zartes, helles Blaugrün.',
  Jadegrün: 'Jadegrün ist ein tiefes Blaugrün. Benannt nach dem Edelstein Jade.',
  Pistaziengrün: 'Pistaziengrün ist ein helles, zartes Grün.',
  Moosgrün: 'Moosgrün ist ein dunkles, gedämpftes Grün.',
  Blattgrün: 'Blattgrün ist ein kräftiges, natürliches Grün.',
  Türkis: 'Türkis ist ein lebhaftes Blaugrün. Benannt nach dem Edelstein.',
  Petrol: 'Petrol ist ein dunkles, gedämpftes Blaugrün.',
  Cyan: 'Cyan ist ein intensives Blaugrün. Eine der drei Druckfarben.',
  Aqua: 'Aqua ist ein helles, klares Blaugrün.',
  Hellblau: 'Hellblau ist ein aufgehelltes Blau.',
  Eisblau: 'Eisblau ist ein sehr helles, klares Blau.',
  Himmelblau: 'Himmelblau ist ein mittleres, klares Blau.',
  Babyblau: 'Babyblau ist ein sehr zartes, helles Blau.',
  Taubenblau: 'Taubenblau ist ein gedämpftes, graues Blau.',
  Blau: 'Blau ist eine der drei Grundfarben des Lichts.',
  Kornblumenblau: 'Kornblumenblau ist ein mittleres, leuchtendes Blau.',
  Königsblau: 'Königsblau ist ein tiefes, intensives Blau.',
  Kobaltblau: 'Kobaltblau ist ein kräftiges, tiefes Blau. Benannt nach dem Metall Kobalt.',
  Saphirblau: 'Saphirblau ist ein tiefes, leuchtendes Blau. Benannt nach dem Edelstein.',
  Marineblau: 'Marineblau ist ein sehr dunkles Blau.',
  Mitternachtsblau: 'Mitternachtsblau ist ein extrem dunkles Blau, fast schwarz.',
  Jeansblau: 'Jeansblau ist ein mittleres, gedämpftes Blau.',
  Stahlblau: 'Stahlblau ist ein gedämpftes, metallisches Blau.',
  Eisenblau: 'Eisenblau ist ein dunkles, gedämpftes Blau.',
  Indigo: 'Indigo ist ein tiefes Blauviolett. Im Regenbogen zwischen Blau und Violett.',
  Blauviolett: 'Blauviolett ist eine lebhafte Mischung aus Blau und Violett.',
  Violett: 'Violett ist eine Mischung aus Blau und Rot.',
  Lavendel: 'Lavendel ist ein zartes Helllila. Benannt nach der Lavendelblüte.',
  Amethyst: 'Amethyst ist ein mitteltiefes Violett. Benannt nach dem Edelstein.',
  Lila: 'Lila ist ein kräftiges Rotviolett.',
  Pflaume: 'Pflaume ist ein dunkles Rotviolett. Benannt nach der Pflaumenfarbe.',
  Flieder: 'Flieder ist ein zartes Hellviolett. Benannt nach der Fliederpflanze.',
  Orchidee: 'Orchidee ist ein helles, zartes Lila. Benannt nach der Blume.',
  Magenta: 'Magenta ist ein kräftiges Rotviolett. Eine der drei Druckfarben.',
  Fuchsia: 'Fuchsia ist ein leuchtendes Lila-Pink.',
  Himbeere: 'Himbeere ist ein dunkles Rotviolett. Benannt nach der Frucht.',
  Braun: 'Braun ist eine Mischfarbe aus Rot, Gelb und Schwarz.',
  Kastanienbraun: 'Kastanienbraun ist ein tiefes Rotbraun.',
  Rotbraun: 'Rotbraun ist ein warmes, dunkles Braun mit Rotanteil.',
  Schokolade: 'Schokolade ist ein sehr dunkles Braun.',
  Espresso: 'Espresso ist ein extrem dunkles Braun, fast schwarz.',
  Kaffeebraun: 'Kaffeebraun ist ein dunkles Braun.',
  Mahagoni: 'Mahagoni ist ein tiefes Rotbraun. Benannt nach dem Holz.',
  Zimtbraun: 'Zimtbraun ist ein warmes, mittleres Braun.',
  Karamell: 'Karamell ist ein warmes, goldenes Braun.',
  Haselnuss: 'Haselnuss ist ein mittleres Braun.',
  Sand: 'Sand ist ein helles, gelbliches Beige.',
  Sahara: 'Sahara ist ein warmes, mittleres Beige-Braun.',
  Taupe: 'Taupe ist ein gedämpftes Graubraun.',
  Mokka: 'Mokka ist ein dunkles Graubraun.',
  Beige: 'Beige ist ein warmes, helles Braun-Weiß.',
  Creme: 'Creme ist ein sehr helles, warmes Weiß.',
  Elfenbein: 'Elfenbein ist ein zartes, fast weißes Gelb.',
  Ecru: 'Ecru ist ein helles, gräulich-beiges Naturweiß.',
  Champagner: 'Champagner ist ein sehr zartes, goldenes Beige.',
  Blaugrün: 'Blaugrün ist eine Mischung aus Blau und Grün.',
  Meergrün: 'Meergrün ist ein kühles, mittleres Blaugrün.',
  Pastellblau: 'Pastellblau ist ein sehr zartes, helles Blau.',
  Pastellgrün: 'Pastellgrün ist ein sehr zartes, helles Grün.',
  Pastellrosa: 'Pastellrosa ist ein sehr zartes, helles Rosa.',
  Pastellgelb: 'Pastellgelb ist ein sehr zartes, helles Gelb.',
  Pastellviolett: 'Pastellviolett ist ein sehr zartes, helles Violett.',
  Pastellorange: 'Pastellorange ist ein sehr zartes, helles Orange.',
  Neongrün: 'Neongrün ist ein extrem leuchtendes Grün.',
  Neongelb: 'Neongelb ist ein extrem leuchtendes Gelb-Grün.',
  Neonpink: 'Neonpink ist ein extrem leuchtendes Pink.',
  Neonorange: 'Neonorange ist ein extrem leuchtendes Orange.',
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    else if (max === gn) h = ((bn - rn) / d + 2) / 6
    else h = ((rn - gn) / d + 4) / 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function hslDistance(h1: number, s1: number, l1: number, h2: number, s2: number, l2: number): number {
  const dh = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2)) / 180
  const ds = Math.abs(s1 - s2) / 100
  const dl = Math.abs(l1 - l2) / 100
  const sWeight = (s1 + s2) / 2 / 100
  return Math.sqrt(dh * dh * (1 + sWeight) + ds * ds * 0.5 + dl * dl)
}

function getBrightness(l: number): { en: string; de: string; deSpeech: string } {
  if (l < 15) return { en: 'very dark', de: 'sehr dunkel', deSpeech: 'sehr dunkles' }
  if (l < 30) return { en: 'dark', de: 'dunkel', deSpeech: 'dunkles' }
  if (l < 45) return { en: 'medium dark', de: 'mitteldunkel', deSpeech: 'mittel-dunkles' }
  if (l < 58) return { en: 'medium', de: 'mittel', deSpeech: 'mittel helles' }
  if (l < 72) return { en: 'medium light', de: 'mittelhell', deSpeech: 'mittel-helles' }
  if (l < 85) return { en: 'light', de: 'hell', deSpeech: 'helles' }
  return { en: 'very light', de: 'sehr hell', deSpeech: 'sehr helles' }
}

export function identifyColor(r: number, g: number, b: number): PickedColor {
  const hsl = rgbToHsl(r, g, b)
  const hex = rgbToHex(r, g, b)

  let bestMatch = COLOR_DB[0]
  let bestDist = Infinity
  for (const entry of COLOR_DB) {
    const d = hslDistance(hsl.h, hsl.s, hsl.l, entry.h, entry.s, entry.l)
    if (d < bestDist) { bestDist = d; bestMatch = entry }
  }

  const brightness = getBrightness(hsl.l)
  const desc = COLOR_DESCRIPTIONS[bestMatch.nameDe] ?? `${bestMatch.nameDe} ist ein ${brightness.de}er Farbton.`

  return {
    hex,
    rgb: { r, g, b },
    hsl,
    nameDe: bestMatch.nameDe,
    nameEn: bestMatch.nameEn,
    brightness: brightness.en,
    brightnessDe: brightness.de,
    brightnessDeSpeech: brightness.deSpeech,
    descriptionDe: desc,
  }
}

export function getPixelColor(canvas: HTMLCanvasElement, x: number, y: number): { r: number; g: number; b: number } | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const d = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data
  return { r: d[0], g: d[1], b: d[2] }
}
