import { UUIDTypes } from './types.js';
import parse from './parse.js';
import { unsafeStringify } from './stringify.js';

/**
 * Convert a v1 UUID to a v6 UUID
 *
 * @param {string|Uint8Array} uuid - The v1 UUID to convert to v6
 * @returns {string|Uint8Array} The v6 UUID as the same type as the `uuid` arg
 * (string or Uint8Array)
 */
export default function v1ToV6(uuid: string): string;
export default function v1ToV6(uuid: Uint8Array): Uint8Array;
export default function v1ToV6(uuid: string | Uint8Array): UUIDTypes {
  const v1Bytes = typeof uuid === 'string' ? parse(uuid) : uuid;

  const v6Bytes = _v1ToV6(v1Bytes);

  return typeof uuid === 'string' ? unsafeStringify(v6Bytes) : v6Bytes;
}

// Do the field transformation needed for v1 -> v6
function _v1ToV6(v1Bytes: Uint8Array) {
  return Uint8Array.of(
    ((v1Bytes[6] & 0x0f) << 4) | ((v1Bytes[7] >> 4) & 0x0f),
    ((v1Bytes[7] & 0x0f) << 4) | ((v1Bytes[4] & 0xf0) >> 4),
    ((v1Bytes[4] & 0x0f) << 4) | ((v1Bytes[5] & 0xf0) >> 4),
    ((v1Bytes[5] & 0x0f) << 4) | ((v1Bytes[0] & 0xf0) >> 4),

    ((v1Bytes[0] & 0x0f) << 4) | ((v1Bytes[1] & 0xf0) >> 4),
    ((v1Bytes[1] & 0x0f) << 4) | ((v1Bytes[2] & 0xf0) >> 4),

    0x60 | (v1Bytes[2] & 0x0f),
    v1Bytes[3],

    v1Bytes[8],
    v1Bytes[9],
    v1Bytes[10],
    v1Bytes[11],
    v1Bytes[12],
    v1Bytes[13],
    v1Bytes[14],
    v1Bytes[15]
  );
}
