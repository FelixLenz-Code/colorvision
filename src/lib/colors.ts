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
  borderHint?: string
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
  Schwarz: 'Schwarz reflektiert kein Licht – die dunkelste aller Farben. Farbe der Nacht, des Weltalls und klassischer Eleganz.',
  Weiß: 'Weiß enthält alle Spektralfarben des Lichts zugleich. Wirkt rein und klar wie frischer Schnee.',
  Grau: 'Neutrale Mischung aus Schwarz und Weiß. Erinnert an Nebel, Asche und bewölkten Himmel.',
  Warmgrau: 'Grau mit einem leichten Gelb- oder Beige-Unterton. Wirkt wärmer als reines Grau.',
  Silber: 'Helles, metallisches Grau mit kühlem Glanz. Erinnert an poliertes Metall oder Mondlicht.',
  Anthrazit: 'Sehr dunkles Grau, fast schwarz – die Farbe von Kohle und Graphit.',
  Rot: 'Eine der drei Grundfarben des Lichts. Signalfarbe, die Aufmerksamkeit und Energie ausstrahlt.',
  Scharlachrot: 'Leuchtendes Rot mit orangem Unterton. Auffällig und kräftig wie eine Signalfarbe.',
  Karmesin: 'Tiefes Rot mit violettem Unterton. Satt und intensiv wie dunkler Granatapfelsaft.',
  Rubinrot: 'Kräftiges, tiefes Rot – benannt nach dem Edelstein Rubin. Leuchtend und edel.',
  Weinrot: 'Dunkles, gedämpftes Rot – die Farbe von trockenem Rotwein.',
  Bordeaux: 'Sehr dunkles Weinrot, benannt nach der französischen Weinregion. Tief und gereift.',
  Burgunderrot: 'Sattes Rotviolett – kräftig und warm wie Burgunderwein.',
  Ziegelrot: 'Gedecktes Rot mit Brauntönen – die Farbe von gebrannten Tonziegeln.',
  Rostrot: 'Warmes, oxidiertes Rot – die Farbe von altem Eisen nach Kontakt mit Luft und Feuchtigkeit.',
  Rosa: 'Helles, zartes Rot. Entsteht durch Mischung von Rot und Weiß.',
  Hellrosa: 'Sehr blasses Rosa – kaum mehr als ein Hauch Farbe auf weißem Grund.',
  Babyrot: 'Extrem zartes Rosa, fast weiß. Zarter als Hellrosa.',
  Tiefrosa: 'Kräftiges, leuchtendes Pink – satter als normales Rosa.',
  Magentarosa: 'Intensives, leuchtendes Pink mit violettem Unterton. Auch als Hot Pink bekannt.',
  Altrosa: 'Gedämpftes Rosa mit Grauanteil – zurückhaltend und zeitlos.',
  Zartrosa: 'Sehr helles, fast weißes Rosa. Der zarteste Rosaton.',
  Orange: 'Mischfarbe aus Rot und Gelb. Warm, lebhaft und auffällig wie reife Zitrusfrüchte.',
  Korallenrot: 'Lebendiges Orange-Rosa – die Farbe von Meereskorallen.',
  Lachs: 'Helles Orange-Rosa, benannt nach der Fleischfarbe des Lachses.',
  Pfirsich: 'Zartes Orange mit rosigem Unterton – die Farbe reifer Pfirsichhaut.',
  Apricot: 'Helles, sanftes Orange – benannt nach der Aprikose.',
  Terrakotta: 'Warmes, erdiges Rotbraun. Benannt nach gebranntem Ton (ital. „gebrannte Erde").',
  Ziegel: 'Gedecktes Rot-Braun – die Farbe von gebrannten Backsteinen.',
  Kupfer: 'Warmes Rot-Orange mit metallischem Charakter – die Farbe des Metalls Kupfer.',
  Gelb: 'Eine der drei Grundfarben des Lichts. Die hellste und am stärksten wahrgenommene Spektralfarbe.',
  Zitronengelb: 'Frisches, leuchtendes Gelb mit grünlichem Unterton – die Farbe einer reifen Zitronenschale.',
  Kanariengelb: 'Helles, lebhaftes Gelb – benannt nach dem Gefieder des Kanarienvogels.',
  Goldgelb: 'Sattes, warmes Gelb mit orange Unterton – tiefer als reines Gelb.',
  Gold: 'Tiefes, warmes Gelb-Orange – benannt nach dem Edelmetall Gold.',
  Sandgelb: 'Helles, gedämpftes Gelb mit beigem Unterton – die Farbe von trockenem Sand.',
  Vanille: 'Sehr zartes, cremiges Gelb – die Farbe der Vanilleschote und Vanilleeis.',
  Strohgelb: 'Helles, trockenes Gelb – die Farbe von getrocknetem Stroh.',
  Maiskorn: 'Kräftiges, lebhaftes Gelb – benannt nach der Farbe von Maiskörnern.',
  Buttergelb: 'Cremiges, warmes Gelb – die Farbe frischer Butter.',
  Senf: 'Gedämpftes, dunkles Gelbgrün – die Farbe von gelbem Senf.',
  Ocker: 'Erdiges Gelb-Braun. Eines der ältesten natürlichen Pigmente, gewonnen aus eisenhaltigem Gestein.',
  Bernstein: 'Tiefes, warmes Orange-Gelb – benannt nach dem fossilen Baumharz Bernstein.',
  Gelbgrün: 'Lebhafte Mischung aus Gelb und Grün, ähnlich frischem Frühlingslaub.',
  Limette: 'Frisches, leuchtendes Gelbgrün – die Farbe der Limettenfrüchte.',
  Chartreuse: 'Intensives Gelbgrün, benannt nach dem französischen Kräuterlikör gleichen Namens.',
  Olivgrün: 'Gedämpftes, erdiges Grün mit Gelbanteil – die Farbe reifer Oliven.',
  Khaki: 'Helles, gedecktes Gelbbraun bis Grünbraun – ursprünglich Farbe militärischer Uniformen.',
  Avocado: 'Sattes, dunkles Gelbgrün – die Farbe des Avocadofleisches.',
  Grün: 'Eine der drei Grundfarben des Lichts. Farbe der Vegetation – beruhigend und natürlich.',
  Waldgrün: 'Dunkles, natürliches Grün – die Farbe dichter Nadel- und Mischwälder.',
  Flaschengrün: 'Sehr dunkles Grün – benannt nach der typischen Farbe grüner Glasflaschen.',
  Smaragdgrün: 'Strahlendes, tiefes Grün – benannt nach dem Edelstein Smaragd.',
  Hellgrün: 'Aufgehelltes, frisches Grün – heller als reines Grün.',
  Apfelgrün: 'Frisches, mittleres Grün – die Farbe grüner Äpfel wie Granny Smith.',
  Grasgrün: 'Kräftiges, natürliches Grün – die Farbe von frischem Gras.',
  Salbeigrün: 'Gedämpftes Graugrün – die Farbe von Salbeiblättern.',
  Mintgrün: 'Zartes, helles Blaugrün – die Farbe von Pfefferminzblättern.',
  Jadegrün: 'Tiefes, klares Blaugrün – benannt nach dem Halbedelstein Jade.',
  Pistaziengrün: 'Helles, zartes Grün – die Farbe des Pistazienkerns.',
  Moosgrün: 'Dunkles, gedämpftes Grün – die Farbe von Moos auf Steinen und Baumrinde.',
  Blattgrün: 'Kräftiges, natürliches Grün – die typische Farbe eines Laubblattes.',
  Türkis: 'Lebhaftes Blaugrün – benannt nach dem Halbedelstein Türkis und dem türkisblauen Meer.',
  Petrol: 'Dunkles, gedämpftes Blaugrün mit grauem Unterton – erinnert an Rohöl (Petroleum).',
  Cyan: 'Intensives, reines Blaugrün – eine der drei Grundfarben im Farbdruck.',
  Aqua: 'Helles, klares Blaugrün – benannt nach dem lateinischen Wort für Wasser.',
  Hellblau: 'Aufgehelltes Blau – heller als reines Blau, wie ein sonniger Himmel.',
  Eisblau: 'Sehr helles, klares Blau mit weißem Anteil – die Farbe von Eis und Gletschern.',
  Himmelblau: 'Mittleres, klares Blau – die Farbe des klaren Himmels am Tag.',
  Babyblau: 'Sehr zartes, helles Blau – traditionell für Babykleidung verwendet.',
  Taubenblau: 'Gedämpftes, graues Blau – die Farbe des Taubengefieder.',
  Blau: 'Eine der drei Grundfarben des Lichts. Farbe des Himmels und des tiefen Wassers.',
  Kornblumenblau: 'Mittleres, leuchtendes Blau – benannt nach der Blütenfarbe der Kornblume.',
  Königsblau: 'Tiefes, intensives Blau – traditionell die Farbe von Königsgewändern.',
  Kobaltblau: 'Kräftiges, tiefes Blau – benannt nach dem Metall Kobalt, das dieses Pigment enthält.',
  Saphirblau: 'Tiefes, leuchtendes Blau – benannt nach dem Edelstein Saphir.',
  Marineblau: 'Sehr dunkles Blau – traditionell die Farbe von Marineuniformen.',
  Mitternachtsblau: 'Extrem dunkles Blau, fast schwarz – die Farbe des Himmels kurz nach Mitternacht.',
  Jeansblau: 'Mittleres, gedämpftes Blau – die typische Farbe von Denim-Jeans.',
  Stahlblau: 'Gedämpftes, metallisches Blau mit grauem Unterton – erinnert an poliertem Stahl.',
  Eisenblau: 'Dunkles, gedämpftes Blau – die Farbe von unbehandeltem Eisen.',
  Indigo: 'Tiefes Blauviolett – im Regenbogen zwischen Blau und Violett. Traditionell aus der Indigopflanze gewonnen.',
  Blauviolett: 'Lebhafte Mischung aus Blau und Violett, lebendiger als Indigo.',
  Violett: 'Mischfarbe aus Blau und Rot. Die Farbe mit der kürzesten sichtbaren Wellenlänge.',
  Lavendel: 'Zartes Helllila – benannt nach der Blütenfarbe der Lavendelpflanze.',
  Amethyst: 'Mitteltiefes Violett – benannt nach dem Halbedelstein Amethyst.',
  Lila: 'Kräftiges Rotviolett – satter und wärmer als reines Violett.',
  Pflaume: 'Dunkles Rotviolett – die Farbe reifer Pflaumen.',
  Flieder: 'Zartes Hellviolett – benannt nach der Blütenfarbe des Fliederbusches.',
  Orchidee: 'Helles, zartes Lila – benannt nach den Blüten der Orchidee.',
  Magenta: 'Kräftiges Rotviolett – eine der drei Grundfarben im Farbdruck (CMYK).',
  Fuchsia: 'Leuchtendes Lila-Pink – benannt nach der Blütenfarbe der Fuchsienpflanze.',
  Himbeere: 'Dunkles Rotviolett – die Farbe reifer Himbeeren.',
  Braun: 'Dunkle Mischfarbe aus Rot, Gelb und Schwarz. Erdfarbe – warm und natürlich.',
  Kastanienbraun: 'Tiefes Rotbraun – die Farbe glänzender Kastanienfrüchte im Herbst.',
  Rotbraun: 'Warmes, dunkles Braun mit deutlichem Rotanteil.',
  Schokolade: 'Sehr dunkles Braun – die Farbe dunkler Zartbitterschokolade.',
  Espresso: 'Extrem dunkles Braun, fast schwarz – die Farbe von frisch gebrühtem Espresso.',
  Kaffeebraun: 'Dunkles Braun – die Farbe von Filterkaffee oder Kaffeebohnen.',
  Mahagoni: 'Tiefes Rotbraun – benannt nach dem tropischen Mahagoniholz.',
  Zimtbraun: 'Warmes, mittleres Braun – die Farbe gemahlener Zimtstangen.',
  Karamell: 'Warmes, goldenes Braun – die Farbe von geschmolzenem Karamellzucker.',
  Haselnuss: 'Mittleres, warmes Braun – die Farbe der Haselnussschale.',
  Sand: 'Helles, gelbliches Beige – die Farbe von trockenem Strandsand.',
  Sahara: 'Warmes, mittleres Beige-Braun – erinnert an den Sand der Sahara.',
  Taupe: 'Gedämpftes Graubraun – eine neutrale Farbe zwischen Grau und Beige.',
  Mokka: 'Dunkles Graubraun – benannt nach der Kaffeesorte aus der jemenitischen Stadt Mokka.',
  Beige: 'Warmes, helles Braun-Weiß. Neutraler Naturton, benannt nach dem französischen Wort für ungefärbte Wolle.',
  Creme: 'Sehr helles, warmes Weiß mit gelblichem Unterton – die Farbe von Sahne.',
  Elfenbein: 'Zartes, fast weißes Gelb – traditionell die Farbe von Elfenbein.',
  Ecru: 'Helles, gräulich-beiges Naturweiß – benannt nach dem französischen Wort für ungefärbten Stoff.',
  Champagner: 'Sehr zartes, goldenes Beige – die Farbe von hellem Champagner im Glas.',
  Blaugrün: 'Gleichwertige Mischung aus Blau und Grün – zwischen Türkis und Petrol.',
  Meergrün: 'Kühles, mittleres Blaugrün – die Farbe des flachen Meerwassers.',
  Pastellblau: 'Sehr zartes, helles Blau mit hohem Weißanteil.',
  Pastellgrün: 'Sehr zartes, helles Grün mit hohem Weißanteil.',
  Pastellrosa: 'Sehr zartes, helles Rosa mit hohem Weißanteil.',
  Pastellgelb: 'Sehr zartes, helles Gelb mit hohem Weißanteil.',
  Pastellviolett: 'Sehr zartes, helles Violett mit hohem Weißanteil.',
  Pastellorange: 'Sehr zartes, helles Orange mit hohem Weißanteil.',
  Neongrün: 'Extrem leuchtendes Grün mit fluoreszierender Wirkung. Gut sichtbar auch auf Distanz.',
  Neongelb: 'Extrem leuchtendes Gelbgrün – die auffälligste Farbe im sichtbaren Spektrum.',
  Neonpink: 'Extrem leuchtendes Pink mit fluoreszierendem Charakter.',
  Neonorange: 'Extrem leuchtendes Orange – häufig als Warnfarbe eingesetzt.',
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

const BORDER_THRESHOLD = 0.09

// Only everyday color names appear in border hints — no exotic shades
const EVERYDAY_COLORS = new Set([
  'Rot', 'Orange', 'Gelb', 'Grün', 'Blau', 'Lila', 'Violett', 'Rosa', 'Weiß', 'Schwarz', 'Grau', 'Braun',
  'Hellblau', 'Hellgrün', 'Hellrosa', 'Türkis', 'Beige', 'Creme',
  'Gold', 'Silber', 'Lachs', 'Mintgrün', 'Marineblau', 'Himmelblau', 'Magenta', 'Flieder', 'Lavendel',
  'Olivgrün', 'Khaki', 'Ocker', 'Senf', 'Korallenrot', 'Tiefrosa', 'Anthrazit',
  'Pfirsich', 'Apricot', 'Schokolade', 'Weinrot', 'Bordeaux', 'Smaragdgrün', 'Indigo',
  'Gelbgrün', 'Blaugrün', 'Blauviolett', 'Limette', 'Pflaume', 'Himbeere',
  'Pastellblau', 'Pastellgrün', 'Pastellgelb', 'Pastellrosa', 'Pastellviolett',
  'Neongelb', 'Neongrün', 'Neonorange', 'Neonpink',
])

export function identifyColor(r: number, g: number, b: number): PickedColor {
  const hsl = rgbToHsl(r, g, b)
  const hex = rgbToHex(r, g, b)

  let bestMatch = COLOR_DB[0]
  let bestDist = Infinity
  for (const entry of COLOR_DB) {
    const d = hslDistance(hsl.h, hsl.s, hsl.l, entry.h, entry.s, entry.l)
    if (d < bestDist) { bestDist = d; bestMatch = entry }
  }

  // Find closest everyday color with a different name to detect borderline cases
  let secondBestDist = Infinity
  let secondBestName: string | undefined
  for (const entry of COLOR_DB) {
    if (entry.nameDe === bestMatch.nameDe) continue
    if (!EVERYDAY_COLORS.has(entry.nameDe)) continue
    const d = hslDistance(hsl.h, hsl.s, hsl.l, entry.h, entry.s, entry.l)
    if (d < secondBestDist) { secondBestDist = d; secondBestName = entry.nameDe }
  }

  const borderHint = (secondBestName && secondBestDist - bestDist < BORDER_THRESHOLD)
    ? secondBestName
    : undefined

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
    borderHint,
  }
}

export function getPixelColor(canvas: HTMLCanvasElement, x: number, y: number): { r: number; g: number; b: number } | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const px = Math.round(x), py = Math.round(y)
  if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) return null
  const d = ctx.getImageData(px, py, 1, 1).data
  if (d[3] < 128) return null // transparent pixel (outside image bounds within canvas)
  return { r: d[0], g: d[1], b: d[2] }
}
