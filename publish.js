const ghpages = require('gh-pages');

ghpages.publish('dist', (err) => {
    if (err) {
        console.log(err);
    }
    console.log('\nPublishing successed!');
});
