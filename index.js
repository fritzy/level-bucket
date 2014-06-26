var AtomicHooks = require('level-atomichooks');

function LevelBucket(db, opts) {


    db = AtomicHooks(db, "level-bucket");
    db._configBucket = opts || {};
    db._configBucket.default = db._configBucket.default || 'default';
    db._configBucket.sep = db._configBucket.sep || '!';

    db.registerKeyPreProcessor(function (key, opts) {
        opts = opts || {};
        var bucket;
        if (Array.isArray(opts.bucket)) {
            bucket = opts.bucket.slice();
        } else {
            bucket = [opts.bucket || db._configBucket.default];
        }
        bucket.push(key);
        var newkey = bucket.join(db._configBucket.sep)
        //console.log(key, "->", newkey);
        return newkey;
    });
    
    db.registerKeyPostProcessor(function (key, opts) {
        opts = opts || {};
        var length = 0;
        var newkey;
        if (Array.isArray(opts.bucket)) {
            opts.bucket.forEach(function (subbuck) {
                length += subbuck.length;
            });
        } else {
            length += (opts.bucket || db._configBucket.default).length;
        }
        newkey = key.slice(length + opts.bucket.length);
        //console.log(key, "<-", newkey);
        return newkey;
    });

    return db;
}

module.exports = LevelBucket;
