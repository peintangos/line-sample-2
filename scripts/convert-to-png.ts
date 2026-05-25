import sharp from "sharp";

async function convert() {
  await sharp("public/assets/rich-menu.svg")
    .resize(2500, 1686)
    .png()
    .toFile("public/assets/rich-menu.png");

  await sharp("public/assets/sample-image.svg")
    .resize(1040, 1040)
    .png()
    .toFile("public/assets/sample-image.png");

  await sharp("public/assets/imagemap/1040.svg")
    .resize(1040, 520)
    .png()
    .toFile("public/assets/imagemap/1040.png");

  await sharp("public/assets/rich-menu-b.svg")
    .resize(2500, 1686)
    .png()
    .toFile("public/assets/rich-menu-b.png");

  console.log("PNG files generated:");
  console.log("  public/assets/rich-menu.png");
  console.log("  public/assets/rich-menu-b.png");
  console.log("  public/assets/sample-image.png");
  console.log("  public/assets/imagemap/1040.png");
}

convert().catch(console.error);
