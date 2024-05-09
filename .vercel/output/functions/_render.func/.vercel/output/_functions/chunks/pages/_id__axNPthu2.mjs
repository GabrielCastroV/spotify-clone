/* empty css                          */
import { A as AstroError, c as InvalidImageService, d as ExpectedImageOptions, E as ExpectedImage, F as FailedToFetchRemoteImageDimensions, e as createComponent, f as ImageMissingAlt, r as renderTemplate, m as maybeRenderHead, g as addAttribute, s as spreadAttributes, h as createAstro, i as renderComponent, j as renderSlot, k as renderHead, l as renderTransition } from '../astro_DslpnMLS.mjs';
import 'kleur/colors';
import 'html-escaper';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { create } from 'zustand';
import * as SliderPrimitive from '@radix-ui/react-slider';
import cn from 'clsx';
import { r as resolveSrc, i as isRemoteImage, a as isESMImportedImage, b as isLocalService, D as DEFAULT_HASH_PROPS } from '../astro/assets-service_Dw08Mtv0.mjs';

const decoder = new TextDecoder();
const toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
const toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + ("0" + i.toString(16)).slice(-2), "");
const readInt16LE = (input, offset = 0) => {
  const val = input[offset] + input[offset + 1] * 2 ** 8;
  return val | (val & 2 ** 15) * 131070;
};
const readUInt16BE = (input, offset = 0) => input[offset] * 2 ** 8 + input[offset + 1];
const readUInt16LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8;
const readUInt24LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16;
const readInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + (input[offset + 3] << 24);
const readUInt32BE = (input, offset = 0) => input[offset] * 2 ** 24 + input[offset + 1] * 2 ** 16 + input[offset + 2] * 2 ** 8 + input[offset + 3];
const readUInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + input[offset + 3] * 2 ** 24;
const methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset, isBigEndian) {
  offset = offset || 0;
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = "readUInt" + bits + endian;
  return methods[methodName](input, offset);
}
function readBox(buffer, offset) {
  if (buffer.length - offset < 4)
    return;
  const boxSize = readUInt32BE(buffer, offset);
  if (buffer.length - offset < boxSize)
    return;
  return {
    name: toUTF8String(buffer, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(buffer, boxName, offset) {
  while (offset < buffer.length) {
    const box = readBox(buffer, offset);
    if (!box)
      break;
    if (box.name === boxName)
      return box;
    offset += box.size;
  }
}

const BMP = {
  validate: (input) => toUTF8String(input, 0, 2) === "BM",
  calculate: (input) => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};

const TYPE_ICON = 1;
const SIZE_HEADER$1 = 2 + 2 + 2;
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize$1(input, imageIndex) {
  const offset = SIZE_HEADER$1 + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
const ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0)
      return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    const imageSize = getImageSize$1(input, 0);
    if (nbImages === 1)
      return imageSize;
    const imgs = [imageSize];
    for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
      imgs.push(getImageSize$1(input, imageIndex));
    }
    return {
      height: imageSize.height,
      images: imgs,
      width: imageSize.width
    };
  }
};

const TYPE_CURSOR = 2;
const CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0)
      return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};

const DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

const gifRegexp = /^GIF8[79]a/;
const GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

const brandMap = {
  avif: "avif",
  mif1: "heif",
  msf1: "heif",
  // hief-sequence
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  // heic-sequence
  hevx: "heic"
  // heic-sequence
};
function detectBrands(buffer, start, end) {
  let brandsDetected = {};
  for (let i = start; i <= end; i += 4) {
    const brand = toUTF8String(buffer, i, i + 4);
    if (brand in brandMap) {
      brandsDetected[brand] = 1;
    }
  }
  if ("avif" in brandsDetected) {
    return "avif";
  } else if ("heic" in brandsDetected || "heix" in brandsDetected || "hevc" in brandsDetected || "hevx" in brandsDetected) {
    return "heic";
  } else if ("mif1" in brandsDetected || "msf1" in brandsDetected) {
    return "heif";
  }
}
const HEIF = {
  validate(buffer) {
    const ftype = toUTF8String(buffer, 4, 8);
    const brand = toUTF8String(buffer, 8, 12);
    return "ftyp" === ftype && brand in brandMap;
  },
  calculate(buffer) {
    const metaBox = findBox(buffer, "meta", 0);
    const iprpBox = metaBox && findBox(buffer, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(buffer, "ipco", iprpBox.offset + 8);
    const ispeBox = ipcoBox && findBox(buffer, "ispe", ipcoBox.offset + 8);
    if (ispeBox) {
      return {
        height: readUInt32BE(buffer, ispeBox.offset + 16),
        width: readUInt32BE(buffer, ispeBox.offset + 12),
        type: detectBrands(buffer, 8, metaBox.offset)
      };
    }
    throw new TypeError("Invalid HEIF, no size found");
  }
};

const SIZE_HEADER = 4 + 4;
const FILE_LENGTH_OFFSET = 4;
const ENTRY_LENGTH_OFFSET = 4;
const ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  // m => 16 x 16
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
const ICNS = {
  validate: (input) => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER;
    let imageHeader = readImageHeader(input, imageOffset);
    let imageSize = getImageSize(imageHeader[0]);
    imageOffset += imageHeader[1];
    if (imageOffset === fileLength)
      return imageSize;
    const result = {
      height: imageSize.height,
      images: [imageSize],
      width: imageSize.width
    };
    while (imageOffset < fileLength && imageOffset < inputLength) {
      imageHeader = readImageHeader(input, imageOffset);
      imageSize = getImageSize(imageHeader[0]);
      imageOffset += imageHeader[1];
      result.images.push(imageSize);
    }
    return result;
  }
};

const J2C = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: (input) => toHexString(input, 0, 4) === "ff4fff51",
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

const JP2 = {
  validate(input) {
    if (readUInt32BE(input, 4) !== 1783636e3 || readUInt32BE(input, 0) < 1)
      return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox)
      return false;
    return readUInt32BE(input, ftypBox.offset + 4) === 1718909296;
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};

const EXIF_MARKER = "45786966";
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = "4d4d";
const LITTLE_ENDIAN_BYTE_ALIGN = "4949";
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
const JPG = {
  validate: (input) => toHexString(input, 0, 2) === "ffd8",
  calculate(input) {
    input = input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      if (input[i] !== 255) {
        input = input.slice(1);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      validateInput(input, i);
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.slice(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};

const KTX = {
  validate: (input) => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: (input) => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};

const pngSignature = "PNG\r\n\n";
const pngImageHeaderChunkName = "IHDR";
const pngFriedChunkName = "CgBI";
const PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};

const PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
const handlers = {
  default: (lines) => {
    let dimensions = [];
    while (lines.length > 0) {
      const line = lines.shift();
      if (line[0] === "#") {
        continue;
      }
      dimensions = line.split(" ");
      break;
    }
    if (dimensions.length === 2) {
      return {
        height: parseInt(dimensions[1], 10),
        width: parseInt(dimensions[0], 10)
      };
    } else {
      throw new TypeError("Invalid PNM");
    }
  },
  pam: (lines) => {
    const size = {};
    while (lines.length > 0) {
      const line = lines.shift();
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key, value] = line.split(" ");
      if (key && value) {
        size[key.toLowerCase()] = parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    } else {
      throw new TypeError("Invalid PAM");
    }
  }
};
const PNM = {
  validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const lines = toUTF8String(input, 3).split(/[\r\n]+/);
    const handler = handlers[type] || handlers.default;
    return handler(lines);
  }
};

const PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

const svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
const extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
const INCH_CM = 2.54;
const units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
const unitsReg = new RegExp(
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = root.match(extractorRegExps.width);
  const height = root.match(extractorRegExps.height);
  const viewbox = root.match(extractorRegExps.viewbox);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
const SVG = {
  // Scan only the first kilo-byte to speed up the check on larger files
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = toUTF8String(input).match(extractorRegExps.root);
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

const TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};

function readIFD(input, isBigEndian) {
  const ifdOffset = readUInt(input, 32, 4, isBigEndian);
  return input.slice(ifdOffset + 2);
}
function readValue(input, isBigEndian) {
  const low = readUInt(input, 16, 8, isBigEndian);
  const high = readUInt(input, 16, 10, isBigEndian);
  return (high << 16) + low;
}
function nextTag(input) {
  if (input.length > 24) {
    return input.slice(12);
  }
}
function extractTags(input, isBigEndian) {
  const tags = {};
  let temp = input;
  while (temp && temp.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) {
      break;
    } else {
      if (length === 1 && (type === 3 || type === 4)) {
        tags[code] = readValue(temp, isBigEndian);
      }
      temp = nextTag(temp);
    }
  }
  return tags;
}
function determineEndianness(input) {
  const signature = toUTF8String(input, 0, 2);
  if ("II" === signature) {
    return "LE";
  } else if ("MM" === signature) {
    return "BE";
  }
}
const signatures = [
  // '492049', // currently not supported
  "49492a00",
  // Little endian
  "4d4d002a"
  // Big Endian
  // '4d4d002a', // BigTIFF > 4GB. currently not supported
];
const TIFF = {
  validate: (input) => signatures.includes(toHexString(input, 0, 4)),
  calculate(input) {
    const isBigEndian = determineEndianness(input) === "BE";
    const ifdBuffer = readIFD(input, isBigEndian);
    const tags = extractTags(ifdBuffer, isBigEndian);
    const width = tags[256];
    const height = tags[257];
    if (!width || !height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return { height, width };
  }
};

function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
const WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(input) {
    const chunkHeader = toUTF8String(input, 12, 16);
    input = input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      } else {
        throw new TypeError("Invalid WebP");
      }
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};

const typeHandlers = /* @__PURE__ */ new Map([
  ["bmp", BMP],
  ["cur", CUR],
  ["dds", DDS],
  ["gif", GIF],
  ["heif", HEIF],
  ["icns", ICNS],
  ["ico", ICO],
  ["j2c", J2C],
  ["jp2", JP2],
  ["jpg", JPG],
  ["ktx", KTX],
  ["png", PNG],
  ["pnm", PNM],
  ["psd", PSD],
  ["svg", SVG],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
const types = Array.from(typeHandlers.keys());

const firstBytes = /* @__PURE__ */ new Map([
  [56, "psd"],
  [66, "bmp"],
  [68, "dds"],
  [71, "gif"],
  [73, "tiff"],
  [77, "tiff"],
  [82, "webp"],
  [105, "icns"],
  [137, "png"],
  [255, "jpg"]
]);
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((fileType) => typeHandlers.get(fileType).validate(input));
}

const globalOptions = {
  disabledTypes: []
};
function lookup(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    if (globalOptions.disabledTypes.indexOf(type) > -1) {
      throw new TypeError("disabled file type: " + type);
    }
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      return size;
    }
  }
  throw new TypeError("unsupported file type: " + type);
}

async function probe(url) {
  const response = await fetch(url);
  if (!response.body || !response.ok) {
    throw new Error("Failed to fetch image");
  }
  const reader = response.body.getReader();
  let done, value;
  let accumulatedChunks = new Uint8Array();
  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    if (done)
      break;
    if (readResult.value) {
      value = readResult.value;
      let tmp = new Uint8Array(accumulatedChunks.length + value.length);
      tmp.set(accumulatedChunks, 0);
      tmp.set(value, accumulatedChunks.length);
      accumulatedChunks = tmp;
      try {
        const dimensions = lookup(accumulatedChunks);
        if (dimensions) {
          await reader.cancel();
          return dimensions;
        }
      } catch (error) {
      }
    }
  }
  throw new Error("Failed to parse the size");
}

async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      '../astro/assets-service_Dw08Mtv0.mjs'
    ).then(n => n.k).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset)
      globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: await resolveSrc(options.src)
  };
  if (options.inferSize && isRemoteImage(resolvedOptions.src)) {
    try {
      const result = await probe(resolvedOptions.src);
      resolvedOptions.width ??= result.width;
      resolvedOptions.height ??= result.height;
      delete resolvedOptions.inferSize;
    } catch {
      throw new AstroError({
        ...FailedToFetchRemoteImageDimensions,
        message: FailedToFetchRemoteImageDimensions.message(resolvedOptions.src)
      });
    }
  }
  const originalFilePath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : void 0;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  resolvedOptions.src = clonedSrc;
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => ({
      transform: srcSet.transform,
      url: await service.getURL(srcSet.transform, imageConfig),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }))
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(
      validatedOptions,
      propsToHash,
      originalFilePath
    );
    srcSets = srcSetTransforms.map((srcSet) => ({
      transform: srcSet.transform,
      url: globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalFilePath),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }));
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$8 = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = await getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(additionalAttributes)}${spreadAttributes(image.attributes)}>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/node_modules/astro/components/Image.astro", void 0);

const $$Astro$7 = createAstro();
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const originalSrc = await resolveSrc(props.src);
  const optimizedImages = await Promise.all(
    formats.map(
      async (format) => await getImage({
        ...props,
        src: originalSrc,
        format,
        widths: props.widths,
        densities: props.densities
      })
    )
  );
  let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(originalSrc) && specialFormatsFallback.includes(originalSrc.format)) {
    resultFallbackFormat = originalSrc.format;
  }
  const fallbackImage = await getImage({
    ...props,
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  });
  const imgAdditionalAttributes = {};
  const sourceAdditionalAttributes = {};
  if (props.sizes) {
    sourceAdditionalAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute("image/" + image.options.format, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
  })} <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(imgAdditionalAttributes)}${spreadAttributes(fallbackImage.attributes)}> </picture>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/node_modules/astro/components/Picture.astro", void 0);

const imageConfig = {"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]};
					const getImage = async (options) => await getImage$1(options, imageConfig);

const colors = {
  red: { accent: "#da2735", dark: "#7f1d1d" },
  orange: { accent: "#cc5400", dark: "#7c2d12" },
  yellow: { accent: "#ffae00", dark: "#78350f" },
  green: { accent: "#21c872", dark: "#14532d" },
  teal: { accent: "#2ee9d7", dark: "#134e4a" },
  blue: { accent: "#1e3a8a", dark: "#1e3a8a" },
  indigo: { accent: "#394bd5", dark: "#312e81" },
  purple: { accent: "#df24ff", dark: "#581c87" },
  pink: { accent: "#f33b73", dark: "#831843" },
  emerald: { accent: "#0c6e54", dark: "#064e3b" },
  rose: { accent: "#ed2377", dark: "#871b48" },
  gray: { accent: "#555555", dark: "#27272a" }
};

const playlists = [
  {
    id: "1",
    albumId: 1,
    title: "Chill Lo-Fi Music",
    color: colors.yellow,
    cover: "https://www.opnminded.com/wp-content/uploads/2018/06/Studio-Ghibli-01-optimized.jpg",
    artists: ["NoSparks", "Zap"]
  },
  {
    id: "2",
    albumId: 2,
    title: "人生最愛の人",
    color: colors.green,
    cover: "https://i.imgur.com/fezrcrL.jpg",
    artists: ["Kupla", "Blue Fox"]
  },
  {
    id: "3",
    albumId: 3,
    title: "Study Session",
    color: colors.rose,
    cover: "https://i1.sndcdn.com/artworks-hzC0LkywnS7TZlFt-TLYPIw-t500x500.jpg",
    artists: ["Tenno", "xander", "Team Astro"]
  },
  {
    id: "4",
    albumId: 4,
    title: "Blue Note Study Time",
    color: colors.blue,
    cover: "https://i.pinimg.com/736x/78/e1/c0/78e1c052ce978cf5b95ec1b991504eb5.jpg",
    artists: ["Raimu", "Yasumu"]
  },
  {
    id: "5",
    albumId: 5,
    title: "Relax Session",
    color: colors.purple,
    cover: "https://media.gq.com.mx/photos/6039588ee77487218ad2c4bc/16:9/w_2560%2Cc_limit/Viaje%2520de%2520Chihiro.jpg",
    artists: ["Shau Saura", "amies", "Tzuyu"]
  },
  {
    id: "6",
    albumId: 6,
    title: "Like a Necessity",
    color: colors.orange,
    cover: "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2020%2F03%2Flofi-hip-hop-popularity-criticism-chilledcow-youtube-livestream-1a.jpg?cbr=1&q=90",
    artists: ["WFS", "Nadav Cohen"]
  },
  {
    id: "7",
    albumId: 7,
    title: "Somewhere we know",
    color: colors.purple,
    cover: "https://pbs.twimg.com/media/ESpdlv1UwAAn8SW.jpg",
    artists: ["Woo", "Dew", "Yong"]
  },
  {
    id: "8",
    albumId: 8,
    title: "Le Ronronnement",
    color: colors.orange,
    cover: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/08/Jiji.jpg",
    artists: ["Romina", "Miti", "Mat"]
  }
];
const morePlaylists = playlists.map((item) => ({
  ...item,
  id: item.id + "_more"
}));
const sidebarPlaylists = playlists.map((item) => ({
  ...item,
  id: item.id + "_side"
}));
const allPlaylists = [
  ...playlists,
  ...morePlaylists,
  ...sidebarPlaylists
];
const songs = [
  {
    "id": 1,
    "albumId": 1,
    "title": "Moonlit Walk",
    "image": `https://www.opnminded.com/wp-content/uploads/2018/06/Studio-Ghibli-01-optimized.jpg`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:12"
  },
  {
    "id": 2,
    "albumId": 1,
    "title": "Coffee Daze",
    "image": `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSwAmYhTrHlhW4GyQWq5Enja_noJvMnPqn3RD5lOOiow&s`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "4:07"
  },
  {
    "id": 3,
    "albumId": 1,
    "title": "Skyline Serenade",
    "image": `https://pbs.twimg.com/media/GHSPXICWIAA2WCM?format=jpg&name=4096x4096`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:50"
  },
  {
    "id": 4,
    "albumId": 1,
    "title": "Urban Echoes",
    "image": `https://thecurrentmsu.com/wp-content/uploads/2021/05/Screenshot-2021-05-09-174400.png`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:30"
  },
  {
    "id": 5,
    "albumId": 1,
    "title": "Night's End",
    "image": `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxMMHUgfHkmCiZa-O4Uf8wb7OrWDxeNcxWdleyKCKNPA&s`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "4:20"
  },
  {
    "id": 1,
    "albumId": 2,
    "title": "Silent Rain",
    "image": `https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187`,
    "artists": ["Urban Nocturne", "Mr Jackson"],
    "album": "Midnight Tales",
    "duration": "3:40"
  },
  {
    "id": 2,
    "albumId": 2,
    "title": "Lost Pages",
    "image": `https://fotografias-neox.atresmedia.com/clipping/cmsimages02/2022/05/13/46017819-5D11-40AA-B49E-F68ACA2FC756/castillo-ambulante_98.jpg?crop=1845,1038,x40,y0&width=1900&height=1069&optimize=high&format=webply`,
    "artists": ["Urban Nocturne"],
    "album": "Midnight Tales",
    "duration": "3:20"
  },
  {
    "id": 3,
    "albumId": 2,
    "title": "Midnight Tales",
    "image": `https://www.cultture.com/pics/2021/08/studio-ghibli-10-criaturas-que-deseariamos-que-fueran-reales-3.webp`,
    "artists": ["Urban Nocturne"],
    "album": "Midnight Tales",
    "duration": "3:50"
  },
  {
    "id": 4,
    "albumId": 2,
    "title": "City Lights",
    "image": `https://www.informador.mx/__export/1705545008827/sites/elinformador/img/2024/01/17/gahjywcwuaqutfe_crop1705544939960.jpeg_788543494.jpeg`,
    "artists": ["Urban Nocturne"],
    "album": "Midnight Tales",
    "duration": "3:30"
  },
  {
    "id": 5,
    "albumId": 2,
    "title": "Night Drive",
    "image": `https://cinepremiere.com.mx/wp-content/uploads/2022/06/studio-ghibli-mejores-peliculas.jpg`,
    "artists": ["Urban Nocturne"],
    "album": "Midnight Tales",
    "duration": "4:20"
  },
  {
    "id": 1,
    "albumId": 3,
    "title": "Lunar",
    "image": `https://www.ecartelera.com/images/sets/5000/5016.jpg`,
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "3:40"
  },
  {
    "id": 2,
    "albumId": 3,
    "title": "Go go go!",
    "image": `https://mundo-ghibli.com/storage/2023/02/jiji-nicky-bruja.jpg`,
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "3:20"
  },
  {
    "id": 3,
    "albumId": 3,
    "title": "Keep focus!",
    "image": `https://mundo-ghibli.com/storage/2023/02/cat-bus-totoro.jpg`,
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "2:40"
  },
  {
    "id": 4,
    "albumId": 3,
    "title": "JavaScript is the way",
    "image": `https://i0.wp.com/xiahpop.com/wp-content/uploads/2019/11/DkPOd0zUwAAB62D.jpg?fit=850%2C537`,
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "3:10"
  },
  {
    "id": 5,
    "albumId": 3,
    "title": "No more TypeScript for me",
    "image": `https://f4.bcbits.com/img/a1435058381_65.jpg`,
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "2:10"
  },
  {
    "id": 1,
    "albumId": 4,
    "title": "Lunar",
    "image": "https://www.lacasadeel.net/wp-content/uploads/2024/03/Porco-Rosso-741x371.webp",
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "3:40"
  },
  {
    "id": 2,
    "albumId": 4,
    "title": "Go go go!",
    "image": "https://f4.bcbits.com/img/a1962013209_16.jpg",
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "3:20"
  },
  {
    "id": 3,
    "albumId": 4,
    "title": "Keep focus!",
    "image": "https://i.redd.it/97gmj14gdr561.jpg",
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "2:40"
  },
  {
    "id": 4,
    "albumId": 4,
    "title": "JavaScript is the way",
    "image": "https://depor.com/resizer/9d4LxX6HgvVeLgQ87ILmwCkAAVQ=/580x330/smart/filters:format(jpeg):quality(90)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/H3FG2O53UFHEPDFAPTIU5IQESY.png",
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "3:10"
  },
  {
    "id": 5,
    "albumId": 4,
    "title": "No more TypeScript for me",
    "image": "https://cdn.domestika.org/c_fill,dpr_auto,f_auto,q_auto/v1476825543/content-items/001/745/852/06.ghibli-heroines-Fio-Piccolo-porco-rosso-original.jpg?1476825543",
    "artists": ["Tenno"],
    "album": "Study Session",
    "duration": "2:10"
  },
  {
    "id": 1,
    "albumId": 5,
    "title": "Moonlit Walk",
    "image": "https://mundo-ghibli.com/storage/2023/04/shun-kazama-pelicula.webp",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:12"
  },
  {
    "id": 2,
    "albumId": 5,
    "title": "Coffee Daze",
    "image": "https://somoskudasai.com/wp-content/uploads/2023/03/portada_ghibli-7.jpg",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "4:07"
  },
  {
    "id": 3,
    "albumId": 5,
    "title": "Skyline Serenade",
    "image": "https://www.geekmi.news/__export/1637429187703/sites/debate/img/2021/11/20/ita_y_fushi1.jpg_1758632412.jpg",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:50"
  },
  {
    "id": 4,
    "albumId": 5,
    "title": "Urban Echoes",
    "image": "https://f4.bcbits.com/img/a2793859494_16.jpg",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:30"
  },
  {
    "id": 5,
    "albumId": 5,
    "title": "Night's End",
    "image": "https://hips.hearstapps.com/es.h-cdn.co/fotoes/images/peliculas-para-ninos-cine-infantil/5-3-peliculas-ghibli-que-haran-las-delicias-de-los-mas-pequenos/02.-ponyo-en-el-acantilado/99709502-1-esl-ES/02.-Ponyo-en-el-acantilado.png",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "4:20"
  },
  {
    "id": 1,
    "albumId": 6,
    "title": "Moonlit Walk",
    "image": "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2020%2F03%2Flofi-hip-hop-popularity-criticism-chilledcow-youtube-livestream-1a.jpg?cbr=1&q=90",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:12"
  },
  {
    "id": 2,
    "albumId": 6,
    "title": "Coffee Daze",
    "image": "https://static01.nyt.com/images/2017/10/15/arts/15GHIBLI-RANKING-A-SPIRITED/10newclassics3-inyt-videoSixteenByNine1050.jpg",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "4:07"
  },
  {
    "id": 3,
    "albumId": 6,
    "title": "Skyline Serenade",
    "image": "https://i.pinimg.com/736x/6d/c6/30/6dc6306a3a7f906961f5cfa39f650d8f.jpg",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:50"
  },
  {
    "id": 4,
    "albumId": 6,
    "title": "Urban Echoes",
    "image": "https://f4.bcbits.com/img/a2793859494_16.jpg",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:30"
  },
  {
    "id": 5,
    "albumId": 6,
    "title": "Night's End",
    "image": "https://elcomercio.pe/resizer/O4Ii_iTBDlCEDqZi6BcXRF1hX4w=/1200x900/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/ZDPVDIWMHRGIRKOD7MJAEY5JOQ.jpg",
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "4:20"
  },
  {
    "id": 1,
    "albumId": 7,
    "title": "Deep Walk",
    "image": "https://www.indiewire.com/wp-content/uploads/2016/08/jiji-kiki.png?w=800",
    "artists": ["Freaking", "Dune"],
    "album": "Somewhere we know",
    "duration": "2:29"
  },
  {
    "id": 2,
    "albumId": 7,
    "title": "Bread and Coffee",
    "image": "https://i.pinimg.com/736x/88/ee/14/88ee143e21b62dcd3e09ccd16b2eabff.jpg",
    "artists": ["Jihyo", "TGG"],
    "album": "Somewhere we know",
    "duration": "1:49"
  },
  {
    "id": 3,
    "albumId": 7,
    "title": "Skyhigh",
    "image": "https://www.looper.com/img/gallery/the-30-best-studio-ghibli-characters-ranked/intro-1667174768.jpg",
    "artists": ["August", "Fredd"],
    "album": "Somewhere we know",
    "duration": "2:36"
  },
  {
    "id": 4,
    "albumId": 7,
    "title": "Drone",
    "image": "https://i.pinimg.com/736x/00/50/a9/0050a998798cc264e82accdc7d95ba5c.jpg",
    "artists": ["Hirai Momo"],
    "album": "Somewhere we know",
    "duration": "2:49"
  },
  {
    "id": 5,
    "albumId": 7,
    "title": "Night's End",
    "image": "https://freefrontend.com/assets/img/css-ghibli-characters/2021-le-voyage-de-chihiro-susuwatari.png",
    "artists": ["FTW", "RaZ"],
    "album": "Somewhere we know",
    "duration": "1:57"
  },
  {
    "id": 1,
    "albumId": 8,
    "title": "M&Ms",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl9MBGQASPgMIh19hD2hJB8bVtqhXVU2Z18D3J2XqLd2If5PI5k5lHgtc6bGsI3YR7C9Q&usqp=CAU",
    "artists": ["Cyan"],
    "album": "Le Ronronnement",
    "duration": "2:54"
  },
  {
    "id": 2,
    "albumId": 8,
    "title": "Sugar Honey Ice Tea",
    "image": "https://i1.sndcdn.com/artworks-000085976582-vonea1-t500x500.jpg",
    "artists": ["ZYZZ"],
    "album": "Le Ronronnement",
    "duration": "1:52"
  },
  {
    "id": 3,
    "albumId": 8,
    "title": "Main Trousers",
    "image": "https://i0.wp.com/higherplainmusic.com/wp-content/uploads/2022/05/rozen-ghibli-secret-hideaway-cover-art.jpg?fit=1200%2C1200&ssl=1",
    "artists": ["Agustin Calderon"],
    "album": "Le Ronronnement",
    "duration": "2:15"
  },
  {
    "id": 4,
    "albumId": 8,
    "title": "Midwest",
    "image": "https://i1.sndcdn.com/artworks-000042547765-eehere-t500x500.jpg",
    "artists": ["Astro Master"],
    "album": "Le Ronronnement",
    "duration": "4:06"
  },
  {
    "id": 5,
    "albumId": 8,
    "title": "End?",
    "image": "https://pbs.twimg.com/media/FCPv12EX0A0YIWx?format=jpg&name=large",
    "artists": ["Bills", "Ocean"],
    "album": "Le Ronronnement",
    "duration": "3:49"
  }
];

const usePlayerStore = create((set) => ({
    isPlaying: false,
    currentMusic: { playlist: null, song: null, songs: [] },
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setCurrentMusic: (currentMusic) => set({ currentMusic }),
    volume: 0.5,
    setVolume: (volume) => set({ volume })
}));

const Slider = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  SliderPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex touch-none select-none items-center group",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-1 w-full grow overflow-hidden rounded-full bg-gray-800", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-white group-hover:bg-green-400" }) }),
      /* @__PURE__ */ jsx(SliderPrimitive.Thumb, { className: "hidden group-hover:block h-3 w-3 bg-white rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = SliderPrimitive.Root.displayName;

const Pause = ({ className }) => /* @__PURE__ */ jsx("svg", { className: `${className}`, role: "img", height: "16", width: "16", "aria-hidden": "true", viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" }) });
const Play = ({ className }) => /* @__PURE__ */ jsx("svg", { className: `${className} p-0`, role: "img", height: "16", width: "16", "aria-hidden": "true", viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" }) });
const MaxVolume = () => /* @__PURE__ */ jsxs("svg", { "data-encore-id": "icon", role: "presentation", "aria-label": "Volume high", "aria-hidden": "true", id: "volume-icon", viewBox: "0 0 16 16", className: "Svg-sc-ytk21e-0 kcUFwU h-4 w-4", children: [
  /* @__PURE__ */ jsx("path", { d: "M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" }),
  /* @__PURE__ */ jsx("path", { d: "M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z" })
] });
const MediumVolume = () => /* @__PURE__ */ jsx("svg", { "data-encore-id": "icon", role: "presentation", "aria-label": "Volume medium", "aria-hidden": "true", id: "volume-icon", viewBox: "0 0 16 16", className: "Svg-sc-ytk21e-0 kcUFwU h-4 w-4", children: /* @__PURE__ */ jsx("path", { d: "M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z" }) });
const MinVolume = () => /* @__PURE__ */ jsx("svg", { fill: "currentColor", "data-encore-id": "icon", role: "presentation", "aria-label": "Volume low", "aria-hidden": "true", id: "volume-icon", viewBox: "0 0 16 16", className: "Svg-sc-ytk21e-0 kcUFwU h-4 w-4", children: /* @__PURE__ */ jsx("path", { d: "M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" }) });
const MutedVolume = () => /* @__PURE__ */ jsxs("svg", { "data-encore-id": "icon", role: "presentation", "aria-label": "Volume off", "aria-hidden": "true", id: "volume-icon", viewBox: "0 0 16 16", className: "Svg-sc-ytk21e-0 kcUFwU h-4 w-4", children: [
  /* @__PURE__ */ jsx("path", { d: "M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z" }),
  /* @__PURE__ */ jsx("path", { d: "M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z" })
] });
const CurrentSong = ({ image, title, artists }) => {
  const defaultImage = "https://enablepublicdam.steelcase.com/Original/10005/6130_1000.jpg";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `
          flex items-center gap-2 relative
          overflow-hidden
        `,
      children: [
        /* @__PURE__ */ jsx("picture", { className: "w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-zinc-800 rounded-sm lg:rounded-md shadow-lg overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: image ?? defaultImage, alt: title, className: " w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold lg:text-sm block text-[8px] md:text-[10px] ", children: title }),
          /* @__PURE__ */ jsx("span", { className: "lg:text-xs opacity-80 text-[6px] md:text-[7px]", children: artists?.join(", ") })
        ] })
      ]
    }
  );
};
const CurrentSongMobile = ({ image, title, artists }) => {
  const defaultImage = "https://enablepublicdam.steelcase.com/Original/10005/6130_1000.jpg";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `
          flex items-center gap-2 relative
          overflow-hidden w-full h-full
        `,
      children: [
        /* @__PURE__ */ jsx("picture", { className: "w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-zinc-800 rounded-sm lg:rounded-md shadow-lg overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: image ?? defaultImage, alt: title, className: " w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold truncate text-sm", children: title }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-400 truncate ", children: artists?.join(", ") })
        ] })
      ]
    }
  );
};
function VolumeControl() {
  const { volume, setVolume } = usePlayerStore((state) => state);
  const previousVolume = useRef(volume);
  const isMuted = volume === 0;
  const handleMute = () => {
    if (isMuted) {
      setVolume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      setVolume(0);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-x-4 items-center", children: [
    /* @__PURE__ */ jsxs("button", { onClick: handleMute, className: "h-4 w-4 opacity-70 hover:opacity-100", children: [
      volume === 0 && /* @__PURE__ */ jsx(MutedVolume, {}),
      volume > 0 && volume < 0.3 && /* @__PURE__ */ jsx(MinVolume, {}),
      volume >= 0.3 && volume < 0.6 && /* @__PURE__ */ jsx(MediumVolume, {}),
      volume >= 0.6 && volume <= 1 && /* @__PURE__ */ jsx(MaxVolume, {})
    ] }),
    /* @__PURE__ */ jsx(
      Slider,
      {
        defaultValue: [50],
        max: 100,
        min: 0,
        className: "w-[95px]",
        value: [volume * 100],
        onValueChange: (value) => {
          const [newVolume] = value;
          const volumeValue = newVolume / 100;
          setVolume(volumeValue);
        }
      }
    )
  ] });
}
function SongControl({ audio }) {
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    audio.current.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);
  const handleTimeUpdate = () => {
    setCurrentTime(audio.current.currentTime);
  };
  const formatTime = (time) => {
    if (time == null)
      return `00:00`;
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const duration = audio?.current?.duration ?? 0;
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-x-2 w-full justify-center items-center", children: [
    /* @__PURE__ */ jsx("span", { className: "lg:block hidden", children: formatTime(currentTime) }),
    /* @__PURE__ */ jsx(
      Slider,
      {
        defaultValue: [0],
        value: [currentTime],
        max: audio?.current?.duration ?? 0,
        min: 0,
        className: "w-full lg:w-1/2 ",
        onValueChange: (value) => {
          audio.current.currentTime = value;
        }
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "lg:block hidden", children: duration ? formatTime(duration) : "0:00" })
  ] });
}
function Player() {
  const { currentMusic, isPlaying, setIsPlaying, volume } = usePlayerStore((state) => state);
  const audioRef = useRef();
  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    const { song, playlist } = currentMusic;
    if (song) {
      const src = `/music/${playlist?.id}/0${song.id}.mp3`;
      audioRef.current.src = src;
      audioRef.current.volume = volume;
      audioRef.current.play();
    }
  }, [currentMusic]);
  const handleClick = () => {
    if (!currentMusic.song)
      return;
    setIsPlaying(!isPlaying);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "md:flex hidden justify-between items-center w-full px-2 lg:px-4 bg-black text-white absolute top-0 z-50  bottom-0 left-0 right-0 lg:py-5", children: [
      /* @__PURE__ */ jsx("div", { audio: audioRef, className: "w-24 md:w-32 lg:w-60", children: /* @__PURE__ */ jsx(CurrentSong, { ...currentMusic.song }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center gap-4 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center flex-col items-center gap-2  w-full md:px-10", children: [
        /* @__PURE__ */ jsx("button", { className: "lg:bg-white lg:fill-black fill-white rounded-full p-2 disabled:cursor-not-allowed", onClick: handleClick, children: isPlaying ? /* @__PURE__ */ jsx(Pause, { className: `` }) : /* @__PURE__ */ jsx(Play, { className: `` }) }),
        /* @__PURE__ */ jsx(SongControl, { audio: audioRef })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:flex  items-center justify-between gap-2 fill-white text-white hidden", children: /* @__PURE__ */ jsx(VolumeControl, {}) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex md:hidden flex-col w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-between items-center mb-1", children: [
        /* @__PURE__ */ jsx("div", { audio: audioRef, className: "text-white lg:w-60", children: /* @__PURE__ */ jsx(CurrentSongMobile, { ...currentMusic.song }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", { className: "lg:bg-white lg:fill-black fill-white rounded-full p-4 disabled:cursor-not-allowed", onClick: handleClick, children: isPlaying ? /* @__PURE__ */ jsx(Pause, { className: `` }) : /* @__PURE__ */ jsx(Play, { className: `` }) }) })
      ] }),
      /* @__PURE__ */ jsx(SongControl, { audio: audioRef }),
      /* @__PURE__ */ jsx("nav", {})
    ] }),
    /* @__PURE__ */ jsx("audio", { ref: audioRef })
  ] });
}

function CardPlayButton({ id, size = "small", display }) {
  const {
    currentMusic,
    isPlaying,
    setIsPlaying,
    setCurrentMusic
  } = usePlayerStore((state) => state);
  const isPlayingPlaylist = isPlaying && currentMusic?.playlist.id === id;
  const handleClick = () => {
    if (isPlayingPlaylist) {
      setIsPlaying(false);
      return;
    }
    fetch(`/api/get-info-playlist.json?id=${id}`).then((res) => res.json()).then((data) => {
      const { songs, playlist } = data;
      setIsPlaying(true);
      setCurrentMusic({ songs, playlist, song: songs[0] });
    });
  };
  const iconClassName = size === "small" ? "w-3 h-3" : "w-5 h-5";
  const displayType = display;
  return /* @__PURE__ */ jsx("button", { onClick: handleClick, className: `md:flex card-play-button rounded-full bg-green-500 p-2 hover:scale-105 transition hover:bg-green-400 ${displayType}`, children: isPlayingPlaylist ? /* @__PURE__ */ jsx(Pause, { className: iconClassName }) : /* @__PURE__ */ jsx(Play, { className: iconClassName }) });
}

const $$Time = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path><path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path></svg>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/icons/Time.astro", void 0);

const $$Astro$6 = createAstro();
const $$MusicsTable = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$MusicsTable;
  const { songs } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<table class="table-auto text-left min-w-full divide-y divide-gray-500/20 hidden md:table"> <thead class=""> <tr class="text-zinc-400 text-sm"> <th class="px-4 py-2 font-light">#</th> <th class="px-4 py-2 font-light">Title</th> <th class="px-4 py-2 font-light">Album</th> <th class="px-4 py-2 font-light">${renderComponent($$result, "Time", $$Time, {})}</th> </tr> </thead> <tbody> <tr class="h-[16px]"></tr> ${songs.map((song, index) => renderTemplate`<tr class="border-spacing-0 text-gray-300 text-sm font-light hover:bg-white/10 overflow-hidden transition duration-300"> <td class="px-4 py-2 rounded-tl-lg rounded-bl-lg w-5 "> ${index + 1} </td> <td class="px-4 py-2 flex gap-3"> <picture class=""> <img${addAttribute(song.image, "src")}${addAttribute(song.title, "alt")} class="w-11 h-11 object-cover"> </picture> <div class="flex flex-col"> <h3 class="text-white text-base font-normal"> ${song.title} </h3> <span>${song.artists.join(", ")}</span> </div> </td> <td class="px-4 py-2">${song.album}</td> <td class="px-4 py-2 rounded-tr-lg rounded-br-lg"> ${song.duration} </td> </tr>`)} </tbody> </table> <ul class="grid min-w-full mb-4 p-1 text-white md:hidden"> ${songs.map((song) => renderTemplate`<a class="flex p-2 justify-between items-center hover:bg-zinc-800 cursor-pointer"> <div class="flex gap-2"> ${renderComponent($$result, "Image", $$Image, { "src": song.image, "alt": song.title, "loading": "lazy", "width": "10", "height": "10", "class": "aspect-square w-10 object-cover" })} <div> <h3 class="font-semibold">${song.title}</h3> <p class="text-zinc-400 text-xs"> ${song.artists.join(", ")} </p> </div> </div> <div class="fill-zinc-500 w-5 flex items-center"> <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path> </svg> </div> </a>`)} </ul>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/components/MusicsTable.astro", void 0);

const $$Astro$5 = createAstro();
const $$ViewTransitions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$ViewTransitions;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/node_modules/astro/components/ViewTransitions.astro", void 0);

const $$Home = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"></path></svg>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/icons/Home.astro", void 0);

const $$Library = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"></path></svg>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/icons/Library.astro", void 0);

const $$Search = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path></svg>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/icons/Search.astro", void 0);

const $$Astro$4 = createAstro();
const $$SideMenuItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$SideMenuItem;
  const { href } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li> <a${addAttribute(href, "href")} class="flex gap-4 text-zinc-400 hover:text-zinc-100 items-center py-3 px-5 font-medium transition duration-300"> ${renderSlot($$result, $$slots["default"])} </a> </li>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/components/SideMenuItem.astro", void 0);

const $$Astro$3 = createAstro();
const $$SideMenuCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$SideMenuCard;
  const { playlist } = Astro2.props;
  const { albumId, artists, color, cover, id, title } = playlist;
  const artistsString = artists.join(", ");
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/playlist/${id}`, "href")} class="playlist-item text-white flex relative p-2 items-center gap-5 rounded-md hover:bg-[#1A1A1A]"> <picture class="h-12 w-12 flex-none"> <img${addAttribute(cover, "src")}${addAttribute(`Cover of ${title} by ${artistsString}`, "alt")} class="object-cover w-full h-full rounded-md"> </picture> <div class="flex flex-auto flex-col truncate"> <h4 class="">${title}</h4> <span class="text-[#A4A4A4] text-[14px]">${artistsString}</span> </div> </a>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/components/SideMenuCard.astro", void 0);

const $$AsideMenu = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="flex flex-col flex-1 gap-2"> <ul class="bg-[#121212] rounded-lg p-2"> ${renderComponent($$result, "SideMenuItem", $$SideMenuItem, { "href": "/" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Home", $$Home, {})}
Home
` })} ${renderComponent($$result, "SideMenuItem", $$SideMenuItem, { "href": "/#" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Search", $$Search, {})}
Search
` })} </ul> <ul class="bg-[#121212] rounded-lg p-2 flex-1"> ${renderComponent($$result, "SideMenuItem", $$SideMenuItem, { "href": "/#" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LibraryIcon", $$Library, {})}
Your library
` })} ${playlists.map((playlist) => renderTemplate`${renderComponent($$result, "SideMenuCard", $$SideMenuCard, { "playlist": playlist })}`)} </ul> </nav>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/components/AsideMenu.astro", void 0);

const $$Astro$2 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderComponent($$result, "ViewTransitions", $$ViewTransitions, { "fallback": "none", "data-astro-cid-sckkx6r4": true })}${renderHead()}</head> <body class="h-full" data-astro-cid-sckkx6r4> <div id="app" class="relative p-2 gap-2 h-full" data-astro-cid-sckkx6r4> <aside class="[grid-area:aside] flex-col md:flex overflow-hidden hidden" data-astro-cid-sckkx6r4> ${renderComponent($$result, "AsideMenu", $$AsideMenu, { "data-astro-cid-sckkx6r4": true })} </aside> <main class="[grid-area:main] index-container md:bg-zinc-800 rounded-lg overflow-y-auto h-full" data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </main> <footer class="[grid-area:player] relative h-16 py-2" data-astro-cid-sckkx6r4> ${renderComponent($$result, "Player", Player, { "client:load": true, "data-astro-transition-persist": "media-player", "client:component-hydration": "load", "client:component-path": "C:/Users/indatech/Desktop/astro/spotify-clone/src/components/Player", "client:component-export": "Player", "data-astro-cid-sckkx6r4": true, "data-astro-transition-scope": renderTransition($$result, "p74ezckc", "", "media-player") })} </footer> </div>   </body> </html>`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/layouts/Layout.astro", "self");

const $$Astro$1 = createAstro();
const $$id$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$id$1;
  const { id } = Astro2.params;
  const playlist = allPlaylists.find((playlist2) => playlist2.id === id);
  const playListSongs = songs.filter(
    (song) => song.albumId === playlist?.albumId
  );
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Playlist: ${playlist?.title}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="playlist-container" class="relative flex flex-col h-full md:bg-zinc-900 overflow-x-hidden"${addAttribute(renderTransition($$result2, "lwbbxtwc", "", `playlist ${id} box`), "data-astro-transition-scope")}> <!-- <PageHeader /> --> <header class="flex flex-col items-center md:justify-start md:flex-row gap-2 md:gap-8 md:px-6 mt-8 md:mt-12"> <picture class="aspect-square w-52 h-52"> <img${addAttribute(playlist?.cover, "src")}${addAttribute(`Cover of ${playlist?.title}`, "alt")} class="object-cover w-full h-full shadow-lg"${addAttribute(renderTransition($$result2, "jkadwh6j", "", `playlist ${playlist?.id} image`), "data-astro-transition-scope")}> </picture> <div class="flex flex-col md:justify-between items-center md:items-start"> <h2 class="flex flex-1 items-end text-white">Playlist</h2> <div> <h1 class="md:text-5xl text-3xl font-bold block text-white"> ${playlist?.title} <span${addAttribute(renderTransition($$result2, "7qurg64c", "", `playlist ${playlist?.id} title`), "data-astro-transition-scope")}></span> </h1> </div> <div class="flex-1 flex p-2 md:p-0 md:items-end items-center"> <div class="text-sm text-gray-300 font-normal flex flex-col items-center md:items-start"> <div${addAttribute(renderTransition($$result2, "h7a2vprm", "", `playlist ${playlist?.id} artist`), "data-astro-transition-scope")}> <span>${playlist?.artists.join(", ")}</span> </div> <p class="mt-1"> <span class="text-white">${playListSongs.length} songs</span>, 3 h aprox
</p> </div> </div> </div> </header> <div class="p-6 pb-0 w-full text-white flex justify-center md:justify-start"> ${renderComponent($$result2, "CardPlayButton", CardPlayButton, { "client:load": true, "id": id, "size": "large", "display": "p-4", "client:component-hydration": "load", "client:component-path": "C:/Users/indatech/Desktop/astro/spotify-clone/src/components/CardPlayButton", "client:component-export": "CardPlayButton" })} </div> <div class="absolute inset-0 md:bg-gradient-to-t from-zinc-900 via-zinc-900/80 -z-[1]"></div> <section class="md:p-6"> ${renderComponent($$result2, "MusicsTable", $$MusicsTable, { "songs": playListSongs })} </section> </div> ` })}`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/pages/playlist/[id].astro", "self");

const $$file$1 = "C:/Users/indatech/Desktop/astro/spotify-clone/src/pages/playlist/[id].astro";
const $$url$1 = "/playlist/[id]";

const _id_$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id$1,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro();
const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const playlist = allPlaylists.find((playlist2) => playlist2.id === id);
  const playListSongs = songs.filter(
    (song) => song.albumId === playlist?.albumId
  );
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Playlist: ${playlist?.title}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="playlist-container" class="relative flex flex-col h-full md:bg-zinc-900 overflow-x-hidden"${addAttribute(renderTransition($$result2, "fvwwxa4l", "", `playlist ${id} box made4u`), "data-astro-transition-scope")}> <!-- <PageHeader /> --> <header class="flex flex-col items-center md:justify-start md:flex-row gap-2 md:gap-8 md:px-6 mt-8 md:mt-12"> <picture class="aspect-square w-52 h-52"> <img${addAttribute(playlist?.cover, "src")}${addAttribute(`Cover of ${playlist?.title}`, "alt")} class="object-cover w-full h-full shadow-lg"${addAttribute(renderTransition($$result2, "qymsxcym", "", `playlist ${playlist?.id} image made4u`), "data-astro-transition-scope")}> </picture> <div class="flex flex-col md:justify-between items-center md:items-start"> <h2 class="flex flex-1 items-end text-white">Playlist</h2> <div> <h1 class="md:text-5xl text-3xl font-bold block text-white"> ${playlist?.title} <span${addAttribute(renderTransition($$result2, "ixmtemtr", "", `playlist ${playlist?.id} title made4u`), "data-astro-transition-scope")}></span> </h1> </div> <div class="flex-1 flex p-2 md:p-0 md:items-end items-center"> <div class="text-sm text-gray-300 font-normal flex flex-col items-center md:items-start"> <div${addAttribute(renderTransition($$result2, "v2aq5rjk", "", `playlist ${playlist?.id} artists made4u`), "data-astro-transition-scope")}> <span>${playlist?.artists.join(", ")}</span> </div> <p class="mt-1"> <span class="text-white">${playListSongs.length} songs</span>, 3 h aprox
</p> </div> </div> </div> </header> <div class="p-6 pb-0 w-full text-white flex justify-center md:justify-start"> ${renderComponent($$result2, "CardPlayButton", CardPlayButton, { "client:load": true, "id": id, "size": "large", "display": "p-4", "client:component-hydration": "load", "client:component-path": "C:/Users/indatech/Desktop/astro/spotify-clone/src/components/CardPlayButton", "client:component-export": "CardPlayButton" })} </div> <div class="absolute inset-0 md:bg-gradient-to-t from-zinc-900 via-zinc-900/80 -z-[1]"></div> <section class="md:p-6"> ${renderComponent($$result2, "MusicsTable", $$MusicsTable, { "songs": playListSongs })} </section> </div> ` })}`;
}, "C:/Users/indatech/Desktop/astro/spotify-clone/src/pages/playlistMade/[id].astro", "self");

const $$file = "C:/Users/indatech/Desktop/astro/spotify-clone/src/pages/playlistMade/[id].astro";
const $$url = "/playlistMade/[id]";

const _id_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Layout as $, CardPlayButton as C, _id_$1 as _, allPlaylists as a, _id_ as b, getConfiguredImageService as g, imageConfig as i, playlists as p, songs as s };
