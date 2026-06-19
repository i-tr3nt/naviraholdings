/**
 * NAVIRA Hardware imagery — local files in /public/images/
 */

const img = (name: string) => `/images/${name}`;

export const hardwareImages = {
  hero: img("power-tools-bench.png"),
  socketSet: img("hero-sockets.png"),
  toolbox: img("toolbox-red.png"),
  wrenchesDisplay: img("wrenches-display.png"),
  toolsFlatlayDark: img("tools-flatlay-dark.png"),
  toolsFlatlayWood: img("tools-flatlay-wood.png"),
  toolBag: img("tool-bag.png"),
  ratchetsAisle: img("ratchets-aisle.png"),
  carpentryBench: img("carpentry-bench.png"),
  drillLumber: img("drill-lumber.png"),
  screwsOrganizer: img("screws-organizer.png"),
  powerToolsBench: img("power-tools-bench.png"),
  workshopClamps: img("workshop-clamps.png"),
  paintCansGrid: img("paint-cans-grid.png"),
  paintSupplies: img("paint-supplies.png"),
  paintStore: img("paint-store.png"),
  paintCansWood: img("paint-cans-wood.png"),
  plumbingInstall: img("plumbing-install.png"),
  plumbingFixtures: img("plumbing-fixtures.png"),
  plumbingTools: img("plumbing-tools.png"),
  doorLocks: img("door-locks.png"),
} as const;

export const departmentImages: Record<string, string> = {
  "Tools & Equipment": hardwareImages.ratchetsAisle,
  "Building Materials": hardwareImages.drillLumber,
  Plumbing: hardwareImages.plumbingInstall,
  Electrical: hardwareImages.powerToolsBench,
  "Paint & Finishes": hardwareImages.paintCansWood,
  "Garden & Outdoor": hardwareImages.toolBag,
};

const categoryKeywords: [string, string][] = [
  ["socket", hardwareImages.socketSet],
  ["wrench", hardwareImages.wrenchesDisplay],
  ["ratchet", hardwareImages.ratchetsAisle],
  ["screw", hardwareImages.screwsOrganizer],
  ["nail", hardwareImages.screwsOrganizer],
  ["bolt", hardwareImages.screwsOrganizer],
  ["fastener", hardwareImages.screwsOrganizer],
  ["tool", hardwareImages.ratchetsAisle],
  ["power", hardwareImages.powerToolsBench],
  ["drill", hardwareImages.drillLumber],
  ["sander", hardwareImages.powerToolsBench],
  ["saw", hardwareImages.carpentryBench],
  ["planer", hardwareImages.carpentryBench],
  ["wood", hardwareImages.carpentryBench],
  ["lumber", hardwareImages.drillLumber],
  ["timber", hardwareImages.drillLumber],
  ["build", hardwareImages.drillLumber],
  ["cement", hardwareImages.workshopClamps],
  ["clamp", hardwareImages.workshopClamps],
  ["plumb", hardwareImages.plumbingTools],
  ["pipe", hardwareImages.plumbingTools],
  ["faucet", hardwareImages.plumbingFixtures],
  ["tap", hardwareImages.plumbingFixtures],
  ["sink", hardwareImages.plumbingInstall],
  ["toilet", hardwareImages.plumbingInstall],
  ["drain", hardwareImages.plumbingFixtures],
  ["electr", hardwareImages.toolsFlatlayDark],
  ["cable", hardwareImages.toolsFlatlayDark],
  ["wire", hardwareImages.toolsFlatlayDark],
  ["paint", hardwareImages.paintSupplies],
  ["varnish", hardwareImages.paintCansWood],
  ["brush", hardwareImages.paintStore],
  ["primer", hardwareImages.paintCansGrid],
  ["lock", hardwareImages.doorLocks],
  ["door", hardwareImages.doorLocks],
  ["handle", hardwareImages.doorLocks],
  ["garden", hardwareImages.toolBag],
  ["outdoor", hardwareImages.toolBag],
];

export function getProductFallbackImage(category: string, itemName = ""): string {
  const key = Object.keys(departmentImages).find(
    (k) => k.toLowerCase() === category?.toLowerCase()
  );
  if (key) return departmentImages[key];

  const haystack = `${category} ${itemName}`.toLowerCase();
  for (const [keyword, url] of categoryKeywords) {
    if (haystack.includes(keyword)) return url;
  }

  return hardwareImages.toolsFlatlayDark;
}

export function getDepartmentImage(departmentName: string): string {
  return departmentImages[departmentName] ?? hardwareImages.ratchetsAisle;
}

export function isLocalHardwareImage(src: string): boolean {
  return src.startsWith("/images/");
}
