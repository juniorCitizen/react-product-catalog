import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'

const plugins = gulpLoadPlugins({
  lazy: true,
  camelize: true
})

const taskPath = './src/workflow/gulp'

gulp.task('backupDotEnv', require(`${taskPath}/backupDotEnv`)(gulp, plugins))
gulp.task('removeLogs', require(`${taskPath}/removeLogs`)(gulp, plugins))
gulp.task('resetDatabase', require(`${taskPath}/resetDatabase`)(gulp, plugins))
