(function () {
  // Central Compare Profile loader.
  // Long term, fighter profile objects should live directly in this file.
  // For now this file keeps the HTML shell clean while preserving the existing compare packs.
  const legacyCompareFiles = [
    'assets/compare-coverage-pack-1.js',
    'assets/compare-coverage-pack-2.js',
    'assets/compare-coverage-pack-3.js',
    'assets/live-integration-pack-v1.js',
    'assets/audited-compare-pack-v1.js'
  ];

  legacyCompareFiles.forEach(src => {
    document.write(`<script src="${src}"></script>`);
  });

  window.COMPARE_PROFILE_FILES = legacyCompareFiles;
})();
