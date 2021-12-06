export default {
    maxValueLength: 280,
    fileSizeLimit: process.env.FILE_SIZE_LIMIT ? parseInt(process.env.FILE_SIZE_LIMIT, 10) : 1024 * 1024,
    version: <'rss3.io/version/v0.3.1'>'rss3.io/version/v0.3.1',
    storageExpires: 14,
};
