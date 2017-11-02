import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import path from 'path'

require('dotenv').config()

const plugins = gulpLoadPlugins({
  lazy: true,
  camelize: true
})

// const devMode = process.env.NODE_ENV === 'development'

function requireTaskPath (pathString) {
  return require(path.resolve(path.join('./src/workflow/gulp', pathString)))(gulp, plugins)
}

gulp.task('backupDotEnv', requireTaskPath('backupDotEnv'))
gulp.task('removeLogs', requireTaskPath('removeLogs'))
gulp.task('resetDatabase', requireTaskPath('resetDatabase/resetDatabase'))

// backup tasks
// gulp.task('backupDatabase', requireTaskPath('/database/backupDatabase'))
// gulp.task('backupEnvConfig', requireTaskPath('/backup/backupEnvConfig'))
// gulp.task('backup', gulp.parallel(
//   'backupDatabase',
//   'backupEnvConfig'
// ))

// clean up related tasks
// gulp.task('removeDistFolder', requireTaskPath('/cleanup/removeDistFolder'))
// gulp.task('generateClientFolders', requireTaskPath('/cleanup/generateClientFolders'))
// gulp.task('realignDistStructure', gulp.parallel(
//   'removeLogs',
//   gulp.series(
//     'removeDistFolder',
//     'generateClientFolders'
//   )
// ))

// asset preparations
// gulp.task('restoreDatabase', requireTaskPath('/database/restoreDatabase'))
// gulp.task('commonAssets', requireTaskPath('/assets/commonAssets'))
// gulp.task('carouselPhotos', requireTaskPath('/assets/carouselPhotos'))
// gulp.task('hbsTemplates', requireTaskPath('/assets/hbsTemplates'))
// gulp.task('prepAssets', gulp.parallel(
//   'restoreDatabase',
//   'carouselPhotos',
//   'commonAssets',
//   'hbsTemplates'
// ))

// database related tasks
// gulp.task('resetDatabase', requireTaskPath('/database/resetDatabase'))

// linting related tasks
// gulp.task('lintClientSideCode', requireTaskPath('/eslint/lintClientSideCode'))
// gulp.task('lintServerSideCode', requireTaskPath('/eslint/lintServerSideCode'))
// gulp.task('lintFullSource', requireTaskPath('/eslint/lintFullSource'))

// server preperation task routines
// gulp.task('prepServer', gulp.series(
//   'backup',
//   'realignDistStructure',
//   gulp.parallel(
//     'lintFullSource',
//     'prepAssets'
//   )
// ))

// development server task routines
// gulp.task('watchTemplates', requireTaskPath('/devServer/watchTemplates'))
// gulp.task('nodemon', requireTaskPath('/devServer/nodemon'))
// gulp.task('startBrowser', requireTaskPath('/devServer/startBrowser'))

// build production server package
// gulp.task('buildServer', requireTaskPath('/transpile/buildServer'))
