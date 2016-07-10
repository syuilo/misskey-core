/****************************
 * Misskey Core gulp settings
 ****************************/

'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const stylus = require('gulp-stylus');

const project = ts.createProject('tsconfig.json');

gulp.task('build', [
	'build:ts',
	'build:styles',
	'build:copy'
]);

gulp.task('build:ts', () => {
	project
		.src()
		.pipe(ts(project))
		.pipe(gulp.dest('./built/'));
});


gulp.task('build:styles', () => {
	return gulp.src('./src/web/**/*.styl')
		.pipe(stylus())
		.pipe(gulp.dest('./built/web/'));
});

gulp.task('build:copy', () => {
	return gulp.src([
		'./src/web/**/*',
		'!**/*.ts',
		'!**/*.ls',
		'!**/*.styl'
	])
		.pipe(gulp.dest('./built/web/'));
});

gulp.task('test', [
	'lint'
]);

gulp.task('lint', () =>
	gulp.src('./src/**/*.ts')
	.pipe(tslint())
	.pipe(tslint.report('verbose'))
);
