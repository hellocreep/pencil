module.exports = function(grunt) {
  grunt.initConfig({
    'gh-pages': {
      options: {
        base: '.'
      },
      src: ['example/**/*']
    },
    uglify: {
      target: {
        files: {
          'dist/pencil.min.js': ['src/pencil.js']
        }
      }
    },
    copy: {
      js: {
        files: [
          {expand: true, cwd: 'dist/', src: 'pencil.min.js', dest: 'example/js/'}
        ]
      }
    },
    watch: {
      js: {
        files: ['src/*.js'],
        tasks: ['build']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['uglify', 'copy']);

}