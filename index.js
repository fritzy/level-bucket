var AtomicHooks = require('level-atomichooks');

function LevelBucket(db, opts) {


    db = AtomicHooks(db, "level-bucket");
    db._configBucket = opts || {};
    db._configBucket.default = db._configBucket.default || 'default';
    db._configBucket.sep = db._configBucket.sep || '!';

    db.registerKeyPreProcessor(function (key, opts) {
        opts = opts || {};
        opts.bucket = opts.bucket || db._configBucket.default;
        var newkey = [opts.bucket, key].join(db._configBucket.sep)
        //console.log(key, "->", newkey);
        return newkey;
    });
    
    db.registerKeyPostProcessor(function (key, opts) {
        opts = opts || {};
        opts.bucket = opts.bucket || db._configBucket.default;
        var newkey = key.slice(opts.bucket + 1);
        //console.log(key, "<-", newkey);
        return newkey;
    });

    return db;
}

module.exports = LevelBucket;
