var AtomicHooks = require('level-atomichooks');

function LevelBucket(db, opts) {

    db._configBucket = opts || {};
    db._configBucket.default = db._configBucket.default || 'default';
    db._configBucket.sep = db._configBucket.sep || '!';

    db = AtomicHooks(db);

    db.registerKeyPreProcessor(function (key, opts) {
        opts = opts || {};
        var newkey = (opts.bucket || db._configBucket.default) + db._configBucket.sep + key;
        return newkey;
    });
    
    db.registerKeyPostProcessor(function (key, opts) {
        opts = opts || {};
        var idx = key.indexOf(db._configBucket.sep);
        if (idx !== -1) {
            key = key.slice(idx + 1);
        }
        return key;
    });

    return db;
}

module.exports = LevelBucket;
