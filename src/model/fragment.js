// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const crypto = require('crypto');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data/memory');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!id) {
      id = crypto.randomUUID();
    }

    if (!ownerId || !type) {
      throw new Error('Required properties missing.');
    }

    if (!created && !updated) {
      created = new Date().toISOString();
      updated = new Date().toISOString();
    }

    if (typeof size !== 'number') {
      throw new Error('Size must be a number.');
    } else {
      if (size < 0) {
        throw new Error('Size cannot be negative.');
      }
    }

    const parsedType = contentType.parse(type);
    console.log(parsedType);
    if (!Fragment.isSupportedType(parsedType.type)) {
      throw new Error(`Invalid type: ${type}`);
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    const fragments = await listFragments(ownerId, expand);
    const fragmentObjects = [];

    if (expand || !fragments) {
      // If expand is true or no fragments are returned, return the fragments as-is
      return Promise.resolve(fragments);
    }

    for (const fragmentId of fragments) {
      fragmentObjects.push(fragmentId);
    }

    return fragmentObjects;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragmentData = await readFragment(ownerId, id);

    if (!fragmentData) {
      throw new Error('Unable to find fragment.');
    }

    return new Fragment(fragmentData);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return Promise.resolve(deleteFragment(ownerId, id));
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    this.updated = new Date().toISOString();
    const fragmentData = {
      id: this.id,
      ownerId: this.ownerId,
      created: this.created,
      updated: this.updated,
      type: this.type,
      size: this.size,
    };
    await writeFragment(fragmentData);
    return Promise.resolve();
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    const data = await readFragmentData(this.ownerId, this.id);
    if (!data) {
      throw new Error('No data retrieved.');
    }

    return Buffer.from(data);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    await writeFragmentData(this.ownerId, this.id, data);
    this.size = Buffer.byteLength(data);

    return this.save();
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const { type } = contentType.parse(this.type);
    return type.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const mimeType = this.mimeType;
    return [mimeType];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const supportedTypes = [
      'text/plain',
      'text/markdown',
      'text/html',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/webp',
    ];

    const typeWithoutCharset = value.split(';')[0].trim();
    return supportedTypes.includes(typeWithoutCharset);
  }
}

module.exports.Fragment = Fragment;
