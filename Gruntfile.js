module.exports = function (grunt) {

    grunt.initConfig({
        htmlmin: {
            //            dist: { // Target
            //                options: { // Target options
            //                    removeComments: true,
            //                    collapseWhitespace: true
            //                },
            //                files: { // Dictionary of files
            //                    'dist/index.html': 'src/index.html', // 'destination': 'source'
            //                    'dist/contact.html': 'src/contact.html'
            //                }
            //            },
            //            dev: { // Another target
            //                files: {
            //                    'dist/index.html': 'src/index.html',
            //                    'dist/contact.html': 'src/contact.html'
            //                }
            //            },
            multiple: {
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'blog/',
                    src: 'release/*.html',
                    dest: 'blog/'
      },{
                    expand: true,
                    cwd: 'blog/',
                    src: 'release/articles/*.html',
                    dest: 'blog/'
      }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.registerTask('default', ['htmlmin']);
};
